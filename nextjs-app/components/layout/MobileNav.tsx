'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Flower2, Atom, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home, label: 'Home' },
        { name: 'Tests', href: '/tests', icon: Activity, label: 'Test' },
        { name: 'Path', href: '/my-path', icon: Map, label: 'Hành trình' },
        { name: 'Sanctuary', href: '/sanctuary', icon: Flower2, label: 'Vườn' },
        { name: 'Expert', href: '/expertise', icon: Atom, label: 'AI' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t pb-safe">
            <div className="flex items-center justify-around p-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                                isActive
                                    ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
