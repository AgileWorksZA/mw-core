import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

function readIgnoreFile(filePath: string): string[] {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8')
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'));
    }
    return [];
}

function getAllFiles(dir: string, ig: any): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath, ig));
        } else {
            const relativePath = path.relative(process.cwd(), filePath);
            if (!ig.ignores(relativePath)) {
                results.push(filePath);
            }
        }
    });
    return results;
}

function dumpToFile(outputFile: string) {
    const gitIgnorePatterns = readIgnoreFile('.gitignore');
    const aiIgnorePatterns = readIgnoreFile('.aiignore');
    const allIgnorePatterns = [...gitIgnorePatterns, ...aiIgnorePatterns];
    const ig = ignore().add(allIgnorePatterns);

    const files = getAllFiles(process.cwd(), ig);

    const prompt = `/*
This file contains the source code from the repository, excluding files specified in .gitignore and .aiignore.

Each file's content is preceded by a header like "--- FILE: path/to/file.ts ---" and followed by "--- END FILE ---".

To make changes, edit the content between these markers. Do not alter the headers or the structure.

When you are done, save this file and use the apply script to apply the changes back to the repository.
*/
`;

    let output = prompt + '\n\n';

    files.forEach(file => {
        const relativePath = path.relative(process.cwd(), file);
        const content = fs.readFileSync(file, 'utf-8');
        output += `--- FILE: ${relativePath} ---\n`;
        output += content + '\n';
        output += `--- END FILE ---\n\n`;
    });

    fs.writeFileSync(outputFile, output, 'utf-8');
}

if (require.main === module) {
    const outputFile = process.argv[2] || 'dump.txt';
    dumpToFile(outputFile);
}
