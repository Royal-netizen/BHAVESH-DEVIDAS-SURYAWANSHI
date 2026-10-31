import test from 'node:test';
import assert from 'node:assert/strict';
import { identifyBottlenecks, computeAverageMeshLatency } from './heatmapLogic';
import { NodeLatencyCell } from '../types/orchestration';

const mockCells: NodeLatencyCell[] = [
  {
    sourceId: 'gpu-0',
    sourceName: 'GPU 0 (H100)',
    targetId: 'gpu-0',
    targetName: 'GPU 0 (H100)',
    latencyMs: 0.1,
    bandwidthGBs: 3350,
    protocol: 'NVLink 4.0',
    packetLossPct: 0,
    isBottleneck: false
  },
  {
    sourceId: 'gpu-0',
    sourceName: 'GPU 0 (H100)',
    targetId: 'gpu-1',
    targetName: 'GPU 1 (H100)',
    latencyMs: 0.85,
    bandwidthGBs: 896,
    protocol: 'NVLink 4.0',
    packetLossPct: 0,
    isBottleneck: false
  },
  {
    sourceId: 'claude-node',
    sourceName: 'Claude 3.5 Sonnet',
    targetId: 'openai-node',
    targetName: 'ChatGPT-4o Gateway',
    latencyMs: 342.0,
    bandwidthGBs: 1.25,
    protocol: 'HTTPS / WAN',
    packetLossPct: 0.02,
    isBottleneck: true
  },
  {
    sourceId: 'dispatcher',
    sourceName: 'Dispatcher Gateway',
    targetId: 'claude-node',
    targetName: 'Claude 3.5 Sonnet',
    latencyMs: 284.0,
    bandwidthGBs: 1.25,
    protocol: 'HTTPS / WAN',
    packetLossPct: 0.01,
    isBottleneck: true
  }
];

test('identifyBottlenecks extracts channels above threshold and ignores self loops', () => {
  const bottlenecks = identifyBottlenecks(mockCells, 100);
  assert.equal(bottlenecks.length, 2);
  assert.equal(bottlenecks[0].sourceName, 'Claude 3.5 Sonnet');
  assert.equal(bottlenecks[0].latencyMs, 342.0);
  assert.ok(bottlenecks[0].impactScore > 50);
});

test('computeAverageMeshLatency distinguishes NVLink from WAN latencies', () => {
  const averages = computeAverageMeshLatency(mockCells);
  assert.equal(averages.nvLinkAvgMs, 0.85);
  assert.equal(averages.wanAvgMs, 313.0);
  assert.ok(averages.overallAvgMs > 0);
});
