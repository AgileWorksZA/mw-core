# MoneyWorks MWScript Canonical Semantic Ontology Project Plan

## 🎯 **Project Overview**

This project will create a comprehensive canonical semantic ontology for the entire MoneyWorks MWScript function library, following the established paradigm from the `/extract-moneyworks-entity` command methodology. The ontology will cover ~400 functions and handlers across multiple categories, providing intelligent code assistance and automated documentation generation.

## 📚 **Document Processing Architecture**

### **Core Documentation Structure**

**Total Documents to Process**: ~400+ files across multiple categories

### **1. Primary Function Documentation** 
- **Files**: 318 `moneyworks_calculations_*.html` files
- **Structure**: Each function has standardized sections:
  - **Function signature**: `FunctionName(parameters)`
  - **Result Type**: Return value type 
  - **Definition**: Detailed description and behavior
  - **Examples**: Usage examples with code
  - **Availability**: Context restrictions (MWScript vs Reports)

### **2. Script Handler Documentation**
- **Files**: 45 `moneyworks_scripts_*.html` files  
- **Categories**: Event handlers for UI, validation, lifecycle
- **Key Handlers**: `Before`, `After`, `Validate`, `ItemHit`, `Load`, `Unload`

### **3. Master Index/Summary Document**
- **Key File**: `moneyworks_calculations_function_and_handler_summary.html`
- **Content**: Complete categorized function index with links
- **Categories**: 15+ functional groupings (Environmental, UI, Data, etc.)

### **4. Function Categories (from summary document)**

**Major Categories**:
1. **Mathematical Functions** (Abs, Round, etc.)
2. **String and Text Functions** (Left, Right, Length, etc.)  
3. **Date and Time Functions** (Today, Time, DateAdd, etc.)
4. **Type and Value Functions** (If, Match, TypeOf, etc.)
5. **Environmental Functions** (Database operations, transactions)
6. **Record Selection Functions** (CreateSelection, FindRecords, etc.)
7. **Table Handling Functions** (CreateTable, TableFind, etc.)
8. **User Interface Functions** (Alert, Ask, GetFieldValue, etc.)
9. **File and Network Functions** (File_Open, Curl_*, etc.)
10. **JSON/XML Parsing** (JSON_Parse, XMLParseString, etc.)
11. **Special Record Methods** (Name.GetContactForRole, Product.SOH, etc.)
12. **Script Handlers** (Event-driven functions)

## 🎯 **Canonical Semantic Ontology Structure**

Following the established `/extract-moneyworks-entity` paradigm:

```typescript
interface MWScriptCanonicalFunction {
  // Core Identity
  name: string;
  canonicalName: string;
  signature: string;
  
  // Semantic Classification
  category: string[];
  domain: 'mathematical' | 'string' | 'date' | 'environmental' | 'ui' | 'data' | 'network' | 'handler';
  purpose: string;
  
  // Technical Specification
  resultType: string;
  parameters: CanonicalParameter[];
  returnValue: CanonicalReturnValue;
  
  // Context and Availability
  availability: {
    mwscript: boolean;
    customReports: boolean;
    formDesigner: boolean;
    handlers: string[];
  };
  
  // Documentation and Examples
  definition: string;
  examples: CanonicalCodeExample[];
  usagePatterns: string[];
  
  // Relationships
  relatedFunctions: string[];
  dependsOn: string[];
  usedBy: string[];
  
  // Quality Metadata
  documentPath: string;
  extractedFrom: string;
  semanticTags: string[];
  validationStatus: 'pending' | 'validated' | 'requires_review';
  
  // Canonical Compliance
  canonicalValidation: {
    followsNamingConvention: boolean;
    hasCompleteDocumentation: boolean;
    examplesValidated: boolean;
    semanticTagsApplied: boolean;
  };
}
```

## 📋 **Project Backlog - Distributed Processing**

### **Sprint 1: Core Function Categories (ont1)**
**Estimated Effort**: 120 functions
**Priority**: High - Foundation functions needed for all MWScript development

#### **ont1 Responsibilities**:
1. **Mathematical Functions** (20 functions)
   - `Abs`, `Round`, `Floor`, `Ceiling`, `Max`, `Min`, `Random`, etc.
   
2. **String and Text Functions** (25 functions)
   - `Left`, `Right`, `Mid`, `Length`, `Find`, `Replace`, `Upper`, `Lower`, etc.
   
3. **Date and Time Functions** (15 functions)
   - `Today`, `Time`, `DateAdd`, `DateDiff`, `Year`, `Month`, `Day`, etc.
   
4. **Type and Value Functions** (12 functions)
   - `If`, `Match`, `TypeOf`, `Val`, `TextToNum`, `NumToText`, etc.
   
5. **Environmental Core** (48 functions)
   - Database operations: `Lookup`, `Find`, `Export`, `Import`
   - Transaction functions: `GetBalance`, `GetMovement`, `PostTransactions`
   - System functions: `GetAppPreference`, `SetAppPreference`

**Deliverables**:
- Canonical ontology files for each category
- Validation report with quality assurance checklist
- Cross-reference mapping for function relationships
- Usage pattern documentation

### **Sprint 2: Advanced Functions (ont2)**
**Estimated Effort**: 125 functions  
**Priority**: High - Advanced capabilities and specialized operations

#### **ont2 Responsibilities**:
1. **User Interface Functions** (45 functions)
   - Dialog functions: `Alert`, `Ask`, `ChooseFromList`
   - Field manipulation: `GetFieldValue`, `SetFieldValue`, `AutoFillField`
   - Window management: `CreateWindow`, `CloseWindow`, `DisplaySelection`
   
2. **Record Selection Functions** (15 functions)
   - `CreateSelection`, `IntersectSelection`, `UnionSelection`, `RecordsSelected`
   
3. **Table Handling Functions** (12 functions)
   - `CreateTable`, `TableFind`, `TableGet`, `TableAccumulate`
   
4. **File and Network Functions** (25 functions)
   - File operations: `File_Open`, `File_Read`, `File_Write`, `File_Close`
   - Network operations: `Curl_Init`, `Curl_Exec`, `Curl_SetOpt`
   
5. **JSON/XML Parsing** (15 functions)
   - JSON: `JSON_Parse`, `JSON_Get`, `JSON_Free`
   - XML: `XMLParseString`, `XPathEval`, `CreateXMLDoc`

6. **Advanced Environmental** (13 functions)
   - `Mail`, `External`, `GetPlugins`, `SysLog`, `GetProfile`

**Deliverables**:
- Canonical ontology files for each category
- Integration testing with ont1 deliverables
- Advanced usage pattern documentation
- Performance and optimization guidelines

### **Sprint 3: Specialized Functions (ont1 & ont2 Collaboration)**
**Estimated Effort**: 80 functions
**Priority**: Medium - Specialized and context-specific functions

#### **Collaborative Responsibilities**:
1. **Script Handlers** (45 functions)
   - Event handlers: `Before`, `After`, `Validate`, `ItemHit`
   - Lifecycle handlers: `Load`, `Unload`, `UserLoggedIn`
   - UI handlers: `EnterField`, `ExitedField`, `ValidateCell`
   
2. **Special Record Methods** (12 functions)
   - Name methods: `GetContactForRole`
   - Product methods: `SOHForLocation`, `StocktakeNewQtyForLocation`
   
3. **Form Designer Functions** (8 functions)
   - `ExpandDetail`, `ExpandList`, `SubTotal`
   
4. **Debugging and Performance** (5 functions)
   - `GetProfile`, `SysLog`, `_NTDump`
   
5. **Advanced Database Operations** (10 functions)
   - `Sqlite3_Open`, `Sqlite3_Exec`, `Sqlite3_Close`

**Deliverables**:
- Complete specialized function ontologies
- Cross-validation between ont1 and ont2 work
- Handler context mapping and usage guidelines
- Performance optimization recommendations

### **Sprint 4: Integration and Quality Assurance**
**Estimated Effort**: Full validation and integration
**Priority**: Critical - Ensure complete coverage and quality

#### **Final Integration Tasks**:
1. **Complete Ontology Merge**
2. **Cross-Reference Validation**
3. **Usage Pattern Verification**
4. **Documentation Quality Assurance**
5. **Canonical Compliance Review**

## 🛠️ **New Claude Commands Required**

### **Command 1: `/extract-mwscript-function` (For ont1 & ont2)**

**Purpose**: Extract canonical semantic ontology for MoneyWorks MWScript functions following established paradigm

**Usage**: `/extract-mwscript-function [function-category] [function-names]`

**Functionality**:
- Parse MoneyWorks function documentation
- Extract canonical semantic information
- Apply consistent naming conventions  
- Generate structured ontology output
- Validate against established patterns
- Create cross-reference mappings

**Output Format**: TypeScript canonical ontology files matching entity extraction patterns

### **Command 2: `/validate-mwscript-ontology` (For Architect)**

**Purpose**: Review and validate completed MWScript ontology work from ont1/ont2

**Usage**: `/validate-mwscript-ontology [ontologist-deliverable-path]`

**Functionality**:
- Review canonical compliance
- Validate semantic consistency
- Check cross-reference accuracy
- Verify example code quality
- Assess documentation completeness
- Generate quality assurance report

**Output Format**: Validation report with pass/fail status and improvement recommendations

## 📊 **Quality Assurance Framework**

### **Validation Criteria**:
1. **Canonical Compliance** (90% minimum)
   - Follows established naming conventions
   - Consistent structure across all functions
   - Proper semantic tagging applied

2. **Documentation Quality** (95% minimum)
   - Complete function signatures
   - Clear definitions and purposes
   - Working code examples
   - Accurate parameter descriptions

3. **Cross-Reference Accuracy** (100% requirement)
   - All related functions properly linked
   - Dependency relationships mapped
   - Usage patterns documented

4. **Semantic Consistency** (90% minimum)
   - Consistent categorization across functions
   - Proper domain classification
   - Standardized terminology usage

### **Review Process**:
1. **ont1/ont2** complete their assigned sprints
2. **Self-validation** using internal quality checks
3. **Deliverable submission** with validation report
4. **Architect review** using `/validate-mwscript-ontology`
5. **Feedback loop** for any required corrections
6. **Final approval** and integration

## 🎯 **Success Metrics**

- **Complete Coverage**: 400+ functions documented
- **Quality Score**: 95%+ validation rate
- **Consistency**: 100% canonical compliance
- **Usability**: Searchable semantic ontology
- **Integration**: Seamless with existing entity ontologies

## 📅 **Timeline**

- **Sprint 1**: 2 weeks (ont1)
- **Sprint 2**: 2 weeks (ont2) 
- **Sprint 3**: 1.5 weeks (collaboration)
- **Sprint 4**: 1 week (integration & QA)
- **Total**: 6.5 weeks to complete canonical ontology

## 🔄 **Paradigm Consistency**

This project follows the exact methodology established in `/extract-moneyworks-entity`:
- **Canonical naming conventions**
- **Structured semantic extraction**  
- **Quality validation frameworks**
- **Cross-reference relationship mapping**
- **Usage pattern documentation**
- **TypeScript ontology output format**

The new commands will maintain consistency with existing tooling while extending capabilities to cover the complete MWScript function library.