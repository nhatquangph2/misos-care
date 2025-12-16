/**
 * VIA Character Strengths Test - Constants & Questions
 * Based on VIA Institute on Character (24 strengths under 6 virtues)
 *
 * This is a scientifically validated assessment of character strengths
 * Source: Peterson & Seligman (2004) - Character Strengths and Virtues
 */

export type VIAVirtue = 'wisdom' | 'courage' | 'humanity' | 'justice' | 'temperance' | 'transcendence'

export interface VIAQuestion {
  id: number
  strength: string // Maps to VIAStrength key
  virtue: VIAVirtue
  question: string
}

export interface VIAStrengthInfo {
  title: string
  desc: string
  virtue: string // Display name of virtue
  color: string
  icon: string
  advice: string // Development advice
}

// ============================================================================
// VIA QUESTIONS (48 Questions - 2 per strength)
// ============================================================================
export const VIA_QUESTIONS: VIAQuestion[] = [
  // --- VIRTUE: WISDOM (Trí tuệ & Kiến thức) ---

  // Creativity (Sáng tạo)
  { id: 1, strength: 'creativity', virtue: 'wisdom', question: 'Tôi luôn có thể nghĩ ra những cách giải quyết vấn đề mới mẻ và độc đáo.' },
  { id: 2, strength: 'creativity', virtue: 'wisdom', question: 'Tôi thích sáng tạo ra cái mới hơn là làm theo lối mòn cũ.' },

  // Curiosity (Tò mò)
  { id: 3, strength: 'curiosity', virtue: 'wisdom', question: 'Tôi luôn tò mò về thế giới xung quanh và thích khám phá những điều lạ.' },
  { id: 4, strength: 'curiosity', virtue: 'wisdom', question: 'Tôi thấy hứng thú với rất nhiều chủ đề khác nhau.' },

  // Judgment / Critical Thinking (Tư duy phản biện)
  { id: 5, strength: 'judgment', virtue: 'wisdom', question: 'Tôi luôn suy nghĩ kỹ và xem xét mọi khía cạnh trước khi đưa ra quyết định.' },
  { id: 6, strength: 'judgment', virtue: 'wisdom', question: 'Tôi không vội vàng kết luận khi chưa có đủ bằng chứng.' },

  // Love of Learning (Ham học hỏi)
  { id: 7, strength: 'love_of_learning', virtue: 'wisdom', question: 'Tôi cảm thấy vui sướng khi học được một kỹ năng hoặc kiến thức mới.' },
  { id: 8, strength: 'love_of_learning', virtue: 'wisdom', question: 'Tôi thường dành thời gian rảnh để đọc sách hoặc tìm hiểu cái mới.' },

  // Perspective (Góc nhìn / Khôn ngoan)
  { id: 9, strength: 'perspective', virtue: 'wisdom', question: 'Mọi người thường tìm đến tôi để xin lời khuyên khôn ngoan.' },
  { id: 10, strength: 'perspective', virtue: 'wisdom', question: 'Tôi có khả năng nhìn nhận bức tranh toàn cảnh của vấn đề.' },

  // --- VIRTUE: COURAGE (Lòng can đảm) ---

  // Bravery (Dũng cảm)
  { id: 11, strength: 'bravery', virtue: 'courage', question: 'Tôi dám nói lên suy nghĩ của mình ngay cả khi có người phản đối.' },
  { id: 12, strength: 'bravery', virtue: 'courage', question: 'Tôi không chùn bước trước khó khăn, đe dọa hay đau khổ.' },

  // Perseverance (Kiên trì)
  { id: 13, strength: 'perseverance', virtue: 'courage', question: 'Một khi đã bắt đầu làm gì, tôi sẽ hoàn thành nó đến cùng.' },
  { id: 14, strength: 'perseverance', virtue: 'courage', question: 'Tôi không bỏ cuộc khi gặp trở ngại.' },

  // Honesty (Trung thực)
  { id: 15, strength: 'honesty', virtue: 'courage', question: 'Tôi luôn nói sự thật, ngay cả khi điều đó khiến tôi gặp bất lợi.' },
  { id: 16, strength: 'honesty', virtue: 'courage', question: 'Tôi sống thật với chính mình và không giả tạo.' },

  // Zest (Nhiệt huyết)
  { id: 17, strength: 'zest', virtue: 'courage', question: 'Tôi thức dậy mỗi ngày với cảm giác hào hứng và tràn đầy năng lượng.' },
  { id: 18, strength: 'zest', virtue: 'courage', question: 'Tôi làm mọi việc với tất cả sự nhiệt tình của mình.' },

  // --- VIRTUE: HUMANITY (Tính nhân văn) ---

  // Love (Yêu thương)
  { id: 19, strength: 'love', virtue: 'humanity', question: 'Tôi có những người mà tôi có thể chia sẻ mọi cảm xúc và suy nghĩ.' },
  { id: 20, strength: 'love', virtue: 'humanity', question: 'Việc chăm sóc và yêu thương người khác rất quan trọng đối với tôi.' },

  // Kindness (Tử tế)
  { id: 21, strength: 'kindness', virtue: 'humanity', question: 'Tôi thích làm việc tốt và giúp đỡ người khác mà không cần đền đáp.' },
  { id: 22, strength: 'kindness', virtue: 'humanity', question: 'Tôi luôn quan tâm đến hạnh phúc của mọi người xung quanh.' },

  // Social Intelligence (Trí tuệ xã hội)
  { id: 23, strength: 'social_intelligence', virtue: 'humanity', question: 'Tôi dễ dàng nhận ra cảm xúc và động lực của người khác.' },
  { id: 24, strength: 'social_intelligence', virtue: 'humanity', question: 'Tôi biết cách ứng xử phù hợp trong các tình huống xã hội khác nhau.' },

  // --- VIRTUE: JUSTICE (Công lý) ---

  // Teamwork (Làm việc nhóm)
  { id: 25, strength: 'teamwork', virtue: 'justice', question: 'Tôi là một thành viên có trách nhiệm và luôn đóng góp cho nhóm.' },
  { id: 26, strength: 'teamwork', virtue: 'justice', question: 'Tôi sẵn sàng hy sinh lợi ích cá nhân vì mục tiêu chung của tập thể.' },

  // Fairness (Công bằng)
  { id: 27, strength: 'fairness', virtue: 'justice', question: 'Tôi đối xử với mọi người công bằng, không thiên vị ai.' },
  { id: 28, strength: 'fairness', virtue: 'justice', question: 'Tôi tin rằng mọi người đều xứng đáng có cơ hội như nhau.' },

  // Leadership (Lãnh đạo)
  { id: 29, strength: 'leadership', virtue: 'justice', question: 'Tôi giỏi trong việc tổ chức mọi người để hoàn thành công việc.' },
  { id: 30, strength: 'leadership', virtue: 'justice', question: 'Mọi người thường trông đợi tôi đứng ra dẫn dắt.' },

  // --- VIRTUE: TEMPERANCE (Sự điều độ) ---

  // Forgiveness (Tha thứ)
  { id: 31, strength: 'forgiveness', virtue: 'temperance', question: 'Tôi sẵn sàng tha thứ cho những người đã làm sai với tôi.' },
  { id: 32, strength: 'forgiveness', virtue: 'temperance', question: 'Tôi không giữ thù hận hay muốn trả đũa.' },

  // Humility (Khiêm tốn)
  { id: 33, strength: 'humility', virtue: 'temperance', question: 'Tôi không thích khoe khoang về thành tích của mình.' },
  { id: 34, strength: 'humility', virtue: 'temperance', question: 'Tôi thích để hành động của mình tự lên tiếng hơn là nói về nó.' },

  // Prudence (Cẩn trọng)
  { id: 35, strength: 'prudence', virtue: 'temperance', question: 'Tôi suy nghĩ rất kỹ về hậu quả trước khi nói hoặc làm.' },
  { id: 36, strength: 'prudence', virtue: 'temperance', question: 'Tôi tránh làm những việc có thể gây rắc rối sau này.' },

  // Self-Regulation (Tự chủ)
  { id: 37, strength: 'self_regulation', virtue: 'temperance', question: 'Tôi kiểm soát tốt cảm xúc và ham muốn của bản thân.' },
  { id: 38, strength: 'self_regulation', virtue: 'temperance', question: 'Tôi có tính kỷ luật cao trong việc ăn uống, tập luyện và làm việc.' },

  // --- VIRTUE: TRANSCENDENCE (Siêu việt) ---

  // Appreciation of Beauty (Thưởng thức cái đẹp)
  { id: 39, strength: 'appreciation_of_beauty', virtue: 'transcendence', question: 'Tôi thường dừng lại để ngắm nhìn vẻ đẹp của thiên nhiên hay nghệ thuật.' },
  { id: 40, strength: 'appreciation_of_beauty', virtue: 'transcendence', question: 'Tôi dễ dàng bị xúc động bởi vẻ đẹp hoặc sự tài năng xuất chúng.' },

  // Gratitude (Biết ơn)
  { id: 41, strength: 'gratitude', virtue: 'transcendence', question: 'Tôi luôn cảm thấy biết ơn vì những gì mình đang có.' },
  { id: 42, strength: 'gratitude', virtue: 'transcendence', question: 'Tôi thường xuyên nói lời cảm ơn đến người khác.' },

  // Hope (Hy vọng)
  { id: 43, strength: 'hope', virtue: 'transcendence', question: 'Tôi luôn tin rằng tương lai sẽ tốt đẹp.' },
  { id: 44, strength: 'hope', virtue: 'transcendence', question: 'Dù trong hoàn cảnh nào, tôi vẫn nhìn thấy tia hy vọng.' },

  // Humor (Hài hước)
  { id: 45, strength: 'humor', virtue: 'transcendence', question: 'Tôi thích làm cho người khác cười.' },
  { id: 46, strength: 'humor', virtue: 'transcendence', question: 'Tôi luôn tìm thấy sự hài hước ngay cả trong những tình huống khó khăn.' },

  // Spirituality (Tâm linh / Đức tin)
  { id: 47, strength: 'spirituality', virtue: 'transcendence', question: 'Tôi tin rằng cuộc sống này có một ý nghĩa và mục đích cao cả hơn.' },
  { id: 48, strength: 'spirituality', virtue: 'transcendence', question: 'Đức tin giúp tôi vững vàng và an yên.' },
]

// ============================================================================
// VIA STRENGTH DETAILS (For Results Display)
// ============================================================================
export const VIA_STRENGTH_DETAILS: Record<string, VIAStrengthInfo> = {
  // Wisdom
  creativity: {
    title: 'Sáng tạo',
    virtue: 'Trí tuệ',
    desc: 'Nghĩ ra những cách làm mới mẻ, hiệu quả. Bạn không bao giờ hài lòng với cách làm cũ kỹ.',
    color: 'text-blue-500',
    icon: '💡',
    advice: 'Hãy dành thời gian mỗi tuần để làm một điều gì đó khác biệt: vẽ tranh, viết lách, hoặc giải quyết một vấn đề theo cách mới.',
  },
  curiosity: {
    title: 'Tò mò',
    virtue: 'Trí tuệ',
    desc: 'Thích thú với mọi trải nghiệm. Bạn luôn đặt câu hỏi "Tại sao?" và tìm kiếm câu trả lời.',
    color: 'text-blue-500',
    icon: '🔍',
    advice: 'Hãy thử một món ăn mới, đi một con đường mới về nhà, hoặc đọc về một chủ đề bạn chưa từng biết.',
  },
  judgment: {
    title: 'Tư duy phản biện',
    virtue: 'Trí tuệ',
    desc: 'Suy nghĩ thấu đáo và xem xét từ nhiều phía. Bạn không vội vàng kết luận.',
    color: 'text-blue-500',
    icon: '⚖️',
    advice: 'Khi gặp một vấn đề, hãy thử viết ra ít nhất 3 góc nhìn khác nhau trước khi quyết định.',
  },
  love_of_learning: {
    title: 'Ham học hỏi',
    virtue: 'Trí tuệ',
    desc: 'Đam mê việc làm chủ các kỹ năng và kiến thức mới.',
    color: 'text-blue-500',
    icon: '📚',
    advice: 'Đăng ký một khóa học online hoặc đặt mục tiêu đọc hết một cuốn sách mỗi tháng.',
  },
  perspective: {
    title: 'Góc nhìn khôn ngoan',
    virtue: 'Trí tuệ',
    desc: 'Có khả năng nhìn bức tranh toàn cảnh và đưa ra lời khuyên sâu sắc cho người khác.',
    color: 'text-blue-500',
    icon: '🔭',
    advice: 'Hãy lắng nghe vấn đề của một người bạn và giúp họ nhìn nhận nó ở góc độ rộng hơn, tích cực hơn.',
  },

  // Courage
  bravery: {
    title: 'Dũng cảm',
    virtue: 'Can đảm',
    desc: 'Không lùi bước trước đe dọa, thử thách hay đau đớn. Bạn dám nói lên sự thật.',
    color: 'text-red-500',
    icon: '🦁',
    advice: 'Hãy thử làm một việc mà bạn vốn sợ hãi (như nói trước đám đông hoặc từ chối một yêu cầu vô lý).',
  },
  perseverance: {
    title: 'Kiên trì',
    virtue: 'Can đảm',
    desc: 'Hoàn thành những gì đã bắt đầu. Bạn kiên định với mục tiêu bất chấp khó khăn.',
    color: 'text-red-500',
    icon: '🧗',
    advice: 'Chọn một dự án bạn đã bỏ dở và cam kết dành 15 phút mỗi ngày để hoàn thành nó.',
  },
  honesty: {
    title: 'Trung thực',
    virtue: 'Can đảm',
    desc: 'Sống thật với chính mình và người khác. Bạn ghét sự giả tạo.',
    color: 'text-red-500',
    icon: '🤝',
    advice: 'Hãy tập thói quen nhận lỗi ngay lập tức khi bạn làm sai, thay vì tìm cách che giấu.',
  },
  zest: {
    title: 'Nhiệt huyết',
    virtue: 'Can đảm',
    desc: 'Sống đầy năng lượng và hứng khởi. Bạn làm mọi việc bằng cả trái tim.',
    color: 'text-red-500',
    icon: '🔥',
    advice: 'Hãy đảm bảo bạn ngủ đủ giấc và tập thể dục để duy trì nguồn năng lượng tuyệt vời này.',
  },

  // Humanity
  love: {
    title: 'Yêu thương',
    virtue: 'Nhân văn',
    desc: 'Coi trọng các mối quan hệ thân thiết. Bạn biết cách trao đi và đón nhận tình cảm.',
    color: 'text-pink-500',
    icon: '❤️',
    advice: 'Hãy gọi điện cho một người thân hoặc bạn bè cũ chỉ để hỏi thăm và nói rằng bạn quý mến họ.',
  },
  kindness: {
    title: 'Tử tế',
    virtue: 'Nhân văn',
    desc: 'Thích làm việc thiện và chăm sóc người khác mà không cần đền đáp.',
    color: 'text-pink-500',
    icon: '🤲',
    advice: 'Thực hiện một hành động tử tế ngẫu nhiên mỗi ngày (giữ cửa, khen ngợi, giúp đỡ đồng nghiệp).',
  },
  social_intelligence: {
    title: 'Trí tuệ xã hội',
    virtue: 'Nhân văn',
    desc: 'Hiểu rõ cảm xúc của bản thân và người khác. Bạn biết cách ứng xử khéo léo.',
    color: 'text-pink-500',
    icon: '🧠',
    advice: 'Trong cuộc trò chuyện tiếp theo, hãy tập trung hoàn toàn vào việc lắng nghe và quan sát ngôn ngữ cơ thể của đối phương.',
  },

  // Justice
  teamwork: {
    title: 'Làm việc nhóm',
    virtue: 'Công lý',
    desc: 'Là thành viên trách nhiệm, trung thành và luôn đóng góp cho tập thể.',
    color: 'text-purple-500',
    icon: '👥',
    advice: 'Hãy chủ động nhận một phần việc khó trong nhóm hoặc tổ chức một buổi gắn kết team.',
  },
  fairness: {
    title: 'Công bằng',
    virtue: 'Công lý',
    desc: 'Đối xử với mọi người như nhau theo nguyên tắc công bằng, không thiên vị.',
    color: 'text-purple-500',
    icon: '⚖️',
    advice: 'Khi giải quyết xung đột, hãy cố gắng lắng nghe đầy đủ ý kiến từ cả hai phía trước khi phán xét.',
  },
  leadership: {
    title: 'Lãnh đạo',
    virtue: 'Công lý',
    desc: 'Giỏi tổ chức và dẫn dắt mọi người hoàn thành mục tiêu chung.',
    color: 'text-purple-500',
    icon: '👑',
    advice: 'Hãy tìm cơ hội để hướng dẫn (mentor) một người mới trong công việc hoặc học tập.',
  },

  // Temperance
  forgiveness: {
    title: 'Tha thứ',
    virtue: 'Điều độ',
    desc: 'Sẵn sàng tha thứ cho người khác. Bạn không giữ sự thù hận trong lòng.',
    color: 'text-green-600',
    icon: '🕊️',
    advice: 'Hãy viết một lá thư (không cần gửi) tha thứ cho người đã từng làm tổn thương bạn để giải phóng bản thân.',
  },
  humility: {
    title: 'Khiêm tốn',
    virtue: 'Điều độ',
    desc: 'Để hành động tự lên tiếng. Bạn không coi mình đặc biệt hơn người khác.',
    color: 'text-green-600',
    icon: '🌾',
    advice: 'Hôm nay, hãy nhường lời khen ngợi cho người khác hoặc thừa nhận công sức của đồng đội.',
  },
  prudence: {
    title: 'Cẩn trọng',
    virtue: 'Điều độ',
    desc: 'Cẩn thận trong lựa chọn, không mạo hiểm vô ích. Bạn luôn suy tính trước sau.',
    color: 'text-green-600',
    icon: '🛡️',
    advice: 'Trước khi mua sắm hay quyết định lớn, hãy áp dụng quy tắc "chờ 24 giờ" để tránh bốc đồng.',
  },
  self_regulation: {
    title: 'Tự chủ',
    virtue: 'Điều độ',
    desc: 'Kiểm soát tốt cảm xúc, ham muốn và hành vi của bản thân.',
    color: 'text-green-600',
    icon: '🎯',
    advice: 'Luyện tập kỹ năng tự điều chỉnh qua các bài tập CBT để tăng cường khả năng kiểm soát hành vi.',
  },

  // Transcendence
  appreciation_of_beauty: {
    title: 'Thưởng thức cái đẹp',
    virtue: 'Siêu việt',
    desc: 'Nhận ra và trân trọng vẻ đẹp trong tự nhiên, nghệ thuật và cuộc sống.',
    color: 'text-indigo-500',
    icon: '🎨',
    advice: 'Hãy dành 10 phút đi dạo và chụp lại 3 thứ bạn thấy đẹp trên đường đi.',
  },
  gratitude: {
    title: 'Biết ơn',
    virtue: 'Siêu việt',
    desc: 'Luôn cảm thấy và bày tỏ lòng biết ơn với những điều tốt đẹp.',
    color: 'text-indigo-500',
    icon: '🙏',
    advice: 'Viết ra 3 điều bạn cảm thấy biết ơn vào mỗi buổi tối trước khi đi ngủ.',
  },
  hope: {
    title: 'Hy vọng',
    virtue: 'Siêu việt',
    desc: 'Lạc quan về tương lai và nỗ lực để biến nó thành hiện thực.',
    color: 'text-indigo-500',
    icon: '🌟',
    advice: 'Hãy hình dung về phiên bản tốt nhất của bạn trong 5 năm tới và viết ra một bước nhỏ để đạt được nó.',
  },
  humor: {
    title: 'Hài hước',
    virtue: 'Siêu việt',
    desc: 'Thích cười và mang lại niềm vui cho người khác. Bạn nhìn thấy mặt nhẹ nhàng của cuộc sống.',
    color: 'text-indigo-500',
    icon: '😂',
    advice: 'Hãy chia sẻ một câu chuyện vui hoặc một meme hài hước với bạn bè để lan tỏa nụ cười.',
  },
  spirituality: {
    title: 'Đức tin / Tâm linh',
    virtue: 'Siêu việt',
    desc: 'Tin vào ý nghĩa và mục đích cao cả hơn của cuộc sống.',
    color: 'text-indigo-500',
    icon: '✨',
    advice: 'Dành thời gian tĩnh lặng mỗi ngày để kết nối với nội tâm hoặc những giá trị cốt lõi của bạn.',
  },
}

// ============================================================================
// QUESTION FLOW FORMAT (For OceanTestFlow Component)
// ============================================================================
export interface VIAQuestionFlow {
  id: number
  question: string
  options: {
    value: number
    label: string
    description: string
  }[]
}

// 5-point Likert scale for VIA
export const VIA_SCALE_OPTIONS = [
  { value: 1, label: 'Rất không giống tôi', description: 'Hoàn toàn không' },
  { value: 2, label: 'Không giống tôi', description: 'Thỉnh thoảng' },
  { value: 3, label: 'Trung lập', description: 'Đôi khi' },
  { value: 4, label: 'Giống tôi', description: 'Thường xuyên' },
  { value: 5, label: 'Rất giống tôi', description: 'Hầu như luôn luôn' },
]

// Convert VIA questions to OceanTestFlow format
export const VIA_QUESTIONS_FLOW: VIAQuestionFlow[] = VIA_QUESTIONS.map((q) => ({
  id: q.id,
  question: q.question,
  options: VIA_SCALE_OPTIONS,
}))

// Test metadata
export const VIA_TEST_METADATA = {
  questionCount: VIA_QUESTIONS.length,
  estimatedMinutes: 10,
  strengthCount: 24,
  virtueCount: 6,
}
