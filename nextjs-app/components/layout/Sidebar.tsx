'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Flower2, Atom, Settings, LogOut, Activity, Briefcase, GraduationCap, HeartPulse, Trophy, ChartSpline, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home, label: 'Trang chủ' },
        { name: 'Tests', href: '/tests', icon: Activity, label: 'Bài Test' },
        { name: 'My Path', href: '/my-path', icon: Map, label: 'Hành trình' },
        { name: 'Sanctuary', href: '/sanctuary', icon: Flower2, label: 'Vườn Cảm Xúc' },
        { name: 'Expertise', href: '/expertise', icon: Atom, label: 'Chuyên gia AI' },
    ];


    const insightItems = [
        { name: 'Career', href: '/insights/career', icon: Briefcase, label: 'Nghề nghiệp' },
        { name: 'Learning', href: '/insights/learning', icon: GraduationCap, label: 'Học tập' },
        { name: 'Clinical', href: '/insights/clinical', icon: HeartPulse, label: 'Lâm sàng' },
        { name: 'Sports', href: '/insights/sports', icon: Trophy, label: 'Thể thao' },
    ];

    return (
        <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-2xl text-primary">
                    <Flower2 className="h-8 w-8 text-rose-500" />
                    <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">Miso&apos;s Care</span>
                </Link>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-2 py-4">
                    <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Menu
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                            >
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 mb-1 transition-all duration-200",
                                        isActive
                                            ? "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300 font-medium shadow-sm"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-rose-500" : "text-slate-500")} />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </div>

                {/* Advanced Analysis Section */}
                <div className="space-y-2 py-4">
                    <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                        <ChartSpline className="h-3 w-3" />
                        Phân tích chuyên sâu
                    </div>
                    {insightItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                            >
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 mb-1 transition-all duration-200",
                                        isActive
                                            ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 font-medium shadow-sm"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-purple-500" : "text-slate-500")} />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-8 px-4">
                    {/* Placeholder for small daily quote or mascot mini-status could go here */}
                </div>
            </ScrollArea>

            <div className="p-4 border-t space-y-1">
                <Link href="/settings">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Settings className="h-5 w-5 text-slate-500" />
                        Cài đặt
                    </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                    <LogOut className="h-5 w-5" />
                    Đăng xuất
                </Button>
            </div>
        </div>
    );
}
