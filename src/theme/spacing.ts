const spacing = [0, 4, 8, 12, 16, 20, 24, 32] as const;
export const s = (n: number) => spacing[n] ?? n;
export { spacing };
