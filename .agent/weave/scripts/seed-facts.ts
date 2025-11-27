/**
 * Seed mw-core Weave with known facts from development
 */

import { weave } from '../index';

const knownFacts = [
  {
    id: 'moneyworks-tsv-no-headers',
    concept: 'MoneyWorks TSV exports have no header row - field order must be discovered from XML',
    basis: 'empirical' as const,
    evidence: 'Discovered during import development, confirmed multiple times'
  },
  {
    id: 'transaction-ourref-unique-per-period',
    concept: 'Transaction.OurRef must be unique within a period',
    basis: 'empirical' as const,
    evidence: 'Import failures when duplicate OurRef in same period'
  },
  {
    id: 'detailline-indices-start-at-one',
    concept: 'DetailLine indices start at 1, not 0',
    basis: 'empirical' as const,
    evidence: 'Observed in Transaction detail line imports'
  },
  {
    id: 'gst-is-universal-tax-term',
    concept: 'MoneyWorks uses GST for ALL tax types globally, not VAT or sales tax',
    basis: 'documented' as const,
    evidence: 'MoneyWorks documentation and canonical DSL pattern'
  },
  {
    id: 'sequence-numbers-auto-assigned',
    concept: 'SequenceNumber fields are auto-assigned by MoneyWorks, not settable via import',
    basis: 'empirical' as const,
    evidence: 'Import attempts with explicit SequenceNumber fail'
  }
];

async function main() {
  console.log('Seeding mw-core Weave with known facts...\n');

  for (const fact of knownFacts) {
    const result = await weave.observeFact(fact.id, fact.concept, {
      basis: fact.basis,
      evidence: fact.evidence,
      initialConfidence: fact.basis === 'documented' ? 0.7 : 0.6
    });
    console.log(`✓ ${fact.id}: ${(result.confidence * 100).toFixed(0)}%`);
  }

  console.log('\n✅ Seeded ${knownFacts.length} facts');

  // Run analytics
  console.log('\nRunning analytics...\n');
}

main().catch(console.error);
