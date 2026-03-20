import React, { useState, useRef, useEffect, DragEvent } from 'react';
import { Send, UploadCloud, Link as LinkIcon, Type, X, CheckCircle, AlertCircle } from 'lucide-react';
import { CaptureType, ApiResponse } from '../types';

interface Toast {
  message: string;
  type: 'success' | 'error';
  id: string;
}

const AVAILABLE_TAGS = ['book', 'ai', 'good practice', 'project idea', 'article', 'inspiration'];

export default function CaptureForm() {
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [inputType, setInputType] = useState<CaptureType>('text');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputType !== 'image') {
      const isUrl = /^https?:\/\/.+/.test(content.trim());
      setInputType(isUrl ? 'url' : 'text');
    }
  }, [content, inputType]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const newTag = customTagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags((prev) => [...prev, newTag]);
      }
      setCustomTagInput('');
    }
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setContent(e.target.result);
        setInputType('image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      addToast('Please enter an idea, URL, or image to capture.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: inputType,
          content: content.trim(),
          tags,
          note: note.trim(),
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to capture');
      }

      addToast('Captured successfully!', 'success');
      setContent('');
      setNote('');
      setTags([]);
      setInputType('text');
    } catch (error: any) {
      addToast(error.message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-12 md:mt-20 fade-in duration-500">
      <div className="w-full">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-3">
            <span className="decoration-teal-500 underline decoration-2 underline-offset-8 transition-colors">Capture</span> Context.
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 text-sm md:text-base tracking-wide font-medium">Clear your mind. Fuel your Inbox.</p>
        </header>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
            isDragging
              ? 'bg-slate-50 dark:bg-neutral-800/80 ring-2 ring-teal-500 shadow-2xl shadow-teal-500/20'
              : 'bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 shadow-xl'
          }`}
        >
          <form onSubmit={handleSubmit} className="p-5 md:p-8">
            
            <div className="relative group mb-6">
              {inputType === 'image' && content.startsWith('data:image') ? (
                <div className="relative h-48 md:h-64 w-full rounded-2xl overflow-hidden group shadow-inner">
                  <img src={content} alt="Upload preview" className="object-cover w-full h-full opacity-90 transition-opacity group-hover:opacity-70 mix-blend-multiply dark:mix-blend-normal" />
                  <button 
                    type="button" 
                    onClick={() => { setContent(''); setInputType('text'); }}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur text-slate-800 dark:text-white rounded-full hover:bg-red-500 hover:text-white transition-colors border border-slate-200 dark:border-neutral-700 shadow-sm"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Drop a thought, paste a link, or toss an image here..."
                  className="w-full bg-transparent resize-none text-xl md:text-2xl font-light text-slate-800 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 min-h-[100px] md:min-h-[140px] transition-all leading-relaxed"
                  autoFocus
                />
              )}
            </div>

            {inputType !== 'text' && (
              <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={`Add a note or thought about this ${inputType} (e.g. "Revisit after finishing the course")...`}
                  className="w-full bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 rounded-xl p-3 resize-none text-sm text-slate-700 dark:text-neutral-300 placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-1 focus:border-teal-500/50 focus:ring-teal-500/50 min-h-[80px] transition-all"
                />
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 dark:text-neutral-500 mb-3 font-semibold flex items-center gap-2">
                Triage Tags
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                {Array.from(new Set([...AVAILABLE_TAGS, ...tags])).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-semibold transition-all transform active:scale-[0.97] ${
                      tags.includes(tag)
                        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/50 shadow-[0_4px_10px_rgba(20,184,166,0.1)]'
                        : 'bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200 hover:border-slate-300 dark:hover:border-neutral-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                
                <input
                   type="text"
                   value={customTagInput}
                   onChange={(e) => setCustomTagInput(e.target.value)}
                   onKeyDown={handleAddCustomTag}
                   placeholder="+ Add custom"
                   className="bg-transparent border-b border-slate-300 dark:border-neutral-700 text-xs font-medium text-slate-700 dark:text-neutral-300 placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-teal-500 px-2 py-1.5 w-32 transition-colors focus:w-40 ml-1"
                 />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 dark:border-neutral-800/80 pt-5 mt-2 gap-4 sm:gap-0">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-neutral-800/50 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded-full transition-all duration-300 group shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                  title="Upload Image"
                >
                  <UploadCloud size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
                
                <span className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-neutral-500 bg-slate-100 dark:bg-neutral-900/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-neutral-800/50 shadow-sm transition-all">
                  {inputType === 'url' && <><LinkIcon size={14} className="text-blue-500" /> <span>Link Detected</span></>}
                  {inputType === 'text' && <><Type size={14} className="text-emerald-500" /> <span>Thought log</span></>}
                  {inputType === 'image' && <><UploadCloud size={14} className="text-purple-500" /> <span>Image Ready</span></>}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-teal-500 hover:bg-teal-600 dark:bg-teal-500/90 dark:hover:bg-teal-400 text-white px-6 py-2.5 rounded-full font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 dark:shadow-teal-500/10 active:scale-95 border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
              >
                <span>{isLoading ? 'Capturing...' : 'Capture Entry'}</span>
                {!isLoading && <Send size={18} className="ml-1 opacity-90" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-in slide-in-from-bottom-5 fade-in duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                : 'bg-red-50/90 dark:bg-red-950/80 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
