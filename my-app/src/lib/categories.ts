export const CATEGORIES = [
  "Education",
  "Emi",
  "Entertainment",
  "Food",
  "Healthcare",
  "Investment",
  "Shopping",
  "Travel",
  "Utilities",
] as const;

export type Category = (typeof CATEGORIES)[number];
