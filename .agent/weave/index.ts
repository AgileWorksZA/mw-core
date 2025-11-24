/**
 * Weave - Core Implementation
 *
 * The main entry point for the Q+E+O+M knowledge framework.
 * Provides loading, querying, updating, and persisting knowledge across dimensions.
 *
 * Architecture:
 * - Load: Read all four JSON files into memory
 * - Query: Retrieve knowledge filtered by concept, dimension, confidence
 * - Update: Merge new knowledge with confidence tracking
 * - Save: Persist changes back to JSON files
 * - Self-Awareness: Introspect knowledge coverage and health
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type {
	BestPractice,
	Component,
	Composition,
	ConfidenceLevel,
	Dimension,
	Entity,
	Epistemology,
	Experience,
	Knowledge,
	KnowledgeHealth,
	KnowledgeQuery,
	KnowledgeUpdate,
	Mereology,
	Ontology,
	PainPoint,
	Pattern,
	Provenance,
	Qualia,
	SelfAwareness,
	Session,
	Solution,
	WeaveKnowledge,
	Workflow,
} from "./types";

// ============================================================================
// Core Weave Class
// ============================================================================

export class Weave {
	private basePath: string;
	private knowledge: WeaveKnowledge | null = null;
	private autoSave = true;

	constructor(basePath = ".agent/weave", autoSave = true) {
		this.basePath = basePath;
		this.autoSave = autoSave;
	}

	// ==========================================================================
	// Loading & Initialization
	// ==========================================================================

	async load(): Promise<WeaveKnowledge> {
		if (this.knowledge) return this.knowledge;

		try {
			const [ontology, mereology, epistemology, qualia] = await Promise.all([
				this.loadDimension<Ontology>("ontology.json"),
				this.loadDimension<Mereology>("mereology.json"),
				this.loadDimension<Epistemology>("epistemology.json"),
				this.loadDimension<Qualia>("qualia.json"),
			]);

			this.knowledge = {
				ontology,
				mereology,
				epistemology,
				qualia,
			};

			return this.knowledge;
		} catch (error) {
			console.error("Failed to load Weave knowledge:", error);
			// Initialize with empty structures if files don't exist
			return this.initialize();
		}
	}

	private async loadDimension<T>(filename: string): Promise<T> {
		const filepath = path.join(this.basePath, filename);
		const content = await fs.readFile(filepath, "utf-8");
		return JSON.parse(content);
	}

	private async initialize(): Promise<WeaveKnowledge> {
		const now = new Date().toISOString();

		this.knowledge = {
			ontology: {
				$schema: "http://json-schema.org/draft-07/schema#",
				title: "Ontology - What exists",
				description:
					"Formal structure of concepts, entities, relations, and constraints",
				version: "1.0.0",
				lastUpdated: now,
				entities: {},
				relations: {},
				constraints: {},
				metadata: {
					totalEntities: 0,
					totalRelations: 0,
					totalConstraints: 0,
					averageConfidence: 0,
					lastCompaction: null,
				},
			},
			mereology: {
				$schema: "http://json-schema.org/draft-07/schema#",
				title: "Mereology - How parts compose",
				description: "Part-whole relationships and system composition",
				version: "1.0.0",
				lastUpdated: now,
				components: {},
				compositions: {},
				hierarchy: {
					root: null,
					layers: [],
					modules: [],
				},
				partWholeRelations: {},
				metadata: {
					totalComponents: 0,
					totalCompositions: 0,
					totalParts: 0,
					maxDepth: 0,
					averageConfidence: 0,
					lastCompaction: null,
				},
			},
			epistemology: {
				$schema: "http://json-schema.org/draft-07/schema#",
				title: "Epistemology - How we know",
				description: "Knowledge confidence and provenance",
				version: "1.0.0",
				lastUpdated: now,
				knowledge: {},
				patterns: {},
				validations: {},
				confidenceModel: {
					scale: {
						"0.0-0.3": "speculative",
						"0.3-0.5": "uncertain",
						"0.5-0.7": "probable",
						"0.7-0.85": "confident",
						"0.85-0.95": "highly_confident",
						"0.95-1.0": "certain",
					},
					updateRules: {
						observation: "+0.05",
						validation: "+0.08",
						production_success: "+0.10",
						contradiction: "-0.10",
						failure: "-0.15",
						time_decay: "-0.01 per month",
					},
					bayesianParameters: {
						priorWeight: 0.3,
						evidenceWeight: 0.7,
						minObservations: 3,
					},
				},
				knowledgeGaps: [],
				metadata: {
					totalConcepts: 0,
					totalPatterns: 0,
					totalValidations: 0,
					averageConfidence: 0,
					highConfidenceConcepts: 0,
					lowConfidenceConcepts: 0,
					knowledgeGaps: 0,
					lastValidation: now,
				},
			},
			qualia: {
				$schema: "http://json-schema.org/draft-07/schema#",
				title: "Qualia - What it's like",
				description: "Experiential knowledge and patterns",
				version: "1.0.0",
				lastUpdated: now,
				experiences: {},
				painPoints: {},
				solutions: {},
				workflows: {},
				bestPractices: {},
				contextualKnowledge: {},
				patterns: {
					development: [],
					debugging: [],
					collaboration: [],
				},
				cognitiveLoad: {},
				metadata: {
					totalExperiences: 0,
					totalPainPoints: 0,
					totalSolutions: 0,
					totalWorkflows: 0,
					totalBestPractices: 0,
					totalPatterns: 0,
					lastUpdated: now,
				},
			},
		};

		// Save initial empty structures
		if (this.autoSave) {
			await this.save();
		}

		return this.knowledge;
	}

	// ==========================================================================
	// Querying
	// ==========================================================================

	async query(query: KnowledgeQuery): Promise<any> {
		if (!this.knowledge) await this.load();

		const results: any = {};

		// Query each requested dimension
		for (const dimension of query.dimensions) {
			switch (dimension) {
				case "O":
					results.ontology = await this.queryOntology(query);
					break;
				case "M":
					results.mereology = await this.queryMereology(query);
					break;
				case "E":
					results.epistemology = await this.queryEpistemology(query);
					break;
				case "Q":
					results.qualia = await this.queryQualia(query);
					break;
			}
		}

		return results;
	}

	private async queryOntology(query: KnowledgeQuery): Promise<any> {
		if (!this.knowledge) return null;

		if (query.concept) {
			// Look for specific concept
			const entity = this.knowledge.ontology.entities[query.concept];
			if (
				entity &&
				this.meetsConfidenceThreshold(
					entity.provenance.confidence,
					query.minConfidence,
				)
			) {
				return entity;
			}

			// Fuzzy matching
			const matches = Object.entries(this.knowledge.ontology.entities).filter(
				([key, value]) =>
					key.toLowerCase().includes(query.concept?.toLowerCase()) &&
					this.meetsConfidenceThreshold(
						value.provenance.confidence,
						query.minConfidence,
					),
			);

			return matches.length > 0 ? Object.fromEntries(matches) : null;
		}

		// Return all entities meeting confidence threshold
		return Object.fromEntries(
			Object.entries(this.knowledge.ontology.entities).filter(([_, entity]) =>
				this.meetsConfidenceThreshold(
					entity.provenance.confidence,
					query.minConfidence,
				),
			),
		);
	}

	private async queryMereology(query: KnowledgeQuery): Promise<any> {
		if (!this.knowledge) return null;

		if (query.concept) {
			const composition = this.knowledge.mereology.compositions[query.concept];
			if (
				composition &&
				this.meetsConfidenceThreshold(
					composition.provenance.confidence,
					query.minConfidence,
				)
			) {
				return composition;
			}

			// Search in components and parts
			const matches = Object.entries(
				this.knowledge.mereology.compositions,
			).filter(([key, comp]) => {
				const allParts = [
					...(comp.parts.core || []),
					...(comp.parts.supporting || []),
					...(comp.parts.infrastructure || []),
					...(comp.parts.backend || []),
					...(comp.parts.frontend || []),
				];
				return (
					(key.toLowerCase().includes(query.concept?.toLowerCase()) ||
						allParts.some((part) =>
							part.toLowerCase().includes(query.concept?.toLowerCase()),
						)) &&
					this.meetsConfidenceThreshold(
						comp.provenance.confidence,
						query.minConfidence,
					)
				);
			});

			return matches.length > 0 ? Object.fromEntries(matches) : null;
		}

		return this.knowledge.mereology.compositions;
	}

	private async queryEpistemology(query: KnowledgeQuery): Promise<any> {
		if (!this.knowledge) return null;

		if (query.concept) {
			const knowledge = this.knowledge.epistemology.knowledge[query.concept];
			if (
				knowledge &&
				this.meetsConfidenceThreshold(knowledge.confidence, query.minConfidence)
			) {
				return knowledge;
			}

			// Check patterns too
			const pattern = this.knowledge.epistemology.patterns[query.concept];
			if (
				pattern &&
				this.meetsConfidenceThreshold(pattern.confidence, query.minConfidence)
			) {
				return pattern;
			}

			// Fuzzy matching
			const matches = Object.entries(
				this.knowledge.epistemology.knowledge,
			).filter(
				([key, k]) =>
					key.toLowerCase().includes(query.concept?.toLowerCase()) &&
					this.meetsConfidenceThreshold(k.confidence, query.minConfidence),
			);

			return matches.length > 0 ? Object.fromEntries(matches) : null;
		}

		return Object.fromEntries(
			Object.entries(this.knowledge.epistemology.knowledge).filter(([_, k]) =>
				this.meetsConfidenceThreshold(k.confidence, query.minConfidence),
			),
		);
	}

	private async queryQualia(query: KnowledgeQuery): Promise<any> {
		if (!this.knowledge) return null;

		if (query.concept) {
			const experience = this.knowledge.qualia.experiences[query.concept];
			if (experience) {
				return experience;
			}

			// Search pain points
			const painPoint = this.knowledge.qualia.painPoints[query.concept];
			if (painPoint) {
				return painPoint;
			}

			// Search workflows
			const workflow = this.knowledge.qualia.workflows[query.concept];
			if (workflow) {
				return workflow;
			}

			// Search in patterns
			const patterns = [
				...this.knowledge.qualia.patterns.development,
				...this.knowledge.qualia.patterns.debugging,
				...this.knowledge.qualia.patterns.collaboration,
			].filter((p) =>
				p.context?.toLowerCase().includes(query.concept?.toLowerCase()),
			);

			return patterns.length > 0 ? patterns : null;
		}

		return this.knowledge.qualia.experiences;
	}

	private meetsConfidenceThreshold(
		confidence: number,
		threshold?: number,
	): boolean {
		return threshold === undefined || confidence >= threshold;
	}

	// ==========================================================================
	// Updating
	// ==========================================================================

	async update(updates: KnowledgeUpdate[]): Promise<void> {
		if (!this.knowledge) await this.load();

		for (const update of updates) {
			await this.applyUpdate(update);
		}

		if (this.autoSave) {
			await this.save();
		}
	}

	private async applyUpdate(update: KnowledgeUpdate): Promise<void> {
		if (!this.knowledge) return;

		switch (update.dimension) {
			case "O":
				await this.updateOntology(update);
				break;
			case "M":
				await this.updateMereology(update);
				break;
			case "E":
				await this.updateEpistemology(update);
				break;
			case "Q":
				await this.updateQualia(update);
				break;
		}

		// Update metadata
		this.updateMetadata(update.dimension);
	}

	private async updateOntology(update: KnowledgeUpdate): Promise<void> {
		if (!this.knowledge) return;

		const { operation, data } = update;

		switch (operation) {
			case "add":
			case "update":
				this.knowledge.ontology.entities[data.id] = data;
				break;
			case "merge": {
				const existing = this.knowledge.ontology.entities[data.id];
				if (existing) {
					// Merge properties and relations
					this.knowledge.ontology.entities[data.id] = {
						...existing,
						...data,
						properties: { ...existing.properties, ...data.properties },
						relations: { ...existing.relations, ...data.relations },
						constraints: { ...existing.constraints, ...data.constraints },
						provenance: this.mergeProvenance(
							existing.provenance,
							data.provenance,
						),
					};
				} else {
					this.knowledge.ontology.entities[data.id] = data;
				}
				break;
			}
			case "remove":
				delete this.knowledge.ontology.entities[data.id];
				break;
		}
	}

	private async updateMereology(update: KnowledgeUpdate): Promise<void> {
		if (!this.knowledge) return;

		const { operation, data } = update;

		switch (operation) {
			case "add":
			case "update":
				if (data.type === "component") {
					this.knowledge.mereology.components[data.id] = data;
				} else {
					this.knowledge.mereology.compositions[data.id] = data;
				}
				break;
			case "merge": {
				const existing = this.knowledge.mereology.compositions[data.id];
				if (existing) {
					// Merge parts
					this.knowledge.mereology.compositions[data.id] = {
						...existing,
						...data,
						parts: {
							core: [
								...(existing.parts.core || []),
								...(data.parts.core || []),
							],
							supporting: [
								...(existing.parts.supporting || []),
								...(data.parts.supporting || []),
							],
							infrastructure: [
								...(existing.parts.infrastructure || []),
								...(data.parts.infrastructure || []),
							],
						},
						emergentProperties: [
							...(existing.emergentProperties || []),
							...(data.emergentProperties || []),
						],
						provenance: this.mergeProvenance(
							existing.provenance,
							data.provenance,
						),
					};
				} else {
					this.knowledge.mereology.compositions[data.id] = data;
				}
				break;
			}
			case "remove":
				delete this.knowledge.mereology.compositions[data.id];
				delete this.knowledge.mereology.components[data.id];
				break;
		}
	}

	private async updateEpistemology(update: KnowledgeUpdate): Promise<void> {
		if (!this.knowledge) return;

		const { operation, data } = update;

		switch (operation) {
			case "add":
				if (data.type === "pattern") {
					this.knowledge.epistemology.patterns[data.id] = data;
				} else {
					this.knowledge.epistemology.knowledge[data.id] = data;
				}
				break;
			case "update": {
				const existing = this.knowledge.epistemology.knowledge[data.id];
				if (existing) {
					// Bayesian confidence update
					const newConfidence = this.calculateBayesianUpdate(
						existing.confidence,
						data.matchQuality || 0.8,
					);

					existing.confidence = newConfidence;
					existing.confidenceLevel = this.getConfidenceLevel(newConfidence);
					existing.confidenceHistory.push({
						date: new Date().toISOString(),
						value: newConfidence,
						reason: data.reason || "observation",
						source: update.provenance.sessionId,
					});
					existing.evidence.observations++;
					existing.evidence.lastSeen = new Date().toISOString();

					// Update sources
					if (
						!existing.sources.some((s) => s.id === update.provenance.sessionId)
					) {
						existing.sources.push({
							type: "session",
							id: update.provenance.sessionId,
							date: new Date().toISOString(),
						});
					}
				}
				break;
			}
			case "merge":
				// Similar to update but creates if doesn't exist
				if (!this.knowledge.epistemology.knowledge[data.id]) {
					this.knowledge.epistemology.knowledge[data.id] = data;
				} else {
					await this.updateEpistemology({ ...update, operation: "update" });
				}
				break;
			case "remove":
				delete this.knowledge.epistemology.knowledge[data.id];
				delete this.knowledge.epistemology.patterns[data.id];
				break;
		}
	}

	private async updateQualia(update: KnowledgeUpdate): Promise<void> {
		if (!this.knowledge) return;

		const { operation, data } = update;

		switch (operation) {
			case "add":
			case "update":
				if (data.type === "experience") {
					this.knowledge.qualia.experiences[data.id] = data;
				} else if (data.type === "painPoint") {
					this.knowledge.qualia.painPoints[data.id] = data;
				} else if (data.type === "solution") {
					this.knowledge.qualia.solutions[data.id] = data;
				} else if (data.type === "workflow") {
					this.knowledge.qualia.workflows[data.id] = data;
				} else if (data.type === "bestPractice") {
					this.knowledge.qualia.bestPractices[data.id] = data;
				}
				break;
			case "merge": {
				const existing = this.knowledge.qualia.painPoints[data.id];
				if (existing) {
					// Increment occurrences for pain points
					existing.occurrences++;
					existing.lastEncountered = new Date().toISOString();
					existing.provenance.observations =
						(existing.provenance.observations || 0) + 1;
				} else {
					this.knowledge.qualia.painPoints[data.id] = data;
				}
				break;
			}
			case "remove":
				delete this.knowledge.qualia.experiences[data.id];
				delete this.knowledge.qualia.painPoints[data.id];
				delete this.knowledge.qualia.solutions[data.id];
				delete this.knowledge.qualia.workflows[data.id];
				delete this.knowledge.qualia.bestPractices[data.id];
				break;
		}
	}

	private mergeProvenance(
		existing: Provenance,
		incoming: Provenance,
	): Provenance {
		return {
			source: incoming.source,
			sessionId: incoming.sessionId,
			timestamp: incoming.timestamp,
			confidence: Math.max(existing.confidence, incoming.confidence),
			observations: (existing.observations || 0) + (incoming.observations || 1),
			agent: incoming.agent || existing.agent,
		};
	}

	// ==========================================================================
	// Confidence & Bayesian Updates
	// ==========================================================================

	private calculateBayesianUpdate(prior: number, likelihood: number): number {
		if (!this.knowledge) return prior;

		const params =
			this.knowledge.epistemology.confidenceModel.bayesianParameters;
		const priorWeight = params.priorWeight;
		const evidenceWeight = params.evidenceWeight;

		// Bayesian update formula
		const posterior = priorWeight * prior + evidenceWeight * likelihood;

		// Clamp between 0 and 1
		return Math.min(1, Math.max(0, posterior));
	}

	private getConfidenceLevel(confidence: number): ConfidenceLevel {
		if (confidence >= 0.95) return "certain";
		if (confidence >= 0.85) return "highly_confident";
		if (confidence >= 0.7) return "confident";
		if (confidence >= 0.5) return "probable";
		if (confidence >= 0.3) return "uncertain";
		return "speculative";
	}

	// ==========================================================================
	// Metadata Management
	// ==========================================================================

	private updateMetadata(dimension: Dimension): void {
		if (!this.knowledge) return;

		const now = new Date().toISOString();

		switch (dimension) {
			case "O": {
				const ontology = this.knowledge.ontology;
				ontology.metadata.totalEntities = Object.keys(ontology.entities).length;
				ontology.metadata.totalRelations = Object.keys(
					ontology.relations,
				).length;
				ontology.metadata.totalConstraints = Object.keys(
					ontology.constraints,
				).length;
				ontology.metadata.averageConfidence = this.calculateAverageConfidence(
					Object.values(ontology.entities).map((e) => e.provenance.confidence),
				);
				ontology.lastUpdated = now;
				break;
			}

			case "M": {
				const mereology = this.knowledge.mereology;
				mereology.metadata.totalComponents = Object.keys(
					mereology.components,
				).length;
				mereology.metadata.totalCompositions = Object.keys(
					mereology.compositions,
				).length;
				mereology.metadata.averageConfidence = this.calculateAverageConfidence(
					Object.values(mereology.compositions).map(
						(c) => c.provenance.confidence,
					),
				);
				mereology.lastUpdated = now;
				break;
			}

			case "E": {
				const epistemology = this.knowledge.epistemology;
				const confidences = Object.values(epistemology.knowledge).map(
					(k) => k.confidence,
				);
				epistemology.metadata.totalConcepts = confidences.length;
				epistemology.metadata.totalPatterns = Object.keys(
					epistemology.patterns,
				).length;
				epistemology.metadata.totalValidations = Object.keys(
					epistemology.validations,
				).length;
				epistemology.metadata.averageConfidence =
					this.calculateAverageConfidence(confidences);
				epistemology.metadata.highConfidenceConcepts = confidences.filter(
					(c) => c >= 0.85,
				).length;
				epistemology.metadata.lowConfidenceConcepts = confidences.filter(
					(c) => c < 0.5,
				).length;
				epistemology.lastUpdated = now;
				break;
			}

			case "Q": {
				const qualia = this.knowledge.qualia;
				qualia.metadata.totalExperiences = Object.keys(
					qualia.experiences,
				).length;
				qualia.metadata.totalPainPoints = Object.keys(qualia.painPoints).length;
				qualia.metadata.totalSolutions = Object.keys(qualia.solutions).length;
				qualia.metadata.totalWorkflows = Object.keys(qualia.workflows).length;
				qualia.metadata.totalBestPractices = Object.keys(
					qualia.bestPractices,
				).length;
				qualia.metadata.totalPatterns =
					qualia.patterns.development.length +
					qualia.patterns.debugging.length +
					qualia.patterns.collaboration.length;
				qualia.lastUpdated = now;
				break;
			}
		}
	}

	private calculateAverageConfidence(confidences: number[]): number {
		if (confidences.length === 0) return 0;
		return confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
	}

	// ==========================================================================
	// Persistence
	// ==========================================================================

	async save(): Promise<void> {
		if (!this.knowledge) return;

		await Promise.all([
			this.saveDimension("ontology.json", this.knowledge.ontology),
			this.saveDimension("mereology.json", this.knowledge.mereology),
			this.saveDimension("epistemology.json", this.knowledge.epistemology),
			this.saveDimension("qualia.json", this.knowledge.qualia),
		]);
	}

	private async saveDimension(filename: string, data: any): Promise<void> {
		const filepath = path.join(this.basePath, filename);
		await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
	}

	// ==========================================================================
	// Self-Awareness
	// ==========================================================================

	async getSelfAwareness(): Promise<SelfAwareness> {
		if (!this.knowledge) await this.load();

		const knowledgeCoverage = {
			ontology: Object.keys(this.knowledge?.ontology.entities).length,
			mereology: Object.keys(this.knowledge?.mereology.compositions).length,
			epistemology: Object.keys(this.knowledge?.epistemology.knowledge).length,
			qualia: Object.keys(this.knowledge?.qualia.experiences).length,
		};

		const confidenceDistribution = this.getConfidenceDistribution();
		const knowledgeGaps = this.knowledge?.epistemology.knowledgeGaps;
		const health = this.assessKnowledgeHealth();

		return {
			coverage: knowledgeCoverage,
			confidence: confidenceDistribution,
			gaps: knowledgeGaps,
			health,
		};
	}

	private getConfidenceDistribution(): any {
		if (!this.knowledge) return {};

		const confidences = Object.values(
			this.knowledge.epistemology.knowledge,
		).map((k) => k.confidence);

		const distribution: Record<ConfidenceLevel, number> = {
			certain: confidences.filter((c) => c >= 0.95).length,
			highly_confident: confidences.filter((c) => c >= 0.85 && c < 0.95).length,
			confident: confidences.filter((c) => c >= 0.7 && c < 0.85).length,
			probable: confidences.filter((c) => c >= 0.5 && c < 0.7).length,
			uncertain: confidences.filter((c) => c >= 0.3 && c < 0.5).length,
			speculative: confidences.filter((c) => c < 0.3).length,
		};

		return {
			average: this.calculateAverageConfidence(confidences),
			high: confidences.filter((c) => c >= 0.85).length,
			medium: confidences.filter((c) => c >= 0.5 && c < 0.85).length,
			low: confidences.filter((c) => c < 0.5).length,
			distribution,
		};
	}

	private assessKnowledgeHealth(): KnowledgeHealth {
		if (!this.knowledge) {
			return {
				status: "nascent",
				ontologyCoverage: 0,
				epistemicConfidence: 0,
				qualiaDepth: 0,
				recommendations: [
					"Initialize knowledge base by loading existing codebase",
				],
			};
		}

		const avgConfidence =
			this.knowledge.epistemology.metadata.averageConfidence;
		const ontologyCoverage = Object.keys(
			this.knowledge.ontology.entities,
		).length;
		const qualiaDepth =
			Object.keys(this.knowledge.qualia.experiences).length +
			Object.keys(this.knowledge.qualia.painPoints).length;

		let status: "nascent" | "developing" | "good" | "excellent";
		const recommendations: string[] = [];

		if (avgConfidence > 0.8 && ontologyCoverage > 20 && qualiaDepth > 15) {
			status = "excellent";
		} else if (
			avgConfidence > 0.6 &&
			ontologyCoverage > 10 &&
			qualiaDepth > 8
		) {
			status = "good";
			if (qualiaDepth < 15)
				recommendations.push(
					"Capture more experiential knowledge from errors and workflows",
				);
		} else if (avgConfidence > 0.4 || ontologyCoverage > 5) {
			status = "developing";
			if (ontologyCoverage < 10)
				recommendations.push("Extract more entities from codebase");
			if (avgConfidence < 0.6)
				recommendations.push("Validate knowledge through testing and commits");
			if (qualiaDepth < 8)
				recommendations.push("Document pain points and best practices");
		} else {
			status = "nascent";
			recommendations.push("Begin extracting knowledge from existing sessions");
			recommendations.push("Populate ontology with core domain entities");
		}

		return {
			status,
			ontologyCoverage: ontologyCoverage / 50, // Normalize to 0-1 (assuming 50 entities is "full")
			epistemicConfidence: avgConfidence,
			qualiaDepth: qualiaDepth / 30, // Normalize to 0-1 (assuming 30 experiences is "deep")
			recommendations: recommendations.length > 0 ? recommendations : undefined,
		};
	}

	// ==========================================================================
	// Utility Methods
	// ==========================================================================

	async getKnowledge(): Promise<WeaveKnowledge | null> {
		return this.knowledge;
	}

	async reload(): Promise<WeaveKnowledge> {
		this.knowledge = null;
		return this.load();
	}
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const weave = new Weave();

// Export class for custom instances
export default Weave;
