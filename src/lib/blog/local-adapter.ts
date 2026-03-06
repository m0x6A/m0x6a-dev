import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { BlogSourceAdapter } from "./adapter";
import { BlogSourceUnavailableError } from "./errors";
import { resolveLocalContentDirectory } from "./source";
import type { BlogSourceEntry, LocalBlogSourceConfig } from "./types";

const MARKDOWN_EXTENSIONS = [".md", ".markdown"];

function isMarkdownFile(fileName: string) {
  return MARKDOWN_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

export class LocalBlogSourceAdapter implements BlogSourceAdapter {
  constructor(private readonly config: LocalBlogSourceConfig) {}

  async listMarkdownFiles(): Promise<BlogSourceEntry[]> {
    const root = resolveLocalContentDirectory(
      this.config.rootDir,
      this.config.contentPath,
    );

    return walkDirectory(root);
  }

  async readFile(filePath: string): Promise<string> {
    const root = resolveLocalContentDirectory(
      this.config.rootDir,
      this.config.contentPath,
    );
    const fullPath = path.join(root, filePath);

    try {
      return await readFile(fullPath, "utf8");
    } catch (error) {
      throw new BlogSourceUnavailableError(
        `Unable to read local blog file "${filePath}".`,
        { cause: error },
      );
    }
  }
}

async function walkDirectory(
  directoryPath: string,
  relativePath = "",
): Promise<BlogSourceEntry[]> {
  const entries = await readDirectoryEntries(directoryPath);

  const nestedEntries = await Promise.all(
    entries.map(async (entry) => {
      const nextRelativePath = relativePath
        ? `${relativePath}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        return walkDirectory(path.join(directoryPath, entry.name), nextRelativePath);
      }

      if (entry.isFile() && isMarkdownFile(entry.name)) {
        return [{ path: nextRelativePath, name: entry.name }];
      }

      return [];
    }),
  );

  return nestedEntries.flat();
}

async function readDirectoryEntries(directoryPath: string): Promise<Dirent[]> {
  try {
    return await readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    throw new BlogSourceUnavailableError(
      `Unable to read local blog directory "${directoryPath}".`,
      { cause: error },
    );
  }
}
