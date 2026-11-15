declare module "*.xlsx" {
  const sheets: Record<string, Record<string, unknown>[]>;
  export default sheets;
}
