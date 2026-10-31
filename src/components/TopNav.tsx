import React from 'react';
import { Play, Pause, RefreshCw, Cpu, Activity, Terminal, Share2, BarChart2, Flame } from 'lucide-react';

export type ActiveView = 'dag' | 'telemetry' | 'heatmap' | 'terminal' | 'topology' | 'benchmarks';

interface TopNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isStreaming: boolean;
  onToggleStream: () => void;
  onResetWorkflow: () => void;
  activeClusterPings: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  setActiveView,
  isStreaming,
  onToggleStream,
  onResetWorkflow,
  activeClusterPings
}) => {
  const navItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'dag', label: 'Inference DAG', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'telemetry', label: 'Cluster Telemetry', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'heatmap', label: 'Latency Heatmap', icon: <Flame className="w-3.5 h-3.5 text-[#00FF88]" /> },
    { id: 'terminal', label: 'Execution Terminal', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'topology', label: 'Topology Studio', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'benchmarks', label: 'Benchmark Matrix', icon: <BarChart2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="flex flex-col bg-[#11141F] border-b border-[rgba(255,255,255,0.08)] sticky top-0 z-50 select-none">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 py-2.5">
        {/* Zone 1: Brand wordmark (single text element, no subtitle pill) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveView('dag'); }}
            className="text-sm sm:text-base font-semibold tracking-tight text-[#e0e1f2] hover:text-[#94da32] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-[1px] bg-[#76B900] inline-block glow-nvidia-subtle" />
            <span className="truncate max-w-[190px] sm:max-w-none">AI Orchestration Workstation</span>
          </a>
        </div>

        {/* Zone 2: 4-5 single-line clean text navigation links (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#c1cab1]">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 py-1 transition-all whitespace-nowrap shrink-0 relative ${
                  isActive
                    ? 'text-[#00FF88] font-semibold'
                    : 'text-[#c1cab1] hover:text-[#e0e1f2]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#76B900] shadow-[0_0_8px_#76B900]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onResetWorkflow}
            title="Reset DAG and clear pipeline buffers"
            className="p-1.5 text-xs text-[#8c947d] hover:text-[#e0e1f2] hover:bg-[#181D2A] rounded-[3px] border border-[rgba(255,255,255,0.08)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleStream}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-[4px] transition-all whitespace-nowrap shrink-0 shadow-sm ${
              isStreaming
                ? 'bg-[#E06C75] text-[#0B0D13] hover:bg-[#fc828b]'
                : 'bg-[#76B900] text-[#0B0D13] hover:bg-[#00FF88] hover:shadow-[0_0_12px_rgba(0,255,136,0.4)]'
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
                <span>Execute</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile-only horizontal tab scrollbar */}
      <div className="flex md:hidden items-center gap-2 px-4 py-1.5 bg-[#0B0D13] border-t border-[rgba(255,255,255,0.06)] overflow-x-auto text-[11px] font-mono scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-[3px] whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#181D2A] text-[#00FF88] border border-[#76B900]/40 font-semibold'
                  : 'text-[#8c947d] hover:text-[#e0e1f2]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
