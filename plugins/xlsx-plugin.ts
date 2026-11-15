import * as XLSX from "xlsx";
import { readFileSync } from "node:fs";

/** Turns `import data from "x.xlsx"` into { sheetName: rows[] } at build time. */
export function xlsxPlugin() {
  return {
    name: "replad-xlsx",
    enforce: "pre" as const,
    load(id: string) {
      if (!id.endsWith(".xlsx")) return null;
      const wb = XLSX.read(readFileSync(id), { cellDates: true });
      const out: Record<string, unknown[]> = {};
      for (const name of wb.SheetNames) out[name] = XLSX.utils.sheet_to_json(wb.Sheets[name]!, { raw: true });
      return `export default ${JSON.stringify(out)};`;
    },
  };
}
