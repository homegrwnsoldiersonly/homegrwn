/**
 * Minimal CSV parsing for intake/CRM exports. Handles quoted fields, embedded
 * commas/quotes/newlines, and CRLF. Deliberately dependency-free — the formats
 * we ingest are simple and a parsing dep is not worth its supply-chain surface
 * for an internal tool touching ad-spend data.
 */

/** Parse CSV text into rows of string cells. No header interpretation. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;

  const pushCell = () => {
    row.push(cell);
    cell = "";
  };
  const pushRow = () => {
    pushCell();
    // Skip rows that are entirely empty (trailing newline artifacts).
    if (row.length > 1 || row[0] !== "") rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += ch;
      i++;
      continue;
    }
    if (ch === '"' && cell === "") {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      pushCell();
      i++;
      continue;
    }
    if (ch === "\n") {
      pushRow();
      i++;
      continue;
    }
    if (ch === "\r") {
      if (text[i + 1] === "\n") i++;
      pushRow();
      i++;
      continue;
    }
    cell += ch;
    i++;
  }
  if (cell !== "" || row.length > 0) pushRow();
  return rows;
}

/**
 * Parse a CSV with a header row into records keyed by normalized header name
 * (lowercased, spaces/dashes -> underscores).
 */
export function parseCsvRecords(text: string): {
  headers: string[];
  records: Array<{ values: Record<string, string>; line: number }>;
} {
  const rows = parseCsv(text);
  if (rows.length === 0) return { headers: [], records: [] };
  const headers = rows[0].map((h) =>
    h.trim().toLowerCase().replace(/[\s-]+/g, "_"),
  );
  const records = rows.slice(1).map((cells, idx) => {
    const values: Record<string, string> = {};
    headers.forEach((h, col) => {
      values[h] = (cells[col] ?? "").trim();
    });
    return { values, line: idx + 1 };
  });
  return { headers, records };
}
