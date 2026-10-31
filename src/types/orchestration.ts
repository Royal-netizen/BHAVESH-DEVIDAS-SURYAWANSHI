export type AgentType = 'nvidia' | 'claude' | 'openai' | 'system';

export interface AgentInfo {
  id: string;
  name: string;
  type: AgentType;
  model: string;
  role: string;
  status: 'idle' | 'generating' | 'tool_call' | 'verifying' | 'completed' | 'error';
  tokenVelocity: number; // tokens/sec
  tokensGenerated: number;
  totalTokens: number;
  latencyMs: number;
  ttftMs: number; // Time to First Token
  temperature: number;
  topP: number;
  maxTokens: number;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
}

export interface DAGNode {
  id: string;
  label: string;
  agentType: AgentType;
  model: string;
  stage: string;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed';
  inputs: string[];
  outputType: string;
  latencyMs: number;
  tokensProcessed: number;
  summary: string;
  details?: Record<string, any>;
}

export interface StreamChunk {
  agentId: string;
  timestamp: number;
  content: string;
  isCode?: boolean;
  language?: string;
}

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  agentType: AgentType;
  agentName: string;
  level: 'INFO' | 'CUDA' | 'KERNEL' | 'TOOL' | 'TRACE' | 'WARN' | 'ERROR';
  message: string;
  payload?: Record<string, any>;
  durationMs?: number;
}

export interface GPUMetric {
  id: string;
  name: string;
  architecture: string;
  vramAllocatedGB: number;
  vramPeakGB: number;
  vramTotalGB: number;
  cudaCoreUtilPct: number;
  tensorCoreUtilPct: number;
  powerDrawWatts: number;
  powerMaxWatts: number;
  temperatureC: number;
  tempMaxC: number;
  fanSpeedPct: number;
  nvLinkBandwidthGBs: number;
  pcieGen: string;
  throttleState: 'Nominal' | 'Thermal Throttle' | 'Power Cap' | 'P0 Full Boost';
  kvCacheHitPct: number;
  activeContextBatches: number;
}

export interface BenchmarkMetrics {
  modelName: string;
  agentType: AgentType;
  avgTTFTMs: number;
  avgTokenVelocity: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
  totalTokensServed: number;
  cacheHitRatio: number;
}

export interface NodeLatencyCell {
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  latencyMs: number;
  bandwidthGBs: number;
  protocol: 'NVLink 4.0' | 'NVLink-C2C' | 'PCIe 5.0' | 'Infiniband 400G' | 'HTTPS / WAN';
  packetLossPct: number;
  isBottleneck: boolean;
}

export interface LatencyBottleneck {
  sourceName: string;
  targetName: string;
  latencyMs: number;
  impactScore: number; // 0-100%
  protocol: string;
  recommendation: string;
}
