import type { ActionFunctionArgs } from "react-router";
import { knowledgeDB } from "~/modules/knowledge-alignment/db/schema.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { cardIds, templateId, contextTags, tokenBudget } = body;

    let cards;
    
    if (templateId) {
      // Use a template
      const template = knowledgeDB.getTemplate(templateId);
      if (!template) {
        return Response.json({ error: "Template not found" }, { status: 404 });
      }
      
      // Get cards from template
      cards = template.cardIds
        .map(id => knowledgeDB.getCard(id))
        .filter(card => card !== null && card.active);
    } else if (cardIds && Array.isArray(cardIds)) {
      // Use specific cards
      cards = cardIds
        .map(id => knowledgeDB.getCard(id))
        .filter(card => card !== null && card.active);
    } else if (contextTags && Array.isArray(contextTags)) {
      // Auto-select cards based on context
      cards = knowledgeDB.searchCards({
        tags: contextTags,
        active: true,
      });
    } else {
      // Get most relevant cards based on usage
      cards = knowledgeDB.getMostUsedCards(10);
    }

    // Sort by priority
    const config = knowledgeDB.getConfig();
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    cards.sort((a, b) => {
      const aPriority = priorityOrder[a!.priority] || 0;
      const bPriority = priorityOrder[b!.priority] || 0;
      return bPriority - aPriority;
    });

    // Build prompt sections
    const promptSections: string[] = [];
    let currentTokens = 0;
    const maxTokens = tokenBudget || config.tokenBudget || 2000;

    for (const card of cards) {
      if (!card) continue;
      
      // Estimate tokens (rough: 1 token ≈ 4 chars)
      const cardContent = formatCardForPrompt(card);
      const estimatedTokens = Math.ceil(cardContent.length / 4);
      
      if (currentTokens + estimatedTokens > maxTokens) {
        break;
      }
      
      promptSections.push(cardContent);
      currentTokens += estimatedTokens;
      
      // Record usage
      knowledgeDB.recordCardUsage(card.id);
    }

    const prompt = promptSections.join("\n\n");
    
    return Response.json({
      prompt,
      cardsUsed: cards.filter(c => c !== null).map(c => ({ id: c!.id, title: c!.title })),
      estimatedTokens: currentTokens,
    });
  } catch (error) {
    console.error("Error building prompt:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function formatCardForPrompt(card: any): string {
  let content = `## ${card.title}\n${card.summary}`;
  
  if (card.content) {
    content += `\n\n${card.content}`;
  }
  
  if (card.examples) {
    if (card.examples.correct && card.examples.correct.length > 0) {
      content += "\n\n### Correct Examples:";
      card.examples.correct.forEach((ex: string) => {
        content += `\n- ${ex}`;
      });
    }
    
    if (card.examples.incorrect && card.examples.incorrect.length > 0) {
      content += "\n\n### Incorrect Examples (avoid these):";
      card.examples.incorrect.forEach((ex: string) => {
        content += `\n- ${ex}`;
      });
    }
  }
  
  return content;
}