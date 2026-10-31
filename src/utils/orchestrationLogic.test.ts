import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeVRAMStatus,
  computeTotalPipelineLatency,
  computeHybridCostComparison
} from './orchestrationLogic';

test('computeVRAMStatus identifies nominal usage', () => {
  const result = computeVRAMStatus(70.0, 80.0);
  assert.equal(result.allocatedPct, 87.5);
  assert.equal(result.isCritical, false);
  assert.equal(result.freeGB, 10.0);
});

test('computeVRAMStatus identifies critical ceiling at or above 92%', () => {
  const result = computeVRAMStatus(74.8, 80.0);
  assert.equal(result.allocatedPct, 93.5);
  assert.equal(result.isCritical, true);
  assert.equal(result.freeGB, 5.2);
});

test('computeTotalPipelineLatency sums positive latencies', () => {
  const total = computeTotalPipelineLatency([14, 342, 178, 68]);
  assert.equal(total, 602);
});

test('computeHybridCostComparison computes positive savings against cloud APIs', () => {
  const result = computeHybridCostComparison(50);
  assert.ok(result.pureClaudeCost > result.hybridCost);
  assert.ok(result.pureOpenAICost > result.hybridCost);
  assert.ok(result.savingsPct > 70); // Should yield > 70% savings
});
