FIX ALL COMPILATION ERRORS and LINTING ERRORS

{{#if path}}
Focus on: {{path}}
- If it's a package name (e.g., "core", "semantic"), fix errors in packages/{{path}}
- If it's a path (contains "/"), fix errors in that specific path
- Only fix TypeScript, ESLint, and other tooling errors in the specified area
{{else}}
Fix errors across the entire project
{{/if}}

Steps:
1. Run type checking to identify TypeScript errors
2. Run linting to identify code style issues  
3. Fix all errors systematically
4. Ensure all imports are correct
5. Verify fixes don't introduce new errors

{{#if path}}
Priority: Focus only on {{path}} and its dependencies
{{/if}}