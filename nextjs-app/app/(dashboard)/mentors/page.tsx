'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Search, SlidersHorizontal, RefreshCcw } from 'lucide-react'
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
import { getMentors, seedMentorsIfNeeded } from '@/services/mentor-booking.service'
import { Mentor } from '@/types/database'

export default function MentorsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [specialtyFilter, setSpecialtyFilter] = useState('all')

    const [mentors, setMentors] = useState<Mentor[]>([])
    const [loading, setLoading] = useState(true)
    const [allSpecialties, setAllSpecialties] = useState<string[]>([])

    useEffect(() => {
        // Initial load and seed
        async function init() {
            // Run seed check (safe to run multiple times, it does checks)
            await seedMentorsIfNeeded().catch(console.error);
            loadMentors();
        }
        init();
    }, []);

    // Reload when filters change (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            loadMentors();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, specialtyFilter]);

    async function loadMentors() {
        setLoading(true);
        try {
            const data = await getMentors(searchQuery, specialtyFilter);
            setMentors(data);

            // Extract unique specialties from current data for the filter dropdown
            // (Ideally this should be a separate API call to get all possible specialties)
            const specs = new Set<string>();
            data.forEach(m => m.specialties?.forEach(s => specs.add(s)));
            if (allSpecialties.length === 0) {
                setAllSpecialties(Array.from(specs));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

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
                            {allSpecialties.map(spec => (
                                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="min-h-[300px]">
                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-2xl bg-muted/20 animate-pulse" />
                        ))}
                    </div>
                ) : mentors.length > 0 ? (
                    <div className="grid gap-6">
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
                        <h3 className="text-lg font-semibold">Không tìm thấy mentor phù hợp</h3>
                        <p className="text-muted-foreground">Vui lòng thử lại với từ khóa khác.</p>
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
