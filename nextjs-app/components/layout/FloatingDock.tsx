'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Activity, Settings, BookOpen, Target, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingDock() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Trang chủ', href: '/dashboard', icon: Home },
    { name: 'Bài Test', href: '/tests', icon: Activity },
    { name: 'Tư vấn AI', href: '/ai-consultant', icon: Brain },
    { name: 'Mục tiêu', href: '/goals', icon: Target },
    { name: 'Mentor', href: '/mentor', icon: BookOpen },
    { name: 'Hồ sơ', href: '/profile', icon: User },
    { name: 'Cài đặt', href: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slideUp">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 rounded-full shadow-2xl transition-all hover:scale-105 hover:bg-white/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group"
            >
              {/* Tooltip nổi lên khi hover */}
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none backdrop-blur-sm">
                {item.name}
                {/* Arrow pointing down */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45" />
              </span>

              {/* Icon Container */}
              <div
                className={cn(
                  "p-3 rounded-full transition-all duration-300 ease-out relative",
                  isActive
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] -translate-y-2 scale-110"
                    : "text-slate-700 dark:text-slate-200 hover:bg-white/40 hover:-translate-y-1 hover:shadow-lg"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />

                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
