import React, { useEffect, useState } from 'react';
import { ExternalLink, Tag, Clock, Type, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface InboxItem {
  ID: string;
  Timestamp: string;
  Type: string;
  Content: string;
  Tags: string;
  Note: string;
  ImageURL: string;
  MetaTitle: string;
  MetaDescription: string;
  ScrapedURL: string;
}

const renderTextWithLinks = (text: string) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 font-bold hover:text-teal-700 dark:hover:text-teal-300 hover:underline underline-offset-4 decoration-2 transition-all cursor-pointer">
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export default function Inbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInbox = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/inbox');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch items');

      const sortedData = (data.data || []).sort((a: InboxItem, b: InboxItem) => {
        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
      });

      setItems(sortedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-pulse text-teal-500">
        <RefreshCw className="animate-spin mb-6" size={40} />
        <p className="text-slate-500 dark:text-neutral-400 font-medium tracking-wide">Retrieving your thoughts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-8 rounded-3xl max-w-lg mx-auto mt-20 text-center shadow-sm">
        <p className="font-semibold text-lg">Failed to load local inbox.</p>
        <p className="text-sm mt-2 opacity-80">{error}</p>
        <button onClick={fetchInbox} className="mt-6 px-6 py-2.5 bg-red-100 dark:bg-red-900/40 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors shadow-sm">Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-slate-200 dark:border-neutral-800 pb-6 gap-4 sm:gap-0">
        <div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-2">
            <span className="decoration-teal-500 underline decoration-2 underline-offset-8">Captured</span> History
          </h2>
          <p className="text-slate-500 dark:text-neutral-500 text-sm font-medium tracking-wide">{items.length} items securely stored.</p>
        </div>
        <button onClick={fetchInbox} className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-semibold bg-white dark:bg-neutral-900 px-5 py-2.5 rounded-full border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow active:scale-95 group">
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Sync
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {items.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-neutral-500 bg-slate-50 dark:bg-neutral-900/30 rounded-3xl border border-slate-200 dark:border-neutral-800 border-dashed">
            <p className="text-lg font-medium">Your inbox is a blank canvas.</p>
            <p className="text-sm mt-2 opacity-70">Capture something new.</p>
          </div>
        ) : (
          items.map((rawItem: any) => {
            const item = {
              ID: rawItem.ID || rawItem.id || Math.random().toString(),
              Timestamp: rawItem.Timestamp || rawItem.timestamp || new Date().toISOString(),
              Type: (rawItem.Type || rawItem.type || 'text').toLowerCase(),
              Content: rawItem.Content || rawItem.content || '',
              Tags: rawItem.Tags || rawItem.tags || '',
              Note: rawItem.Note || rawItem.note || '',
              ImageURL: rawItem.ImageURL || rawItem.ImageUrl || rawItem.imageUrl || rawItem.imageurl || '',
              MetaTitle: rawItem.MetaTitle || rawItem.metaTitle || rawItem.metatitle || '',
              MetaDescription: rawItem.MetaDescription || rawItem.metaDescription || rawItem.metadescription || '',
              ScrapedURL: rawItem.ScrapedURL || rawItem.ScrapedUrl || rawItem.scrapedUrl || rawItem.url || '',
            };

            return (
              <article key={item.ID} className="bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800/80 rounded-[2rem] p-5 sm:p-7 hover:border-slate-300 dark:hover:border-neutral-700 transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-none relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-transparent pointer-events-none" />
              
                <div className="relative z-10">
                  <header className="flex flex-wrap items-center justify-between mb-5 gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-neutral-800">
                        {item.Type === 'text' && <Type size={14} className="text-emerald-500" />}
                        {item.Type === 'url' && <LinkIcon size={14} className="text-blue-500" />}
                        {item.Type === 'image' && <ImageIcon size={14} className="text-purple-500" />}
                      </span>
                      <span>{item.Type}</span>
                      <span className="mx-1 text-slate-300 dark:text-neutral-700">•</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} className="opacity-70" /> {new Date(item.Timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                  
                    {item.Type === 'url' && (item.ScrapedURL || item.Content) && (
                      <a href={item.ScrapedURL || item.Content} target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-500 bg-teal-50 dark:bg-teal-500/10 p-2 rounded-full hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </header>

                {item.Type === 'url' && (
                  <div className="mb-4 relative w-full group/link">
                    <a href={item.ScrapedURL || item.Content} target="_blank" rel="noreferrer" className="block p-5 sm:p-6 bg-slate-50 dark:bg-neutral-900/50 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition-all shadow-sm group-hover/link:shadow-md">
                      {item.MetaTitle ? (
                        <>
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl leading-snug mb-2">
                            {item.MetaTitle.length > 150 ? item.MetaTitle.slice(0, 150) + '...' : item.MetaTitle}
                          </h3>
                          <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed break-all line-clamp-2">{item.ScrapedURL || item.Content}</p>
                        </>
                      ) : (
                        <p className="text-teal-600 dark:text-teal-400 font-medium break-all underline-offset-4 decoration-2 hover:underline">
                          {item.Content.length > 150 ? item.Content.slice(0, 150) + '...' : item.Content}
                        </p>
                      )}
                    </a>
                  </div>
                )}
                  {item.Type === 'image' && (item.ImageURL || item.Content.startsWith('http') || item.Content.startsWith('data:image')) && (
                    <div className="mb-5 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-neutral-800/50 block w-full sm:w-max">
                      <a href={item.ImageURL || item.Content} target="_blank" rel="noreferrer" className="block relative group-hover:block w-full h-full">
                        <img src={item.ImageURL || item.Content} alt="User Captured" loading="lazy" className="max-h-[500px] w-full object-contain bg-slate-100 dark:bg-neutral-950 hover:opacity-90 transition-opacity" />
                      </a>
                    </div>
                  )}

                {(item.Type === 'text' || item.Note) && (
                  <div className="mt-2 mb-4">
                    {item.Type === 'text' ? (
                      <div className="text-slate-800 dark:text-neutral-200 text-[1.05rem] sm:text-[1.15rem] leading-[1.8] whitespace-pre-wrap font-medium tracking-wide">
                        {renderTextWithLinks(item.Content)}
                      </div>
                    ) : (
                      <div className="pl-4 sm:pl-5 py-2 border-l-4 border-teal-500 text-slate-700 dark:text-neutral-300 text-base sm:text-lg italic leading-relaxed whitespace-pre-wrap font-medium bg-slate-50/50 dark:bg-neutral-800/20 rounded-r-xl">
                        {renderTextWithLinks(item.Note)}
                      </div>
                    )}
                  </div>
                )}
                  {item.Tags && (
                    <footer className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-neutral-800/50">
                      {item.Tags.split(',').map((tag: string) => tag.trim()).filter(Boolean).map((t: string, idx: number) => (
                        <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-neutral-800/80 rounded-full text-xs font-semibold text-slate-600 dark:text-neutral-400 shadow-sm">
                          <Tag size={12} className="opacity-70" /> {t}
                        </span>
                      ))}
                    </footer>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
