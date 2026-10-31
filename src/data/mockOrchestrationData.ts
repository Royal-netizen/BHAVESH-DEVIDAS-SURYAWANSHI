import { AgentInfo, DAGNode, GPUMetric, TerminalLogEntry, BenchmarkMetrics, NodeLatencyCell } from '../types/orchestration';

export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'agent-nvidia',
    name: 'NVIDIA AI Ultra',
    type: 'nvidia',
    model: 'TensorRT-LLM Llama-3.3-70B-FP8 (CUDA 12.6)',
    role: 'Local High-Throughput Kernel Execution & Quantitative Verification',
    status: 'idle',
    tokenVelocity: 218.4,
    tokensGenerated: 1420,
    totalTokens: 18450,
    latencyMs: 92,
    ttftMs: 64,
    temperature: 0.1,
    topP: 0.9,
    maxTokens: 4096,
    color: '#76B900',
    bgColor: 'rgba(118, 185, 0, 0.12)',
    borderColor: 'rgba(118, 185, 0, 0.45)',
    glowColor: 'rgba(118, 185, 0, 0.35)'
  },
  {
    id: 'agent-claude',
    name: 'Claude 3.5 Sonnet',
    type: 'claude',
    model: 'claude-3-5-sonnet-20241022',
    role: 'Hierarchical Cognitive Reasoning & Dynamic Tool Orchestration',
    status: 'idle',
    tokenVelocity: 88.5,
    tokensGenerated: 2140,
    totalTokens: 24190,
    latencyMs: 345,
    ttftMs: 290,
    temperature: 0.2,
    topP: 0.95,
    maxTokens: 8192,
    color: '#E06C75',
    bgColor: 'rgba(224, 108, 117, 0.12)',
    borderColor: 'rgba(224, 108, 117, 0.40)',
    glowColor: 'rgba(224, 108, 117, 0.35)'
  },
  {
    id: 'agent-openai',
    name: 'ChatGPT-4o',
    type: 'openai',
    model: 'gpt-4o-2024-11-20',
    role: 'Multi-Modal Extraction, JSON Schema Synthesis & API Translation',
    status: 'idle',
    tokenVelocity: 134.2,
    tokensGenerated: 1890,
    totalTokens: 19800,
    latencyMs: 184,
    ttftMs: 165,
    temperature: 0.3,
    topP: 0.95,
    maxTokens: 4096,
    color: '#00D2FF',
    bgColor: 'rgba(0, 210, 255, 0.12)',
    borderColor: 'rgba(0, 210, 255, 0.40)',
    glowColor: 'rgba(0, 210, 255, 0.35)'
  }
];

export interface OrchestrationPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  parameters: string;
  routingMode: 'Speculative Consensus' | 'Parallel DAG' | 'Cascaded Fallback' | 'Self-Refining Loop';
  initialNodes: DAGNode[];
  streamOutputs: Record<string, string>;
}

export const WORKFLOW_PRESETS: OrchestrationPreset[] = [
  {
    id: 'preset-quant-risk',
    name: 'Quantitative Risk & CUDA Monte-Carlo Factor Engine',
    category: 'High-Frequency Finance & Simulation',
    description: 'Claude analyzes macro liquidity shocks, GPT-4o extracts structured 10-K filings, NVIDIA TensorRT-LLM runs 1,000,000 CUDA Monte Carlo path simulations.',
    prompt: `Analyze portfolio volatility under a 75bps sudden interest rate shock across G10 sovereign debt. Extract debt maturity schedules, construct Black-Scholes risk surface, and compute 99% VaR over 1,000,000 Monte Carlo paths using local TensorRT FP8 kernel.`,
    parameters: `--temperature 0.15 --top_p 0.92 --fp8_gemm enabled --streams 8`,
    routingMode: 'Parallel DAG',
    initialNodes: [
      {
        id: 'node-dispatch',
        label: 'Task Ingestion & Vector Router',
        agentType: 'system',
        model: 'Dispatcher-v3.2',
        stage: 'Stage 0: Prompt Partitioning',
        status: 'completed',
        inputs: ['User Query Payload'],
        outputType: 'Partitioned Sub-DAG',
        latencyMs: 14,
        tokensProcessed: 120,
        summary: 'Decomposed request into macro reasoning, tabular filings extraction, and vectorized CUDA kernel generation.'
      },
      {
        id: 'node-claude-reasoning',
        label: 'Cognitive Macro Risk Tree',
        agentType: 'claude',
        model: 'claude-3-5-sonnet',
        stage: 'Stage 1: Multi-Step Decomposition',
        status: 'running',
        inputs: ['Partitioned Sub-DAG'],
        outputType: 'Structured Factor Covariance Matrix',
        latencyMs: 342,
        tokensProcessed: 840,
        summary: 'Identified yield curve steepening contagion across US Treasuries, Bunds, and JGBs. Formulated Cholesky decomposition priors.'
      },
      {
        id: 'node-openai-extract',
        label: 'Structured Filings & SEC Extraction',
        agentType: 'openai',
        model: 'gpt-4o',
        stage: 'Stage 2: Schema Conformance',
        status: 'running',
        inputs: ['node-claude-reasoning'],
        outputType: 'Pydantic Strict JSON Schema',
        latencyMs: 178,
        tokensProcessed: 610,
        summary: 'Parsed 42 debt tranches and duration risk tables into strict validated JSON with zero parse errors.'
      },
      {
        id: 'node-nvidia-compute',
        label: 'TensorRT CUDA Kernel Execution',
        agentType: 'nvidia',
        model: 'TensorRT-LLM FP8',
        stage: 'Stage 3: High-Throughput Matrix Compute',
        status: 'pending',
        inputs: ['node-openai-extract', 'node-claude-reasoning'],
        outputType: 'Compiled CUDA Tensor & VaR Float64',
        latencyMs: 68,
        tokensProcessed: 1120,
        summary: 'Dispatched 8 CUDA streams on NVIDIA H100 SXM5. Simulated 1M paths in 42.1ms (Speedup: 18.4x vs vLLM FP16).'
      }
    ],
    streamOutputs: {
      'agent-claude': `### Cognitive Reasoning & Factor Covariance Formulation
1. **Macro Transmission Channel Evaluation**:
   - Shock magnitude: $\\Delta r = +75\\text{ bps}$ across G10 yield curve anchors.
   - Primary contagion: Liquidity premium expansion in 5Y-10Y maturities; swap spread compression of $14.2\\text{ bps}$.
   - Cross-asset correlation shift: Equity volatility $\\rho(\\text{SPX}, \\text{10Y}) = -0.42 \\to +0.18$.

2. **Cholesky Covariance Matrix Parameterization**:
   \`\`\`python
   # Prior volatility vector (sigma_bps)
   vol_prior = [18.4, 24.1, 31.8, 42.5]
   # Correlation matrix conditioned on high-stress regime
   correlation_matrix = np.array([
       [1.00, 0.89, 0.74, 0.62],
       [0.89, 1.00, 0.88, 0.79],
       [0.74, 0.88, 1.00, 0.91],
       [0.62, 0.79, 0.91, 1.00]
   ])
   \`\`\`
3. **Execution Directive Passed to Dispatcher**:
   Forwarding schema requirements to ChatGPT-4o for debt maturity schedule validation.`,
      
      'agent-openai': `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "pipeline": "quant_risk_g10_sovereign",
  "execution_mode": "strict_validation",
  "assets": [
    { "ticker": "UST_2Y", "duration": 1.94, "dv01": 19400.0, "spread_shock_bps": 48.0 },
    { "ticker": "UST_5Y", "duration": 4.62, "dv01": 46200.0, "spread_shock_bps": 75.0 },
    { "ticker": "UST_10Y", "duration": 8.81, "dv01": 88100.0, "spread_shock_bps": 68.0 },
    { "ticker": "UST_30Y", "duration": 17.40, "dv01": 174000.0, "spread_shock_bps": 52.0 }
  ],
  "monte_carlo_spec": {
    "paths": 1000000,
    "timesteps": 252,
    "precision": "FP8_E4M3",
    "cuda_stream_count": 8,
    "seed": 948201
  }
}`,

      'agent-nvidia': `// NVIDIA TensorRT-LLM CUDA Kernel Dispatched
// Hardware: 8x NVIDIA H100 SXM5 80GB (NVLink 4.0: 896 GB/s)
// Kernel: __global__ void monte_carlo_g10_paths_fp8<<<grid, block, smem, stream>>>

[CUDA] Allocated 1,000,000 x 252 float4 state tensors in HBM3 VRAM: 1.008 GB
[CUDA] FP8 Tensor Core Gemm GEMV throughput: 742.6 TFLOPS (94.2% peak theoretical)
[CUDA] Execution time: 42.18 ms across 8 streams (latency: 0.042 ms/path)
================================================================================
FINAL RISK ASSESSMENT SUMMARY:
- Portfolio Base Value:      $240,000,000.00 USD
- 1-Day 99.0% VaR:          -$8,421,800.00 USD (-3.51%)
- 1-Day 99.9% Expected Shortfall: -$12,180,450.00 USD (-5.08%)
- Maximum Drawdown Horizon:  Trading Day 14 (Liquidity cluster dry-up)
- Cache Hit Status:          100% PagedAttention block reuse achieved
================================================================================`
    }
  },
  {
    id: 'preset-code-verification',
    name: 'Multi-Modal Autonomous Code Synthesis & Formal Invariant Prover',
    category: 'Systems Architecture & Compilers',
    description: 'Claude architecturally designs lock-free ring buffer, GPT-4o formats unit test harness and Rust FFI, NVIDIA TensorRT validates assembly and memory invariants.',
    prompt: `Synthesize a high-throughput lock-free ring buffer in C++23 with memory_order_acquire/release fences. Prove absence of ABA hazards, emit x86_64 and ARM64 assembly disassembly, and verify cacheline padding to avoid false sharing.`,
    parameters: `--temperature 0.05 --top_p 0.88 --asm_opt O3 --verify_invariants`,
    routingMode: 'Speculative Consensus',
    initialNodes: [
      {
        id: 'node-dispatch-code',
        label: 'Task Ingestion & AST Decomposer',
        agentType: 'system',
        model: 'Dispatcher-v3.2',
        stage: 'Stage 0: Spec Breakdown',
        status: 'completed',
        inputs: ['C++23 Prompt'],
        outputType: 'Formal Spec Tree',
        latencyMs: 11,
        tokensProcessed: 95,
        summary: 'Extracted cache alignment, lock-free concurrency barriers, and ABA mitigation requirements.'
      },
      {
        id: 'node-claude-impl',
        label: 'Algorithmic Design & Barrier Placement',
        agentType: 'claude',
        model: 'claude-3-5-sonnet',
        stage: 'Stage 1: Algorithmic Architecture',
        status: 'completed',
        inputs: ['Formal Spec Tree'],
        outputType: 'C++23 Lock-Free Implementation',
        latencyMs: 295,
        tokensProcessed: 910,
        summary: 'Implemented std::atomic head/tail with alignas(hardware_destructive_interference_size) to eliminate false sharing.'
      },
      {
        id: 'node-openai-test',
        label: 'Test Suite & Rust FFI Binding',
        agentType: 'openai',
        model: 'gpt-4o',
        stage: 'Stage 2: FFI & Property Testing',
        status: 'completed',
        inputs: ['node-claude-impl'],
        outputType: 'GoogleTest & Criterion Benchmark Harness',
        latencyMs: 165,
        tokensProcessed: 540,
        summary: 'Generated 24 concurrency stress test scenarios with thread sanitizers and ThreadSanitizer flags.'
      },
      {
        id: 'node-nvidia-verify',
        label: 'Invariant Verification & CUDA Kernel Interop',
        agentType: 'nvidia',
        model: 'TensorRT-LLM FP8',
        stage: 'Stage 3: Low-Level Proof & JIT Assembly',
        status: 'completed',
        inputs: ['node-openai-test', 'node-claude-impl'],
        outputType: 'Machine Code Verification & Benchmark Result',
        latencyMs: 58,
        tokensProcessed: 870,
        summary: 'Proved memory fence sequence: cmpxchg16b with acquire-release guarantees 0 memory races across 10B operations.'
      }
    ],
    streamOutputs: {
      'agent-claude': `\`\`\`cpp
#include <atomic>
#include <new>
#include <optional>
#include <concepts>

#if defined(__cpp_lib_hardware_interference_size)
    using std::hardware_destructive_interference_size;
#else
    constexpr size_t hardware_destructive_interference_size = 64;
#endif

template <typename T, size_t Capacity>
requires (Capacity > 0 && (Capacity & (Capacity - 1)) == 0) // Power of 2
class SPSCQueue {
private:
    static constexpr size_t IndexMask = Capacity - 1;
    alignas(hardware_destructive_interference_size) std::atomic<size_t> tail_{0};
    alignas(hardware_destructive_interference_size) size_t cached_head_{0};
    
    alignas(hardware_destructive_interference_size) std::atomic<size_t> head_{0};
    alignas(hardware_destructive_interference_size) size_t cached_tail_{0};
    
    alignas(hardware_destructive_interference_size) T buffer_[Capacity];

public:
    template <typename... Args>
    bool emplace(Args&&... args) noexcept {
        const size_t tail = tail_.load(std::memory_order_relaxed);
        if (tail - cached_head_ >= Capacity) {
            cached_head_ = head_.load(std::memory_order_acquire);
            if (tail - cached_head_ >= Capacity) return false; // Buffer full
        }
        new (&buffer_[tail & IndexMask]) T(std::forward<Args>(args)...);
        tail_.store(tail + 1, std::memory_order_release);
        return true;
    }
};
\`\`\``,
      'agent-openai': `\`\`\`rust
// Rust FFI bindings and proptest concurrency verification harness
use std::sync::Arc;
use std::thread;

#[repr(C)]
pub struct SPSCQueueOpaque {
    _private: [u8; 0],
}

extern "C" {
    fn spsc_create(capacity: usize) -> *mut SPSCQueueOpaque;
    fn spsc_push(queue: *mut SPSCQueueOpaque, item: u64) -> bool;
    fn spsc_pop(queue: *mut SPSCQueueOpaque, out_item: *mut u64) -> bool;
    fn spsc_destroy(queue: *mut SPSCQueueOpaque);
}

#[test]
fn test_spsc_stress_10m_items() {
    let q = unsafe { spsc_create(65536) };
    let q_ptr = q as usize;
    
    let producer = thread::spawn(move || {
        let raw = q_ptr as *mut SPSCQueueOpaque;
        for i in 0..10_000_000u64 {
            while !unsafe { spsc_push(raw, i) } {
                std::hint::spin_loop();
            }
        }
    });
    // Verifies 0 dropped packets and zero atomic contention
}
\`\`\``,
      'agent-nvidia': `// NVIDIA TensorRT Hardware Telemetry & Disassembly Verification
// Target architecture: x86_64 AVX-512 / CUDA Unified Memory Page Invalidation Check

[DISASSEMBLY // hot loop spsc_push]
  mov     rax, QWORD PTR [rdi]        ; load tail_ relaxed
  mov     rcx, QWORD PTR [rdi+64]     ; load cached_head_
  sub     rax, rcx
  cmp     rax, 65536
  jae     .L_cache_refresh
  lea     rdx, [rax+1]
  mov     QWORD PTR [rsi], r8         ; write payload to buffer slot
  mov     QWORD PTR [rdi], rdx        ; release tail store
  ret

[VERIFICATION ENGINE RESULT]
- Memory Order Safety:  Strict Acquire-Release verified (Zero Sequentially-Consistent overhead)
- False Sharing Check:  Verified 64-byte spacing between tail_ and head_ (0 L1D cacheline bounces)
- Peak Throughput:      248.6 Million elements/sec on single AMD EPYC 9654 core`
    }
  },
  {
    id: 'preset-bio-docking',
    name: 'Bio-Molecular Structure & Ligand Affinity Optimization',
    category: 'Biochemical Computation',
    description: 'Claude formulates hydrogen bond donor/acceptor constraints, GPT-4o parses RCSB PDB structures, NVIDIA TensorRT evaluates electrostatic surface potential.',
    prompt: `Analyze the binding pocket of SARS-CoV-2 Main Protease (Mpro, PDB: 6LU7) complexed with N3 inhibitor. Identify catalytic dyad His41-Cys145 interactions, calculate solvent-accessible surface area (SASA), and score 5 candidate small-molecule scaffolds.`,
    parameters: `--pocket_radius 12.0A --ff_forcefield amber14sb --cuda_precision tf32`,
    routingMode: 'Parallel DAG',
    initialNodes: [
      {
        id: 'node-dispatch-bio',
        label: 'PDB Ingestion & Coordinate Validator',
        agentType: 'system',
        model: 'Dispatcher-v3.2',
        stage: 'Stage 0: Structure Validation',
        status: 'completed',
        inputs: ['RCSB PDB: 6LU7'],
        outputType: 'Atom Coordinate Tensor',
        latencyMs: 18,
        tokensProcessed: 140,
        summary: 'Verified 306 amino acid residues; resolved 2 alternate conformations for residue Ser46.'
      },
      {
        id: 'node-claude-dyad',
        label: 'Catalytic Dyad Mechanism & Pharmacophore',
        agentType: 'claude',
        model: 'claude-3-5-sonnet',
        stage: 'Stage 1: Pharmacophore Mapping',
        status: 'completed',
        inputs: ['Atom Coordinate Tensor'],
        outputType: 'Pharmacophore Spatial Constraints',
        latencyMs: 310,
        tokensProcessed: 780,
        summary: 'Calculated Cys145-Sγ to His41-Nε2 distance at 3.82Å. Mapped electrophilic warhead attack angle at 104.5°.'
      },
      {
        id: 'node-openai-sdf',
        label: 'Ligand Conformer SDF & Property Profiling',
        agentType: 'openai',
        model: 'gpt-4o',
        stage: 'Stage 2: Cheminformatics Conformer Generation',
        status: 'completed',
        inputs: ['node-claude-dyad'],
        outputType: 'SMILES & Conformer Ensembles',
        latencyMs: 195,
        tokensProcessed: 670,
        summary: 'Generated 50 low-energy 3D conformers for each candidate scaffold adhering to Lipinski Rule of 5.'
      },
      {
        id: 'node-nvidia-grid',
        label: 'CUDA Poisson-Boltzmann Electrostatics & Scoring',
        agentType: 'nvidia',
        model: 'TensorRT-LLM FP8',
        stage: 'Stage 3: Molecular Mechanics & Docking Score',
        status: 'completed',
        inputs: ['node-openai-sdf', 'node-claude-dyad'],
        outputType: 'Binding Free Energy (ΔG kcal/mol)',
        latencyMs: 74,
        tokensProcessed: 990,
        summary: 'Scored top candidate Scaffold-04 with binding affinity ΔG = -11.4 kcal/mol (Kd = 4.2 nM).'
      }
    ],
    streamOutputs: {
      'agent-claude': `### Catalytic Dyad Mechanism & Pharmacophore Constraints
**Target**: SARS-CoV-2 Mpro (3CLpro, Cysteine Protease)
- **Catalytic Dyad**: His41 (base) + Cys145 (nucleophile).
- **Substrate Binding Subsites**:
  - $S_1$ pocket: Absolute requirement for Gln/lactam ring; Glu166 forms critical bi-dentate H-bonds.
  - $S_2$ pocket: Deep hydrophobic subsite accommodated by Leu/Phe side chains.
  - $S_4$ pocket: Exposed solvent channel compatible with polar aromatic substitutions.

**Geometric Warhead Anchor**:
\`\`\`text
Cys145(S-gamma) --- [1.81 A covalent bond] ---> Carbonyl C=O
His41(N-epsilon2) --- [2.85 A H-bond] --------> Oxyanion hole (Gly143/Cys145 backbone NH)
\`\`\``,
      'agent-openai': `{
  "target": "6LU7_Mpro",
  "candidates": [
    {
      "id": "SCAFFOLD_04",
      "smiles": "CC(C)CC(NC(=O)C(Cc1ccccc1)NC(=O)OCC2CCOC2)C(=O)C=O",
      "mw": 489.6,
      "tpsa": 114.2,
      "logP": 2.14,
      "hbd": 3,
      "hba": 6,
      "rule_of_five_violations": 0
    },
    {
      "id": "SCAFFOLD_02",
      "smiles": "O=C(NCc1ccccc1)C1CCCN1C(=O)C(CC(C)C)NC(=O)C=C",
      "mw": 415.5,
      "tpsa": 84.1,
      "logP": 2.85,
      "hbd": 2,
      "hba": 4,
      "rule_of_five_violations": 0
    }
  ]
}`,
      'agent-nvidia': `// NVIDIA CUDA Fast Electrostatic Potential (APBS / Poisson-Boltzmann)
// GPU Grid: 128x128x128 0.33A Spacing (16.2 Million Field Points)

[CUDA KERNEL: compute_electrostatic_grid_sm90]
  Grid computation time:   8.41 ms (4.8x faster than CPU OpenMP 64-threads)
  Poisson-Boltzmann error: < 0.0012 kT/e
================================================================================
BINDING AFFINITY DOCKING MATRIX:
- Scaffold-04:  ΔG = -11.42 kcal/mol  |  Predicted Kd =  4.2 nM  | Rank #1 (Selected)
- Scaffold-02:  ΔG =  -9.84 kcal/mol  |  Predicted Kd = 58.1 nM  | Rank #2
- Scaffold-01:  ΔG =  -8.15 kcal/mol  |  Predicted Kd = 1.12 uM  | Rank #3
- Scaffold-05:  ΔG =  -7.62 kcal/mol  |  Predicted Kd = 2.45 uM  | Rank #4
- Scaffold-03:  ΔG =  -6.90 kcal/mol  |  Predicted Kd = 8.80 uM  | Rank #5
================================================================================`
    }
  }
];

export const INITIAL_GPUS: GPUMetric[] = [
  {
    id: 'gpu-0',
    name: 'GPU 0: NVIDIA H100 SXM5 80GB',
    architecture: 'Hopper GH100 (SXM5 Form Factor)',
    vramAllocatedGB: 74.8,
    vramPeakGB: 77.2,
    vramTotalGB: 80.0,
    cudaCoreUtilPct: 91.5,
    tensorCoreUtilPct: 96.2,
    powerDrawWatts: 585,
    powerMaxWatts: 700,
    temperatureC: 64,
    tempMaxC: 84,
    fanSpeedPct: 78,
    nvLinkBandwidthGBs: 896.0,
    pcieGen: 'NVLink 4.0 (Bi-directional)',
    throttleState: 'P0 Full Boost',
    kvCacheHitPct: 94.6,
    activeContextBatches: 32
  },
  {
    id: 'gpu-1',
    name: 'GPU 1: NVIDIA H100 SXM5 80GB',
    architecture: 'Hopper GH100 (SXM5 Form Factor)',
    vramAllocatedGB: 71.4,
    vramPeakGB: 75.1,
    vramTotalGB: 80.0,
    cudaCoreUtilPct: 88.0,
    tensorCoreUtilPct: 92.4,
    powerDrawWatts: 542,
    powerMaxWatts: 700,
    temperatureC: 62,
    tempMaxC: 84,
    fanSpeedPct: 72,
    nvLinkBandwidthGBs: 896.0,
    pcieGen: 'NVLink 4.0 (Bi-directional)',
    throttleState: 'P0 Full Boost',
    kvCacheHitPct: 93.8,
    activeContextBatches: 28
  },
  {
    id: 'gpu-2',
    name: 'GPU 2: NVIDIA GH200 Grace Hopper 480GB',
    architecture: 'Grace Hopper (480GB LPDDR5X + 96GB HBM3)',
    vramAllocatedGB: 89.2,
    vramPeakGB: 94.0,
    vramTotalGB: 96.0,
    cudaCoreUtilPct: 94.8,
    tensorCoreUtilPct: 98.1,
    powerDrawWatts: 780,
    powerMaxWatts: 1000,
    temperatureC: 69,
    tempMaxC: 85,
    fanSpeedPct: 84,
    nvLinkBandwidthGBs: 900.0,
    pcieGen: 'NVLink-C2C (900 GB/s coherency)',
    throttleState: 'P0 Full Boost',
    kvCacheHitPct: 96.8,
    activeContextBatches: 64
  },
  {
    id: 'gpu-3',
    name: 'GPU 3: NVIDIA L40S 48GB Ada',
    architecture: 'Ada Lovelace AD102 (PCIe Gen5)',
    vramAllocatedGB: 38.6,
    vramPeakGB: 41.2,
    vramTotalGB: 48.0,
    cudaCoreUtilPct: 74.2,
    tensorCoreUtilPct: 81.0,
    powerDrawWatts: 285,
    powerMaxWatts: 350,
    temperatureC: 58,
    tempMaxC: 82,
    fanSpeedPct: 65,
    nvLinkBandwidthGBs: 128.0,
    pcieGen: 'PCIe 5.0 x16 (64 GB/s)',
    throttleState: 'Nominal',
    kvCacheHitPct: 89.4,
    activeContextBatches: 16
  }
];

export const INITIAL_LOGS: TerminalLogEntry[] = [
  {
    id: 'log-01',
    timestamp: '10:02:14.281',
    agentType: 'system',
    agentName: 'ORCHESTRATOR',
    level: 'INFO',
    message: 'Workstation cluster connected to 4 heterogeneous GPU nodes and 2 remote API endpoints.',
    payload: { cluster_id: 'dgx-h100-alpha', healthy_nodes: 4, api_gateways: ['anthropic-v1', 'openai-v1'] }
  },
  {
    id: 'log-02',
    timestamp: '10:02:14.412',
    agentType: 'nvidia',
    agentName: 'NVIDIA AI Ultra',
    level: 'CUDA',
    message: 'TensorRT-LLM initialized: Llama-3.3-70B-FP8 loaded in 74.8 GB VRAM. PagedAttention blocks ready.',
    payload: { kv_cache_tokens: 32768, block_size: 64, tensor_parallel: 2 }
  },
  {
    id: 'log-03',
    timestamp: '10:02:15.019',
    agentType: 'claude',
    agentName: 'Claude 3.5 Sonnet',
    level: 'TRACE',
    message: 'Cognitive tree session initialized with system prompt: Multi-Agent Quantitative Architecture.',
    payload: { context_window: 200000, temperature: 0.2, tools_declared: 6 }
  },
  {
    id: 'log-04',
    timestamp: '10:02:15.228',
    agentType: 'openai',
    agentName: 'ChatGPT-4o',
    level: 'TRACE',
    message: 'OpenAI HTTP/2 streaming pipeline active. JSON Schema verification strict mode enabled.',
    payload: { endpoint: 'api.openai.com/v1/chat/completions', stream: true, schema_type: 'strict' }
  },
  {
    id: 'log-05',
    timestamp: '10:02:16.890',
    agentType: 'claude',
    agentName: 'Claude 3.5 Sonnet',
    level: 'TOOL',
    message: 'Dispatched tool call: extract_debt_maturity_schedules(issuer="US_TREASURY", tranches=4)',
    durationMs: 84,
    payload: { tool: 'extract_debt_maturity_schedules', status: '200 OK' }
  },
  {
    id: 'log-06',
    timestamp: '10:02:17.104',
    agentType: 'openai',
    agentName: 'ChatGPT-4o',
    level: 'INFO',
    message: 'Structured JSON validation complete: 42 tranches parsed with 0 schema violations.',
    durationMs: 142,
    payload: { output_tokens: 610, validation_latency_ms: 12 }
  },
  {
    id: 'log-07',
    timestamp: '10:02:17.480',
    agentType: 'nvidia',
    agentName: 'NVIDIA AI Ultra',
    level: 'KERNEL',
    message: 'CUDA Kernel monte_carlo_g10_paths_fp8 completed on GPU 0-1. 1,000,000 paths in 42.18ms.',
    durationMs: 42,
    payload: { grid: [1024, 1, 1], block: [256, 1, 1], tflops: 742.6 }
  }
];

export const INITIAL_BENCHMARKS: BenchmarkMetrics[] = [
  {
    modelName: 'NVIDIA TensorRT-LLM (Llama-3.3-70B FP8)',
    agentType: 'nvidia',
    avgTTFTMs: 64,
    avgTokenVelocity: 218.4,
    p50LatencyMs: 88,
    p95LatencyMs: 124,
    p99LatencyMs: 168,
    inputCostPer1M: 0.12,
    outputCostPer1M: 0.28,
    totalTokensServed: 4125000,
    cacheHitRatio: 0.946
  },
  {
    modelName: 'Claude 3.5 Sonnet (20241022)',
    agentType: 'claude',
    avgTTFTMs: 290,
    avgTokenVelocity: 88.5,
    p50LatencyMs: 340,
    p95LatencyMs: 480,
    p99LatencyMs: 620,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    totalTokensServed: 2890000,
    cacheHitRatio: 0.812
  },
  {
    modelName: 'OpenAI ChatGPT-4o (2024-11-20)',
    agentType: 'openai',
    avgTTFTMs: 165,
    avgTokenVelocity: 134.2,
    p50LatencyMs: 195,
    p95LatencyMs: 310,
    p99LatencyMs: 440,
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    totalTokensServed: 3410000,
    cacheHitRatio: 0.765
  }
];

export interface ClusterNodeInfo {
  id: string;
  name: string;
  shortName: string;
  category: 'Local GPU' | 'Frontier Cloud API' | 'Orchestration Infrastructure';
  tier: string;
}

export const CLUSTER_HEATMAP_NODES: ClusterNodeInfo[] = [
  { id: 'gpu-0', name: 'GPU 0: NVIDIA H100 SXM5', shortName: 'GPU 0 (H100)', category: 'Local GPU', tier: 'SXM5 80GB' },
  { id: 'gpu-1', name: 'GPU 1: NVIDIA H100 SXM5', shortName: 'GPU 1 (H100)', category: 'Local GPU', tier: 'SXM5 80GB' },
  { id: 'gpu-2', name: 'GPU 2: GH200 Grace Hopper', shortName: 'GPU 2 (GH200)', category: 'Local GPU', tier: 'Grace 480GB' },
  { id: 'gpu-3', name: 'GPU 3: NVIDIA L40S Ada', shortName: 'GPU 3 (L40S)', category: 'Local GPU', tier: 'PCIe 48GB' },
  { id: 'claude-node', name: 'Anthropic Claude 3.5 Sonnet', shortName: 'Claude 3.5', category: 'Frontier Cloud API', tier: 'API us-east' },
  { id: 'openai-node', name: 'OpenAI ChatGPT-4o Gateway', shortName: 'ChatGPT-4o', category: 'Frontier Cloud API', tier: 'API us-west' },
  { id: 'dispatcher', name: 'Task Ingestion & Vector Router', shortName: 'Dispatcher', category: 'Orchestration Infrastructure', tier: 'Local Host' },
  { id: 'sink', name: 'Consensus & Output Sink', shortName: 'Consensus Sink', category: 'Orchestration Infrastructure', tier: 'Local Host' }
];

export function generateLatencyMatrix(jitterFactor = 1.0) {
  const cells: NodeLatencyCell[] = [];
  
  CLUSTER_HEATMAP_NODES.forEach((src) => {
    CLUSTER_HEATMAP_NODES.forEach((tgt) => {
      if (src.id === tgt.id) {
        cells.push({
          sourceId: src.id,
          sourceName: src.shortName,
          targetId: tgt.id,
          targetName: tgt.shortName,
          latencyMs: 0.05,
          bandwidthGBs: 3350,
          protocol: 'NVLink 4.0',
          packetLossPct: 0,
          isBottleneck: false
        });
        return;
      }

      const isBothGpus = src.category === 'Local GPU' && tgt.category === 'Local GPU';
      const isBothH100 = (src.id === 'gpu-0' || src.id === 'gpu-1') && (tgt.id === 'gpu-0' || tgt.id === 'gpu-1');
      const isGrace = src.id === 'gpu-2' || tgt.id === 'gpu-2';
      const isL40S = src.id === 'gpu-3' || tgt.id === 'gpu-3';
      const isCloudSrc = src.category === 'Frontier Cloud API';
      const isCloudTgt = tgt.category === 'Frontier Cloud API';

      let baseLatency = 2.0;
      let bandwidth = 100.0;
      let protocol: NodeLatencyCell['protocol'] = 'Infiniband 400G';
      let packetLoss = 0.0;

      if (isBothH100) {
        baseLatency = 0.85;
        bandwidth = 896.0;
        protocol = 'NVLink 4.0';
      } else if (isBothGpus && isGrace) {
        baseLatency = 1.15;
        bandwidth = 900.0;
        protocol = 'NVLink-C2C';
      } else if (isBothGpus && isL40S) {
        baseLatency = 4.8;
        bandwidth = 64.0;
        protocol = 'PCIe 5.0';
      } else if (isCloudSrc && isCloudTgt) {
        baseLatency = 345.0; // Cross cloud provider bottleneck
        bandwidth = 1.25;
        protocol = 'HTTPS / WAN';
        packetLoss = 0.02;
      } else if (isCloudSrc || isCloudTgt) {
        baseLatency = src.id === 'claude-node' || tgt.id === 'claude-node' ? 292.0 : 182.0;
        bandwidth = 2.5;
        protocol = 'HTTPS / WAN';
        packetLoss = 0.01;
      } else {
        baseLatency = 1.8;
        bandwidth = 400.0;
        protocol = 'Infiniband 400G';
      }

      // Apply subtle jitter
      const jitter = (Math.sin(src.id.charCodeAt(0) * 11 + tgt.id.charCodeAt(0) * 17) * 0.15 + 1.0) * jitterFactor;
      const latencyMs = parseFloat((baseLatency * jitter).toFixed(2));
      const isBottleneck = latencyMs >= 150.0;

      cells.push({
        sourceId: src.id,
        sourceName: src.shortName,
        targetId: tgt.id,
        targetName: tgt.shortName,
        latencyMs,
        bandwidthGBs: bandwidth,
        protocol,
        packetLossPct: packetLoss,
        isBottleneck
      });
    });
  });

  return cells;
}
