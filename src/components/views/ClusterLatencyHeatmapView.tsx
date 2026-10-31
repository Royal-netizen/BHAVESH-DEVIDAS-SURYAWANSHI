import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  Activity,
  AlertTriangle,
  Zap,
  Radio,
  ArrowRight,
  Info,
  Maximize2,
  Minimize2,
  RefreshCw,
  TrendingDown,
  Layers
} from 'lucide-react';
import { NodeLatencyCell, LatencyBottleneck } from '../../types/orchestration';
import { CLUSTER_HEATMAP_NODES, ClusterNodeInfo, generateLatencyMatrix } from '../../data/mockOrchestrationData';
import { identifyBottlenecks, computeAverageMeshLatency } from '../../utils/heatmapLogic';

interface ClusterLatencyHeatmapViewProps {
  onInspectPayload?: (title: string, data: any) => void;
}

export const ClusterLatencyHeatmapView: React.FC<ClusterLatencyHeatmapViewProps> = ({
  onInspectPayload
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'gpus' | 'dag'>('all');
  const [isLivePolling, setIsLivePolling] = useState<boolean>(true);
  const [matrixCells, setMatrixCells] = useState<NodeLatencyCell[]>(() => generateLatencyMatrix());
  const [selectedCell, setSelectedCell] = useState<NodeLatencyCell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<NodeLatencyCell | null>(null);
  const [jitterCount, setJitterCount] = useState<number>(0);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Filter nodes based on selected mode
  const activeNodes: ClusterNodeInfo[] = React.useMemo(() => {
    if (filterMode === 'gpus') {
      return CLUSTER_HEATMAP_NODES.filter((n) => n.category === 'Local GPU');
    }
    if (filterMode === 'dag') {
      return CLUSTER_HEATMAP_NODES.filter((n) =>
        ['dispatcher', 'claude-node', 'openai-node', 'gpu-0'].includes(n.id)
      );
    }
    return CLUSTER_HEATMAP_NODES;
  }, [filterMode]);

  // Live jitter loop
  useEffect(() => {
    if (!isLivePolling) return;
    const interval = setInterval(() => {
      setJitterCount((prev) => prev + 1);
      setMatrixCells(() => generateLatencyMatrix(0.95 + Math.random() * 0.1));
    }, 1500);

    return () => clearInterval(interval);
  }, [isLivePolling]);

  // Filter cells according to active nodes
  const filteredCells = React.useMemo(() => {
    const nodeIds = new Set(activeNodes.map((n) => n.id));
    return matrixCells.filter((c) => nodeIds.has(c.sourceId) && nodeIds.has(c.targetId));
  }, [matrixCells, activeNodes]);

  const bottlenecks = React.useMemo(() => {
    return identifyBottlenecks(filteredCells, 120);
  }, [filteredCells]);

  const meshStats = React.useMemo(() => {
    return computeAverageMeshLatency(filteredCells);
  }, [filteredCells]);

  // D3 Heatmap Render Effect
  useEffect(() => {
    if (!svgRef.current || activeNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const n = activeNodes.length;
    // Dimensions
    const margin = { top: 120, right: 30, bottom: 30, left: 140 };
    const width = 640;
    const height = 640;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const cellSize = innerWidth / n;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Color interpolation using design spec colors:
    // < 2ms: #76B900 (NVIDIA Neon)
    // 2ms - 30ms: #00D2FF (Orchestration Cyan)
    // 30ms - 150ms: #D97706 (Amber)
    // > 150ms: #E06C75 (Coral Bottleneck)
    const colorScale = d3
      .scaleThreshold<number, string>()
      .domain([1.5, 10, 100, 250])
      .range(['#76B900', '#00D2FF', '#D97706', '#E06C75', '#fc828b']);

    // Column Headers (Target Nodes - rotated)
    const colLabels = g
      .selectAll('.col-label')
      .data(activeNodes)
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(${i * cellSize + cellSize / 2}, -10)`);

    colLabels
      .append('text')
      .attr('text-anchor', 'start')
      .attr('transform', 'rotate(-45)')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '10px')
      .attr('fill', '#c1cab1')
      .attr('class', 'select-none')
      .text((d) => d.shortName);

    // Row Headers (Source Nodes)
    const rowLabels = g
      .selectAll('.row-label')
      .data(activeNodes)
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(-12, ${i * cellSize + cellSize / 2 + 3})`);

    rowLabels
      .append('text')
      .attr('text-anchor', 'end')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '10px')
      .attr('fill', '#c1cab1')
      .attr('class', 'select-none')
      .text((d) => d.shortName);

    // Heatmap Cells
    const cellGroups = g
      .selectAll('.cell-group')
      .data(filteredCells)
      .enter()
      .append('g')
      .attr('class', 'cell-group cursor-pointer')
      .on('mouseenter', (_, d) => setHoveredCell(d))
      .on('mouseleave', () => setHoveredCell(null))
      .on('click', (_, d) => {
        setSelectedCell(d);
      });

    // Node index mapping
    const nodeIndexMap = new Map<string, number>();
    activeNodes.forEach((node, idx) => nodeIndexMap.set(node.id, idx));

    cellGroups.each(function (d) {
      const rowIdx = nodeIndexMap.get(d.sourceId) ?? 0;
      const colIdx = nodeIndexMap.get(d.targetId) ?? 0;
      const x = colIdx * cellSize;
      const y = rowIdx * cellSize;

      const group = d3.select(this);
      const isSelf = d.sourceId === d.targetId;
      const isSelected = selectedCell && selectedCell.sourceId === d.sourceId && selectedCell.targetId === d.targetId;
      const isHovered = hoveredCell && hoveredCell.sourceId === d.sourceId && hoveredCell.targetId === d.targetId;

      const fill = isSelf ? '#181D2A' : colorScale(d.latencyMs);
      const fillOpacity = isSelf ? 0.35 : d.isBottleneck ? 0.85 : 0.65;

      // Cell rectangle
      group
        .append('rect')
        .attr('x', x + 1)
        .attr('y', y + 1)
        .attr('width', cellSize - 2)
        .attr('height', cellSize - 2)
        .attr('rx', 2)
        .attr('fill', fill)
        .attr('fill-opacity', fillOpacity)
        .attr('stroke', isSelected ? '#00FF88' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.08)')
        .attr('stroke-width', isSelected || isHovered ? 2 : 1)
        .style('transition', 'all 0.15s ease');

      // Metric text inside cell
      const textVal = isSelf
        ? 'LOCAL'
        : d.latencyMs < 1
        ? `${(d.latencyMs * 1000).toFixed(0)}µs`
        : `${d.latencyMs.toFixed(1)}ms`;

      group
        .append('text')
        .attr('x', x + cellSize / 2)
        .attr('y', y + cellSize / 2 + 3.5)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'JetBrains Mono, monospace')
        .attr('font-size', cellSize > 55 ? '10px' : '9px')
        .attr('font-weight', d.isBottleneck ? '700' : '500')
        .attr('fill', isSelf ? '#8c947d' : d.isBottleneck ? '#ffffff' : '#0B0D13')
        .attr('class', 'pointer-events-none select-none')
        .text(textVal);
    });
  }, [activeNodes, filteredCells, selectedCell, hoveredCell]);

  const handleSimulateSpike = () => {
    setMatrixCells((prev) =>
      prev.map((c) => {
        if (c.sourceId === 'claude-node' && c.targetId === 'openai-node') {
          return {
            ...c,
            latencyMs: 512.4,
            isBottleneck: true,
            packetLossPct: 0.08
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
      {/* Top Banner Toolbar */}
      <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-[#76B900]" />
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#e0e1f2]">
              Cluster Latency Heatmap & Cross-Node Comm Profiler
            </h2>
            <div className="text-[11px] text-[#8c947d] mt-0.5">
              Real-time D3 matrix visualizing inter-node transport latency, NVLink meshes, and DAG bottlenecks.
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Node Scope Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[#8c947d]">SCOPE:</span>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as any)}
              className="bg-[#0B0D13] border border-[rgba(255,255,255,0.12)] rounded-[3px] px-2 py-1 text-xs font-mono text-[#00FF88] focus:outline-none focus:border-[#76B900]"
            >
              <option value="all">Full Cluster Matrix (8×8)</option>
              <option value="gpus">Local GPU NVLink Mesh (4×4)</option>
              <option value="dag">Agent DAG Critical Path (4×4)</option>
            </select>
          </div>

          {/* Real-time Polling Toggle */}
          <button
            onClick={() => setIsLivePolling(!isLivePolling)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-xs font-mono border transition-all ${
              isLivePolling
                ? 'bg-[#181D2A] text-[#00FF88] border-[#76B900]/40'
                : 'bg-[#0B0D13] text-[#8c947d] border-[rgba(255,255,255,0.08)]'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLivePolling ? 'animate-pulse text-[#00FF88]' : ''}`} />
            <span>Telemetry: {isLivePolling ? 'LIVE (1.5s)' : 'PAUSED'}</span>
          </button>

          {/* Latency Spike Simulator */}
          <button
            onClick={handleSimulateSpike}
            title="Inject simulated WAN latency spike on cross-agent gateway"
            className="px-3 py-1 bg-[#181D2A] hover:bg-[#222838] border border-[rgba(255,255,255,0.08)] hover:border-[#E06C75]/50 rounded-[3px] text-xs font-mono text-[#E06C75] flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Inject Spike</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-hud p-3.5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          <span className="text-[10px] font-mono text-[#8c947d] uppercase block">
            NVLink Intra-Cluster Latency
          </span>
          <div className="text-xl font-bold font-mono text-[#00FF88] tabular-nums mt-0.5">
            {meshStats.nvLinkAvgMs} <span className="text-xs text-[#8c947d]">ms</span>
          </div>
          <div className="text-[10px] font-mono text-[#8c947d] mt-1">
            Coherent HBM3 / NVLink 4.0
          </div>
        </div>

        <div className="glass-hud p-3.5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          <span className="text-[10px] font-mono text-[#8c947d] uppercase block">
            Frontier Cloud WAN Latency
          </span>
          <div className="text-xl font-bold font-mono text-[#E06C75] tabular-nums mt-0.5">
            {meshStats.wanAvgMs} <span className="text-xs text-[#8c947d]">ms</span>
          </div>
          <div className="text-[10px] font-mono text-[#8c947d] mt-1">
            Cross-Cloud API Round-Trip
          </div>
        </div>

        <div className="glass-hud p-3.5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          <span className="text-[10px] font-mono text-[#8c947d] uppercase block">
            Transport Disparity
          </span>
          <div className="text-xl font-bold font-mono text-[#e0e1f2] tabular-nums mt-0.5">
            {meshStats.nvLinkAvgMs > 0 ? (meshStats.wanAvgMs / meshStats.nvLinkAvgMs).toFixed(0) : '0'}×
          </div>
          <div className="text-[10px] font-mono text-[#00D2FF] mt-1">
            Local GPU Speedup vs Cloud
          </div>
        </div>

        <div className="glass-hud p-3.5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          <span className="text-[10px] font-mono text-[#8c947d] uppercase block">
            Detected DAG Bottlenecks
          </span>
          <div className="text-xl font-bold font-mono text-[#D97706] tabular-nums mt-0.5">
            {bottlenecks.length} <span className="text-xs text-[#8c947d]">Critical Channels</span>
          </div>
          <div className="text-[10px] font-mono text-[#8c947d] mt-1">
            Threshold: ≥ 120 ms
          </div>
        </div>
      </div>

      {/* Main Split: D3 Matrix View (Left) & Channel Inspector / Bottleneck Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive D3 Heatmap Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)] flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)] mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c947d]">
                Communication Latency Heatmap Matrix (N × N)
              </span>
              <span className="text-[10px] font-mono text-[#00FF88]">
                Rows = Source Node · Cols = Target Node
              </span>
            </div>

            {/* D3 Heatmap SVG Container */}
            <div className="w-full overflow-x-auto flex justify-center py-2">
              <svg
                ref={svgRef}
                viewBox="0 0 640 640"
                className="w-full max-w-[620px] h-auto drop-shadow-xl"
              />
            </div>

            {/* Heatmap Legend */}
            <div className="w-full pt-3 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap items-center justify-between text-[10px] font-mono text-[#8c947d]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-[1px] bg-[#76B900]" /> &lt; 1.5ms (NVLink)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-[1px] bg-[#00D2FF]" /> 2-25ms (Infiniband/PCIe)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-[1px] bg-[#D97706]" /> 25-150ms (Gateway)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-[1px] bg-[#E06C75]" /> &gt; 150ms (Bottleneck)
                </span>
              </div>
              <span>Click any cell for channel diagnostics</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bottleneck Detection Engine & Channel Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Channel Detail Inspector */}
          <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#00D2FF]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#e0e1f2]">
                  Channel Diagnostic Registry
                </h3>
              </div>
              {selectedCell ? (
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] font-semibold"
                  style={{
                    color: selectedCell.isBottleneck ? '#E06C75' : '#00FF88',
                    backgroundColor: selectedCell.isBottleneck ? 'rgba(224,108,117,0.15)' : 'rgba(118,185,0,0.15)'
                  }}
                >
                  {selectedCell.isBottleneck ? 'BOTTLENECK' : 'OPTIMAL'}
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#8c947d]">SELECT CELL</span>
              )}
            </div>

            {selectedCell ? (
              <div className="flex flex-col gap-3 mt-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#e0e1f2] bg-[#0B0D13] p-2.5 rounded-[3px] border border-[rgba(255,255,255,0.06)]">
                  <span className="text-[#00FF88] font-bold">{selectedCell.sourceName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8c947d]" />
                  <span className="text-[#00D2FF] font-bold">{selectedCell.targetName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#0B0D13] p-2.5 rounded-[3px] border border-[rgba(255,255,255,0.05)]">
                    <span className="text-[10px] text-[#8c947d] block uppercase">Round-Trip Latency</span>
                    <span className="text-base font-bold tabular-nums" style={{ color: selectedCell.isBottleneck ? '#E06C75' : '#00FF88' }}>
                      {selectedCell.latencyMs < 1 ? `${(selectedCell.latencyMs * 1000).toFixed(0)} µs` : `${selectedCell.latencyMs.toFixed(2)} ms`}
                    </span>
                  </div>

                  <div className="bg-[#0B0D13] p-2.5 rounded-[3px] border border-[rgba(255,255,255,0.05)]">
                    <span className="text-[10px] text-[#8c947d] block uppercase">Interconnect Protocol</span>
                    <span className="text-xs font-bold text-[#e0e1f2] truncate block mt-1">
                      {selectedCell.protocol}
                    </span>
                  </div>

                  <div className="bg-[#0B0D13] p-2.5 rounded-[3px] border border-[rgba(255,255,255,0.05)]">
                    <span className="text-[10px] text-[#8c947d] block uppercase">Bus Bandwidth</span>
                    <span className="text-base font-bold text-[#00D2FF] tabular-nums">
                      {selectedCell.bandwidthGBs} <span className="text-xs text-[#8c947d]">GB/s</span>
                    </span>
                  </div>

                  <div className="bg-[#0B0D13] p-2.5 rounded-[3px] border border-[rgba(255,255,255,0.05)]">
                    <span className="text-[10px] text-[#8c947d] block uppercase">Packet Loss</span>
                    <span className="text-base font-bold text-[#e0e1f2] tabular-nums">
                      {selectedCell.packetLossPct.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {onInspectPayload && (
                  <button
                    onClick={() =>
                      onInspectPayload(
                        `Channel Telemetry: ${selectedCell.sourceName} -> ${selectedCell.targetName}`,
                        selectedCell
                      )
                    }
                    className="w-full py-1.5 bg-[#181D2A] hover:bg-[#222838] border border-[rgba(255,255,255,0.08)] hover:border-[#00D2FF]/40 rounded-[3px] text-xs font-mono text-[#00D2FF] transition-colors"
                  >
                    Inspect Full JSON Payload
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs font-mono text-[#8c947d]">
                Hover or click any cell in the heatmap matrix to inspect interconnect bandwidth, packet loss, and transfer protocol.
              </div>
            )}
          </div>

          {/* Top Bottleneck Analysis List */}
          <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)] flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#E06C75]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#e0e1f2]">
                    Active Pipeline Bottlenecks
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#E06C75] bg-[rgba(224,108,117,0.12)] px-2 py-0.5 rounded-[2px]">
                  DELAY IMPACT
                </span>
              </div>

              <div className="flex flex-col gap-2.5 mt-3">
                {bottlenecks.map((b, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0B0D13] p-3 rounded-[3px] border border-[rgba(255,255,255,0.06)] hover:border-[#E06C75]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] text-[#E06C75] font-bold">#{idx + 1}</span>
                        <span className="text-[#e0e1f2] font-semibold">{b.sourceName}</span>
                        <ArrowRight className="w-3 h-3 text-[#8c947d]" />
                        <span className="text-[#00D2FF] font-semibold">{b.targetName}</span>
                      </div>
                      <span className="text-[#E06C75] font-bold tabular-nums shrink-0 ml-2">
                        {b.latencyMs.toFixed(1)}ms
                      </span>
                    </div>

                    <div className="text-[11px] text-[#8c947d] mt-1 line-clamp-2">
                      {b.recommendation}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8c947d] mt-2 pt-1.5 border-t border-[rgba(255,255,255,0.04)]">
                      <span>Protocol: {b.protocol}</span>
                      <span className="text-[#00FF88]">Impact: {b.impactScore}% of cross-cloud delay</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] text-[10px] font-mono text-[#8c947d] flex items-center justify-between">
              <span>Automatic Topology Routing: ENABLED</span>
              <span className="text-[#00FF88]">Adaptive Speculative Bypass: READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
