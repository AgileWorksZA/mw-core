import { readFile, readdir } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface ContentMeta {
  title: string;
  description?: string;
  version?: string;
  package?: string;
  category?: string;
  order?: number;
  [key: string]: any;
}

export interface ContentData {
  meta: ContentMeta;
  content: string;
  readingTime: {
    text: string;
    minutes: number;
    words: number;
  };
}

export interface PackageContent {
  overview?: ContentData;
  guides: ContentData[];
  examples: ContentData[];
  api?: {
    functions: any;
    types: any;
    constants: any;
  };
}

const CONTENT_DIR = join(process.cwd(), "content");

export async function loadMdxFile(filePath: string): Promise<ContentData | null> {
  try {
    const fileContent = await readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);
    
    return {
      meta: data as ContentMeta,
      content,
      readingTime: stats,
    };
  } catch (error) {
    console.error(`Failed to load MDX file ${filePath}:`, error);
    return null;
  }
}

export async function loadPackageContent(packageName: string): Promise<PackageContent> {
  const packageDir = join(CONTENT_DIR, "packages", packageName);
  
  const content: PackageContent = {
    guides: [],
    examples: [],
  };
  
  // Load overview
  const overviewPath = join(packageDir, "overview.mdx");
  const overview = await loadMdxFile(overviewPath);
  if (overview) {
    content.overview = overview;
  }
  
  // Load API data
  try {
    const apiPath = join(packageDir, "api.json");
    const apiData = await readFile(apiPath, "utf-8");
    content.api = JSON.parse(apiData);
  } catch {
    // API file might not exist yet
    content.api = undefined;
  }
  
  // Load guides
  try {
    const guidesDir = join(packageDir, "guides");
    const guideFiles = await readdir(guidesDir);
    
    for (const file of guideFiles) {
      if (file.endsWith(".mdx")) {
        const guide = await loadMdxFile(join(guidesDir, file));
        if (guide) {
          content.guides.push(guide);
        }
      }
    }
  } catch {
    // Guides directory might not exist
  }
  
  // Load examples
  try {
    const examplesDir = join(packageDir, "examples");
    const exampleFiles = await readdir(examplesDir);
    
    for (const file of exampleFiles) {
      if (file.endsWith(".mdx")) {
        const example = await loadMdxFile(join(examplesDir, file));
        if (example) {
          content.examples.push(example);
        }
      }
    }
  } catch {
    // Examples directory might not exist
  }
  
  // Sort guides and examples by order
  content.guides.sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999));
  content.examples.sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999));
  
  return content;
}

export async function loadAllPackages(): Promise<string[]> {
  try {
    const packagesDir = join(CONTENT_DIR, "packages");
    const packages = await readdir(packagesDir);
    return packages.filter(pkg => !pkg.startsWith("."));
  } catch {
    return [];
  }
}

export async function loadGuide(guideName: string): Promise<ContentData | null> {
  const guidePath = join(CONTENT_DIR, "guides", `${guideName}.mdx`);
  return loadMdxFile(guidePath);
}

export async function loadAllGuides(): Promise<ContentData[]> {
  try {
    const guidesDir = join(CONTENT_DIR, "guides");
    const files = await readdir(guidesDir);
    
    const guides: ContentData[] = [];
    for (const file of files) {
      if (file.endsWith(".mdx")) {
        const guide = await loadMdxFile(join(guidesDir, file));
        if (guide) {
          guides.push(guide);
        }
      }
    }
    
    return guides.sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999));
  } catch {
    return [];
  }
}

export async function loadPackageSubpageContent(packageName: string, subpage: string): Promise<ContentData | null> {
  const subpagePath = join(CONTENT_DIR, "packages", packageName, `${subpage}.mdx`);
  return loadMdxFile(subpagePath);
}