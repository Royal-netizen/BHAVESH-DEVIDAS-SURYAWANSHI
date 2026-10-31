import React from 'react';

interface SegmentedVRAMBarProps {
  allocatedGB: number;
  peakGB: number;
  totalGB: number;
  segmentsCount?: number;
  showLabels?: boolean;
  className?: string;
}

export const SegmentedVRAMBar: React.FC<SegmentedVRAMBarProps> = ({
  allocatedGB,
  peakGB,
  totalGB,
  segmentsCount = 40,
  showLabels = true,
  className = ''
}) => {
  const allocatedPct = (allocatedGB / totalGB) * 100;
  const peakPct = (peakGB / totalGB) * 100;
  const isCritical = allocatedPct >= 92.0;

  // Segmented mechanical blocks
  const allocatedSegments = Math.round((allocatedPct / 100) * segmentsCount);
  const peakSegments = Math.round((peakPct / 100) * segmentsCount);

  // Color logic according to spec:
  // Main pool rendered in vibrant #76B900 (or #E06C75 if >= 92%), buffer headroom highlighted in #00FF88
  const primaryColor = isCritical ? '#E06C75' : '#76B900';
  const bufferColor = isCritical ? '#fc828b' : '#00FF88';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-[11px] font-mono tabular-nums leading-none">
          <span className="text-[#8c947d] text-[10px] tracking-wide uppercase">
            VRAM POOL {isCritical && <span className="text-[#E06C75] font-semibold ml-1">[CEILING CRITICAL ≥92%]</span>}
          </span>
          <span className="text-[#e0e1f2] font-medium">
            <span style={{ color: primaryColor }}>{allocatedGB.toFixed(1)}</span>
            <span className="text-[#8c947d]"> / {totalGB.toFixed(1)} GB</span>
            <span className="ml-1.5 px-1 py-0.2 rounded text-[10px]" style={{
              color: primaryColor,
              backgroundColor: isCritical ? 'rgba(224, 108, 117, 0.15)' : 'rgba(118, 185, 0, 0.15)'
            }}>
              {allocatedPct.toFixed(1)}%
            </span>
          </span>
        </div>
      )}

      {/* Segmented mechanical bar */}
      <div className="h-2.5 w-full bg-[#0B0D13] p-0.5 rounded-[2px] border border-[rgba(255,255,255,0.08)] flex gap-[1px]">
        {Array.from({ length: segmentsCount }).map((_, idx) => {
          let segmentBg = 'rgba(255, 255, 255, 0.05)';
          if (idx < allocatedSegments) {
            segmentBg = primaryColor;
          } else if (idx < peakSegments) {
            segmentBg = bufferColor;
          }

          return (
            <div
              key={idx}
              className="flex-1 h-full rounded-[0.5px] transition-colors duration-150"
              style={{ backgroundColor: segmentBg }}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[9px] font-mono text-[#8c947d]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-[1px]" style={{ backgroundColor: primaryColor }} />
            Active Pool ({allocatedGB.toFixed(1)} GB)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-[1px]" style={{ backgroundColor: bufferColor }} />
            Peak Headroom ({(peakGB - allocatedGB).toFixed(1)} GB)
          </span>
        </div>
        <span>Free: {(totalGB - peakGB).toFixed(1)} GB</span>
      </div>
    </div>
  );
};
