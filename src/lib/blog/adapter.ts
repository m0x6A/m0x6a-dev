import type { BlogSourceEntry } from "./types";

export interface BlogSourceAdapter {
  listMarkdownFiles(): Promise<BlogSourceEntry[]>;
  readFile(filePath: string): Promise<string>;
}
