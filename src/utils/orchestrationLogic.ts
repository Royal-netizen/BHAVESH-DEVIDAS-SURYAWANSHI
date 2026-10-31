/**
 * Pure business logic for the AI Orchestration Workstation Suite
 */

export interface VRAMStatus {
  allocatedPct: number;
  isCritical: boolean;
  freeGB: number;
}

export function computeVRAMStatus(allocatedGB: number, totalGB: number): VRAMStatus {
  if (totalGB <= 0) {
    return { allocatedPct: 0, isCritical: false, freeGB: 0 };
  }
  const allocatedPct = (allocatedGB / totalGB) * 100;
  const isCritical = allocatedPct >= 92.0;
  const freeGB = Math.max(0, totalGB - allocatedGB);
  return {
    allocatedPct: parseFloat(allocatedPct.toFixed(1)),
    isCritical,
    freeGB: parseFloat(freeGB.toFixed(1))
  };
}

export function computeTotalPipelineLatency(latencies: number[]): number {
  return latencies.reduce((acc, l) => acc + (l > 0 ? l : 0), 0);
}

export function computeHybridCostComparison(
  monthlyVolumeM: number,
  inputRatio = 0.6,
  outputRatio = 0.4
) {
  const inputVol = monthlyVolumeM * inputRatio;
  const outputVol = monthlyVolumeM * outputRatio;

  // Pure Claude 3.5: $3.00 / 1M input, $15.00 / 1M output
  const pureClaudeCost = inputVol * 3.0 + outputVol * 15.0;

  // Pure GPT-4o: $2.50 / 1M input, $10.00 / 1M output
  const pureOpenAICost = inputVol * 2.5 + outputVol * 10.0;

  // Hybrid Orchestration (70% local TensorRT-LLM at $0.12/$0.28, 15% Claude, 15% GPT-4o)
  const localCost = (inputVol * 0.12 + outputVol * 0.28) * 0.7;
  const hybridCost = localCost + pureClaudeCost * 0.15 + pureOpenAICost * 0.15;

  const baselineMax = Math.max(pureClaudeCost, pureOpenAICost);
  const savingsPct = baselineMax > 0 ? ((baselineMax - hybridCost) / baselineMax) * 100 : 0;

  return {
    pureClaudeCost: Math.round(pureClaudeCost),
    pureOpenAICost: Math.round(pureOpenAICost),
    hybridCost: Math.round(hybridCost),
    savingsPct: parseFloat(savingsPct.toFixed(1))
  };
}
