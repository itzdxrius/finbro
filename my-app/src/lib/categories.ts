export const CATEGORIES = [
  "Groceries",
  "Dining",
  "Transportation",
  "Housing",
  "Entertainment",
  "Misc",
] as const;

export type Category = (typeof CATEGORIES)[number];
