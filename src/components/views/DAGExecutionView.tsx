import React, { useState, useEffect } from 'react';
import { Play, Pause, GitFork, Eye, RotateCw, CheckCircle2, Clock, Sparkles, Sliders, ChevronRight, Copy, Check } from 'lucide-react';
import { AgentInfo, DAGNode } from '../../types/orchestration';
import { AgentBadge } from '../common/AgentBadge';
import { OrchestrationPreset } from '../../data/mockOrchestrationData';

interface DAGExecutionViewProps {
  agents: AgentInfo[];
  presets: OrchestrationPreset[];
  activePreset: OrchestrationPreset;
  onSelectPreset: (preset: OrchestrationPreset) => void;
  isStreaming: boolean;
  onToggleStream: () => void;
  streamedText: Record<string, string>;
  onInspectPayload: (title: string, data: any) => void;
  dagNodes: DAGNode[];
}

export const DAGExecutionView: React.FC<DAGExecutionViewProps> = ({
  agents,
  presets,
  activePreset,
  onSelectPreset,
  isStreaming,
  onToggleStream,
  streamedText,
  onInspectPayload,
  dagNodes
}) => {
  const [customPrompt, setCustomPrompt] = useState(activePreset.prompt);
  const [customParams, setCustomParams] = useState(activePreset.parameters);
  const [routingMode, setRoutingMode] = useState(activePreset.routingMode);
  const [isolatedAgentId, setIsolatedAgentId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync when preset changes
  useEffect(() => {
    setCustomPrompt(activePreset.prompt);
    setCustomParams(activePreset.parameters);
    setRoutingMode(activePreset.routingMode);
  }, [activePreset]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const visibleAgents = isolatedAgentId
    ? agents.filter((a) => a.id === isolatedAgentId)
    : agents;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
      {/* SECTION 1: Prompt & Graph Dispatcher Console */}
      <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-[1px] bg-[#00D2FF]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#e0e1f2]">
              Multi-Agent Orchestration & Dispatch Console
            </h2>
            <span className="text-[11px] text-[#8c947d] hidden sm:inline">
              (NVIDIA TensorRT-LLM · Claude 3.5 Sonnet · GPT-4o)
            </span>
          </div>

          {/* Workflow Preset Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-[#8c947d] mr-1">Workflows:</span>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`px-2.5 py-1 text-[11px] rounded-[3px] transition-all whitespace-nowrap shrink-0 ${
                  activePreset.id === preset.id
                    ? 'bg-[#181D2A] text-[#00FF88] border border-[#76B900]/40 font-medium'
                    : 'bg-[#0B0D13] text-[#c1cab1] hover:text-[#e0e1f2] border border-[rgba(255,255,255,0.05)]'
                }`}
              >
                {preset.name.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input & Inset Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-3">
          <div className="lg:col-span-8 flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#8c947d] flex items-center justify-between">
              <span>ORCHESTRATION PROMPT INTENT</span>
              <span className="text-[10px] text-[#00D2FF]">Token Budget: 4,096 tokens</span>
            </label>
            <div className="relative">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full bg-[#0B0D13] border border-[rgba(255,255,255,0.12)] rounded-[4px] p-2.5 text-xs font-mono text-[#e0e1f2] focus:outline-none focus:border-[#76B900]/60 focus:ring-1 focus:ring-[#76B900]/40 transition-all resize-none leading-relaxed"
                placeholder="Enter multi-agent orchestration objective..."
              />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-[#8c947d] flex items-center justify-between">
                <span>EXECUTION PARAMETERS</span>
                <span className="text-[10px] text-[#94da32]">CUDA JIT Optimized</span>
              </label>
              <input
                type="text"
                value={customParams}
                onChange={(e) => setCustomParams(e.target.value)}
                className="w-full bg-[#0B0D13] border border-[rgba(255,255,255,0.12)] rounded-[4px] px-2.5 py-1.5 text-xs font-mono text-[#00D2FF] focus:outline-none focus:border-[#00D2FF]/60"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#8c947d]">ROUTING TOPOLOGY</span>
                <select
                  value={routingMode}
                  onChange={(e) => setRoutingMode(e.target.value as any)}
                  className="bg-[#0B0D13] border border-[rgba(255,255,255,0.12)] rounded-[4px] px-2 py-1 text-xs font-mono text-[#e0e1f2] focus:outline-none focus:border-[#76B900]"
                >
                  <option value="Parallel DAG">Parallel DAG Multi-Model</option>
                  <option value="Speculative Consensus">Speculative Consensus Voter</option>
                  <option value="Cascaded Fallback">Cascaded Fallback Chain</option>
                  <option value="Self-Refining Loop">Self-Refining Feedback Loop</option>
                </select>
              </div>

              <button
                onClick={onToggleStream}
                className={`self-end flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-[4px] transition-all whitespace-nowrap shrink-0 ${
                  isStreaming
                    ? 'bg-[#E06C75] text-[#0B0D13] hover:bg-[#fc828b]'
                    : 'bg-[#76B900] text-[#0B0D13] hover:bg-[#00FF88] shadow-[0_0_14px_rgba(118,185,0,0.35)]'
                }`}
              >
                {isStreaming ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Dispatch DAG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Execution DAG Nodes Bar */}
        <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c947d]">
              Execution Pipeline Trace Graph
            </span>
            <span className="text-[10px] font-mono text-[#76B900]">
              Active Stages: {dagNodes.filter((n) => n.status === 'completed' || n.status === 'running').length} / {dagNodes.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {dagNodes.map((node, idx) => {
              const isDone = node.status === 'completed';
              const isRunning = node.status === 'running' || (isStreaming && !isDone);
              
              let borderColor = 'border-[rgba(255,255,255,0.08)]';
              let badgeColor = '#8c947d';
              if (node.agentType === 'nvidia') {
                badgeColor = '#76B900';
                if (isRunning || isDone) borderColor = 'border-[#76B900]/40';
              } else if (node.agentType === 'claude') {
                badgeColor = '#E06C75';
                if (isRunning || isDone) borderColor = 'border-[#E06C75]/40';
              } else if (node.agentType === 'openai') {
                badgeColor = '#00D2FF';
                if (isRunning || isDone) borderColor = 'border-[#00D2FF]/40';
              }

              return (
                <div
                  key={node.id}
                  onClick={() => onInspectPayload(node.label, node)}
                  className={`bg-[#0B0D13] p-2.5 rounded-[4px] border ${borderColor} hover:border-[#76B900]/60 cursor-pointer transition-all relative group`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-mono text-[#8c947d] truncate">
                      {node.stage}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums text-[#e0e1f2]">
                      {node.latencyMs}ms
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'animate-pulse' : ''}`}
                      style={{ backgroundColor: badgeColor }}
                    />
                    <span className="text-xs font-semibold text-[#e0e1f2] truncate">
                      {node.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-[#8c947d]">
                    <span className="truncate">{node.outputType}</span>
                    <span className="text-[#00FF88]">{node.tokensProcessed} tok</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: Parallel Multi-Agent Inference Canvas */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#e0e1f2]">
            Parallel Heterogeneous Inference Canvas
          </h3>
          {isolatedAgentId && (
            <button
              onClick={() => setIsolatedAgentId(null)}
              className="text-[11px] font-mono text-[#00D2FF] hover:underline"
            >
              [Exit Isolated View · Show All 3 Agents]
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#8c947d] font-mono">
          <span>Aggregate Velocity: <strong className="text-[#00FF88] font-semibold tabular-nums">441.1 t/s</strong></span>
          <span>·</span>
          <span>Interconnect: <strong className="text-[#00D2FF] font-semibold">NVLink 4.0 (896 GB/s)</strong></span>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${visibleAgents.length === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-4`}>
        {visibleAgents.map((agent) => {
          const content = streamedText[agent.id] || activePreset.streamOutputs[agent.id] || 'Awaiting DAG stream payload...';
          const isGenerating = isStreaming;

          let glowClass = 'glow-nvidia';
          if (agent.type === 'claude') glowClass = 'glow-coral';
          if (agent.type === 'openai') glowClass = 'glow-cyan';

          return (
            <div
              key={agent.id}
              className={`glass-hud rounded-[4px] border ${
                isGenerating ? glowClass : ''
              } transition-all duration-300 flex flex-col h-[580px] overflow-hidden`}
              style={{ borderColor: agent.borderColor }}
            >
              {/* Telemetry Card Header matching spec */}
              <div className="px-3.5 py-2.5 bg-[#11141F] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <AgentBadge type={agent.type} showPulse={isGenerating} />
                  <span className="text-[11px] font-mono text-[#8c947d] tabular-nums">
                    {agent.latencyMs}ms
                  </span>
                </div>

                {/* Action Icons matching spec: fork trace, isolate agent, terminal inspect */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(agent.id, content)}
                    title="Copy agent stream output"
                    className="p-1 hover:bg-[#181D2A] text-[#8c947d] hover:text-[#e0e1f2] rounded-[3px] transition-colors"
                  >
                    {copiedId === agent.id ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setIsolatedAgentId(isolatedAgentId === agent.id ? null : agent.id)}
                    title={isolatedAgentId === agent.id ? "Exit Isolate Mode" : "Isolate Agent Stream"}
                    className={`p-1 rounded-[3px] transition-colors ${
                      isolatedAgentId === agent.id
                        ? 'bg-[#181D2A] text-[#00FF88]'
                        : 'text-[#8c947d] hover:text-[#e0e1f2] hover:bg-[#181D2A]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onInspectPayload(`${agent.name} Output & Context`, { agent, content, prompt: customPrompt })}
                    title="Inspect Raw JSON Payload"
                    className="p-1 hover:bg-[#181D2A] text-[#8c947d] hover:text-[#e0e1f2] rounded-[3px] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Real-time dynamic telemetry row */}
              <div className="px-3.5 py-1.5 bg-[#0B0D13]/70 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between text-[10px] font-mono text-[#8c947d]">
                <span className="truncate max-w-[190px]" title={agent.model}>
                  {agent.model}
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#e0e1f2] tabular-nums">
                    <strong style={{ color: agent.color }}>{agent.tokenVelocity.toFixed(1)}</strong> t/s
                  </span>
                  <span>·</span>
                  <span className="tabular-nums">TTFT: {agent.ttftMs}ms</span>
                </div>
              </div>

              {/* Code & Execution Stream Body */}
              <div className="flex-1 bg-[#0B0D13] p-3 overflow-y-auto font-mono text-xs text-[#e0e1f2] leading-relaxed relative select-text">
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ backgroundColor: agent.color }}
                />
                
                <pre className="whitespace-pre-wrap break-words pl-2 font-mono text-[11px] leading-relaxed text-[#e0e1f2]">
                  {content}
                </pre>

                {isGenerating && (
                  <span
                    className="inline-block w-2 h-4 ml-1 align-middle animate-pulse"
                    style={{ backgroundColor: agent.color }}
                  />
                )}
              </div>

              {/* Card Footer Metrics */}
              <div className="px-3.5 py-2 bg-[#11141F] border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-[10px] font-mono text-[#8c947d] shrink-0">
                <span className="text-[#8c947d]">
                  Tokens: <strong className="text-[#e0e1f2] tabular-nums">{agent.tokensGenerated}</strong> / {agent.maxTokens}
                </span>
                <span className="text-[10px] flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isGenerating ? '#00FF88' : '#8c947d' }}
                  />
                  <span className="uppercase">{isGenerating ? 'Active Kernel Transit' : 'Buffer Cached'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
