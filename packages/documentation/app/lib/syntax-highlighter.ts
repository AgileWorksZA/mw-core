import { type Highlighter, createHighlighter } from "shiki";

// Cache the highlighter instance
let highlighterPromise: Promise<Highlighter> | null = null;

// Common languages for MoneyWorks documentation
const LANGUAGES = [
	"typescript",
	"javascript",
	"bash",
	"json",
	"tsx",
	"jsx",
	"sql",
	"yaml",
	"markdown",
	"mdx",
];

// Theme configuration
const THEMES = {
	light: "github-light",
	dark: "vitesse-dark",
};

/**
 * Get or create the singleton highlighter instance
 */
export async function getHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: Object.values(THEMES),
			langs: LANGUAGES,
		});
	}

	return highlighterPromise;
}

/**
 * Highlight code with the specified language and theme
 */
export async function highlightCode(
	code: string,
	language = "text",
	theme: "light" | "dark" = "dark",
	includeCopyButton = true,
): Promise<string> {
	const highlighter = await getHighlighter();

	// Ensure the language is loaded
	const loadedLanguages = highlighter.getLoadedLanguages();
	if (!loadedLanguages.includes(language) && language !== "text") {
		try {
			await highlighter.loadLanguage(language as any);
		} catch (error) {
			console.warn(
				`Failed to load language '${language}', falling back to 'text'`,
			);
			language = "text";
		}
	}

	const html = highlighter.codeToHtml(code, {
		lang: language,
		theme: THEMES[theme],
	});

	// Wrap in a container with copy button
	if (includeCopyButton) {
		// Convert code to base64 to avoid escaping issues
		const base64Code = Buffer.from(code).toString("base64");

		return `
      <div class="relative group">
        ${html}
        <button
          data-code="${base64Code}"
          onclick="(function() {
            const base64 = this.getAttribute('data-code');
            const code = atob(base64);
            navigator.clipboard.writeText(code).then(() => {
              const checkIcon = '<svg class=\\'h-4 w-4\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M5 12l5 5L20 7\\'></path></svg>';
              const copyIcon = '<svg class=\\'h-4 w-4\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z\\'></path></svg>';
              
              this.innerHTML = checkIcon;
              this.classList.add('text-green-600', 'dark:text-green-400');
              setTimeout(() => {
                this.innerHTML = copyIcon;
                this.classList.remove('text-green-600', 'dark:text-green-400');
              }, 2000);
            });
          })"
          class="absolute top-2 right-2 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-muted transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Copy code to clipboard"
          title="Copy code"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>
      </div>
    `;
	}

	return html;
}

/**
 * Extract language from code fence info string
 * e.g., "typescript" or "typescript title=example.ts"
 */
export function parseLanguage(infoString: string): string {
	if (!infoString) return "text";

	// Extract just the language part (before any spaces)
	const language = infoString.split(" ")[0].toLowerCase();

	// Map common aliases
	const aliases: Record<string, string> = {
		ts: "typescript",
		js: "javascript",
		sh: "bash",
		shell: "bash",
		yml: "yaml",
		md: "markdown",
	};

	return aliases[language] || language;
}

/**
 * Parse code block metadata from fence info string
 */
export function parseCodeBlockMeta(infoString: string): {
	language: string;
	title?: string;
	showLineNumbers?: boolean;
} {
	const parts = infoString.split(" ");
	const language = parseLanguage(parts[0]);

	const meta: any = { language };

	// Parse additional metadata
	parts.slice(1).forEach((part) => {
		if (part.startsWith("title=")) {
			meta.title = part.slice(6);
		} else if (part === "showLineNumbers") {
			meta.showLineNumbers = true;
		}
	});

	return meta;
}
