export interface MentorSpecialty {
    id: string;
    name: string;
}

export interface Mentor {
    id: string;
    name: string;
    title: string;
    avatarUrl: string;
    rating: number;
    reviewCount: number;
    specialties: string[];
    bio: string;
    experienceYears: number;
    hourlyRate: number;
    availableSlotCount: number;
    languages: string[];
    education: string[];
    verified: boolean;
}

export const MOCK_MENTORS: Mentor[] = [
    {
        id: "m1",
        name: "ThS. BS Nguyễn Minh Tuấn",
        title: "Bác sĩ Tâm lý",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan",
        rating: 4.9,
        reviewCount: 128,
        specialties: ["Trầm cảm", "Rối loạn lo âu", "Stress công việc"],
        bio: "Hơn 10 năm kinh nghiệm điều trị các vấn đề về sức khỏe tâm thần tại BV Tâm thần Trung ương 1. Phong cách trị liệu nhẹ nhàng, lắng nghe và thấu hiểu.",
        experienceYears: 12,
        hourlyRate: 500000,
        availableSlotCount: 5,
        languages: ["Tiếng Việt", "English"],
        education: ["Thạc sĩ Tâm lý học Lâm sàng - ĐHQG Hà Nội", "Bác sĩ Đa khoa - ĐH Y Hà Nội"],
        verified: true
    },
    {
        id: "m2",
        name: "TS. Lê Thị Mai Hạnh",
        title: "Tiến sĩ Tâm lý học",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hanh",
        rating: 4.8,
        reviewCount: 95,
        specialties: ["Tư vấn mối quan hệ", "Gia đình", "Phát triển bản thân"],
        bio: "Chuyên gia hàng đầu về trị liệu gia đình và cặp đôi. Giúp bạn tìm lại sự cân bằng trong cuộc sống và hàn gắn các mối quan hệ.",
        experienceYears: 15,
        hourlyRate: 600000,
        availableSlotCount: 8,
        languages: ["Tiếng Việt"],
        education: ["Tiến sĩ Tâm lý học - ĐH Sư phạm TP.HCM"],
        verified: true
    },
    {
        id: "m3",
        name: "Cử nhân Trần Văn Bình",
        title: "Chuyên viên Tham vấn",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Binh",
        rating: 4.7,
        reviewCount: 42,
        specialties: ["Hướng nghiệp", "Áp lực học đường", "Gen Z"],
        bio: "Mentor trẻ trung, năng động, thấu hiểu tâm lý Gen Z. Chuyên hỗ trợ các vấn đề về định hướng nghề nghiệp và áp lực đồng trang lứa.",
        experienceYears: 4,
        hourlyRate: 300000,
        availableSlotCount: 12,
        languages: ["Tiếng Việt", "English", "Japanese"],
        education: ["Cử nhân Tâm lý học - ĐH KHXH&NV"],
        verified: true
    },
    {
        id: "m4",
        name: "ThS. Phạm Thu Trang",
        title: "Chuyên gia Trị liệu Nhận thức Hành vi",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Trang",
        rating: 5.0,
        reviewCount: 60,
        specialties: ["CBT", "Rối loạn ám ảnh cưỡng chế", "Mất ngủ"],
        bio: "Áp dụng phương pháp CBT (Nhận thức hành vi) để giúp khách hàng thay đổi tư duy và hành vi tiêu cực.",
        experienceYears: 8,
        hourlyRate: 550000,
        availableSlotCount: 3,
        languages: ["Tiếng Việt", "English"],
        education: ["Thạc sĩ Tâm lý học - Đại học Melbourne"],
        verified: true
    }
];
