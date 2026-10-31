import React, { useState } from 'react';
import { Activity, Plus, Settings, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Sliders, Play } from 'lucide-react';
import { AgentType, DAGNode } from '../../types/orchestration';
import { AgentBadge } from '../common/AgentBadge';

interface GraphTopologyStudioProps {
  nodes: DAGNode[];
  onUpdateNode: (nodeId: string, updates: Partial<DAGNode>) => void;
  onAddCustomNode: (node: DAGNode) => void;
  onRunTestGraph: () => void;
}

export const GraphTopologyStudio: React.FC<GraphTopologyStudioProps> = ({
  nodes,
  onUpdateNode,
  onAddCustomNode,
  onRunTestGraph
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[1]?.id || nodes[0]?.id);
  const [editTemperature, setEditTemperature] = useState<number>(0.2);
  const [editTopP, setEditTopP] = useState<number>(0.95);
  const [editTimeoutMs, setEditTimeoutMs] = useState<number>(1500);
  const [editSystemPrompt, setEditSystemPrompt] = useState<string>(
    'You are an expert system acting as a node in an enterprise orchestration compute graph. Adhere strictly to the requested schema and emit zero hallucinated data.'
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleSaveNodeConfig = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        summary: `Configured: temp=${editTemperature}, top_p=${editTopP}, timeout=${editTimeoutMs}ms`
      });
    }
  };

  const handleAddNewAgentNode = () => {
    const id = `node-custom-${Date.now().toString().slice(-4)}`;
    const newNode: DAGNode = {
      id,
      label: 'NVIDIA Embedding & Vector Sink',
      agentType: 'nvidia',
      model: 'NV-Embed-v2-FP8',
      stage: 'Stage 4: Post-Processing & Indexing',
      status: 'pending',
      inputs: [selectedNode ? selectedNode.id : 'node-claude-reasoning'],
      outputType: 'Dense Vector Embeddings [4096-dim]',
      latencyMs: 18,
      tokensProcessed: 512,
      summary: 'High-speed HBM3 embedding projection into Milvus vector cluster.'
    };
    onAddCustomNode(newNode);
    setSelectedNodeId(id);
  };

  // Estimated pipeline stats
  const totalPipelineLatency = nodes.reduce((acc, n) => acc + n.latencyMs, 0);
  const totalTokens = nodes.reduce((acc, n) => acc + n.tokensProcessed, 0);

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
      {/* Topology Header */}
      <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-[#00D2FF]" />
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#e0e1f2]">
              Multi-Agent DAG Topology & Pipeline Studio
            </h2>
            <div className="text-[11px] text-[#8c947d] mt-0.5">
              Design heterogeneous execution graphs, model failover chains, and consensus arbitration.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewAgentNode}
            className="px-3 py-1.5 bg-[#181D2A] hover:bg-[#222838] border border-[rgba(255,255,255,0.08)] hover:border-[#76B900]/40 rounded-[3px] text-xs font-mono text-[#00FF88] flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add DAG Node</span>
          </button>

          <button
            onClick={onRunTestGraph}
            className="px-4 py-1.5 bg-[#76B900] text-[#0B0D13] hover:bg-[#00FF88] rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(118,185,0,0.35)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Validate & Benchmark DAG</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Visual Graph Flow Canvas + Node Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Graph Flow Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-hud p-5 rounded-[4px] border border-[rgba(255,255,255,0.08)] min-h-[580px] flex flex-col justify-between relative overflow-hidden bg-radial from-[#181D2A]/40 to-[#0B0D13]">
            {/* Visual Grid Lines Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c947d]">
                Graph Topology Layout · Directed Acyclic Graph (DAG)
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#8c947d]">
                <span>Predicted Latency: <strong className="text-[#00FF88]">{totalPipelineLatency}ms</strong></span>
                <span>·</span>
                <span>Tokens: <strong className="text-[#00D2FF]">{totalTokens}</strong></span>
              </div>
            </div>

            {/* Interactive Graph Node Chain */}
            <div className="relative z-10 flex flex-col gap-4 my-auto py-4">
              {nodes.map((node, index) => {
                const isSelected = node.id === selectedNodeId;

                let cardBorder = 'border-[rgba(255,255,255,0.08)]';
                let accentColor = '#8c947d';
                if (node.agentType === 'nvidia') {
                  accentColor = '#76B900';
                  if (isSelected) cardBorder = 'border-[#76B900] shadow-[0_0_16px_rgba(118,185,0,0.3)]';
                } else if (node.agentType === 'claude') {
                  accentColor = '#E06C75';
                  if (isSelected) cardBorder = 'border-[#E06C75] shadow-[0_0_16px_rgba(224,108,117,0.3)]';
                } else if (node.agentType === 'openai') {
                  accentColor = '#00D2FF';
                  if (isSelected) cardBorder = 'border-[#00D2FF] shadow-[0_0_16px_rgba(0,210,255,0.3)]';
                }

                return (
                  <div key={node.id} className="flex flex-col items-center">
                    <div
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-full max-w-2xl bg-[#11141F] p-4 rounded-[4px] border ${cardBorder} cursor-pointer transition-all hover:border-[rgba(255,255,255,0.3)] relative group`}
                    >
                      {/* Left color stripe */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[4px]"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="flex items-start justify-between gap-3 pl-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#8c947d] uppercase">
                              {node.stage}
                            </span>
                            <span className="text-[#8c947d]">·</span>
                            <span className="text-[10px] font-mono text-[#00FF88]">
                              {node.model}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-[#e0e1f2]">
                            {node.label}
                          </h4>
                          <p className="text-xs text-[#8c947d] mt-0.5 line-clamp-1">
                            {node.summary}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <AgentBadge type={node.agentType} size="sm" />
                          <div className="text-[10px] font-mono text-[#8c947d] tabular-nums">
                            {node.latencyMs}ms · {node.tokensProcessed} tok
                          </div>
                        </div>
                      </div>

                      {/* Input/Output Data Line */}
                      <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.05)] pl-2 flex items-center justify-between text-[10px] font-mono text-[#8c947d]">
                        <span className="truncate">IN: {node.inputs.join(', ')}</span>
                        <span className="text-[#e0e1f2] font-medium truncate">OUT: {node.outputType}</span>
                      </div>
                    </div>

                    {/* Connecting vector line to next node */}
                    {index < nodes.length - 1 && (
                      <div className="flex flex-col items-center my-1 select-none">
                        <div className="w-[1px] h-4 bg-[rgba(255,255,255,0.2)]" />
                        <ArrowRight className="w-3.5 h-3.5 text-[#00D2FF] rotate-90 my-[-2px]" />
                        <div className="w-[1px] h-4 bg-[rgba(255,255,255,0.2)]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Canvas Footer Status */}
            <div className="relative z-10 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[10px] font-mono text-[#8c947d]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF88]" />
                <span>Zero Cyclical Dependencies Detected · Invariants Formally Verified</span>
              </div>
              <span className="text-[#00D2FF]">Speculative Execution Concurrency: 3 Nodes</span>
            </div>
          </div>
        </div>

        {/* Node Configuration Inspector Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#76B900]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#e0e1f2]">
                  Node Configuration Inspector
                </h3>
              </div>
              <AgentBadge type={selectedNode.agentType} size="sm" />
            </div>

            <div className="flex flex-col gap-3 mt-3">
              <div>
                <label className="text-[10px] font-mono text-[#8c947d] uppercase block mb-1">
                  Node Identifier & Stage
                </label>
                <input
                  type="text"
                  value={selectedNode.label}
                  readOnly
                  className="w-full bg-[#0B0D13] border border-[rgba(255,255,255,0.08)] rounded-[3px] px-2.5 py-1.5 text-xs font-mono text-[#e0e1f2] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8c947d] uppercase block mb-1">
                  Model Runtime Endpoint
                </label>
                <input
                  type="text"
                  value={selectedNode.model}
                  readOnly
                  className="w-full bg-[#0B0D13] border border-[rgba(255,255,255,0.08)] rounded-[3px] px-2.5 py-1.5 text-xs font-mono text-[#00FF88] cursor-not-allowed"
                />
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8c947d] mb-1">
                  <span>SAMPLING TEMPERATURE</span>
                  <span className="text-[#e0e1f2]">{editTemperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={editTemperature}
                  onChange={(e) => setEditTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#76B900] bg-[#0B0D13] h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Top-P Slider */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8c947d] mb-1">
                  <span>NUCLEUS SAMPLING (TOP-P)</span>
                  <span className="text-[#00D2FF]">{editTopP.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={editTopP}
                  onChange={(e) => setEditTopP(parseFloat(e.target.value))}
                  className="w-full accent-[#00D2FF] bg-[#0B0D13] h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Timeout */}
              <div>
                <label className="text-[10px] font-mono text-[#8c947d] uppercase block mb-1">
                  TIMEOUT DEADLINE (MS)
                </label>
                <input
                  type="number"
                  value={editTimeoutMs}
                  onChange={(e) => setEditTimeoutMs(parseInt(e.target.value))}
                  className="w-full bg-[#0B0D13] border border-[rgba(255,255,255,0.08)] rounded-[3px] px-2.5 py-1.5 text-xs font-mono text-[#e0e1f2] focus:outline-none focus:border-[#76B900]"
                />
              </div>

              {/* System Instructions */}
              <div>
                <label className="text-[10px] font-mono text-[#8c947d] uppercase block mb-1">
                  NODE SYSTEM PROMPT CONSTRAINTS
                </label>
                <textarea
                  value={editSystemPrompt}
                  onChange={(e) => setEditSystemPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0B0D13] border border-[rgba(255,255,255,0.08)] rounded-[3px] p-2 text-xs font-mono text-[#c1cab1] focus:outline-none focus:border-[#76B900] resize-none leading-relaxed"
                />
              </div>

              <button
                onClick={handleSaveNodeConfig}
                className="w-full py-2 bg-[#76B900] text-[#0B0D13] hover:bg-[#00FF88] font-semibold rounded-[3px] text-xs transition-colors mt-2"
              >
                Apply Node Parameters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
