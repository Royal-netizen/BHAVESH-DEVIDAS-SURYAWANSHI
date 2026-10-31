import React, { useState, useEffect, useRef } from 'react';
import { TopNav, ActiveView } from './components/TopNav';
import { DAGExecutionView } from './components/views/DAGExecutionView';
import { ClusterTelemetryHUD } from './components/views/ClusterTelemetryHUD';
import { ClusterLatencyHeatmapView } from './components/views/ClusterLatencyHeatmapView';
import { AgentTerminalView } from './components/views/AgentTerminalView';
import { GraphTopologyStudio } from './components/views/GraphTopologyStudio';
import { BenchmarkMatrixView } from './components/views/BenchmarkMatrixView';

import { PayloadInspectorModal } from './components/common/PayloadInspectorModal';
import { TerminalDownloadModal } from './components/common/TerminalDownloadModal';
import {
  INITIAL_AGENTS,
  WORKFLOW_PRESETS,
  INITIAL_GPUS,
  INITIAL_LOGS,
  INITIAL_BENCHMARKS,
  OrchestrationPreset
} from './data/mockOrchestrationData';
import { AgentInfo, DAGNode, GPUMetric, TerminalLogEntry, BenchmarkMetrics } from './types/orchestration';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dag');
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [presets] = useState<OrchestrationPreset[]>(WORKFLOW_PRESETS);
  const [activePreset, setActivePreset] = useState<OrchestrationPreset>(WORKFLOW_PRESETS[0]);
  const [dagNodes, setDagNodes] = useState<DAGNode[]>(WORKFLOW_PRESETS[0].initialNodes);
  const [gpus, setGpus] = useState<GPUMetric[]>(INITIAL_GPUS);
  const [logs, setLogs] = useState<TerminalLogEntry[]>(INITIAL_LOGS);
  const [benchmarks, setBenchmarks] = useState<BenchmarkMetrics[]>(INITIAL_BENCHMARKS);
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamProgress, setStreamProgress] = useState<number>(100);
  const [streamedText, setStreamedText] = useState<Record<string, string>>({
    'agent-nvidia': WORKFLOW_PRESETS[0].streamOutputs['agent-nvidia'] || '',
    'agent-claude': WORKFLOW_PRESETS[0].streamOutputs['agent-claude'] || '',
    'agent-openai': WORKFLOW_PRESETS[0].streamOutputs['agent-openai'] || ''
  });

  // Modal payload inspector state
  const [inspector, setInspector] = useState<{ isOpen: boolean; title: string; data: any }>({
    isOpen: false,
    title: '',
    data: null
  });

  // Terminal PC tool download modal state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  const streamTimerRef = useRef<any>(null);

  // Sync preset changes
  const handleSelectPreset = (preset: OrchestrationPreset) => {
    setActivePreset(preset);
    setDagNodes(preset.initialNodes);
    setStreamedText({
      'agent-nvidia': preset.streamOutputs['agent-nvidia'] || '',
      'agent-claude': preset.streamOutputs['agent-claude'] || '',
      'agent-openai': preset.streamOutputs['agent-openai'] || ''
    });
    setStreamProgress(100);
    setIsStreaming(false);

    // Add log
    const newLog: TerminalLogEntry = {
      id: `log-preset-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'system',
      agentName: 'ORCHESTRATOR',
      level: 'INFO',
      message: `Workflow preset switched to: [${preset.name}]. Pipeline DAG reconfigured.`,
      payload: { preset_id: preset.id, nodes_count: preset.initialNodes.length }
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Toggle stream simulation
  const handleToggleStream = () => {
    if (isStreaming) {
      setIsStreaming(false);
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    } else {
      // Start streaming simulation
      setIsStreaming(true);
      setStreamProgress(0);
      setStreamedText({
        'agent-nvidia': '',
        'agent-claude': '',
        'agent-openai': ''
      });

      // Update DAG node statuses
      setDagNodes((prev) =>
        prev.map((n, idx) => ({
          ...n,
          status: idx === 0 ? 'completed' : idx === 1 ? 'running' : 'pending'
        }))
      );

      // Log dispatch
      const dispatchLog: TerminalLogEntry = {
        id: `log-dispatch-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        agentType: 'system',
        agentName: 'DISPATCHER',
        level: 'TRACE',
        message: `Dispatched parallel DAG execution for [${activePreset.name}]. All heterogeneous streams listening.`,
        payload: { prompt: activePreset.prompt.slice(0, 80) + '...', routing: activePreset.routingMode }
      };
      setLogs((prev) => [dispatchLog, ...prev]);
    }
  };

  // Stream simulation loop
  useEffect(() => {
    if (!isStreaming) {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      return;
    }

    const fullOutputs = activePreset.streamOutputs;
    let step = 0;
    const maxSteps = 40;

    streamTimerRef.current = setInterval(() => {
      step++;
      const ratio = Math.min(1, step / maxSteps);
      setStreamProgress(Math.round(ratio * 100));

      setStreamedText({
        'agent-nvidia': fullOutputs['agent-nvidia'] ? fullOutputs['agent-nvidia'].slice(0, Math.floor(fullOutputs['agent-nvidia'].length * ratio)) : '',
        'agent-claude': fullOutputs['agent-claude'] ? fullOutputs['agent-claude'].slice(0, Math.floor(fullOutputs['agent-claude'].length * ratio)) : '',
        'agent-openai': fullOutputs['agent-openai'] ? fullOutputs['agent-openai'].slice(0, Math.floor(fullOutputs['agent-openai'].length * ratio)) : ''
      });

      // Update agent metrics slightly for realism
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          status: ratio < 1 ? 'generating' : 'completed',
          tokensGenerated: Math.floor(agent.tokensGenerated + Math.random() * 8),
          tokenVelocity: agent.tokenVelocity + (Math.random() * 4 - 2)
        }))
      );

      // Stage progression in DAG
      if (step === 10) {
        setDagNodes((prev) =>
          prev.map((n, i) => (i === 1 ? { ...n, status: 'completed' } : i === 2 ? { ...n, status: 'running' } : n))
        );
      } else if (step === 25) {
        setDagNodes((prev) =>
          prev.map((n, i) => (i <= 2 ? { ...n, status: 'completed' } : i === 3 ? { ...n, status: 'running' } : n))
        );
      } else if (step >= maxSteps) {
        setIsStreaming(false);
        setDagNodes((prev) => prev.map((n) => ({ ...n, status: 'completed' })));
        clearInterval(streamTimerRef.current);

        // Completion log
        const finishLog: TerminalLogEntry = {
          id: `log-complete-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleTimeString(),
          agentType: 'nvidia',
          agentName: 'NVIDIA AI Ultra',
          level: 'CUDA',
          message: `DAG Execution finished. Final consensus verified across heterogeneous cluster. 0 anomalies detected.`,
          durationMs: 42,
          payload: { total_steps: maxSteps, consensus_score: 0.998 }
        };
        setLogs((prev) => [finishLog, ...prev]);
      }
    }, 120);

    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [isStreaming, activePreset]);

  // Reset workflow
  const handleResetWorkflow = () => {
    setIsStreaming(false);
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setStreamedText({
      'agent-nvidia': '',
      'agent-claude': '',
      'agent-openai': ''
    });
    setDagNodes((prev) =>
      prev.map((n, i) => ({
        ...n,
        status: i === 0 ? 'completed' : 'pending'
      }))
    );
  };

  // Trigger GC on selected GPU
  const handleTriggerGC = (gpuId: string) => {
    setGpus((prev) =>
      prev.map((g) => {
        if (g.id === gpuId) {
          const newAllocated = Math.max(20, g.vramAllocatedGB - 8.5);
          return {
            ...g,
            vramAllocatedGB: parseFloat(newAllocated.toFixed(1)),
            kvCacheHitPct: Math.min(99.4, g.kvCacheHitPct + 1.2)
          };
        }
        return g;
      })
    );

    const log: TerminalLogEntry = {
      id: `log-gc-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'nvidia',
      agentName: 'NVIDIA AI Ultra',
      level: 'CUDA',
      message: `Garbage Collection cycle executed on [${gpuId}]. Reclaimed 8.5 GB unpinned KV blocks.`,
      durationMs: 14,
      payload: { gpu_id: gpuId, memory_freed_gb: 8.5 }
    };
    setLogs((prev) => [log, ...prev]);
  };

  // Simulate VRAM load adjustment
  const handleSimulateLoad = (gpuId: string, deltaGB: number) => {
    setGpus((prev) =>
      prev.map((g) => {
        if (g.id === gpuId) {
          const updated = Math.min(g.vramTotalGB, Math.max(15, g.vramAllocatedGB + deltaGB));
          return {
            ...g,
            vramAllocatedGB: parseFloat(updated.toFixed(1)),
            vramPeakGB: Math.max(g.vramPeakGB, updated)
          };
        }
        return g;
      })
    );
  };

  // Open modal
  const handleInspectPayload = (title: string, data: any) => {
    setInspector({
      isOpen: true,
      title,
      data
    });
  };

  // Update DAG Node
  const handleUpdateNode = (nodeId: string, updates: Partial<DAGNode>) => {
    setDagNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, ...updates } : node))
    );
    const log: TerminalLogEntry = {
      id: `log-cfg-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'system',
      agentName: 'ORCHESTRATOR',
      level: 'INFO',
      message: `DAG Node [${nodeId}] configuration modified.`,
      payload: updates
    };
    setLogs((prev) => [log, ...prev]);
  };

  // Add custom node
  const handleAddCustomNode = (newNode: DAGNode) => {
    setDagNodes((prev) => [...prev, newNode]);
    const log: TerminalLogEntry = {
      id: `log-add-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'system',
      agentName: 'ORCHESTRATOR',
      level: 'INFO',
      message: `New execution node appended to DAG: [${newNode.label}].`,
      payload: newNode
    };
    setLogs((prev) => [log, ...prev]);
  };

  // Run test graph in studio
  const handleRunTestGraph = () => {
    handleToggleStream();
  };

  // Run benchmark suite
  const handleRunBenchmarkSuite = () => {
    setBenchmarks((prev) =>
      prev.map((b) => ({
        ...b,
        avgTokenVelocity: b.avgTokenVelocity + (Math.random() * 6 - 3),
        avgTTFTMs: Math.max(30, b.avgTTFTMs + Math.floor(Math.random() * 10 - 5)),
        totalTokensServed: b.totalTokensServed + 100000
      }))
    );
    const log: TerminalLogEntry = {
      id: `log-bench-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'nvidia',
      agentName: 'NVIDIA AI Ultra',
      level: 'CUDA',
      message: `100-sample empirical benchmark completed across heterogeneous cluster nodes.`,
      durationMs: 88,
      payload: { test_requests: 100, concurrency: 16 }
    };
    setLogs((prev) => [log, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-[#e0e1f2] flex flex-col selection:bg-[#76B900]/30 selection:text-[#00FF88]">
      {/* Top Navigation conforming to Top Bar Contract */}
      <TopNav
        activeView={activeView}
        setActiveView={setActiveView}
        isStreaming={isStreaming}
        onToggleStream={handleToggleStream}
        onResetWorkflow={handleResetWorkflow}
        activeClusterPings={gpus.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 overflow-x-hidden">
        {activeView === 'dag' && (
          <DAGExecutionView
            agents={agents}
            presets={presets}
            activePreset={activePreset}
            onSelectPreset={handleSelectPreset}
            isStreaming={isStreaming}
            onToggleStream={handleToggleStream}
            streamedText={streamedText}
            onInspectPayload={handleInspectPayload}
            dagNodes={dagNodes}
          />
        )}

        {activeView === 'telemetry' && (
          <ClusterTelemetryHUD
            gpus={gpus}
            onTriggerGC={handleTriggerGC}
            onSimulateLoad={handleSimulateLoad}
          />
        )}

        {activeView === 'heatmap' && (
          <ClusterLatencyHeatmapView
            onInspectPayload={handleInspectPayload}
          />
        )}

        {activeView === 'terminal' && (
          <AgentTerminalView
            logs={logs}
            onClearLogs={() => setLogs([])}
            onInspectPayload={handleInspectPayload}
            onAddLog={(entry) =>
              setLogs((prev) => [{ id: `log-${Date.now()}`, ...entry }, ...prev])
            }
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />
        )}

        {activeView === 'topology' && (
          <GraphTopologyStudio
            nodes={dagNodes}
            onUpdateNode={handleUpdateNode}
            onAddCustomNode={handleAddCustomNode}
            onRunTestGraph={handleRunTestGraph}
          />
        )}

        {activeView === 'benchmarks' && (
          <BenchmarkMatrixView
            benchmarks={benchmarks}
            onRunBenchmarkSuite={handleRunBenchmarkSuite}
          />
        )}
      </main>

      {/* Structured JSON Payload Inspector Modal */}
      <PayloadInspectorModal
        isOpen={inspector.isOpen}
        onClose={() => setInspector((prev) => ({ ...prev, isOpen: false }))}
        title={inspector.title}
        data={inspector.data}
      />

      {/* PC Terminal Diagnostic Download Modal */}
      <TerminalDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        appUrl={window.location.origin}
      />

      {/* Quiet, unboxed footer with attribution and cluster status */}
      <footer className="px-6 py-3 border-t border-[rgba(255,255,255,0.06)] bg-[#0B0D13] text-[11px] font-mono text-[#8c947d] flex flex-wrap items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <span>AI Orchestration Workstation Suite</span>
          <span>·</span>
          <span>Heterogeneous Cluster v4.2</span>
          <span>·</span>
          <span className="text-[#00FF88]">NVIDIA TensorRT-LLM 0.14</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Obsidian HUD Model</span>
          <span>·</span>
          <span>Tabular JetBrains Mono</span>
          <span>·</span>
          <span className="text-[#e0e1f2]">80.0 GB SXM5 HBM3</span>
        </div>
      </footer>
    </div>
  );
}
