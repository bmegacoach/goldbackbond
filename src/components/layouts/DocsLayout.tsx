import React, { useEffect, useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { HeadingItem } from "../../types/docs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type DocsLayoutProps = {
  title: string;
  version?: string;
  note?: string;
  headings?: HeadingItem[];
  markdownContent: string;
  beforeContent?: ReactNode;
};

// Helper to generate IDs matching the heading list
export const generateSlug = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Custom extract text from ReactNode children
const extractText = (children: any): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && children.props && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};


export default function DocsLayout({
  title,
  version,
  note,
  headings = [],
  markdownContent,
  beforeContent,
}: DocsLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Scrollspy to highlight current section
  useEffect(() => {
    if (!headings.length) return;
    const ids = headings.map((h) => h.id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -70% 0px", // trigger a bit before center
        threshold: 0.1,
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, markdownContent]); // Re-run when markdown content is injected

  // Smooth scroll helper
  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // Offset for header
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="mx-auto flex max-w-7xl gap-12 px-6">
        {/* TOC sidebar */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-hide">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-500">
              On this page
            </h2>
            <nav className="space-y-1 text-sm">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  onClick={(e) => scrollToHeading(e, h.id)}
                  className={[
                    "block rounded-md px-3 py-2 transition-colors duration-200",
                    h.level === 3 ? "ml-4 text-xs text-gray-400" : "text-gray-300 font-medium",
                    activeId === h.id ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500" : "hover:text-emerald-400 hover:bg-white/5 border-l-2 border-transparent",
                  ].join(" ")}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <header className="mb-10 border-b border-gray-800 pb-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">{title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {version && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Version {version}
                </span>
              )}
              {note && <span className="italic pl-4 border-l border-gray-700">{note}</span>}
            </div>
          </header>

          {beforeContent}

          <article className="prose prose-invert prose-emerald max-w-none 
            prose-headings:text-gray-100 prose-headings:font-bold 
            prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-800
            prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300
            prose-strong:text-white
            prose-code:text-emerald-300 prose-code:bg-emerald-900/20 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
            prose-li:text-gray-300">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ node, ...props }) => {
                  const text = extractText(props.children);
                  const builtinId = headings.find(h => h.text === text && h.level === 2)?.id;
                  const id = builtinId || generateSlug(text);
                  return <h2 id={id} className="scroll-mt-28" {...props} />;
                },
                h3: ({ node, ...props }) => {
                  const text = extractText(props.children);
                  const builtinId = headings.find(h => h.text === text && h.level === 3)?.id;
                  const id = builtinId || generateSlug(text);
                  return <h3 id={id} className="scroll-mt-28" {...props} />;
                }
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
