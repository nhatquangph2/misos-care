import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const testPageTour = driver({
    showProgress: true,
    animate: true,
    steps: [
        {
            element: '#test-categories',
            popover: {
                title: 'Thư viện bài test',
                description: 'Phân loại theo Tính cách, Tâm thần học, và Kỹ năng.',
                side: 'bottom',
                align: 'center'
            }
        },
        {
            element: '.test-card-mbti',
            popover: {
                title: 'Bài test phổ biến nhất',
                description: 'Bắt đầu với MBTI nếu bạn mới làm lần đầu.',
                side: 'right',
                align: 'start'
            }
        },
        {
            element: '#test-search',
            popover: {
                title: 'Tìm kiếm nhanh',
                description: 'Tìm bài test theo tên hoặc từ khóa liên quan.',
                side: 'bottom',
                align: 'end'
            }
        }
    ]
});
