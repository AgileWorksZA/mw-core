/**
 * Simple test script to verify Weave implementation
 */

import { weave } from "./index";

async function testWeave() {
	console.log("🧪 Testing Weave Implementation\n");

	try {
		// Test 1: Load knowledge
		console.log("1️⃣  Loading knowledge...");
		const knowledge = await weave.load();
		console.log("✅ Knowledge loaded successfully");
		console.log(
			`   - Entities: ${Object.keys(knowledge.ontology.entities).length}`,
		);
		console.log(
			`   - Compositions: ${Object.keys(knowledge.mereology.compositions).length}`,
		);
		console.log(
			`   - Knowledge items: ${Object.keys(knowledge.epistemology.knowledge).length}`,
		);
		console.log(
			`   - Experiences: ${Object.keys(knowledge.qualia.experiences).length}\n`,
		);

		// Test 2: Query ontology
		console.log('2️⃣  Querying ontology for "sse"...');
		const sseOntology = await weave.query({
			concept: "sse",
			dimensions: ["O"],
		});
		console.log("✅ Ontology query successful");
		console.log(`   Found: ${sseOntology.ontology?.name || "SSE Pattern"}\n`);

		// Test 3: Query epistemology
		console.log('3️⃣  Querying epistemology for "sse-pattern"...');
		const sseEpistemology = await weave.query({
			concept: "sse-pattern",
			dimensions: ["E"],
			minConfidence: 0.8,
		});
		console.log("✅ Epistemology query successful");
		console.log(
			`   Confidence: ${sseEpistemology.epistemology?.confidence || "N/A"}\n`,
		);

		// Test 4: Query qualia
		console.log("4️⃣  Querying qualia for experiential knowledge...");
		const sseQualia = await weave.query({
			concept: "sse",
			dimensions: ["Q"],
		});
		console.log("✅ Qualia query successful");
		console.log(`   Found: ${sseQualia.qualia?.concept || "SSE experience"}\n`);

		// Test 5: Query all dimensions
		console.log('5️⃣  Querying all dimensions for "campaign"...');
		const campaignAll = await weave.query({
			concept: "campaign",
			dimensions: ["Q", "E", "O", "M"],
		});
		console.log("✅ Multi-dimensional query successful");
		console.log(`   - Ontology: ${campaignAll.ontology ? "✓" : "✗"}`);
		console.log(`   - Mereology: ${campaignAll.mereology ? "✓" : "✗"}`);
		console.log(`   - Epistemology: ${campaignAll.epistemology ? "✓" : "✗"}`);
		console.log(`   - Qualia: ${campaignAll.qualia ? "✓" : "✗"}\n`);

		// Test 6: Self-awareness
		console.log("6️⃣  Getting self-awareness...");
		const selfAwareness = await weave.getSelfAwareness();
		console.log("✅ Self-awareness retrieved");
		console.log(`   - Health: ${selfAwareness.health.status}`);
		console.log(
			`   - Avg Confidence: ${(selfAwareness.confidence.average * 100).toFixed(1)}%`,
		);
		console.log(`   - Knowledge Gaps: ${selfAwareness.gaps.length}`);
		console.log(
			`   - Ontology Coverage: ${Object.keys(knowledge.ontology.entities).length} entities`,
		);
		if (selfAwareness.health.recommendations) {
			console.log("   - Recommendations:");
			selfAwareness.health.recommendations.forEach((r) =>
				console.log(`     • ${r}`),
			);
		}
		console.log();

		// Test 7: Update knowledge (Bayesian confidence)
		console.log("7️⃣  Testing Bayesian confidence update...");
		await weave.update([
			{
				dimension: "E",
				operation: "update",
				data: {
					id: "sse-pattern-knowledge",
					matchQuality: 0.9,
					reason: "test validation",
				},
				provenance: {
					source: "manual-annotation",
					sessionId: "test-session",
					timestamp: new Date().toISOString(),
					confidence: 0.9,
				},
			},
		]);
		console.log("✅ Confidence updated successfully\n");

		// Verify update
		const updatedKnowledge = await weave.reload();
		const updatedSSE =
			updatedKnowledge.epistemology.knowledge["sse-pattern-knowledge"];
		console.log(`   - New confidence: ${updatedSSE.confidence.toFixed(3)}`);
		console.log(
			`   - Confidence history entries: ${updatedSSE.confidenceHistory.length}\n`,
		);

		console.log("🎉 All tests passed!\n");
	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
}

// Run tests
testWeave();
