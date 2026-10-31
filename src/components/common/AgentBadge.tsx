import React from 'react';
import { AgentType } from '../../types/orchestration';

interface AgentBadgeProps {
  type: AgentType;
  showPulse?: boolean;
  size?: 'sm' | 'md';
  customLabel?: string;
  className?: string;
}

export const AgentBadge: React.FC<AgentBadgeProps> = ({
  type,
  showPulse = true,
  size = 'md',
  customLabel,
  className = ''
}) => {
  if (type === 'nvidia') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-[3px] border ${
          size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'
        } ${className}`}
        style={{
          color: '#76B900',
          backgroundColor: 'rgba(118, 185, 0, 0.12)',
          borderColor: 'rgba(118, 185, 0, 0.35)'
        }}
      >
        {showPulse && (
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: '#00FF88' }}
            aria-hidden="true"
          />
        )}
        {customLabel || 'NVIDIA AI ULTRA'}
      </span>
    );
  }

  if (type === 'claude') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-[3px] border ${
          size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'
        } ${className}`}
        style={{
          color: '#E06C75',
          backgroundColor: 'rgba(224, 108, 117, 0.12)',
          borderColor: 'rgba(224, 108, 117, 0.35)'
        }}
      >
        {showPulse && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#E06C75' }}
            aria-hidden="true"
          />
        )}
        {customLabel || 'CLAUDE 3.5 SONNET'}
      </span>
    );
  }

  if (type === 'openai') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-[3px] border ${
          size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'
        } ${className}`}
        style={{
          color: '#00D2FF',
          backgroundColor: 'rgba(0, 210, 255, 0.12)',
          borderColor: 'rgba(0, 210, 255, 0.35)'
        }}
      >
        {showPulse && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#00D2FF' }}
            aria-hidden="true"
          />
        )}
        {customLabel || 'CHATGPT-4O'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-[3px] border text-[#c1cab1] bg-[#181D2A] border-[rgba(255,255,255,0.1)] ${
        size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'
      } ${className}`}
    >
      {showPulse && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />}
      {customLabel || 'SYSTEM'}
    </span>
  );
};
