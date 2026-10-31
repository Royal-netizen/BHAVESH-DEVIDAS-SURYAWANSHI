import React, { useState } from 'react';
import { X, Copy, Check, FileJson, Download } from 'lucide-react';

interface PayloadInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
}

export const PayloadInspectorModal: React.FC<PayloadInspectorModalProps> = ({
  isOpen,
  onClose,
  title,
  data
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const formattedJson = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(formattedJson);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `payload-inspect-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#11141F] border border-[rgba(255,255,255,0.15)] rounded-[4px] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-[#181D2A] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-[#00D2FF]" />
            <h3 className="text-xs font-bold font-mono text-[#e0e1f2] truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#c1cab1] hover:text-[#e0e1f2] bg-[#0B0D13] hover:bg-[#222838] border border-[rgba(255,255,255,0.08)] rounded-[3px] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#00FF88]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              title="Download JSON"
              className="p-1 text-[#8c947d] hover:text-[#e0e1f2] bg-[#0B0D13] hover:bg-[#222838] border border-[rgba(255,255,255,0.08)] rounded-[3px] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1 text-[#8c947d] hover:text-[#e0e1f2] hover:bg-[#222838] rounded-[3px] transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 bg-[#0B0D13] overflow-y-auto select-text font-mono text-xs">
          <pre className="text-[#00D2FF] leading-relaxed break-words whitespace-pre-wrap font-mono text-[11px]">
            {formattedJson}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#11141F] border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-[10px] font-mono text-[#8c947d] shrink-0">
          <span>Schema: draft-07 validated · RFC 8259</span>
          <span>Size: {(new Blob([formattedJson]).size / 1024).toFixed(2)} KB</span>
        </div>
      </div>
    </div>
  );
};
