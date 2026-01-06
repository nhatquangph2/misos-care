/**
 * Daily Quotes Collection
 * 50 Vietnamese motivational and mindfulness quotes for daily display
 */

export interface DailyQuote {
    text: string;
    author?: string;
    category: 'motivation' | 'mindfulness' | 'gratitude' | 'healing';
}

export const dailyQuotes: DailyQuote[] = [
    // Motivation (15 quotes)
    { text: "Mỗi ngày là một cơ hội mới để trở thành phiên bản tốt hơn của chính mình.", category: 'motivation' },
    { text: "Hành trình ngàn dặm bắt đầu từ một bước chân.", author: "Lão Tử", category: 'motivation' },
    { text: "Bạn không cần phải hoàn hảo để bắt đầu, nhưng bạn cần bắt đầu để trở nên hoàn hảo hơn.", category: 'motivation' },
    { text: "Sức mạnh không đến từ thể chất. Nó đến từ ý chí kiên định.", author: "Mahatma Gandhi", category: 'motivation' },
    { text: "Thất bại không định nghĩa bạn, cách bạn đứng dậy mới định nghĩa bạn.", category: 'motivation' },
    { text: "Đừng so sánh mình với người khác. Hãy so sánh mình ngày hôm qua với mình hôm nay.", category: 'motivation' },
    { text: "Mỗi bước tiến nhỏ vẫn là tiến bộ. Hãy tự hào về những gì bạn đã làm được.", category: 'motivation' },
    { text: "Khó khăn là bước đệm để bạn vươn cao hơn.", category: 'motivation' },
    { text: "Tin vào bản thân là bước đầu tiên để thành công.", category: 'motivation' },
    { text: "Hôm nay khó khăn, ngày mai sẽ dễ dàng hơn nếu bạn không bỏ cuộc.", category: 'motivation' },
    { text: "Bạn mạnh mẽ hơn bạn nghĩ, can đảm hơn bạn tin, và được yêu thương hơn bạn biết.", category: 'motivation' },
    { text: "Những người thành công không bao giờ bỏ cuộc, những người bỏ cuộc không bao giờ thành công.", category: 'motivation' },
    { text: "Cuộc sống không chờ đợi ai. Hãy sống trọn vẹn từng khoảnh khắc.", category: 'motivation' },
    { text: "Bạn là tác giả của cuộc đời mình. Hãy viết một câu chuyện đáng tự hào.", category: 'motivation' },
    { text: "Không bao giờ là quá muộn để bắt đầu lại.", category: 'motivation' },

    // Mindfulness (15 quotes)
    { text: "Hít thở sâu. Bạn đang ở đây, trong khoảnh khắc này, và đó là đủ.", category: 'mindfulness' },
    { text: "Tâm bình thì thế giới bình.", author: "Thích Nhất Hạnh", category: 'mindfulness' },
    { text: "Hãy để mọi thứ đến và đi. Chỉ cần quan sát, đừng phán xét.", category: 'mindfulness' },
    { text: "Hiện tại là món quà. Đó là lý do tại sao nó được gọi là 'present'.", category: 'mindfulness' },
    { text: "Bạn không thể kiểm soát sóng, nhưng bạn có thể học cách lướt sóng.", author: "Jon Kabat-Zinn", category: 'mindfulness' },
    { text: "Trong tĩnh lặng, bạn sẽ tìm thấy câu trả lời.", category: 'mindfulness' },
    { text: "Chậm lại. Cuộc sống không phải cuộc đua.", category: 'mindfulness' },
    { text: "Mỗi hơi thở là một cơ hội để bắt đầu lại.", category: 'mindfulness' },
    { text: "Hãy ở đây, ngay bây giờ. Đó là nơi duy nhất bạn cần.", category: 'mindfulness' },
    { text: "Tĩnh lặng không có nghĩa là không có điều gì xảy ra. Tĩnh lặng là tất cả đang xảy ra trong hòa bình.", category: 'mindfulness' },
    { text: "Hãy để tâm trí bạn nghỉ ngơi như mặt hồ phẳng lặng.", category: 'mindfulness' },
    { text: "Khi bạn thay đổi cách nhìn, mọi thứ bạn nhìn sẽ thay đổi.", author: "Wayne Dyer", category: 'mindfulness' },
    { text: "Mỗi khoảnh khắc là duy nhất và không bao giờ lặp lại. Hãy trân trọng.", category: 'mindfulness' },
    { text: "Không phải bận rộn mà là có mục đích. Hãy sống có ý nghĩa.", category: 'mindfulness' },
    { text: "Hãy nhẹ nhàng với bản thân. Bạn đang làm tốt nhất có thể.", category: 'mindfulness' },

    // Gratitude (10 quotes)
    { text: "Biết ơn những gì bạn có, bạn sẽ có thêm nhiều hơn.", author: "Oprah Winfrey", category: 'gratitude' },
    { text: "Hạnh phúc không phải có được mọi thứ bạn muốn, mà là trân trọng những gì bạn có.", category: 'gratitude' },
    { text: "Mỗi ngày có ít nhất 3 điều tốt đẹp. Hãy tìm và ghi nhớ chúng.", category: 'gratitude' },
    { text: "Lòng biết ơn biến những gì ta có thành đủ.", author: "Aesop", category: 'gratitude' },
    { text: "Cảm ơn cuộc sống vì những điều nhỏ bé nhưng ý nghĩa.", category: 'gratitude' },
    { text: "Khi bạn biết ơn, nỗi sợ biến mất và sự dồi dào xuất hiện.", author: "Tony Robbins", category: 'gratitude' },
    { text: "Hãy bắt đầu mỗi ngày với một trái tim biết ơn.", category: 'gratitude' },
    { text: "Những điều đơn giản nhất thường là nguồn hạnh phúc lớn nhất.", category: 'gratitude' },
    { text: "Cảm ơn những người đã ở bên bạn trong những lúc khó khăn.", category: 'gratitude' },
    { text: "Đếm phước lành, không phải vấn đề.", category: 'gratitude' },

    // Healing (10 quotes)
    { text: "Vết thương là nơi ánh sáng đi vào bạn.", author: "Rumi", category: 'healing' },
    { text: "Chữa lành không có nghĩa là quên đi. Chữa lành là học cách sống với ký ức.", category: 'healing' },
    { text: "Bạn không cô đơn trong hành trình này. Có người quan tâm đến bạn.", category: 'healing' },
    { text: "Mỗi ngày là một cơ hội mới để chữa lành và phát triển.", category: 'healing' },
    { text: "Hãy cho phép bản thân thời gian cần thiết để hồi phục.", category: 'healing' },
    { text: "Bạn xứng đáng được yêu thương, bắt đầu từ chính bản thân mình.", category: 'healing' },
    { text: "Sau cơn mưa, trời lại sáng. Sau bóng tối, bình minh lại đến.", category: 'healing' },
    { text: "Chăm sóc bản thân không phải là ích kỷ, mà là cần thiết.", category: 'healing' },
    { text: "Sức mạnh của bạn nằm ở khả năng vượt qua những điều bạn nghĩ mình không thể.", category: 'healing' },
    { text: "Hãy tin rằng mọi thứ sẽ ổn. Vì nó sẽ ổn.", category: 'healing' },
];

/**
 * Get today's quote based on day of year
 */
export function getTodayQuote(): DailyQuote {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Use day of year as index, wrap around if needed
    const index = dayOfYear % dailyQuotes.length;
    return dailyQuotes[index];
}

/**
 * Get a random quote by category
 */
export function getQuoteByCategory(category: DailyQuote['category']): DailyQuote {
    const filtered = dailyQuotes.filter(q => q.category === category);
    return filtered[Math.floor(Math.random() * filtered.length)];
}
