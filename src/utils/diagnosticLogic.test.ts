import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDiagnosticResults, generateBashDiagnosticScript, DiagnosticCheckItem } from './diagnosticLogic';

test('evaluateDiagnosticResults correctly passes when all checks pass', () => {
  const items: DiagnosticCheckItem[] = [
    { id: '1', name: 'Shell Probe', category: 'HOST', status: 'PASS', latencyMs: 2, details: 'Bash detected' },
    { id: '2', name: 'Network Ping', category: 'NETWORK', status: 'PASS', latencyMs: 18, details: 'Endpoint reachable' },
    { id: '3', name: 'CUDA Kernel Test', category: 'CUDA', status: 'PASS', latencyMs: 4, details: 'Driver ready' }
  ];

  const result = evaluateDiagnosticResults(items);
  assert.equal(result.allPassed, true);
  assert.equal(result.passCount, 3);
  assert.equal(result.failCount, 0);
  assert.equal(result.avgLatencyMs, 8.0);
  assert.ok(result.summary.includes('PASSED'));
});

test('evaluateDiagnosticResults identifies failures', () => {
  const items: DiagnosticCheckItem[] = [
    { id: '1', name: 'Network Ping', category: 'NETWORK', status: 'FAIL', latencyMs: 500, details: 'Connection timed out' }
  ];

  const result = evaluateDiagnosticResults(items);
  assert.equal(result.allPassed, false);
  assert.equal(result.failCount, 1);
  assert.ok(result.summary.includes('FAILED'));
});

test('generateBashDiagnosticScript includes target URL and probe sequence', () => {
  const script = generateBashDiagnosticScript('https://my-workstation.example.com');
  assert.ok(script.includes('https://my-workstation.example.com'));
  assert.ok(script.includes('DIAGNOSTIC SUMMARY'));
  assert.ok(script.includes('#!/usr/bin/env bash'));
});
