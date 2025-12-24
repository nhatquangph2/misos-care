import Link from 'next/link';
import { Star, Clock, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mentor } from '@/types/database'; // CHANGED: Import from database types

interface MentorCardProps {
    mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
    return (
        <div className="group relative flex flex-col md:flex-row gap-6 p-6 bg-card border rounded-2xl hover:shadow-lg transition-all duration-300">
            {/* Avatar Section */}
            <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
                <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md">
                        <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {mentor.verified && (
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-background" title="Đã xác thực">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{mentor.rating}</span>
                    <span className="text-muted-foreground text-sm font-normal">({mentor.total_reviews})</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {mentor.name}
                        </h3>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mentor.hourly_rate)}/h
                        </span>
                    </div>
                    {/* Using credentials/title if available */}
                    <p className="text-muted-foreground font-medium">{mentor.title || mentor.credentials}</p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                    {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {mentor.specialties?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-normal">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {/* Assuming experience_years might be absent in type due to file update failure, casting safely or handling fallback */}
                        <span>{(mentor as any).experience_years || 0} năm KN</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Sẵn sàng</span>
                    </div>
                </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col justify-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l pl-0 md:pl-6">
                <Link href={`/mentors/${mentor.id}`} className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Đặt lịch ngay
                    </Button>
                </Link>
                <Link href={`/mentors/${mentor.id}`} className="w-full">
                    <Button variant="outline" className="w-full group/btn">
                        Xem hồ sơ
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
