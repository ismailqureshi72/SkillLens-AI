export function splitHighlight(text: string, query: string): Array<{ text: string; matched: boolean }> {
  if (!query.trim()) return [{ text, matched: false }];
  const result: Array<{ text: string; matched: boolean }> = [];
  const lower = text.toLocaleLowerCase();
  const needle = query.toLocaleLowerCase();
  let cursor = 0;
  while (cursor < text.length) {
    const match = lower.indexOf(needle, cursor);
    if (match === -1) { result.push({ text: text.slice(cursor), matched: false }); break; }
    if (match > cursor) result.push({ text: text.slice(cursor, match), matched: false });
    result.push({ text: text.slice(match, match + query.length), matched: true });
    cursor = match + query.length;
  }
  return result;
}
