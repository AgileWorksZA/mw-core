import { createOpenAI } from '@ai-sdk/openai';
import { streamText, CoreMessage, LanguageModel } from 'ai';
import { SmartMoneyWorksClient } from '@moneyworks/data';
import { MoneyWorksChatContext, StreamingChunk } from '../shared/types';
import { createMoneyWorksTools } from './tools';
import { getSystemPrompt } from './prompts';

export interface ChatServiceConfig {
  openaiApiKey: string;
  model?: string;
  maxTokens?: number;
}

export class MoneyWorksChatService {
  private model: LanguageModel;
  private mwClient: SmartMoneyWorksClient;
  
  constructor(
    private context: MoneyWorksChatContext,
    private config: ChatServiceConfig,
    mwClientConfig: any // MoneyWorks connection config from server
  ) {
    const openai = createOpenAI({
      apiKey: config.openaiApiKey
    });
    
    this.model = openai(config.model || 'gpt-4o-mini');
    // Always use real MoneyWorks client
    this.mwClient = new SmartMoneyWorksClient(mwClientConfig);
  }

  async *streamChat(messages: CoreMessage[]): AsyncGenerator<StreamingChunk> {
    try {
      const tools = createMoneyWorksTools(this.mwClient, this.context);
      
      console.log('[ChatService] Available tools:', Object.keys(tools));
      console.log('[ChatService] Starting stream with messages:', messages.length);
      console.log('[ChatService] Last message:', messages[messages.length - 1]);
      
      const result = await streamText({
        model: this.model,
        messages,
        system: getSystemPrompt(this.context),
        tools,
        maxTokens: this.config.maxTokens || 16384,
        temperature: 0.7,
        toolChoice: 'auto', // Explicitly allow the model to choose when to use tools
        maxSteps: 3 // Enable multi-step generation to allow text after tool calls
      });

      // Use fullStream which includes both text and tool calls
      for await (const chunk of result.fullStream) {
        switch (chunk.type) {
          case 'text-delta':
            yield {
              type: 'text',
              content: chunk.textDelta
            };
            break;
            
          case 'tool-call':
            console.log('[ChatService] Tool call:', chunk.toolName, chunk.args);
            yield {
              type: 'tool_start',
              toolName: chunk.toolName,
              toolArgs: chunk.args
            };
            break;
            
          case 'tool-result':
            yield {
              type: 'tool_result',
              toolName: chunk.toolName,
              toolResult: chunk.result
            };
            
            // If the tool returns MoneyWorks data, send it as a special chunk
            if (chunk.result && typeof chunk.result === 'object') {
              const mwDataType = this.detectMWDataType(chunk.toolName);
              if (mwDataType) {
                yield {
                  type: 'mw_data',
                  mwData: {
                    type: mwDataType,
                    data: chunk.result,
                    metadata: this.extractMetadata(chunk.result)
                  }
                };
              }
            }
            break;
            
          case 'error':
            console.log('[ChatService] Stream error:', chunk.error);
            yield {
              type: 'error',
              error: chunk.error instanceof Error ? chunk.error.message : 'An error occurred'
            };
            break;
        }
      }

      // Signal completion
      yield { type: 'done' };
      
    } catch (error) {
      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  private detectMWDataType(toolName: string): any | null {
    const typeMap: Record<string, any> = {
      'getTransactions': 'transaction',
      'getTaxRate': 'taxRate',
      'listTaxRates': null, // Don't attach structured data for list of tax rates
      'getAccount': 'account',
      'searchNames': 'name',
      'runReport': 'report',
    };
    
    return typeMap[toolName] || null;
  }

  private extractMetadata(data: any): any {
    if (Array.isArray(data)) {
      return {
        count: data.length,
        totalAmount: data.reduce((sum, item) => sum + (item.Total || item.Amount || 0), 0)
      };
    }
    return {};
  }
}