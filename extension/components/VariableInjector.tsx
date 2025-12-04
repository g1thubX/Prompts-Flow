import React, { useEffect, useState, useMemo, useRef } from 'react';
import { VariableMap } from '../types';

interface InjectorLabels {
  pressEnterFinish: string;
  valueFor: string;
  preview: string;
  copyResult: string;
}

interface VariableInjectorProps {
  content: string;
  onVariablesFilled: (filledContent: string) => void;
  resetTrigger: number;
  onComplete: (filledContent: string) => void;
  labels: InjectorLabels;
}

export const VariableInjector: React.FC<VariableInjectorProps> = ({ content, onVariablesFilled, resetTrigger, onComplete, labels }) => {
  const [values, setValues] = useState<VariableMap>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  const variables = useMemo(() => {
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    const found = new Set<string>();
    let match;
    while ((match = regex.exec(content)) !== null) {
      found.add(match[1]);
    }
    return Array.from(found);
  }, [content]);

  useEffect(() => {
    setValues({});
    // Focus first input after render
    setTimeout(() => {
        if (firstInputRef.current) firstInputRef.current.focus();
    }, 50);
  }, [resetTrigger]);

  const currentFilledContent = useMemo(() => {
      let filledContent = content;
      variables.forEach(v => {
        const regex = new RegExp(`\\{\\{\\s*${v}\\s*\\}\\}`, 'g');
        filledContent = filledContent.replace(regex, values[v] || `{{${v}}}`);
      });
      return filledContent;
  }, [content, variables, values]);

  // Sync up
  useEffect(() => {
    onVariablesFilled(currentFilledContent);
  }, [currentFilledContent, onVariablesFilled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          // If all variables have some value (optional check, currently allows empty), or just simple Enter triggers copy
          onComplete(currentFilledContent);
      }
  };

  if (variables.length === 0) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {variables.map((v, index) => (
        <div key={v} className="flex flex-col gap-1 group">
           <div className="flex justify-between items-baseline">
                <label className="text-xs font-mono text-indigo-300 opacity-80">{v}</label>
                {index === 0 && <span className="text-[9px] text-carbon-400">{labels.pressEnterFinish}</span>}
           </div>
           <input
            ref={index === 0 ? firstInputRef : null}
            type="text"
            value={values[v] || ''}
            onChange={(e) => setValues(prev => ({ ...prev, [v]: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder={`${labels.valueFor} ${v}...`}
            className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder-white/10 focus:border-indigo-500 focus:outline-none transition-all font-mono text-sm"
           />
        </div>
      ))}
      
      {/* Preview of result */}
      <div className="mt-8 pt-4 border-t border-white/5">
         <p className="text-[10px] uppercase tracking-widest text-carbon-400 mb-2">{labels.preview}</p>
         <div className="text-xs text-gray-400 font-mono leading-relaxed opacity-70">
             {currentFilledContent}
         </div>
      </div>

      <button 
        onClick={() => onComplete(currentFilledContent)}
        className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
      >
        {labels.copyResult}
      </button>
    </div>
  );
};