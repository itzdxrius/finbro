export const CATEGORIES = [
  "Groceries",
  "Dining",
  "Transportation",
  "Housing",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Income",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
