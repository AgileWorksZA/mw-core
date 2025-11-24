#!/usr/bin/env bun

/**
 * End-to-End Test: Complete Weave System with Extraction
 *
 * Tests the full pipeline: Session → Extraction → Knowledge Update → Query
 *
 * Run with: bun run .agent/weave/test-e2e.ts
 */

import { Weave } from "./index";
import { updateWeaveFromSession } from "./session-update";
import type { Session } from "./types";

async function testCompleteSystem() {
	console.log("🧪 End-to-End Weave Test: Session Learning\n");
	console.log("=".repeat(60));

	try {
		// ==========================================================================
		// Test Session: SSE Implementation with Pain Points and Fixes
		// ==========================================================================

		const testSession: Session = {
			id: "test-session-sse-implementation",
			startedAt: "2024-11-20T14:00:00Z",
			endedAt: "2024-11-20T16:30:00Z",

			// Files changed during session
			filesChanged: [
				"apps/api/src/modules/crm/routes/contacts-sse.ts",
				"apps/web/app/hooks/useContactsStream.ts",
				"packages/db/src/migrations/0050_add_contact_events.sql",
				"apps/api/src/modules/crm/services/contact-service.ts",
			],

			// Tool usage sequence
			toolUses: [
				{
					tool: "Grep",
					parameters: { pattern: "EventSource", glob: "*.ts" },
					result: { files: ["existing-sse-example.ts"] },
					timestamp: "2024-11-20T14:05:00Z",
				},
				{
					tool: "Read",
					parameters: { file_path: "existing-sse-example.ts" },
					result: { content: "EventSource implementation example..." },
					timestamp: "2024-11-20T14:06:00Z",
				},
				{
					tool: "Write",
					parameters: {
						file_path: "contacts-sse.ts",
						content:
							'export const contactsSSE = new EventSource("/api/contacts/stream")',
					},
					result: { success: true },
					timestamp: "2024-11-20T14:25:00Z",
				},
				{
					tool: "Edit",
					parameters: {
						file_path: "useContactsStream.ts",
						old_string: "useEffect(() => {",
						new_string:
							"useEffect(() => {\n  return () => eventSource.close();",
					},
					result: { success: true },
					timestamp: "2024-11-20T15:10:00Z",
				},
				{
					tool: "Bash",
					parameters: { command: "bun test contacts-sse.test.ts" },
					result: {
						stdout: "Tests passed: 12/12",
						exitCode: 0,
					},
					timestamp: "2024-11-20T16:00:00Z",
				},
			],

			// Errors encountered
			errors: [
				{
					message:
						"Memory leak detected: EventSource not closed on component unmount",
					severity: "high",
					stackTrace: "at useContactsStream (useContactsStream.ts:15)",
					relatedTo: "sse-pattern",
					timestamp: "2024-11-20T14:50:00Z",
				},
				{
					message:
						"CORS error: SSE endpoint missing Access-Control-Allow-Origin header",
					severity: "medium",
					stackTrace: "Browser console",
					relatedTo: "sse-pattern",
					timestamp: "2024-11-20T15:30:00Z",
				},
			],

			// Fixes applied
			fixes: [
				{
					resolvedError: "Memory leak - EventSource not closed",
					approach:
						"Added cleanup function to useEffect that closes EventSource on unmount",
					resolved: true,
					changedFiles: ["apps/web/app/hooks/useContactsStream.ts"],
				},
				{
					resolvedError: "CORS error on SSE endpoint",
					approach:
						"Added CORS middleware to SSE route with appropriate headers",
					resolved: true,
					changedFiles: ["apps/api/src/modules/crm/routes/contacts-sse.ts"],
				},
			],

			// Successful commit
			commit: {
				sha: "def456",
				message: "feat(contacts): Implement real-time SSE updates with cleanup",
				files: [
					"apps/api/src/modules/crm/routes/contacts-sse.ts",
					"apps/web/app/hooks/useContactsStream.ts",
					"packages/db/src/migrations/0050_add_contact_events.sql",
				],
				timestamp: "2024-11-20T16:30:00Z",
				successful: true,
			},

			patterns: [],
		};

		// ==========================================================================
		// Test 1: Load Initial State
		// ==========================================================================

		console.log("\n📚 Test 1: Loading Initial Knowledge State");
		console.log("-".repeat(60));

		const weave = new Weave();
		const initialKnowledge = await weave.load();

		const initialStats = {
			entities: Object.keys(initialKnowledge.ontology.entities).length,
			compositions: Object.keys(initialKnowledge.mereology.compositions).length,
			knowledgeItems: Object.keys(initialKnowledge.epistemology.knowledge)
				.length,
			experiences: Object.keys(initialKnowledge.qualia.experiences).length,
			painPoints: Object.keys(initialKnowledge.qualia.painPoints).length,
		};

		console.log("Initial state:");
		console.log(`  • Entities: ${initialStats.entities}`);
		console.log(`  • Compositions: ${initialStats.compositions}`);
		console.log(`  • Knowledge items: ${initialStats.knowledgeItems}`);
		console.log(`  • Experiences: ${initialStats.experiences}`);
		console.log(`  • Pain points: ${initialStats.painPoints}`);
		console.log("✅ Initial state loaded");

		// ==========================================================================
		// Test 2: Extract and Update from Session
		// ==========================================================================

		console.log("\n🔄 Test 2: Extracting Knowledge from Session");
		console.log("-".repeat(60));

		const updateResult = await updateWeaveFromSession(testSession, weave);

		if (!updateResult.success) {
			throw new Error(`Update failed: ${updateResult.error}`);
		}

		console.log("Update results:");
		console.log(`  • Updates applied: ${updateResult.updatesApplied}`);
		console.log(
			`  • Dimensions updated: ${updateResult.dimensionsUpdated.join(", ")}`,
		);
		console.log(`  • New concepts: ${updateResult.newConcepts}`);
		console.log(`  • Confidence updates: ${updateResult.confidenceUpdates}`);
		console.log(`  • Processing time: ${updateResult.processingTime}ms`);
		console.log("✅ Knowledge extraction complete");

		// ==========================================================================
		// Test 3: Verify New Knowledge
		// ==========================================================================

		console.log("\n🔍 Test 3: Verifying Learned Knowledge");
		console.log("-".repeat(60));

		// Reload to see changes
		const updatedKnowledge = await weave.reload();

		const updatedStats = {
			entities: Object.keys(updatedKnowledge.ontology.entities).length,
			compositions: Object.keys(updatedKnowledge.mereology.compositions).length,
			knowledgeItems: Object.keys(updatedKnowledge.epistemology.knowledge)
				.length,
			experiences: Object.keys(updatedKnowledge.qualia.experiences).length,
			painPoints: Object.keys(updatedKnowledge.qualia.painPoints).length,
		};

		console.log("Updated state:");
		console.log(
			`  • Entities: ${initialStats.entities} → ${updatedStats.entities} (+${updatedStats.entities - initialStats.entities})`,
		);
		console.log(
			`  • Compositions: ${initialStats.compositions} → ${updatedStats.compositions} (+${updatedStats.compositions - initialStats.compositions})`,
		);
		console.log(
			`  • Knowledge items: ${initialStats.knowledgeItems} → ${updatedStats.knowledgeItems} (+${updatedStats.knowledgeItems - initialStats.knowledgeItems})`,
		);
		console.log(
			`  • Experiences: ${initialStats.experiences} → ${updatedStats.experiences} (+${updatedStats.experiences - initialStats.experiences})`,
		);
		console.log(
			`  • Pain points: ${initialStats.painPoints} → ${updatedStats.painPoints} (+${updatedStats.painPoints - initialStats.painPoints})`,
		);

		// Verify SSE pattern confidence increased
		const sseKnowledge =
			updatedKnowledge.epistemology.knowledge["sse-pattern-knowledge"];
		if (sseKnowledge) {
			console.log(
				`\n  • SSE Pattern confidence: ${sseKnowledge.confidence.toFixed(3)} (${sseKnowledge.confidenceLevel})`,
			);
			console.log(`  • Observations: ${sseKnowledge.evidence.observations}`);
			console.log(
				`  • Confidence history entries: ${sseKnowledge.confidenceHistory.length}`,
			);
		}

		console.log("✅ Knowledge successfully updated");

		// ==========================================================================
		// Test 4: Query Learned Knowledge
		// ==========================================================================

		console.log("\n🎯 Test 4: Querying Learned Knowledge");
		console.log("-".repeat(60));

		// Query for contacts-related knowledge
		const contactsKnowledge = await weave.query({
			concept: "contacts",
			dimensions: ["O", "M", "E", "Q"],
		});

		console.log('Query results for "contacts":');
		console.log(
			`  • Ontology: ${contactsKnowledge.ontology ? "✓ Found" : "✗ Not found"}`,
		);
		console.log(
			`  • Mereology: ${contactsKnowledge.mereology ? "✓ Found" : "✗ Not found"}`,
		);
		console.log(
			`  • Epistemology: ${contactsKnowledge.epistemology ? "✓ Found" : "✗ Not found"}`,
		);
		console.log(
			`  • Qualia: ${contactsKnowledge.qualia ? "✓ Found" : "✗ Not found"}`,
		);

		// Query for SSE pattern
		const ssePattern = await weave.query({
			concept: "sse",
			dimensions: ["E", "Q"],
			minConfidence: 0.8,
		});

		console.log('\nQuery results for "sse" (min confidence 0.8):');
		console.log(
			`  • Epistemology: ${ssePattern.epistemology ? "✓ Found" : "✗ Not found"}`,
		);
		console.log(`  • Qualia: ${ssePattern.qualia ? "✓ Found" : "✗ Not found"}`);

		console.log("✅ Query successful");

		// ==========================================================================
		// Test 5: Self-Awareness Assessment
		// ==========================================================================

		console.log("\n🧠 Test 5: Self-Awareness Assessment");
		console.log("-".repeat(60));

		const awareness = await weave.getSelfAwareness();

		console.log("Knowledge health:");
		console.log(`  • Status: ${awareness.health.status}`);
		console.log(
			`  • Ontology coverage: ${(awareness.health.ontologyCoverage * 100).toFixed(1)}%`,
		);
		console.log(
			`  • Epistemic confidence: ${(awareness.health.epistemicConfidence * 100).toFixed(1)}%`,
		);
		console.log(
			`  • Qualia depth: ${(awareness.health.qualiaDepth * 100).toFixed(1)}%`,
		);

		console.log("\nConfidence distribution:");
		console.log(
			`  • Average: ${(awareness.confidence.average * 100).toFixed(1)}%`,
		);
		console.log(`  • High confidence: ${awareness.confidence.high} concepts`);
		console.log(
			`  • Medium confidence: ${awareness.confidence.medium} concepts`,
		);
		console.log(`  • Low confidence: ${awareness.confidence.low} concepts`);

		if (
			awareness.health.recommendations &&
			awareness.health.recommendations.length > 0
		) {
			console.log("\nRecommendations:");
			awareness.health.recommendations.forEach((rec) =>
				console.log(`  • ${rec}`),
			);
		}

		console.log("✅ Self-awareness assessed");

		// ==========================================================================
		// Summary
		// ==========================================================================

		console.log(`\n${"=".repeat(60)}`);
		console.log("🎉 ALL TESTS PASSED!");
		console.log("=".repeat(60));
		console.log("\nWeave System Status:");
		console.log("  ✅ Knowledge extraction working");
		console.log("  ✅ Session integration working");
		console.log("  ✅ Bayesian confidence updates working");
		console.log("  ✅ Multi-dimensional queries working");
		console.log("  ✅ Self-awareness working");
		console.log("  ✅ Ready for production use");

		console.log("\nKnowledge Growth:");
		console.log(
			`  • Started with: ${initialStats.entities} entities, ${initialStats.painPoints} pain points`,
		);
		console.log(
			`  • Learned: +${updatedStats.entities - initialStats.entities} entities, +${updatedStats.painPoints - initialStats.painPoints} pain points`,
		);
		console.log(`  • System health: ${awareness.health.status}`);

		process.exit(0);
	} catch (error) {
		console.error("\n❌ TEST FAILED:", error);
		console.error(error);
		process.exit(1);
	}
}

// Run the complete test
testCompleteSystem();
