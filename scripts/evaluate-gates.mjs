// scripts/evaluate-gates.mjs
import { evaluatePhaseGates } from '../lib/phase-gates.mjs';

(async () => {
  const phases = await evaluatePhaseGates();
  console.log('Phase Gates Evaluation:');
  phases.forEach(p => {
    console.log(`Phase ${p.phase} (${p.name}): ${p.completed ? '✅ Completed' : '❌ Incomplete'}`);
    if (p.notes.length) console.log('  Notes:', p.notes.join('; '));
  });
})();
