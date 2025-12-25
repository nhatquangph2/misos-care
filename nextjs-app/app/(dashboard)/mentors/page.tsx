'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MentorCard } from '@/components/features/mentors/MentorCard'
import { getMentors, getSpecializations } from '@/app/actions/mentor-actions'
import { MentorProfile, Specialization } from '@/types/mentor'

export default function MentorsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [specialtyFilter, setSpecialtyFilter] = useState('all')

    const [mentors, setMentors] = useState<MentorProfile[]>([])
    const [specializations, setSpecializations] = useState<Specialization[]>([])
    const [loading, setLoading] = useState(true)

    // Load specializations on mount
    useEffect(() => {
        getSpecializations().then(setSpecializations).catch(console.error);
    }, []);

    const loadMentors = useCallback(async () => {
        setLoading(true);
        try {
            // Mapping UI filters to API filters
            const filter = {
                specialization_slug: specialtyFilter !== 'all' ? specialtyFilter : undefined,
                // Client-side search for name typically, but we could add server-side valid search
                // For now, let's fetch matches and filter client side for text search if API doesn't support it yet
                // Or update API to support text search. The action I wrote didn't explicitly check query.
                // Re-reading my action: I didn't add search_text.
                // Let's implement client-side filtering for search query for now.
            };

            const data = await getMentors(filter);

            // Client-side text filtering
            const filteredData = data.filter(m => {
                if (!searchQuery) return true;
                const lowerQuery = searchQuery.toLowerCase();
                const nameMatch = m.user?.full_name?.toLowerCase().includes(lowerQuery);
                const titleMatch = m.title?.toLowerCase().includes(lowerQuery);
                const specMatch = m.detailed_specializations?.some(s => s.specialization?.name_vi?.toLowerCase().includes(lowerQuery));

                return nameMatch || titleMatch || specMatch;
            });

            setMentors(filteredData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, specialtyFilter]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadMentors();
        }, 500);
        return () => clearTimeout(timer);
    }, [loadMentors]);

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Tìm kiếm Mentor
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Kết nối với các chuyên gia tâm lý hàng đầu để được hỗ trợ 1:1.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden md:flex">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Bộ lọc nâng cao
                    </Button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-background p-4 rounded-xl border shadow-sm sticky top-20 z-10 backdrop-blur-md bg-opacity-95">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên, chuyên ngành..."
                        className="pl-9 h-12"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-[250px]">
                    <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Chuyên ngành" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả chuyên ngành</SelectItem>
                            {specializations.map(spec => (
                                <SelectItem key={spec.slug} value={spec.slug}>
                                    {spec.name_vi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="min-h-[300px]">
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[300px] rounded-2xl bg-muted/20 animate-pulse" />
                        ))}
                    </div>
                ) : mentors.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mentors.map((mentor, index) => (
                            <motion.div
                                key={mentor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <MentorCard mentor={mentor} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
                        <Filter className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Không tìm thấy chuyên gia phù hợp</h3>
                        <p className="text-muted-foreground">Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.</p>
                        <Button
                            variant="link"
                            onClick={() => { setSearchQuery(''); setSpecialtyFilter('all') }}
                            className="mt-2 text-blue-600"
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
