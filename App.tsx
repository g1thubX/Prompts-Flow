import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Prompt, PromptFormData } from './types';
import { promptService } from './services/db';
import { PlusIcon, SearchIcon, CopyIcon, EditIcon, TrashIcon, CheckIcon, XMarkIcon } from './components/Icons';
import { VariableInjector } from './components/VariableInjector';

// --- Types ---
type ViewMode = 'SEARCH' | 'FILLING' | 'EDITOR';
type Language = 'en' | 'cn';

// --- Translations ---
const TRANSLATIONS = {
  en: {
    searchPlaceholder: "Type to search...",
    pressEnterCreate: "Press Enter to Create",
    tabulaRasa: "Tabula Rasa.",
    typeNew: "Type",
    toCreateMagic: "to create magic.",
    inputVariables: "Input Variables",
    editPrompt: "Edit Prompt",
    newPrompt: "New Prompt",
    save: "Save",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Cold Outreach Email",
    tagsLabel: "Tags (comma separated)",
    tagsPlaceholder: "marketing, email, coding",
    contentLabel: "Prompt Content",
    contentPlaceholder: "Write a {{tone}} story about {{topic}}...",
    variableHint: "Use {{variable}} to create dynamic inputs.",
    navNavigate: "to navigate",
    navSelect: "to select",
    navCopy: "to copy",
    navCancel: "to cancel",
    copied: "Copied to clipboard",
    confirmDelete: "Delete this prompt?",
    createNew: "New",
    injector: {
      pressEnterFinish: "Press Enter to finish",
      valueFor: "Value for",
      preview: "Preview",
      copyResult: "Copy Result"
    }
  },
  cn: {
    searchPlaceholder: "输入关键词搜索...",
    pressEnterCreate: "按回车键新建",
    tabulaRasa: "思维白板。",
    typeNew: "输入",
    toCreateMagic: "开启魔法。",
    inputVariables: "输入变量",
    editPrompt: "编辑提示词",
    newPrompt: "新建提示词",
    save: "保存",
    titleLabel: "标题",
    titlePlaceholder: "例如：冷启动开发信",
    tagsLabel: "标签 (逗号分隔)",
    tagsPlaceholder: "营销, 邮件, 代码",
    contentLabel: "提示词内容",
    contentPlaceholder: "写一个关于 {{topic}} 的 {{tone}} 故事...",
    variableHint: "使用 {{variable}} 来创建动态填空。",
    navNavigate: "导航",
    navSelect: "选择",
    navCopy: "复制",
    navCancel: "取消",
    copied: "已复制到剪贴板",
    confirmDelete: "确认删除此提示词？",
    createNew: "新建",
    injector: {
      pressEnterFinish: "按回车完成",
      valueFor: "输入",
      preview: "预览",
      copyResult: "复制结果"
    }
  }
};

// --- Helper Components ---
const CategoryIcon = ({ tag }: { tag: string }) => {
  // Deterministic color generation based on string char code
  const getColor = (str: string) => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 
      'bg-emerald-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const bg = tag ? getColor(tag) : 'bg-carbon-400';

  return (
    <div className={`w-2 h-2 rounded-full ${bg} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
  );
};

export default function App() {
  // Data State
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [mode, setMode] = useState<ViewMode>('SEARCH');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('promptflow_lang') as Language) || 'en');
  
  // Editor State
  const [editorData, setEditorData] = useState<PromptFormData>({ title: '', content: '', tags: [] });
  const [editorId, setEditorId] = useState<string | null>(null); // Null for create, ID for edit

  // Feedback State
  const [toast, setToast] = useState<string | null>(null);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[lang];

  // --- Initial Load ---
  const fetchPrompts = useCallback(async () => {
    try {
      const data = await promptService.getAll();
      setPrompts(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load prompts", err);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // --- Filtering ---
  const filteredPrompts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return prompts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [prompts, searchQuery]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // --- Keyboard Navigation (The Core Interaction) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'SEARCH') {
        if (e.key === 'Escape') {
          // If in filling or editor mode, escape goes back to search
          setMode('SEARCH');
          setActivePrompt(null);
          // Refocus search after a tick
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredPrompts.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredPrompts.length) % filteredPrompts.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredPrompts[selectedIndex]) {
            handlePromptSelection(filteredPrompts[selectedIndex]);
          } else {
             const isNewCommand = searchQuery.toLowerCase() === 'new' || searchQuery === '新建';
             if (isNewCommand) {
                openEditor();
             }
          }
          break;
        case 'Tab':
            break; 
        case 'Escape':
            if (searchQuery) setSearchQuery('');
            break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, filteredPrompts, selectedIndex, searchQuery, lang]);

  // Scroll active item into view
  useEffect(() => {
    if (mode === 'SEARCH' && listRef.current) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        const container = listRef.current;
        if (activeElement.offsetTop + activeElement.clientHeight > container.scrollTop + container.clientHeight) {
          container.scrollTop = activeElement.offsetTop + activeElement.clientHeight - container.clientHeight;
        } else if (activeElement.offsetTop < container.scrollTop) {
          container.scrollTop = activeElement.offsetTop;
        }
      }
    }
  }, [selectedIndex, mode]);


  // --- Actions ---

  const handlePromptSelection = (prompt: Prompt) => {
    // Check for variables
    const hasVariables = /\{\{\s*[a-zA-Z0-9_]+\s*\}\}/.test(prompt.content);
    
    if (hasVariables) {
      setActivePrompt(prompt);
      setMode('FILLING');
    } else {
      // Direct Copy
      copyToClipboard(prompt.content, prompt);
    }
  };

  const copyToClipboard = async (text: string, prompt?: Prompt) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(t.copied);
      if (prompt) {
        promptService.incrementUsage(prompt).then(updated => {
             setPrompts(prev => prev.map(p => p.id === updated.id ? updated : p));
        });
      }
      // Reset logic
      setMode('SEARCH');
      setSearchQuery('');
      setActivePrompt(null);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const toggleLang = () => {
      const newLang = lang === 'en' ? 'cn' : 'en';
      setLang(newLang);
      localStorage.setItem('promptflow_lang', newLang);
  };

  // --- Editor Logic ---
  const openEditor = (prompt?: Prompt) => {
    if (prompt) {
      setEditorData({ title: prompt.title, content: prompt.content, tags: prompt.tags });
      setEditorId(prompt.id);
    } else {
      setEditorData({ title: '', content: '', tags: [] });
      setEditorId(null);
    }
    setMode('EDITOR');
  };

  const handleEditorSave = async () => {
    if (!editorData.title || !editorData.content) return;

    try {
      if (editorId) {
        // Update
        const original = prompts.find(p => p.id === editorId);
        if (original) {
          const updated = await promptService.update({ ...original, ...editorData });
          setPrompts(prev => prev.map(p => p.id === updated.id ? updated : p));
        }
      } else {
        // Create
        const newPrompt = await promptService.add(editorData);
        setPrompts(prev => [newPrompt, ...prev]);
      }
      setMode('SEARCH');
    } catch (e) {
      console.error(e);
    }
  };
  
  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm(t.confirmDelete)) {
          await promptService.delete(id);
          setPrompts(prev => prev.filter(p => p.id !== id));
      }
  }


  // --- Renders ---
  const isCreateCommand = searchQuery.toLowerCase() === 'new' || searchQuery === '新建';

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      {/* Toast */}
      {toast && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/20 animate-fade-in z-50">
          {toast}
        </div>
      )}

      {/* The Monolith (Command Palette) */}
      {/* Updated Design: 80% Opacity, Blur, Rounded-xl */}
      <div className="w-full max-w-[640px] bg-[#0F1014]/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ring-1 ring-white/5 relative transition-all duration-300">
        
        {/* Decorative Top Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

        {/* --- SEARCH MODE HEADER --- */}
        {mode === 'SEARCH' && (
          <div className="relative shrink-0">
            <SearchIcon className={`absolute left-5 top-5 w-5 h-5 transition-colors duration-300 ${searchQuery ? 'text-indigo-400' : 'text-carbon-400'}`} />
            <input
              ref={searchInputRef}
              type="text"
              autoFocus
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // Updated Contrast: placeholder-gray-500
              className="w-full h-16 bg-transparent text-lg text-white placeholder-gray-500 pl-14 pr-4 focus:outline-none font-light"
            />
            {searchQuery && (
                <div className="absolute right-4 top-5">
                    <button onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} className="text-carbon-400 hover:text-white">
                        <XMarkIcon className="w-4 h-4"/>
                    </button>
                </div>
            )}
            <div className="h-px w-full bg-white/5"></div>
          </div>
        )}

        {/* --- FILLING MODE HEADER --- */}
        {mode === 'FILLING' && activePrompt && (
           <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMode('SEARCH')} className="text-carbon-400 hover:text-white transition-colors">
                        <span className="text-lg">←</span>
                    </button>
                    <div>
                        <h2 className="text-sm font-medium text-white">{activePrompt.title}</h2>
                        <p className="text-[10px] text-carbon-400 uppercase tracking-wider font-mono">{t.inputVariables}</p>
                    </div>
                </div>
           </div>
        )}
        
        {/* --- EDITOR MODE HEADER --- */}
        {mode === 'EDITOR' && (
           <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMode('SEARCH')} className="text-carbon-400 hover:text-white transition-colors">
                        <span className="text-lg">←</span>
                    </button>
                    <h2 className="text-sm font-medium text-white">{editorId ? t.editPrompt : t.newPrompt}</h2>
                </div>
                 <button onClick={handleEditorSave} className="text-xs bg-white text-black px-3 py-1.5 rounded-full font-bold hover:bg-gray-200 transition-colors">
                    {t.save}
                </button>
           </div>
        )}

        {/* --- BODY AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[300px]" ref={listRef}>
          
          {/* 1. Search List */}
          {mode === 'SEARCH' && (
             <div className="py-2">
                {filteredPrompts.length === 0 ? (
                    <div className="px-6 py-12 text-center select-none">
                        {isCreateCommand ? (
                            <div className="animate-pulse">
                                <p className="text-indigo-400 text-sm font-medium">{t.pressEnterCreate}</p>
                            </div>
                        ) : (
                            <>
                                {/* Updated Contrast: text-gray-400, text-gray-500 */}
                                <p className="text-gray-400 text-sm mb-1">{t.tabulaRasa}</p>
                                <p className="text-gray-500 text-xs">
                                    {t.typeNew} <span className="text-indigo-400 font-mono">{lang === 'en' ? 'New' : 'New / 新建'}</span> {t.toCreateMagic}
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    filteredPrompts.map((prompt, index) => {
                        const isSelected = index === selectedIndex;
                        return (
                            <div
                                key={prompt.id}
                                onClick={() => { setSelectedIndex(index); handlePromptSelection(prompt); }}
                                className={`px-4 py-3 mx-2 rounded-lg flex items-center justify-between group cursor-pointer transition-all duration-100 ${
                                    isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                                }`}
                            >
                                <div className="flex items-center gap-4 overflow-hidden">
                                    {/* Icon */}
                                    <CategoryIcon tag={prompt.tags[0] || ''} />
                                    
                                    {/* Text */}
                                    <div className="flex flex-col truncate">
                                        <span className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                            {prompt.title}
                                        </span>
                                        <span className="text-[11px] text-carbon-400 truncate font-mono opacity-60">
                                            {prompt.content.substring(0, 50).replace(/\n/g, ' ')}...
                                        </span>
                                    </div>
                                </div>

                                {/* Hints */}
                                <div className={`flex items-center gap-3 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                    {/* Suggestive Tags */}
                                    {prompt.tags[0] && (
                                        <span className="text-[9px] uppercase tracking-wider text-indigo-300/80 font-medium">
                                            {prompt.tags[0]}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); openEditor(prompt); }}
                                            className="p-1.5 text-carbon-400 hover:text-white rounded hover:bg-white/10"
                                            title="Edit"
                                        >
                                            <EditIcon className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(e, prompt.id)}
                                            className="p-1.5 text-carbon-400 hover:text-red-400 rounded hover:bg-white/10"
                                            title="Delete"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="w-px h-3 bg-white/10"></div>
                                    <span className="text-[10px] text-carbon-400 font-mono">
                                        ⏎
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
             </div>
          )}

          {/* 2. Filling Mode */}
          {mode === 'FILLING' && activePrompt && (
              <div className="p-6">
                  <div className="mb-6 opacity-50 font-mono text-xs border-l-2 border-indigo-500 pl-3 py-1">
                      {activePrompt.content}
                  </div>
                  <VariableInjector 
                    content={activePrompt.content} 
                    onVariablesFilled={(text) => {}}
                    resetTrigger={Date.now()}
                    onComplete={(finalText) => copyToClipboard(finalText, activePrompt)}
                    labels={t.injector}
                  />
              </div>
          )}

          {/* 3. Editor Mode */}
          {mode === 'EDITOR' && (
              <div className="p-6 space-y-5">
                  <div>
                      <label className="text-[10px] uppercase font-bold text-carbon-400 tracking-wider mb-1 block">{t.titleLabel}</label>
                      <input 
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:border-indigo-500 outline-none transition-colors"
                        value={editorData.title}
                        onChange={e => setEditorData({...editorData, title: e.target.value})}
                        placeholder={t.titlePlaceholder}
                        autoFocus
                      />
                  </div>
                  <div>
                      <label className="text-[10px] uppercase font-bold text-carbon-400 tracking-wider mb-1 block">{t.tagsLabel}</label>
                      <input 
                        className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-gray-300 focus:border-indigo-500 outline-none transition-colors"
                        value={editorData.tags.join(', ')}
                        onChange={e => setEditorData({...editorData, tags: e.target.value.split(',').map(s => s.trim())})}
                        placeholder={t.tagsPlaceholder}
                      />
                  </div>
                  <div className="flex-1 flex flex-col">
                      <label className="text-[10px] uppercase font-bold text-carbon-400 tracking-wider mb-2 block">{t.contentLabel}</label>
                      <textarea 
                        className="w-full flex-1 min-h-[200px] bg-white/5 rounded-lg p-4 text-sm font-mono text-gray-300 focus:ring-1 focus:ring-indigo-500/50 outline-none resize-none leading-relaxed"
                        value={editorData.content}
                        onChange={e => setEditorData({...editorData, content: e.target.value})}
                        placeholder={t.contentPlaceholder}
                      />
                      <p className="mt-2 text-[10px] text-carbon-400">
                          {lang === 'en' ? (
                              <>Use <code className="text-indigo-400">{'{{variable}}'}</code> to create dynamic inputs.</>
                          ) : (
                              <>使用 <code className="text-indigo-400">{'{{variable}}'}</code> 创建动态输入。</>
                          )}
                      </p>
                  </div>
              </div>
          )}

        </div>

        {/* Footer Hint Bar */}
        {/* Updated Contrast: text-gray-400, bg-black/40 */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-400 font-mono select-none">
            <div className="flex gap-3 items-center">
                {mode === 'SEARCH' && (
                    <>
                        <span><span className="text-gray-300">↑↓</span> {t.navNavigate}</span>
                        <span><span className="text-gray-300">↵</span> {t.navSelect}</span>
                        <button 
                            onClick={() => openEditor()} 
                            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer ml-2"
                        >
                            <span className="text-gray-300">+</span> {t.createNew}
                        </button>
                    </>
                )}
                {mode === 'FILLING' && <span><span className="text-gray-300">↵</span> {t.navCopy}</span>}
                {mode === 'EDITOR' && <span><span className="text-gray-300">Esc</span> {t.navCancel}</span>}
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={toggleLang}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                    <span className={lang === 'en' ? 'text-white' : 'text-gray-500'}>EN</span>
                    <span className="text-gray-600">/</span>
                    <span className={lang === 'cn' ? 'text-white' : 'text-gray-500'}>中</span>
                </button>
                <span className="opacity-30">|</span>
                <span>PROMPT FLOW v1.0</span>
            </div>
        </div>

      </div>
    </div>
  );
}