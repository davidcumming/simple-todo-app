
// This is a stubbed AI service. It returns deterministic fake suggestions.
// In a real application, this would make a call to an external AI/LLM service.

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

interface AISuggestion {
  suggestion: string;
  rationale: string;
}

/**
 * Mocks an AI suggesting a "next action" for a given to-do title.
 * @param todoTitle The title of the to-do item.
 * @returns A promise that resolves to an AISuggestion.
 */
export const suggestNextAction = async (todoTitle: string): Promise<AISuggestion> => {
  await simulateDelay(750); // Simulate network latency for AI call

  const lowerTitle = todoTitle.toLowerCase();
  
  if (lowerTitle.includes('report')) {
    return {
      suggestion: 'Compile data from sources A and B.',
      rationale: 'Reports typically require data compilation as a first step.'
    };
  }
  if (lowerTitle.includes('call') || lowerTitle.includes('email')) {
    return {
      suggestion: `Find contact information for ${todoTitle.split(' ').slice(1).join(' ')}.`,
      rationale: 'You need the contact details before you can initiate communication.'
    };
  }
  if (lowerTitle.includes('fix bug')) {
    return {
      suggestion: 'Reproduce the bug in the local development environment.',
      rationale: 'Confirming the bug is the first step to fixing it.'
    };
  }
  
  return {
    suggestion: 'Break down the task into smaller sub-tasks.',
    rationale: 'This is a good general first step for any complex task.'
  };
};
