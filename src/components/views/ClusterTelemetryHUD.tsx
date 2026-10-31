import React, { useState } from 'react';
import { Cpu, Zap, Thermometer, HardDrive, RefreshCw, Layers, ShieldCheck, Gauge, Server, Activity } from 'lucide-react';
import { GPUMetric } from '../../types/orchestration';
import { SegmentedVRAMBar } from '../common/SegmentedVRAMBar';

interface ClusterTelemetryHUDProps {
  gpus: GPUMetric[];
  onTriggerGC: (gpuId: string) => void;
  onSimulateLoad: (gpuId: string, deltaGB: number) => void;
}

export const ClusterTelemetryHUD: React.FC<ClusterTelemetryHUDProps> = ({
  gpus,
  onTriggerGC,
  onSimulateLoad
}) => {
  const [selectedGpuId, setSelectedGpuId] = useState<string>(gpus[0]?.id || 'gpu-0');
  const activeGpu = gpus.find((g) => g.id === selectedGpuId) || gpus[0];

  // Aggregate stats across cluster
  const totalAllocatedVRAM = gpus.reduce((acc, g) => acc + g.vramAllocatedGB, 0);
  const totalCapacityVRAM = gpus.reduce((acc, g) => acc + g.vramTotalGB, 0);
  const totalPowerWatts = gpus.reduce((acc, g) => acc + g.powerDrawWatts, 0);
  const totalPowerCapWatts = gpus.reduce((acc, g) => acc + g.powerMaxWatts, 0);
  const avgTensorCoreUtil = gpus.reduce((acc, g) => acc + g.tensorCoreUtilPct, 0) / gpus.length;

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
      {/* HUD Header Bar: Cluster Top-Level Vitals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-hud p-3.5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between text-[#8c947d] text-[10px] font-mono uppercase mb-1">
            <span>Cluster VRAM Pool</span>
            <HardDrive className="w-3.5 h-3.5 text-[#76B900]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#e0e1f2] tabular-nums">
            {totalAllocatedVRAM.toFixed(1)} <span className="text-xs text-[#8c947d]">/ {totalCapacityVRAM.toFixed(1)} GB</span>
          </div>
          <div className="text-[10px] font-mono text-[#00FF88] mt-1">
            {((totalAllocatedVRAM / totalCapacityVRAM) * 100).toFixed(1)}% Cluster Allocation
          </div>
        </div>

        <div className="glass-hud p-3.5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between text-[#8c947d] text-[10px] font-mono uppercase mb-1">
            <span>Tensor Core Utilization</span>
            <Gauge className="w-3.5 h-3.5 text-[#00D2FF]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#e0e1f2] tabular-nums">
            {avgTensorCoreUtil.toFixed(1)}%
          </div>
          <div className="text-[10px] font-mono text-[#00D2FF] mt-1">
            FP8 GEMM Turbo active
          </div>
        </div>

        <div className="glass-hud p-3.5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between text-[#8c947d] text-[10px] font-mono uppercase mb-1">
            <span>Total Cluster Power</span>
            <Zap className="w-3.5 h-3.5 text-[#E06C75]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#e0e1f2] tabular-nums">
            {totalPowerWatts} <span className="text-xs text-[#8c947d]">/ {totalPowerCapWatts} W</span>
          </div>
          <div className="text-[10px] font-mono text-[#8c947d] mt-1">
            SXM5 High-Efficiency Target
          </div>
        </div>

        <div className="glass-hud p-3.5 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between text-[#8c947d] text-[10px] font-mono uppercase mb-1">
            <span>NVLink Interconnect</span>
            <Activity className="w-3.5 h-3.5 text-[#00FF88]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#00FF88] tabular-nums">
            896.0 <span className="text-xs text-[#8c947d]">GB/s</span>
          </div>
          <div className="text-[10px] font-mono text-[#8c947d] mt-1">
            Full Mesh All-to-All
          </div>
        </div>
      </div>

      {/* Main Split: Left GPU Grid & Right Detailed Registry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: List of GPU Nodes with Dual-Track VRAM meters */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#e0e1f2]">
              Heterogeneous GPU Compute Nodes
            </h3>
            <span className="text-[11px] font-mono text-[#8c947d]">
              Click card to inspect Streaming Multiprocessors & Registers
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {gpus.map((gpu) => {
              const isSelected = gpu.id === selectedGpuId;
              const isCritical = (gpu.vramAllocatedGB / gpu.vramTotalGB) >= 0.92;

              return (
                <div
                  key={gpu.id}
                  onClick={() => setSelectedGpuId(gpu.id)}
                  className={`glass-hud p-4 rounded-[4px] border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#76B900]/70 bg-[#181D2A]'
                      : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-[1px] ${
                            isCritical ? 'bg-[#E06C75]' : 'bg-[#76B900]'
                          }`}
                        />
                        <h4 className="text-xs font-bold text-[#e0e1f2] font-mono">
                          {gpu.name}
                        </h4>
                        <span className="text-[10px] font-mono text-[#8c947d] px-1.5 py-0.5 bg-[#0B0D13] rounded-[2px] border border-[rgba(255,255,255,0.05)]">
                          {gpu.architecture.split('(')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-[#8c947d]">{gpu.throttleState}</span>
                      <span className="text-[#00FF88] font-semibold">{gpu.temperatureC}°C</span>
                    </div>
                  </div>

                  {/* Dual-Track Segmented VRAM Bar matching spec */}
                  <SegmentedVRAMBar
                    allocatedGB={gpu.vramAllocatedGB}
                    peakGB={gpu.vramPeakGB}
                    totalGB={gpu.vramTotalGB}
                    segmentsCount={45}
                  />

                  {/* Micro telemetry footer */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.05)] text-[10px] font-mono text-[#8c947d]">
                    <div>
                      CUDA Load: <strong className="text-[#e0e1f2]">{gpu.cudaCoreUtilPct.toFixed(1)}%</strong>
                    </div>
                    <div>
                      Tensor Util: <strong className="text-[#00D2FF]">{gpu.tensorCoreUtilPct.toFixed(1)}%</strong>
                    </div>
                    <div>
                      Power: <strong className="text-[#e0e1f2]">{gpu.powerDrawWatts}W</strong>
                    </div>
                    <div>
                      Paged KV Cache: <strong className="text-[#00FF88]">{gpu.kvCacheHitPct.toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Hardware Registry & Tactical Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-hud p-4 rounded-[4px] border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#76B900]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#e0e1f2]">
                  {activeGpu.name} Registry
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00FF88] bg-[rgba(118,185,0,0.12)] px-2 py-0.5 rounded-[2px] border border-[#76B900]/30">
                ACTIVE FOCUS
              </span>
            </div>

            {/* Tactical Telemetry Gauges */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-[#0B0D13] p-3 rounded-[3px] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] font-mono text-[#8c947d] uppercase">Thermals & Fan</div>
                <div className="text-base font-mono font-bold text-[#e0e1f2] mt-0.5 tabular-nums">
                  {activeGpu.temperatureC}°C <span className="text-xs text-[#8c947d]">/ {activeGpu.tempMaxC}°C</span>
                </div>
                <div className="text-[10px] font-mono text-[#8c947d] mt-1">
                  Fan Speed: {activeGpu.fanSpeedPct}% PWM
                </div>
              </div>

              <div className="bg-[#0B0D13] p-3 rounded-[3px] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] font-mono text-[#8c947d] uppercase">Bus & Interconnect</div>
                <div className="text-base font-mono font-bold text-[#00D2FF] mt-0.5 tabular-nums">
                  {activeGpu.nvLinkBandwidthGBs} GB/s
                </div>
                <div className="text-[10px] font-mono text-[#8c947d] mt-1 truncate">
                  {activeGpu.pcieGen}
                </div>
              </div>

              <div className="bg-[#0B0D13] p-3 rounded-[3px] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] font-mono text-[#8c947d] uppercase">PagedAttention KV Cache</div>
                <div className="text-base font-mono font-bold text-[#00FF88] mt-0.5 tabular-nums">
                  {activeGpu.kvCacheHitPct.toFixed(1)}% Hit
                </div>
                <div className="text-[10px] font-mono text-[#8c947d] mt-1">
                  Active Batches: {activeGpu.activeContextBatches}
                </div>
              </div>

              <div className="bg-[#0B0D13] p-3 rounded-[3px] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] font-mono text-[#8c947d] uppercase">SM Warp Occupancy</div>
                <div className="text-base font-mono font-bold text-[#e0e1f2] mt-0.5 tabular-nums">
                  132 / 132 SMs
                </div>
                <div className="text-[10px] font-mono text-[#76B900] mt-1">
                  Tensor Core Active: 100%
                </div>
              </div>
            </div>

            {/* CUDA Kernel Execution Register Table */}
            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c947d] block mb-2">
                Active CUDA Kernel Pipelines
              </span>

              <div className="bg-[#0B0D13] rounded-[3px] border border-[rgba(255,255,255,0.06)] p-2.5 font-mono text-[11px] flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(255,255,255,0.05)] text-[10px] text-[#8c947d]">
                  <span>KERNEL FUNCTION</span>
                  <span>GRID / BLOCK</span>
                  <span>TIME</span>
                </div>
                <div className="flex items-center justify-between text-[#00FF88]">
                  <span className="truncate max-w-[160px]">tensorrt_gemm_fp8_m4096</span>
                  <span className="text-[#8c947d] text-[10px]">1024x1 / 256</span>
                  <span className="tabular-nums">0.042ms</span>
                </div>
                <div className="flex items-center justify-between text-[#00D2FF]">
                  <span className="truncate max-w-[160px]">paged_attention_v2_kernel</span>
                  <span className="text-[#8c947d] text-[10px]">512x2 / 128</span>
                  <span className="tabular-nums">0.088ms</span>
                </div>
                <div className="flex items-center justify-between text-[#e0e1f2]">
                  <span className="truncate max-w-[160px]">rmsnorm_quant_nvfp4</span>
                  <span className="text-[#8c947d] text-[10px]">256x1 / 256</span>
                  <span className="tabular-nums">0.012ms</span>
                </div>
              </div>
            </div>

            {/* Tactical Control Actions */}
            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c947d]">
                Node Maintenance & Workload Simulator
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onTriggerGC(activeGpu.id)}
                  className="px-3 py-2 bg-[#181D2A] hover:bg-[#222838] border border-[rgba(255,255,255,0.08)] hover:border-[#76B900]/40 rounded-[3px] text-xs font-mono text-[#00FF88] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Flush KV Cache GC</span>
                </button>

                <button
                  onClick={() => onSimulateLoad(activeGpu.id, 2.5)}
                  className="px-3 py-2 bg-[#181D2A] hover:bg-[#222838] border border-[rgba(255,255,255,0.08)] hover:border-[#E06C75]/40 rounded-[3px] text-xs font-mono text-[#e0e1f2] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Push +2.5GB Batch</span>
                </button>
              </div>

              <button
                onClick={() => onSimulateLoad(activeGpu.id, -4.0)}
                className="w-full py-1.5 bg-[#0B0D13] hover:bg-[#181D2A] border border-[rgba(255,255,255,0.05)] rounded-[3px] text-[10px] font-mono text-[#8c947d] hover:text-[#e0e1f2] transition-colors"
              >
                Release Memory Allocation (-4.0 GB)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
