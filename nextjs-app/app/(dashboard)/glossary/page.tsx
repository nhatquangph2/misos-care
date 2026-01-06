'use client';

import { useState } from 'react';
import { glossaryTerms, getTermsByCategory, type GlossaryTerm } from '@/constants/glossary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Brain, TestTube, Heart, Wrench, HelpCircle } from 'lucide-react';

const categoryInfo: Record<GlossaryTerm['category'], { name: string; icon: React.ReactNode; color: string }> = {
    psychology: { name: 'Tâm lý học', icon: <Brain className="h-4 w-4" />, color: 'bg-purple-500/20 text-purple-700 dark:text-purple-300' },
    test: { name: 'Bài test', icon: <TestTube className="h-4 w-4" />, color: 'bg-blue-500/20 text-blue-700 dark:text-blue-300' },
    mental_health: { name: 'Sức khỏe tâm thần', icon: <Heart className="h-4 w-4" />, color: 'bg-rose-500/20 text-rose-700 dark:text-rose-300' },
    technique: { name: 'Kỹ thuật trị liệu', icon: <Wrench className="h-4 w-4" />, color: 'bg-green-500/20 text-green-700 dark:text-green-300' },
    general: { name: 'Chung', icon: <HelpCircle className="h-4 w-4" />, color: 'bg-slate-500/20 text-slate-700 dark:text-slate-300' },
};

export default function GlossaryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<GlossaryTerm['category'] | 'all'>('all');
    const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

    const allTerms = Object.entries(glossaryTerms);

    const filteredTerms = allTerms.filter(([key, term]) => {
        const matchesSearch = searchQuery === '' ||
            key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            term.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const toggleExpand = (key: string) => {
        const newExpanded = new Set(expandedTerms);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedTerms(newExpanded);
    };

    const categories: (GlossaryTerm['category'] | 'all')[] = ['all', 'psychology', 'test', 'mental_health', 'technique', 'general'];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Thuật Ngữ Chuyên Môn
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Giải thích các thuật ngữ tâm lý học và kỹ thuật trong MisosCare
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm thuật ngữ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 glass-card"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${selectedCategory === cat
                                    ? 'bg-purple-600 text-white'
                                    : 'glass-card hover:bg-purple-500/20'}
              `}
                        >
                            {cat === 'all' ? 'Tất cả' : categoryInfo[cat].name}
                            {cat !== 'all' && (
                                <span className="ml-1 opacity-70">
                                    ({getTermsByCategory(cat).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Hiển thị {filteredTerms.length} / {allTerms.length} thuật ngữ
            </p>

            {/* Terms Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {filteredTerms.map(([key, term]) => {
                    const isExpanded = expandedTerms.has(key);
                    const catInfo = categoryInfo[term.category];

                    return (
                        <Card
                            key={key}
                            className="glass-card backdrop-blur-md cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => toggleExpand(key)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {term.term}
                                    </CardTitle>
                                    <Badge className={catInfo.color}>
                                        {catInfo.icon}
                                        <span className="ml-1">{catInfo.name}</span>
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {isExpanded && term.fullDefinition
                                        ? term.fullDefinition
                                        : term.shortDefinition}
                                </p>

                                {term.fullDefinition && !isExpanded && (
                                    <button className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline">
                                        Bấm để xem chi tiết →
                                    </button>
                                )}

                                {term.relatedTerms && term.relatedTerms.length > 0 && isExpanded && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <span className="text-xs text-slate-500">Liên quan: </span>
                                        {term.relatedTerms.map((related, idx) => (
                                            <span key={related} className="text-xs text-purple-600 dark:text-purple-400">
                                                {related}{idx < term.relatedTerms!.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredTerms.length === 0 && (
                <div className="text-center py-12">
                    <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Không tìm thấy thuật ngữ phù hợp</p>
                </div>
            )}
        </div>
    );
}
