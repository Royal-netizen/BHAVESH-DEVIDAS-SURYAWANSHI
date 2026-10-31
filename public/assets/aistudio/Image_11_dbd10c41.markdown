---
name: AI Orchestration Workstation Suite
colors:
  surface: '#10131e'
  surface-dim: '#10131e'
  surface-bright: '#363945'
  surface-container-lowest: '#0b0e18'
  surface-container-low: '#181b26'
  surface-container: '#1c1f2b'
  surface-container-high: '#272935'
  surface-container-highest: '#313440'
  on-surface: '#e0e1f2'
  on-surface-variant: '#c1cab1'
  inverse-surface: '#e0e1f2'
  inverse-on-surface: '#2d303c'
  outline: '#8c947d'
  outline-variant: '#424936'
  surface-tint: '#94da32'
  primary: '#94da32'
  on-primary: '#203700'
  primary-container: '#76b900'
  on-primary-container: '#284400'
  inverse-primary: '#416900'
  secondary: '#a5e7ff'
  on-secondary: '#003543'
  secondary-container: '#00d2ff'
  on-secondary-container: '#00566a'
  tertiary: '#ffb3b6'
  on-tertiary: '#630c1c'
  tertiary-container: '#fc828b'
  on-tertiary-container: '#741927'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#aff74e'
  primary-fixed-dim: '#94da32'
  on-primary-fixed: '#102000'
  on-primary-fixed-variant: '#304f00'
  secondary-fixed: '#b6ebff'
  secondary-fixed-dim: '#47d6ff'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e60'
  tertiary-fixed: '#ffdada'
  tertiary-fixed-dim: '#ffb3b6'
  on-tertiary-fixed: '#40000c'
  on-tertiary-fixed-variant: '#822430'
  background: '#10131e'
  on-background: '#e0e1f2'
  surface-variant: '#313440'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  telemetry-display:
    fontFamily: JetBrains Mono
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  telemetry-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  telemetry-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-dense: 0.5rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system targets machine learning engineers, systems architects, and AI research directors orchestrating multi-agent compute graphs across heterogeneous model clusters (NVIDIA TensorRT-LLM, Anthropic Claude 3.5, OpenAI GPT-4o). 

The visual personality balances mission-critical tactical clarity with bleeding-edge computational power. The aesthetic fuses high-density telemetry dashboards with a refined Glassmorphic HUD overlay model:
- **Obsidian Immersion:** Subdued, deep-slate backgrounds isolate light emission strictly to computational metrics, active states, and real-time token throughput.
- **Agent Identity Through Color:** Instant visual attribution using distinct high-luminance chromatic vectors—NVIDIA hardware pipelines in laser green, Anthropic chains in warm coral/amber, and general synthetic inference streams in electric cyan.
- **Precision Engineering:** Micro-borders, tabular monospaced readouts, and surgical spatial partitioning prevent visual fatigue during marathon orchestration and monitoring sessions.

## Colors

The palette leverages an ultra-deep obsidian baseline to deliver true dark-mode depth while ensuring contrast ratios for continuous telemetry stream reading:

### Foundation Surfaces
- **Obsidian Base (`#0B0D13`):** Root canvas, structural viewport backdrop, and inactive split panes.
- **Surface Elevation 1 (`#11141F`):** Primary dock modules, workstation panels, and navigation side rails.
- **Surface Elevation 2 (`#181D2A`):** Interactive cards, telemetry monitors, modal overlays, and elevated docks.
- **Surface Elevation 3 (`#222838`):** Hover states, active input fills, and secondary controls.

### Accent & Multi-Agent Telemetry
- **Primary / NVIDIA Neon (`#76B900` / `#00FF88`):** GPU compute status, hardware VRAM meters, CUDA kernel execution, and NVIDIA AI Ultra agent node connections.
- **Secondary / Orchestration Cyan (`#00D2FF`):** API gateways, OpenAI/GPT-4o execution traces, WebSocket channels, and live active token throughput streams.
- **Tertiary / Anthropic Coral & Amber (`#E06C75` / `#D97706`):** Claude 3.5 Sonnet processing nodes, tool-use execution cycles, cognitive reasoning trees, and system alerts.

### Structural Lines & Alpha Borders
- **Border Default:** `rgba(255, 255, 255, 0.08)`
- **Border Active / Focus:** `rgba(118, 185, 0, 0.45)`
- **Border Agent Coral:** `rgba(224, 108, 117, 0.40)`
- **Border Agent Cyan:** `rgba(0, 210, 255, 0.40)`

## Typography

The typographic hierarchy separates cognitive comprehension from runtime execution metrics:
- **Inter** delivers structural layouts, workstation headers, and interaction labels with neutral, anti-aliased legibility.
- **JetBrains Mono** powers all real-time dynamic output: GPU memory registries, token velocities (`t/s`), latency timers (`ms`), model IDs, JSON payload inspect views, and execution terminal lines.
- Numerical readouts must always enable tabular figures (`font-variant-numeric: tabular-nums`) to prevent layout shifting during live multi-agent streaming.

## Layout & Spacing

Designed for ultra-dense multi-display workstation screens (3840x2160, 5120x1440 ultrawide, and dual 4K setups). 
- **Window Grid Philosophy:** Tiled, non-overlapping modular docking layout. The viewport is divided into configurable pane segments (Left: Model Pipeline & Topology, Center: Parallel Inference Canvas & Execution DAG, Right: Hardware & Telemetry HUD).
- **Density:** Baseline layout rhythm adheres to a compact 4px/8px modular scale. Telemetry readouts utilize ultra-tight row spacing (`space-xs` and `space-sm`) to ensure maximum visible pipeline metrics above the fold without scrolling.
- **Adaptive Breakpoints:**
  - **Workstation Extreme (≥2560px):** 3 to 4 column persistent dock system with visible parallel execution columns for Anthropic, OpenAI, and local cluster.
  - **Standard Desktop (1440px - 2559px):** 3-column modular split, secondary hardware panels collapsable to icon HUD strip.
  - **Compact Studio (1024px - 1439px):** Tabbed parallel views; side telemetry shelves convert into slide-out glass drawers.

## Elevation & Depth

Visual hierarchy uses physical HUD stacking rather than conventional high-drop shadow blur:
- **Base Canvas (`#0B0D13`):** Bottom stratum. Zero shadow, flat absorption.
- **Glassmorphic HUD Containers (`#11141F` at 75% alpha):** Applied to telemetry monitors and floating agent cards. Uses `backdrop-filter: blur(16px)` with internal 1px border `rgba(255, 255, 255, 0.08)`.
- **Glow & Photon Lighting:** Subtle hardware illumination marks active model computation. 
  - NVIDIA Agent active: `0 0 16px -2px rgba(118, 185, 0, 0.35)`
  - GPT-4o Agent active: `0 0 16px -2px rgba(0, 210, 255, 0.35)`
  - Claude 3.5 Agent active: `0 0 16px -2px rgba(224, 108, 117, 0.35)`
- **Depth Separators:** Recessed panel gutters have a 1px inset drop: `inset 0 1px 2px rgba(0, 0, 0, 0.6)`.

## Shapes

The interface embraces a low-radius, tactical geometry (Soft / 0.25rem = 4px baseline). 
- **Containers, Docks & Panels:** 4px border radius keeps edge-to-edge modular snapping seamless and maximizes display real estate.
- **Pills & Status Rings:** Dedicated circular tokens (9999px) are reserved strictly for tiny runtime state pings (green pulse = node active, cyan = payload transit, amber = rate limit throttle).
- **Corner Cuts & Segmented Meters:** Progress indicators, VRAM blocks, and hardware load bars employ segmented 0px-gap or 1px-gap mechanical blocks.

## Components

### Buttons
- **Tactical Primary:** `#76B900` fill with `#0B0D13` high-contrast typography, bold 400 weight, 4px border radius. Hover introduces `#00FF88` and outer neon edge illumination.
- **Ghost Utility:** Transparent surface with `rgba(255, 255, 255, 0.08)` border. On hover, background transitions to `#181D2A` and border shifts to cyan or primary green depending on current panel focus.

### Agent Identification Chips & Badges
- **NVIDIA AI Ultra:** JetBrains Mono 10px uppercase, `#76B900` text, `rgba(118, 185, 0, 0.12)` background, with an integrated `#00FF88` pulse indicator.
- **Claude 3.5 Sonnet:** `#E06C75` text, `rgba(224, 108, 117, 0.12)` background, `rgba(224, 108, 117, 0.3)` micro-border.
- **ChatGPT-4o:** `#00D2FF` text, `rgba(0, 210, 255, 0.12)` background, `rgba(0, 210, 255, 0.3)` micro-border.

### Telemetry Cards & HUD Panels
- Background: `#11141F` with 80% opacity, backdrop blur 12px, 1px border `#222838`.
- Header: Inter 13px bold, accompanied by active model badge, running clock (`ms`), and action icons (fork trace, isolate agent, terminal inspect).

### GPU VRAM Progress Meters
- Dual-track display: Linear segmented bar graph.
- Allocated vs. Peak VRAM: Main pool rendered in vibrant `#76B900`, buffer headroom highlighted in `#00FF88`, and critical ceiling warning (≥92% capacity) turning to `#E06C75`.
- Textual metadata: JetBrains Mono 11px right-aligned: `74.8 / 80.0 GB (93.5%)`.

### Code & Execution Terminals
- Background `#0B0D13` with left-edge color stripe identifying origin agent. 
- Line-number gutters in `#4B5563`, monospaced text rendering at 12px with syntax highlights matching agent identities (green variables, cyan strings, amber functions).

### Input Fields & Prompt Editors
- Inset field with `#0B0D13` background, 1px border `rgba(255, 255, 255, 0.12)`, active focus glow matching current orchestration context (green or cyan). Monospaced inline syntax highlighting for parameter tokens (`--temperature 0.2`, `top_p: 0.95`).