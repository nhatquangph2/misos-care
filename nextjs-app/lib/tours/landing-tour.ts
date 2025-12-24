import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const landingPageTour = driver({
    showProgress: true,
    animate: true,
    showButtons: ['next', 'previous', 'close'],
    steps: [
        {
            element: 'header .container',
            popover: {
                title: 'Chào mừng đến MisosCare! 🐬',
                description: 'Chúng tôi giúp bạn thấu hiểu bản thân thông qua các bài test khoa học.',
                side: 'bottom',
                align: 'start'
            }
        },
        {
            element: '#how-it-works',
            popover: {
                title: 'Quy trình đơn giản',
                description: '4 bước nhanh chóng để khám phá tính cách và sức khỏe tinh thần.',
                side: 'top',
                align: 'center'
            }
        },
        {
            element: 'button.shadow-blue-500\\/20', // Hero CTA
            popover: {
                title: 'Hành động ngay',
                description: 'Click vào đây để bắt đầu bài test đầu tiên của bạn!',
                side: 'right',
                align: 'center'
            }
        },
        {
            element: 'nav [href="/about"]',
            popover: {
                title: 'Tìm hiểu thêm',
                description: 'Xem sứ mệnh và đội ngũ đằng sau MisosCare.',
                side: 'bottom',
                align: 'center'
            }
        }
    ]
});
