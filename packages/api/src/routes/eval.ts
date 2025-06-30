/**
 * MWScript Evaluation Routes
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia } from 'elysia';
import type { SmartMoneyWorksClient } from '@moneyworks/data';
import { EvalRequestSchema, EvalResponseSchema } from '@moneyworks/api/schemas/eval';
import { ErrorSchema, SuccessResponse } from '@moneyworks/api/schemas/common';

/**
 * Create eval routes
 */
export function createEvalRoutes(client: SmartMoneyWorksClient) {
  return new Elysia({ prefix: '/eval' })
    .post('/', async ({ body, set, headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';
      const { expression, context } = body;
      
      if (!expression || expression.trim().length === 0) {
        set.status = 400;
        throw new Error('VALIDATION_ERROR: Expression cannot be empty');
      }
      
      const startTime = performance.now();
      
      try {
        // Note: MoneyWorks REST API doesn't support context,
        // but we keep it in the API for future enhancement
        const result = await client.evaluate(expression);
        
        const executionTime = performance.now() - startTime;
        
        // Try to detect data type
        const dataType = detectDataType(result);
        
        return {
          data: {
            expression,
            result: result.trim(),
            dataType,
            executionTime: Math.round(executionTime * 100) / 100
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId
          }
        };
      } catch (error: any) {
        // Provide helpful context for common MWScript errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('Unknown identifier')) {
          set.status = 400;
          throw new Error(`MWSCRIPT_ERROR: ${errorMessage}. Note: Direct table references like 'Count(TaxRate)' may not work in REST context.`);
        } else if (errorMessage.includes('Syntax error')) {
          set.status = 400;
          throw new Error(`MWSCRIPT_SYNTAX_ERROR: ${errorMessage}`);
        }
        
        throw error;
      }
    }, {
      body: EvalRequestSchema,
      detail: {
        summary: 'Evaluate MWScript expression',
        description: 'Evaluate a MWScript expression and return the result',
        tags: ['MWScript']
      },
      response: {
        200: SuccessResponse(EvalResponseSchema),
        400: ErrorSchema,
        500: ErrorSchema
      }
    });
}

/**
 * Detect the data type of a result string
 */
function detectDataType(result: string): 'string' | 'number' | 'boolean' | 'date' | undefined {
  const trimmed = result.trim();
  
  // Boolean
  if (trimmed === 'true' || trimmed === 'false') {
    return 'boolean';
  }
  
  // Number
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return 'number';
  }
  
  // Date (YYYYMMDD format)
  if (/^\d{8}$/.test(trimmed)) {
    const year = parseInt(trimmed.substring(0, 4));
    const month = parseInt(trimmed.substring(4, 6));
    const day = parseInt(trimmed.substring(6, 8));
    
    if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return 'date';
    }
  }
  
  // Default to string
  return 'string';
}