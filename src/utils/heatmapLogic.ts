import { NodeLatencyCell, LatencyBottleneck } from '../types/orchestration';

export function identifyBottlenecks(
  cells: NodeLatencyCell[],
  thresholdMs = 120
): LatencyBottleneck[] {
  // Ignore self-loops (sourceId === targetId)
  const crossNodes = cells.filter(
    (c) => c.sourceId !== c.targetId && c.latencyMs >= thresholdMs
  );

  // Sort descending by latency
  crossNodes.sort((a, b) => b.latencyMs - a.latencyMs);

  const totalHighLatency = crossNodes.reduce((acc, c) => acc + c.latencyMs, 0);

  return crossNodes.slice(0, 5).map((c) => {
    const impactScore = totalHighLatency > 0 ? Math.round((c.latencyMs / totalHighLatency) * 100) : 0;
    let recommendation = 'Consider co-locating nodes or using local TensorRT execution.';
    if (c.protocol === 'HTTPS / WAN') {
      recommendation = 'Batch payloads or use HTTP/2 bidirectional streaming proxy to reduce round-trip TLS overhead.';
    } else if (c.protocol === 'PCIe 5.0') {
      recommendation = 'Migrate critical tensor buffers to NVLink 4.0 peer-to-peer domain.';
    }

    return {
      sourceName: c.sourceName,
      targetName: c.targetName,
      latencyMs: c.latencyMs,
      impactScore,
      protocol: c.protocol,
      recommendation
    };
  });
}

export function computeAverageMeshLatency(cells: NodeLatencyCell[]): {
  overallAvgMs: number;
  nvLinkAvgMs: number;
  wanAvgMs: number;
} {
  const nonSelf = cells.filter((c) => c.sourceId !== c.targetId);
  if (nonSelf.length === 0) {
    return { overallAvgMs: 0, nvLinkAvgMs: 0, wanAvgMs: 0 };
  }

  const overallTotal = nonSelf.reduce((acc, c) => acc + c.latencyMs, 0);
  const nvLinkCells = nonSelf.filter((c) => c.protocol.startsWith('NVLink'));
  const wanCells = nonSelf.filter((c) => c.protocol.includes('WAN'));

  const nvLinkTotal = nvLinkCells.reduce((acc, c) => acc + c.latencyMs, 0);
  const wanTotal = wanCells.reduce((acc, c) => acc + c.latencyMs, 0);

  return {
    overallAvgMs: parseFloat((overallTotal / nonSelf.length).toFixed(2)),
    nvLinkAvgMs: nvLinkCells.length > 0 ? parseFloat((nvLinkTotal / nvLinkCells.length).toFixed(2)) : 0,
    wanAvgMs: wanCells.length > 0 ? parseFloat((wanTotal / wanCells.length).toFixed(2)) : 0
  };
}
