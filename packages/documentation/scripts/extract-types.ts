#!/usr/bin/env bun

import * as ts from "typescript";
import { readFile } from "fs/promises";
import { join } from "path";

export interface ExtractedFunction {
  name: string;
  signature: string;
  description?: string;
  parameters: {
    name: string;
    type: string;
    description?: string;
    optional?: boolean;
  }[];
  returns?: {
    type: string;
    description?: string;
  };
  examples?: { title: string; code: string }[];
  since?: string;
  category?: string;
}

export interface ExtractedType {
  name: string;
  kind: "interface" | "type" | "enum" | "class";
  description?: string;
  properties?: {
    name: string;
    type: string;
    description?: string;
    optional?: boolean;
  }[];
  signature?: string;
}

export interface ExtractedConstant {
  name: string;
  type: string;
  value?: string;
  description?: string;
}

export class TypeScriptExtractor {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  
  constructor(private packagePath: string) {
    const configPath = ts.findConfigFile(
      packagePath,
      ts.sys.fileExists,
      "tsconfig.json"
    );
    
    if (!configPath) {
      throw new Error("Could not find tsconfig.json");
    }
    
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      packagePath
    );
    
    this.program = ts.createProgram(
      parsedConfig.fileNames,
      parsedConfig.options
    );
    this.checker = this.program.getTypeChecker();
  }
  
  async extractFromIndex(): Promise<{
    functions: ExtractedFunction[];
    types: ExtractedType[];
    constants: ExtractedConstant[];
  }> {
    const indexPath = join(this.packagePath, "src", "index.ts");
    const sourceFile = this.program.getSourceFile(indexPath);
    
    if (!sourceFile) {
      throw new Error("Could not find index.ts");
    }
    
    const functions: ExtractedFunction[] = [];
    const types: ExtractedType[] = [];
    const constants: ExtractedConstant[] = [];
    
    // Visit all exported declarations
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach((element) => {
          const name = element.name.text;
          const symbol = this.checker.getSymbolAtLocation(element.name);
          
          if (symbol) {
            const declarations = symbol.getDeclarations();
            if (declarations && declarations.length > 0) {
              const decl = declarations[0];
              
              if (ts.isFunctionDeclaration(decl) || ts.isMethodDeclaration(decl)) {
                const func = this.extractFunction(decl);
                if (func) functions.push(func);
              } else if (ts.isTypeAliasDeclaration(decl) || ts.isInterfaceDeclaration(decl)) {
                const type = this.extractType(decl);
                if (type) types.push(type);
              } else if (ts.isVariableDeclaration(decl)) {
                const constant = this.extractConstant(decl);
                if (constant) constants.push(constant);
              }
            }
          }
        });
      }
    });
    
    return { functions, types, constants };
  }
  
  private extractFunction(node: ts.FunctionDeclaration | ts.MethodDeclaration): ExtractedFunction | null {
    const symbol = this.checker.getSymbolAtLocation(node.name!);
    if (!symbol) return null;
    
    const signature = this.checker.getSignatureFromDeclaration(node);
    if (!signature) return null;
    
    const jsDocTags = ts.getJSDocTags(node);
    const description = ts.getJSDocCommentsAndTags(node)
      .find(tag => ts.isJSDoc(tag))
      ?.comment?.toString();
    
    const parameters = signature.getParameters().map(param => {
      const paramType = this.checker.getTypeOfSymbolAtLocation(param, node);
      const paramDecl = param.valueDeclaration as ts.ParameterDeclaration;
      const isOptional = paramDecl ? paramDecl.questionToken !== undefined : false;
      
      return {
        name: param.getName(),
        type: this.checker.typeToString(paramType),
        optional: isOptional,
        description: this.getJSDocParamDescription(node, param.getName()),
      };
    });
    
    const returnType = signature.getReturnType();
    const examples = this.extractExamples(jsDocTags);
    
    return {
      name: symbol.getName(),
      signature: this.checker.signatureToString(signature),
      description,
      parameters,
      returns: {
        type: this.checker.typeToString(returnType),
        description: this.getJSDocReturnsDescription(node),
      },
      examples,
      since: this.getJSDocTag(jsDocTags, "since"),
      category: this.getJSDocTag(jsDocTags, "category"),
    };
  }
  
  private extractType(node: ts.TypeAliasDeclaration | ts.InterfaceDeclaration): ExtractedType | null {
    const symbol = this.checker.getSymbolAtLocation(node.name);
    if (!symbol) return null;
    
    const type = this.checker.getTypeAtLocation(node);
    const jsDocTags = ts.getJSDocTags(node);
    const description = ts.getJSDocCommentsAndTags(node)
      .find(tag => ts.isJSDoc(tag))
      ?.comment?.toString();
    
    const result: ExtractedType = {
      name: symbol.getName(),
      kind: ts.isInterfaceDeclaration(node) ? "interface" : "type",
      description,
      signature: this.checker.typeToString(type),
    };
    
    // Extract properties for interfaces
    if (ts.isInterfaceDeclaration(node)) {
      result.properties = [];
      node.members.forEach(member => {
        if (ts.isPropertySignature(member) && member.name && ts.isIdentifier(member.name)) {
          const propSymbol = this.checker.getSymbolAtLocation(member.name);
          if (propSymbol) {
            const propType = this.checker.getTypeOfSymbolAtLocation(propSymbol, member);
            result.properties!.push({
              name: propSymbol.getName(),
              type: this.checker.typeToString(propType),
              optional: member.questionToken !== undefined,
              description: ts.getJSDocCommentsAndTags(member)
                .find(tag => ts.isJSDoc(tag))
                ?.comment?.toString(),
            });
          }
        }
      });
    }
    
    return result;
  }
  
  private extractConstant(node: ts.VariableDeclaration): ExtractedConstant | null {
    if (!node.name || !ts.isIdentifier(node.name)) return null;
    
    const symbol = this.checker.getSymbolAtLocation(node.name);
    if (!symbol) return null;
    
    const type = this.checker.getTypeAtLocation(node);
    const description = ts.getJSDocCommentsAndTags(node)
      .find(tag => ts.isJSDoc(tag))
      ?.comment?.toString();
    
    return {
      name: symbol.getName(),
      type: this.checker.typeToString(type),
      value: node.initializer ? node.initializer.getText() : undefined,
      description,
    };
  }
  
  private getJSDocTag(tags: readonly ts.JSDocTag[], tagName: string): string | undefined {
    return tags.find(tag => tag.tagName.text === tagName)?.comment?.toString();
  }
  
  private getJSDocParamDescription(node: ts.Node, paramName: string): string | undefined {
    const tags = ts.getJSDocTags(node);
    const paramTag = tags.find(
      tag => tag.tagName.text === "param" && 
      tag.comment?.toString().startsWith(paramName)
    );
    return paramTag?.comment?.toString().replace(`${paramName} `, "");
  }
  
  private getJSDocReturnsDescription(node: ts.Node): string | undefined {
    const tags = ts.getJSDocTags(node);
    return tags.find(tag => tag.tagName.text === "returns")?.comment?.toString();
  }
  
  private extractExamples(tags: readonly ts.JSDocTag[]): { title: string; code: string }[] {
    return tags
      .filter(tag => tag.tagName.text === "example")
      .map(tag => {
        const comment = tag.comment?.toString() || "";
        const lines = comment.split("\n");
        const title = lines[0] || "Example";
        const code = lines.slice(1).join("\n").trim();
        return { title, code };
      });
  }
}