'use client';

import { useState, useRef, useEffect } from 'react';
import { glossaryTerms, findTerm, type GlossaryTerm } from '@/constants/glossary';
import { cn } from '@/lib/utils';
import { X, BookOpen, ChevronRight } from 'lucide-react';

interface GlossaryTooltipProps {
    /** The term key from glossary (e.g., "MBTI", "Big Five") */
    term: string;
    /** Custom display text (defaults to the term) */
    children?: React.ReactNode;
    /** Additional className for the trigger */
    className?: string;
}

/**
 * GlossaryTooltip - Hover/click tooltip for technical terms
 * 
 * Usage:
 * <GlossaryTooltip term="MBTI">MBTI</GlossaryTooltip>
 * <GlossaryTooltip term="CBT">Trị liệu nhận thức hành vi</GlossaryTooltip>
 */
export function GlossaryTooltip({ term, children, className }: GlossaryTooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showFull, setShowFull] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);

    const termData = findTerm(term);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowFull(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setShowFull(false);
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    if (!termData) {
        // Term not found, render without tooltip
        return <span className={className}>{children || term}</span>;
    }

    const categoryColors: Record<GlossaryTerm['category'], string> = {
        psychology: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
        test: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
        mental_health: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
        technique: 'bg-green-500/20 text-green-700 dark:text-green-300',
        general: 'bg-slate-500/20 text-slate-700 dark:text-slate-300',
    };

    const categoryNames: Record<GlossaryTerm['category'], string> = {
        psychology: 'Tâm lý học',
        test: 'Bài test',
        mental_health: 'Sức khỏe tâm thần',
        technique: 'Kỹ thuật trị liệu',
        general: 'Chung',
    };

    return (
        <span className="relative inline-block">
            <span
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                className={cn(
                    "cursor-help border-b border-dashed border-purple-400 dark:border-purple-500",
                    "text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200",
                    "transition-colors",
                    className
                )}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-describedby={`tooltip-${term}`}
                onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
            >
                {children || term}
            </span>

            {isOpen && (
                <div
                    ref={tooltipRef}
                    id={`tooltip-${term}`}
                    role="tooltip"
                    className={cn(
                        "absolute z-[9999] left-0 bottom-full mb-2",
                        "w-72 sm:w-80 p-4",
                        "glass-card backdrop-blur-xl",
                        "bg-white/95 dark:bg-slate-900/95",
                        "border border-purple-200 dark:border-purple-800",
                        "rounded-xl shadow-xl",
                        "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-purple-500" />
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {termData.term}
                            </span>
                        </div>
                        <button
                            onClick={() => { setIsOpen(false); setShowFull(false); }}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            aria-label="Đóng"
                        >
                            <X className="h-3 w-3 text-slate-500" />
                        </button>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                        <span className={cn(
                            "inline-block px-2 py-0.5 text-xs font-medium rounded-full",
                            categoryColors[termData.category]
                        )}>
                            {categoryNames[termData.category]}
                        </span>
                    </div>

                    {/* Definition */}
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {showFull && termData.fullDefinition
                            ? termData.fullDefinition
                            : termData.shortDefinition
                        }
                    </p>

                    {/* Expand Button */}
                    {termData.fullDefinition && !showFull && (
                        <button
                            onClick={() => setShowFull(true)}
                            className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                        >
                            Xem chi tiết <ChevronRight className="h-3 w-3" />
                        </button>
                    )}

                    {/* Related Terms */}
                    {termData.relatedTerms && termData.relatedTerms.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Liên quan:{' '}
                            </span>
                            {termData.relatedTerms.map((related, idx) => (
                                <span key={related}>
                                    <span className="text-xs text-purple-600 dark:text-purple-400">
                                        {related}
                                    </span>
                                    {idx < termData.relatedTerms!.length - 1 && ', '}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </span>
    );
}

/**
 * Auto-highlight terms in text
 * Wraps known glossary terms with GlossaryTooltip
 */
export function GlossaryHighlighter({
    text,
    className
}: {
    text: string;
    className?: string;
}) {
    const terms = Object.keys(glossaryTerms);
    const sortedTerms = terms.sort((a, b) => b.length - a.length); // Longest first

    let result: (string | React.ReactNode)[] = [text];

    for (const term of sortedTerms) {
        const newResult: (string | React.ReactNode)[] = [];

        for (const part of result) {
            if (typeof part !== 'string') {
                newResult.push(part);
                continue;
            }

            const regex = new RegExp(`(${term})`, 'gi');
            const segments = part.split(regex);

            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                if (segment.toLowerCase() === term.toLowerCase()) {
                    newResult.push(
                        <GlossaryTooltip key={`${term}-${i}`} term={term}>
                            {segment}
                        </GlossaryTooltip>
                    );
                } else if (segment) {
                    newResult.push(segment);
                }
            }
        }

        result = newResult;
    }

    return <span className={className}>{result}</span>;
}

export default GlossaryTooltip;
