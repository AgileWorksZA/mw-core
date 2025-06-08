// dump.ts
import fs from "fs/promises";
import path from "path";
import ignore from "ignore";

const ROOT_DIR = process.cwd(); // Use current working directory as root
const OUTPUT_FILE = path.join(ROOT_DIR, "dump.txt");
const IGNORE_FILES = [".gitignore", ".aiignore"];
const ALWAYS_IGNORE = ["node_modules", ".git", path.basename(OUTPUT_FILE)]; // Always ignore these

const PROMPT_HEADER = `
AI CODE MODIFICATION INSTRUCTIONS:

You are about to receive a dump of multiple source code files. Your task is to modify the code based on my instructions that follow this block.

**IMPORTANT RULES:**
1.  **ONLY modify the code content** within the file blocks provided below.
2.  **DO NOT** change the file path lines (e.g., \`// ==== FILE: src/index.ts ====\`).
3.  **DO NOT** add or remove any file blocks.
4.  **RETURN THE ENTIRE MODIFIED CODE BLOCK**, including this instruction prompt and all the \`// ==== FILE: ... ====\` separators and their corresponding code, exactly as provided, but with your modifications applied to the code sections.
5.  If you are asked to add a new file, create a new block like \`// ==== FILE: path/to/new/file.ext ====\` followed by its content.

The code dump starts below this line.
--------------------------------------------------------------------------

`;

async function readIgnoreFile(filePath: string): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content.split(/\r?\n/).filter((line) => line && !line.startsWith("#"));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File not found is okay, just means no rules from this file
      return [];
    }
    console.warn(`Warning: Could not read ignore file ${filePath}: ${error.message}`);
    return [];
  }
}

async function walkDir(
  dir: string,
  ig: ignore.Ignore,
  baseDir: string = dir,
): Promise<{ filePath: string; content: string }[]> {
  let results: { filePath: string; content: string }[] = [];
  const dirents = await fs.readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);
    const relativePath = path.relative(baseDir, fullPath);

    // Use POSIX paths for ignore checking, even on Windows
    const relativePathPosix = relativePath.split(path.sep).join(path.posix.sep);

    if (ig.ignores(relativePathPosix) || ig.ignores(relativePathPosix + '/')) {
        // console.log(`Ignoring: ${relativePathPosix}`); // Optional: log ignored files
        continue;
    }

    if (dirent.isDirectory()) {
      results = results.concat(await walkDir(fullPath, ig, baseDir));
    } else {
      try {
        const content = await fs.readFile(fullPath, "utf-8");
        results.push({ filePath: relativePath, content });
      } catch (error: any) {
        console.warn(`Warning: Could not read file ${fullPath}: ${error.message}`);
      }
    }
  }
  return results;
}

async function main() {
  console.log(`Starting dump from directory: ${ROOT_DIR}`);
  console.log(`Output file will be: ${OUTPUT_FILE}`);

  const ig = ignore().add(ALWAYS_IGNORE);

  for (const ignoreFileName of IGNORE_FILES) {
    const ignoreFilePath = path.join(ROOT_DIR, ignoreFileName);
    const patterns = await readIgnoreFile(ignoreFilePath);
    if (patterns.length > 0) {
        console.log(`Loaded ${patterns.length} rules from ${ignoreFileName}`);
        ig.add(patterns);
    }
  }

  console.log("Walking directory tree...");
  const allFiles = await walkDir(ROOT_DIR, ig);
  console.log(`Found ${allFiles.length} files to include.`);

  let outputContent = PROMPT_HEADER;

  allFiles.sort((a, b) => a.filePath.localeCompare(b.filePath)); // Sort for consistent output

  for (const fileData of allFiles) {
    // Use POSIX paths for separators for consistency across OS
    const separatorPath = fileData.filePath.split(path.sep).join(path.posix.sep);
    outputContent += `\n\n// ==== FILE: ${separatorPath} ====\n`;
    outputContent += fileData.content;
  }

  try {
    await fs.writeFile(OUTPUT_FILE, outputContent);
    console.log(`✅ Successfully dumped ${allFiles.length} files to ${OUTPUT_FILE}`);
  } catch (error: any) {
    console.error(`❌ Error writing output file: ${error.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ An unexpected error occurred:", err);
  process.exit(1);
});
