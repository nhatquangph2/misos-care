import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const dashboardTour = driver({
    showProgress: true,
    animate: true,
    steps: [
        {
            element: '#dashboard-welcome',
            popover: {
                title: 'Dashboard của bạn 🎉',
                description: 'Đây là nơi tổng hợp tất cả kết quả và tiến trình của bạn.',
                side: 'bottom',
                align: 'center'
            }
        },
        {
            element: '#stats-summary',
            popover: {
                title: 'Chỉ số quan trọng',
                description: 'Theo dõi sự thay đổi của các chỉ số tâm lý theo thời gian.',
                side: 'top',
                align: 'start'
            }
        },
        {
            element: '#ai-consultant-trigger',
            popover: {
                title: 'Tư vấn AI',
                description: 'Nói chuyện với MISO AI để hiểu sâu hơn về kết quả của mình.',
                side: 'left',
                align: 'center'
            }
        },
        {
            element: '#recommended-tests',
            popover: {
                title: 'Đề xuất cho bạn',
                description: 'Dựa trên profile, chúng tôi gợi ý các bài test phù hợp tiếp theo.',
                side: 'top',
                align: 'center'
            }
        }
    ]
});
