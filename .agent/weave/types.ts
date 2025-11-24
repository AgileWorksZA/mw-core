/**
 * Weave - Q+E+O+M Knowledge Framework Types
 *
 * Core type definitions for the four-dimensional knowledge representation system:
 * - Qualia (Q): Experiential, subjective knowledge
 * - Epistemology (E): Knowledge confidence and provenance
 * - Ontology (O): Formal structure and relationships
 * - Mereology (M): Part-whole composition
 */

// ============================================================================
// Common Types
// ============================================================================

export interface Provenance {
  source: ProvenanceSource;
  sessionId: string;
  timestamp: string;
  confidence: number;
  observations?: number;
  agent?: string;
}

export type ProvenanceSource =
  | 'code-analysis'
  | 'schema-analysis'
  | 'dependency-analysis'
  | 'pattern-detection'
  | 'error-tracking'
  | 'fix-implementation'
  | 'workflow-detection'
  | 'commit-message-analysis'
  | 'manual-annotation'
  | 'session-init';

export interface CodeLocation {
  file: string;
  startLine?: number;
  endLine?: number;
}

export interface Example {
  sessionId: string;
  location?: CodeLocation;
  context?: string;
}

export type Dimension = 'Q' | 'E' | 'O' | 'M';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ConfidenceLevel =
  | 'speculative'      // 0.0-0.3
  | 'uncertain'        // 0.3-0.5
  | 'probable'         // 0.5-0.7
  | 'confident'        // 0.7-0.85
  | 'highly_confident' // 0.85-0.95
  | 'certain';         // 0.95-1.0

// ============================================================================
// Ontology Types - What exists
// ============================================================================

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  description?: string;
  properties?: Record<string, PropertyDefinition>;
  relations?: EntityRelations;
  constraints?: EntityConstraints;
  location?: CodeLocation;
  provenance: Provenance;
}

export type EntityType =
  | 'domain-entity'
  | 'module'
  | 'service'
  | 'api-endpoint'
  | 'database-table'
  | 'architectural-pattern'
  | 'library'
  | 'type-definition';

export interface PropertyDefinition {
  type: string;
  required?: boolean;
  values?: string[];
  description?: string;
}

export interface EntityRelations {
  hasMany?: string[];
  belongsTo?: string[];
  references?: string[];
  implements?: string[];
  extends?: string[];
  uses?: string[];
  dependsOn?: string[];
  complementsWith?: string[];
  replaces?: string[];
}

export interface EntityConstraints {
  unique?: string[];
  required?: string[];
  validation?: Record<string, string>;
  businessRules?: string[];
  statusTransitions?: Record<string, string[]>;
  requiredBefore?: Record<string, string[]>;
  incompatible?: string[];
}

export interface Relation {
  id: string;
  type: RelationType;
  source: string;
  target: string;
  properties?: Record<string, any>;
  provenance: Provenance;
}

export type RelationType =
  | 'has-many'
  | 'belongs-to'
  | 'references'
  | 'implements'
  | 'extends'
  | 'uses'
  | 'depends-on'
  | 'one-to-many'
  | 'many-to-one'
  | 'many-to-many'
  | 'realization';

export interface Constraint {
  id: string;
  type: ConstraintType;
  entities: string[];
  rule: string;
  description?: string;
  provenance: Provenance;
}

export type ConstraintType =
  | 'unique'
  | 'required'
  | 'validation'
  | 'business-rule'
  | 'state-transition';

export interface Ontology {
  $schema: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  entities: Record<string, Entity>;
  relations: Record<string, Relation>;
  constraints: Record<string, Constraint>;
  metadata: OntologyMetadata;
}

export interface OntologyMetadata {
  totalEntities: number;
  totalRelations: number;
  totalConstraints: number;
  averageConfidence: number;
  lastCompaction: string | null;
}

// ============================================================================
// Mereology Types - How parts compose
// ============================================================================

export interface Component {
  id: string;
  name: string;
  type: ComponentType;
  description?: string;
  location?: CodeLocation;
  dependencies?: string[];
  provenance: Provenance;
}

export type ComponentType =
  | 'module'
  | 'service'
  | 'controller'
  | 'repository'
  | 'middleware'
  | 'utility'
  | 'hook'
  | 'component'
  | 'route'
  | 'pattern-implementation'
  | 'system';

export interface Composition {
  id: string;
  name: string;
  type: ComponentType;
  description?: string;
  parts: CompositionParts;
  compositionType?: CompositionType;
  dependencies?: DependencyGraph;
  compositionRules?: CompositionRules;
  emergentProperties?: string[];
  provenance: Provenance;
}

export interface CompositionParts {
  core?: string[];
  supporting?: string[];
  infrastructure?: string[];
  backend?: string[];
  frontend?: string[];
  shared?: string[];
}

export type CompositionType =
  | 'aggregation'   // Parts can exist independently
  | 'composition'   // Parts cannot exist without whole
  | 'collection';   // Loose grouping

export interface DependencyGraph {
  internal?: Record<string, string[]>;
  external?: Record<string, string[]>;
}

export interface CompositionRules {
  sequence?: string[];
  cardinality?: Record<string, string | number>;
}

export interface SystemHierarchy {
  root: string | null;
  layers: Layer[];
  modules: Module[];
}

export interface Layer {
  name: string;
  level: number;
  components: string[];
}

export interface Module {
  id: string;
  name: string;
  path: string;
  components: string[];
  submodules?: string[];
}

export interface PartWholeRelation {
  type: string;
  description: string;
  examples: string[];
}

export interface Mereology {
  $schema: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  components: Record<string, Component>;
  compositions: Record<string, Composition>;
  hierarchy: SystemHierarchy;
  partWholeRelations: Record<string, PartWholeRelation>;
  metadata: MereologyMetadata;
}

export interface MereologyMetadata {
  totalComponents: number;
  totalCompositions: number;
  totalParts: number;
  maxDepth: number;
  averageConfidence: number;
  lastCompaction: string | null;
}

// ============================================================================
// Epistemology Types - How we know
// ============================================================================

export interface Knowledge {
  id: string;
  concept: string;
  confidence: number;
  confidenceLevel?: ConfidenceLevel;
  confidenceHistory: ConfidencePoint[];
  basis: KnowledgeBasis;
  evidence: Evidence;
  sources: Source[];
  uncertainties?: Uncertainty[];
  contradictions?: Contradiction[];
  validations?: string[];
  reliability: Reliability;
}

export type KnowledgeBasis =
  | 'empirical'     // Observed in code/behavior
  | 'inferred'      // Derived from patterns
  | 'documented'    // From comments/docs
  | 'validated'     // Tested/confirmed
  | 'assumed';      // Unverified belief

export interface ConfidencePoint {
  date: string;
  value: number;
  reason: string;
  source?: string;
}

export interface Evidence {
  observations: number;
  validations: number;
  contradictions: number;
  firstSeen: string;
  lastSeen: string;
}

export interface Source {
  type: 'session' | 'commit' | 'documentation' | 'external' | 'test';
  id: string;
  date: string;
  contribution?: string;
}

export interface Uncertainty {
  aspect: string;
  confidence: number;
  reason: string;
}

export interface Contradiction {
  observedAt: string;
  description: string;
  sessionId: string;
  resolved: boolean;
  resolution?: string;
}

export interface Reliability {
  status: 'speculative' | 'unreliable' | 'reliable' | 'highly_reliable';
  factors: {
    consistency: number;
    reproducibility: number;
    testability: number;
  };
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  type: PatternType;
  confidence: number;
  observations: number;
  examples: Example[];
  context?: string;
  effectiveness?: number;
  provenance: Provenance;
}

export type PatternType =
  | 'architectural'
  | 'code-pattern'
  | 'workflow'
  | 'error-pattern'
  | 'usage-pattern'
  | 'development'
  | 'debugging'
  | 'collaboration';

export interface Validation {
  id: string;
  concept: string;
  validationType: ValidationType;
  successful: boolean;
  timestamp: string;
  evidence: ValidationEvidence;
}

export type ValidationType =
  | 'test-passed'
  | 'commit-successful'
  | 'pattern-repeated'
  | 'manual-verification'
  | 'production-success';

export interface ValidationEvidence {
  type: string;
  data: any;
  source: string;
}

export interface ConfidenceModel {
  scale: Record<string, ConfidenceLevel>;
  updateRules: Record<string, string>;
  bayesianParameters: {
    priorWeight: number;
    evidenceWeight: number;
    minObservations: number;
  };
}

export interface KnowledgeGap {
  concept: string;
  currentConfidence: number;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestedActions?: string[];
}

export interface Epistemology {
  $schema: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  knowledge: Record<string, Knowledge>;
  patterns: Record<string, Pattern>;
  validations: Record<string, Validation>;
  confidenceModel: ConfidenceModel;
  knowledgeGaps: KnowledgeGap[];
  metadata: EpistemologyMetadata;
}

export interface EpistemologyMetadata {
  totalConcepts: number;
  totalPatterns: number;
  totalValidations: number;
  averageConfidence: number;
  highConfidenceConcepts: number;
  lowConfidenceConcepts: number;
  knowledgeGaps: number;
  lastValidation: string;
}

// ============================================================================
// Qualia Types - What it's like
// ============================================================================

export interface Experience {
  id: string;
  concept: string;
  description?: string;
  commonWorkflow?: string[];
  painPoints: PainPoint[];
  bestPractices: BestPractice[];
  solutions?: Solution[];
  debuggingTips?: string[];
  contextualCues?: string[];
  tacitKnowledge?: string[];
  emotionalContext?: EmotionalContext;
  cognitiveLoad?: CognitiveLoad;
  provenance: {
    sources: string[];
    lastUpdated: string;
  };
}

export interface PainPoint {
  id: string;
  concept?: string;
  issue: string;
  description?: string;
  frequency: 'rare' | 'uncommon' | 'common' | 'very_common';
  severity: Severity;
  consequence?: string;
  context?: string;
  firstEncountered: string;
  lastEncountered?: string;
  occurrences: number;
  relatedErrors?: ErrorReference[];
  solutions?: string[];
  provenance: Provenance;
}

export interface ErrorReference {
  message: string;
  stackTrace?: string;
  sessionId: string;
  timestamp?: string;
}

export interface Solution {
  id: string;
  problem: string;
  approach: string;
  reason?: string;
  effectiveness: number;
  context: Context;
  examples: Example[];
  provenance: Provenance;
}

export interface BestPractice {
  id: string;
  concept: string;
  practice: string;
  reason: string;
  context: string;
  confidence: number;
  examples?: Example[];
  provenance: Provenance;
}

export interface EmotionalContext {
  initialComplexity: 'low' | 'medium' | 'high' | 'very_high';
  learningCurve?: string;
  satisfaction?: string;
  frustrationPoints?: string[];
  confidence?: string;
}

export interface CognitiveLoad {
  initial: string;
  afterLearning: string;
  commonConfusion: string[];
  masteryIndicators: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  successRate: number;
  context: Context;
  observations: number;
  provenance: Provenance;
}

export interface WorkflowStep {
  order: number;
  action: string;
  toolsUsed?: string[];
  commonIssues?: string[];
  duration?: string;
}

export interface ContextualKnowledge {
  id: string;
  concept: string;
  context: {
    why?: string;
    when?: string;
    how?: string;
    gotchas?: string[];
  };
  provenance: Provenance;
}

export interface Context {
  taskType?: string;
  fileTypes?: string[];
  modules?: string[];
  relatedConcepts?: string[];
}

export interface Qualia {
  $schema: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  experiences: Record<string, Experience>;
  painPoints: Record<string, PainPoint>;
  solutions: Record<string, Solution>;
  workflows: Record<string, Workflow>;
  bestPractices: Record<string, BestPractice>;
  contextualKnowledge: Record<string, ContextualKnowledge>;
  patterns: {
    development: Pattern[];
    debugging: Pattern[];
    collaboration: Pattern[];
  };
  cognitiveLoad: Record<string, CognitiveLoad>;
  metadata: QualiaMetadata;
}

export interface QualiaMetadata {
  totalExperiences: number;
  totalPainPoints: number;
  totalSolutions: number;
  totalWorkflows: number;
  totalBestPractices: number;
  totalPatterns: number;
  lastUpdated: string;
}

// ============================================================================
// Unified Knowledge Types
// ============================================================================

export interface WeaveKnowledge {
  ontology: Ontology;
  mereology: Mereology;
  epistemology: Epistemology;
  qualia: Qualia;
}

export interface ConceptReference {
  conceptId: string;
  dimensions: Dimension[];
  confidence: number;
}

export interface KnowledgeQuery {
  concept?: string;
  dimensions: Dimension[];
  minConfidence?: number;
  depth?: 'shallow' | 'medium' | 'deep';
  scope?: 'local' | 'organization' | 'local+organization';
}

export interface KnowledgeUpdate {
  dimension: Dimension;
  operation: 'add' | 'update' | 'merge' | 'remove';
  data: any;
  provenance: Provenance;
}

// ============================================================================
// Session Types (for knowledge extraction)
// ============================================================================

export interface Session {
  id: string;
  startedAt: string;
  endedAt: string;
  filesChanged?: string[];
  toolUses?: ToolUse[];
  errors?: ErrorEvent[];
  fixes?: Fix[];
  commit?: CommitInfo;
  patterns?: RecognizedPattern[];
}

export interface ToolUse {
  tool: string;
  parameters: any;
  result: any;
  timestamp: string;
}

export interface ErrorEvent {
  message: string;
  stackTrace?: string;
  severity: Severity;
  relatedTo?: string;
  timestamp?: string;
}

export interface Fix {
  resolvedError: string;
  approach: string;
  resolved: boolean;
  changedFiles: string[];
}

export interface CommitInfo {
  sha: string;
  message: string;
  files: string[];
  timestamp: string;
  successful: boolean;
}

export interface RecognizedPattern {
  id: string;
  matchQuality: number;
  context: any;
}

// ============================================================================
// Self-Awareness Types
// ============================================================================

export interface SelfAwareness {
  coverage: {
    ontology: number;
    mereology: number;
    epistemology: number;
    qualia: number;
  };
  confidence: {
    average: number;
    high: number;
    medium: number;
    low: number;
    distribution: Record<ConfidenceLevel, number>;
  };
  gaps: KnowledgeGap[];
  health: KnowledgeHealth;
}

export interface KnowledgeHealth {
  status: 'nascent' | 'developing' | 'good' | 'excellent';
  ontologyCoverage: number;
  epistemicConfidence: number;
  qualiaDepth: number;
  recommendations?: string[];
}
