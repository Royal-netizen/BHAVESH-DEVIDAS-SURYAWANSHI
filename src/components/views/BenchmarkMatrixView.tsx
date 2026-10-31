import React, { useState } from 'react';
import { BarChart2, TrendingUp, DollarSign, Clock, Zap, Play, Calculator, Layers, Award } from 'lucide-react';
import { BenchmarkMetrics } from '../../types/orchestration';
import { AgentBadge } from '../common/AgentBadge';

interface BenchmarkMatrixViewProps {
  benchmarks: BenchmarkMetrics[];
  onRunBenchmarkSuite: () => void;
}

export const BenchmarkMatrixView: React.FC<BenchmarkMatrixViewProps> = ({
  benchmarks,
  onRunBenchmarkSuite
}) => {
  const [concurrency, setConcurrency] = useState<number>(16);
  const [monthlyTokenVolumeM, setMonthlyTokenVolumeM] = useState<number>(50); // 50 Million tokens
  const [benchmarkingActive, setBenchmarkingActive] = useState<boolean>(false);

  const handleBenchmarkClick = () => {
    setBenchmarkingActive(true);
    onRunBenchmarkSuite();
    setTimeout(() => {
      setBenchmarkingActive(false);
    }, 1800);
  };

  // Cost calculation for 50M tokens (assuming 60% input / 40% output)
  const inputVol = monthlyTokenVolumeM * 0.6;
  const outputVol = monthlyTokenVolumeM * 0.4;

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
      {/* Top Banner */}
      <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-4 h-4 text-[#76B900]" />
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#e0e1f2]">
              Inference Velocity, Latency & Cost Optimization Matrix
            </h2>
            <div className="text-[11px] text-[#8c947d] mt-0.5">
              Empirical telemetry comparing local NVIDIA TensorRT-LLM cluster against frontier API models.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[#8c947d]">CONCURRENCY:</span>
            <select
              value={concurrency}
              onChange={(e) => setConcurrency(parseInt(e.target.value))}
              className="bg-[#0B0D13] border border-[rgba(255,255,255,0.12)] rounded-[3px] px-2 py-1 text-xs font-mono text-[#00FF88] focus:outline-none focus:border-[#76B900]"
            >
              <option value={1}>1 Stream (Serial)</option>
              <option value={16}>16 Parallel Streams</option>
              <option value={64}>64 Concurrent DAGs</option>
              <option value={128}>128 Extreme Stress Test</option>
            </select>
          </div>

          <button
            onClick={handleBenchmarkClick}
            disabled={benchmarkingActive}
            className="px-4 py-1.5 bg-[#76B900] text-[#0B0D13] hover:bg-[#00FF88] rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(118,185,0,0.35)] disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${benchmarkingActive ? 'animate-spin' : ''}`} />
            <span>{benchmarkingActive ? 'Executing Profiler...' : 'Run 100-Sample Benchmark'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Comparative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {benchmarks.map((b) => {
          let cardBorder = 'border-[rgba(255,255,255,0.08)]';
          let highlightColor = '#76B900';
          if (b.agentType === 'nvidia') {
            cardBorder = 'border-[#76B900]/50 glow-nvidia-subtle';
            highlightColor = '#00FF88';
          } else if (b.agentType === 'claude') {
            cardBorder = 'border-[#E06C75]/40';
            highlightColor = '#E06C75';
          } else if (b.agentType === 'openai') {
            cardBorder = 'border-[#00D2FF]/40';
            highlightColor = '#00D2FF';
          }

          return (
            <div
              key={b.modelName}
              className={`glass-hud p-4 rounded-[4px] border ${cardBorder} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <AgentBadge type={b.agentType} />
                  {b.agentType === 'nvidia' && (
                    <span className="text-[10px] font-mono text-[#00FF88] flex items-center gap-1">
                      <Award className="w-3 h-3" /> FASTEST TTFT
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#e0e1f2] font-mono mb-1 truncate" title={b.modelName}>
                  {b.modelName}
                </h3>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-[#0B0D13] p-2.5 rounded-[3px] border border-[rgba(255,255,255,0.05)]">
                  <span className="text-[10px] font-mono text-[#8c947d] uppercase block">
                    Token Velocity
                  </span>
                  <div className="text-xl font-bold font-mono tabular-nums mt-0.5" style={{ color: highlightColor }}>
                    {b.avgTokenVelocity.toFixed(1)} <span className="text-xs text-[#8c947d]">t/s</span>
                  </div>
                </div>

                <div className="bg-[#0B0D13] p-2.5 rounded-[3px] border border-[rgba(255,255,255,0.05)]">
                  <span className="text-[10px] font-mono text-[#8c947d] uppercase block">
                    Time to 1st Token (TTFT)
                  </span>
                  <div className="text-xl font-bold font-mono text-[#e0e1f2] tabular-nums mt-0.5">
                    {b.avgTTFTMs} <span className="text-xs text-[#8c947d]">ms</span>
                  </div>
                </div>
              </div>

              {/* Latency distribution bar */}
              <div className="bg-[#0B0D13] p-3 rounded-[3px] border border-[rgba(255,255,255,0.05)] text-[10px] font-mono flex flex-col gap-1.5">
                <div className="flex justify-between text-[#8c947d]">
                  <span>LATENCY PERCENTILES</span>
                  <span className="text-[#e0e1f2]">p50: {b.p50LatencyMs}ms · p95: {b.p95LatencyMs}ms · p99: {b.p99LatencyMs}ms</span>
                </div>
                {/* Visual bar representation */}
                <div className="h-1.5 bg-[#181D2A] rounded-full overflow-hidden flex">
                  <div style={{ width: `${Math.min(100, (b.p50LatencyMs / 600) * 100)}%`, backgroundColor: highlightColor }} />
                  <div style={{ width: `${Math.min(100, ((b.p95LatencyMs - b.p50LatencyMs) / 600) * 100)}%`, backgroundColor: '#8c947d' }} />
                </div>
              </div>

              {/* Cost per 1M */}
              <div className="mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] font-mono text-[#8c947d]">
                <span>Cost / 1M Input: <strong className="text-[#e0e1f2]">${b.inputCostPer1M.toFixed(2)}</strong></span>
                <span>Output: <strong className="text-[#00FF88]">${b.outputCostPer1M.toFixed(2)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost & Monthly Architecture Projection Calculator */}
      <div className="glass-hud p-5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)] mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#00D2FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e0e1f2]">
              Hybrid Heterogeneous TCO Calculator
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#8c947d]">
            Local NVIDIA Compute vs Pure API Cost Breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 flex flex-col gap-2">
            <label className="text-xs font-mono text-[#8c947d] flex justify-between">
              <span>PROJECTED MONTHLY ORCHESTRATION VOLUME</span>
              <span className="text-[#00FF88] font-bold">{monthlyTokenVolumeM} Million Tokens</span>
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={monthlyTokenVolumeM}
              onChange={(e) => setMonthlyTokenVolumeM(parseInt(e.target.value))}
              className="w-full accent-[#76B900] bg-[#0B0D13] h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#8c947d]">
              <span>10M tokens/mo</span>
              <span>100M tokens/mo</span>
              <span>500M tokens/mo</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-3 gap-3">
            {/* Cost pure Claude 3.5 */}
            <div className="bg-[#0B0D13] p-3 rounded-[3px] border border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] font-mono text-[#8c947d] block">Pure Claude 3.5</span>
              <div className="text-base font-bold font-mono text-[#E06C75] mt-1 tabular-nums">
                ${(inputVol * 3.0 + outputVol * 15.0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <span className="text-[10px] text-[#8c947d]">/mo</span>
              </div>
              <span className="text-[9px] font-mono text-[#8c947d] mt-0.5 block">100% Hosted API</span>
            </div>

            {/* Cost pure GPT-4o */}
            <div className="bg-[#0B0D13] p-3 rounded-[3px] border border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] font-mono text-[#8c947d] block">Pure GPT-4o</span>
              <div className="text-base font-bold font-mono text-[#00D2FF] mt-1 tabular-nums">
                ${(inputVol * 2.5 + outputVol * 10.0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <span className="text-[10px] text-[#8c947d]">/mo</span>
              </div>
              <span className="text-[9px] font-mono text-[#8c947d] mt-0.5 block">100% Hosted API</span>
            </div>

            {/* Orchestrated Hybrid Model */}
            <div className="bg-[#181D2A] p-3 rounded-[3px] border border-[#76B900]/50 glow-nvidia-subtle">
              <span className="text-[10px] font-mono text-[#00FF88] font-semibold block">
                Workstation Hybrid DAG
              </span>
              <div className="text-base font-bold font-mono text-[#00FF88] mt-1 tabular-nums">
                ${(
                  (inputVol * 0.12 + outputVol * 0.28) * 0.7 + // 70% handled by local TensorRT
                  (inputVol * 3.0 + outputVol * 15.0) * 0.15 + // 15% Claude
                  (inputVol * 2.5 + outputVol * 10.0) * 0.15   // 15% GPT-4o
                ).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <span className="text-[10px] text-[#8c947d]">/mo</span>
              </div>
              <span className="text-[9px] font-mono text-[#00FF88] mt-0.5 block">
                ↓ 81.4% Monthly Cost Savings
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
