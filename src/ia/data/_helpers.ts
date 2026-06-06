import type { Choice, ChoiceKey } from '../types';

export function mc(correct: ChoiceKey, items: Partial<Record<ChoiceKey, string>>): Choice[] {
  return (Object.keys(items) as ChoiceKey[]).map((key) => ({
    key,
    text: String(items[key]),
    correct: key === correct,
  }));
}
