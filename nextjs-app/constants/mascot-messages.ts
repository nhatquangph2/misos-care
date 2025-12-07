/**
 * Mascot Context Messages
 * Pre-defined messages for different contexts
 */

import type { MascotMood } from '@/stores/mascotStore'

export interface ContextMessage {
  text: string
  mood: MascotMood
  trigger?: string // Optional event trigger
}

// =====================================================
// GREETING MESSAGES
// =====================================================

export const GREETING_MESSAGES: ContextMessage[] = [
  {
    text: 'Chào bạn! Mình là Dory, người bạn đồng hành cùng bạn khám phá sức khỏe tinh thần! 🐬',
    mood: 'waving',
  },
  {
    text: 'Hế lô! Mình thấy bạn có vẻ tò mò nhỉ? Hãy cùng mình tìm hiểu về bản thân bạn nha! 💙',
    mood: 'happy',
  },
  {
    text: 'Chào bạn mới! Mình là Dory - chuyên gia tư vấn sức khỏe tinh thần của bạn đây! ✨',
    mood: 'excited',
  },
]

// =====================================================
// TEST SELECTION MESSAGES
// =====================================================

export const TEST_SELECTION_MESSAGES: ContextMessage[] = [
  {
    text: 'Hmm... bạn đang chọn bài test nào đây? Mình gợi ý bạn nên bắt đầu với MBTI hoặc SISRI-24 đấy! 🎯',
    mood: 'thinking',
  },
  {
    text: 'Có 7 bài test thú vị đang chờ bạn đấy! Bạn muốn khám phá tính cách hay đánh giá sức khỏe tinh thần trước? 🤔',
    mood: 'encouraging',
  },
  {
    text: 'Mỗi bài test sẽ giúp bạn hiểu rõ hơn về chính mình. Bắt đầu thôi nào! 🌟',
    mood: 'happy',
  },
]

// =====================================================
// DURING TEST MESSAGES
// =====================================================

export const DURING_TEST_MESSAGES: ContextMessage[] = [
  {
    text: 'Bạn đang làm rất tốt! Hãy trả lời thật lòng để kết quả chính xác nhất nhé! 💪',
    mood: 'encouraging',
  },
  {
    text: 'Còn một chút nữa thôi! Mình tin bạn có thể hoàn thành! 🔥',
    mood: 'happy',
  },
  {
    text: 'Hãy dành chút thời gian suy nghĩ kỹ trước khi trả lời nha bạn! ⏰',
    mood: 'idle',
  },
]

// =====================================================
// TEST COMPLETION MESSAGES
// =====================================================

export const TEST_COMPLETION_MESSAGES: ContextMessage[] = [
  {
    text: 'Tuyệt vời! Bạn vừa hoàn thành bài test! Cùng xem kết quả thôi! 🎉',
    mood: 'celebrating',
  },
  {
    text: 'Xong rồi! Mình đang tính toán kết quả cho bạn... 🧮',
    mood: 'thinking',
  },
  {
    text: 'Wow! Bạn thật kiên trì! Kết quả sẽ rất thú vị đấy! ✨',
    mood: 'happy',
  },
]

// =====================================================
// RESULTS PAGE MESSAGES
// =====================================================

export const RESULTS_MESSAGES = {
  high: [
    {
      text: 'Kết quả của bạn rất ấn tượng! Bạn đang trên con đường phát triển tốt! 🌟',
      mood: 'celebrating' as MascotMood,
    },
    {
      text: 'Tuyệt vời! Điểm số này cho thấy bạn có nền tảng vững chắc! 💪',
      mood: 'happy' as MascotMood,
    },
  ],
  moderate: [
    {
      text: 'Kết quả tốt đấy! Vẫn còn nhiều điều để khám phá và phát triển nữa! 📈',
      mood: 'encouraging' as MascotMood,
    },
    {
      text: 'Bạn đang trên đúng hướng! Hãy tiếp tục phát triển bản thân nhé! 🎯',
      mood: 'happy' as MascotMood,
    },
  ],
  low: [
    {
      text: 'Đừng lo lắng! Kết quả này chỉ là bước đầu để hiểu rõ bản thân. Mình luôn ở đây để hỗ trợ bạn! 💙',
      mood: 'concerned' as MascotMood,
    },
    {
      text: 'Cảm ơn bạn đã tin tưởng chia sẻ. Hãy xem phần khuyến nghị để cải thiện nhé! 🌱',
      mood: 'encouraging' as MascotMood,
    },
  ],
  crisis: [
    {
      text: 'Mình thấy bạn có vẻ đang gặp khó khăn. Bạn có muốn nói chuyện với một chuyên gia không? Mình có thể giúp bạn kết nối! 🤝',
      mood: 'concerned' as MascotMood,
    },
    {
      text: 'Bạn không đơn độc đâu! Có rất nhiều người quan tâm và sẵn sàng giúp đỡ bạn. Hãy tìm sự hỗ trợ nhé! ❤️',
      mood: 'concerned' as MascotMood,
    },
  ],
}

// =====================================================
// ACHIEVEMENT MESSAGES
// =====================================================

export const ACHIEVEMENT_MESSAGES: Record<string, ContextMessage> = {
  'first-test': {
    text: 'Chúc mừng! Bạn vừa hoàn thành bài test đầu tiên! Đây là bước đầu tiên tuyệt vời! 🎯',
    mood: 'celebrating',
  },
  'test-trio': {
    text: 'Wow! 3 bài test rồi! Bạn thật kiên trì! Mở khóa thành tích "Bộ ba khám phá"! 🎪',
    mood: 'celebrating',
  },
  'spiritual-explorer': {
    text: 'Tuyệt vời! Bạn đã khám phá trí tuệ tâm linh của mình! Mở khóa "Nhà thám hiểm tâm linh"! ✨',
    mood: 'celebrating',
  },
  'personality-master': {
    text: 'Bạn là bậc thầy tính cách rồi! Đã hiểu rõ về MBTI và Big5! 🧠',
    mood: 'celebrating',
  },
  'week-warrior': {
    text: 'Streak 7 ngày! Bạn là chiến binh tuần lễ! Tiếp tục duy trì nhé! 🔥',
    mood: 'celebrating',
  },
  'mental-health-advocate': {
    text: 'Bạn thật quan tâm đến sức khỏe tinh thần! Thành tích "Người ủng hộ" đã mở khóa! 💚',
    mood: 'celebrating',
  },
  'completionist': {
    text: 'HOÀN THÀNH TẤT CẢ! Bạn là người hoàn thành xuất sắc! Mình tự hào về bạn lắm! 🏆',
    mood: 'celebrating',
  },
}

// =====================================================
// STREAK MESSAGES
// =====================================================

export const STREAK_MESSAGES = {
  start: {
    text: 'Bắt đầu streak ngày 1! Hãy quay lại mỗi ngày để duy trì nhé! 📅',
    mood: 'happy' as MascotMood,
  },
  continue: (days: number) => ({
    text: `Tuyệt vời! Bạn đã duy trì streak ${days} ngày! Tiếp tục nào! 🔥`,
    mood: 'celebrating' as MascotMood,
  }),
  broken: {
    text: 'Ối! Streak bị gián đoạn rồi. Không sao, bắt đầu lại từ hôm nay nhé! 💪',
    mood: 'encouraging' as MascotMood,
  },
}

// =====================================================
// IDLE MESSAGES (Random motivation)
// =====================================================

export const IDLE_MESSAGES: ContextMessage[] = [
  {
    text: 'Psst... Bạn có muốn làm thêm bài test nào không? 👀',
    mood: 'idle',
  },
  {
    text: 'Mình đang bơi vòng vòng đây... Có chuyện gì thú vị không? 🌊',
    mood: 'idle',
  },
  {
    text: 'Hôm nay bạn cảm thấy thế nào? Muốn chia sẻ không? 💙',
    mood: 'idle',
  },
  {
    text: 'Mình có thể giúp gì cho bạn không? Cứ hỏi mình nhé! 😊',
    mood: 'encouraging',
  },
]

// =====================================================
// RETURN MESSAGES (User came back)
// =====================================================

export const RETURN_MESSAGES = {
  sameDay: {
    text: 'Ô, bạn quay lại rồi à! Vui quá! Có gì mình giúp được không? 😊',
    mood: 'happy' as MascotMood,
  },
  nextDay: {
    text: 'Chào mừng bạn trở lại! Streak của bạn vẫn đang tốt đấy! 🔥',
    mood: 'excited' as MascotMood,
  },
  longTime: (days: number) => ({
    text: `Ơ hay! Đã ${days} ngày rồi! Mình nhớ bạn lắm! Cùng tiếp tục hành trình nhé! 💙`,
    mood: 'excited' as MascotMood,
  }),
}

// =====================================================
// ERROR/SUPPORT MESSAGES
// =====================================================

export const SUPPORT_MESSAGES: ContextMessage[] = [
  {
    text: 'Ối! Có gì đó không đúng rồi. Bạn thử reload trang xem sao nhé! 🔄',
    mood: 'concerned',
  },
  {
    text: 'Hmm... Mình không hiểu lắm. Bạn có thể hỏi lại không? 🤔',
    mood: 'thinking',
  },
  {
    text: 'Nếu bạn cần hỗ trợ, hãy liên hệ team support nhé! Mình luôn ở đây! 💪',
    mood: 'encouraging',
  },
]

// =====================================================
// GOALS & ACTION PLANS MESSAGES
// =====================================================

export const GOAL_MESSAGES = {
  created: {
    text: 'Wow! Bạn vừa tạo một mục tiêu mới! Mình sẽ cổ vũ bạn đạt được nó nhé! 💪',
    mood: 'excited' as MascotMood,
  },
  completed: {
    text: '🎉 CHÚC MỪNG! Bạn vừa hoàn thành một mục tiêu! Mình tự hào về bạn lắm! 🌟',
    mood: 'celebrating' as MascotMood,
  },
  nearDeadline: (days: number) => ({
    text: `Nhắc nhở nè! Mục tiêu của bạn còn ${days} ngày nữa hết hạn. Cố lên! 💪`,
    mood: 'encouraging' as MascotMood,
  }),
  overdue: {
    text: 'Ối! Mục tiêu này đã quá hạn rồi. Bạn muốn điều chỉnh lại thời gian không? 📅',
    mood: 'concerned' as MascotMood,
  },
  firstGoal: {
    text: 'Xuất sắc! Đây là mục tiêu đầu tiên của bạn! Hành trình ngàn dặm bắt đầu từ bước chân đầu tiên! 🚀',
    mood: 'celebrating' as MascotMood,
  },
}

export const ACTION_PLAN_MESSAGES = {
  created: {
    text: 'Tuyệt vời! Kế hoạch hành động của bạn đã sẵn sàng! Từng bước nhỏ sẽ đưa bạn đến đích! 📋',
    mood: 'happy' as MascotMood,
  },
  completed: {
    text: '✅ Hoàn thành! Bạn vừa tick thêm một item! Cứ tiếp tục như vậy! 🔥',
    mood: 'happy' as MascotMood,
  },
  streakMilestone: (days: number) => ({
    text: `🔥 AMAZING! Streak ${days} ngày liên tiếp! Bạn thật kiên định! 💎`,
    mood: 'celebrating' as MascotMood,
  }),
  streakBroken: {
    text: 'Ối! Streak bị gián đoạn rồi. Không sao cả, quan trọng là tiếp tục! 💪',
    mood: 'encouraging' as MascotMood,
  },
  reminder: (actionName: string) => ({
    text: `⏰ Đến giờ rồi! Đừng quên: ${actionName}. Mình tin bạn làm được! 🎯`,
    mood: 'waving' as MascotMood,
  }),
  weeklyProgress: (completed: number, total: number) => ({
    text: `Tuần này bạn đã hoàn thành ${completed}/${total} kế hoạch! ${completed === total ? 'Hoàn hảo! 🌟' : 'Cố lên nào! 💪'}`,
    mood: completed === total ? ('celebrating' as MascotMood) : ('encouraging' as MascotMood),
  }),
}

export const GOALS_PAGE_MESSAGES: ContextMessage[] = [
  {
    text: 'Chào bạn! Đây là nơi bạn đặt mục tiêu và theo dõi tiến độ đấy! Hãy bắt đầu với một mục tiêu nhỏ nhé! 🎯',
    mood: 'encouraging',
  },
  {
    text: 'Mục tiêu rõ ràng = Con đường thành công! Mình sẽ giúp bạn theo dõi từng bước! 📊',
    mood: 'happy',
  },
  {
    text: 'Bạn biết không? Người có mục tiêu cụ thể thường thành công hơn 10 lần! Cùng bắt đầu thôi! 🚀',
    mood: 'excited',
  },
]

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get random message from array
 */
export function getRandomMessage(messages: ContextMessage[]): ContextMessage {
  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Get contextual greeting based on time of day
 */
export function getGreetingByTime(): ContextMessage {
  const hour = new Date().getHours()

  if (hour < 12) {
    return {
      text: 'Chào buổi sáng! Hy vọng bạn đã ngủ ngon! Bắt đầu ngày mới thôi! ☀️',
      mood: 'happy',
    }
  } else if (hour < 18) {
    return {
      text: 'Chào buổi chiều! Bạn có thời gian khám phá bản thân một chút không? 🌤️',
      mood: 'happy',
    }
  } else {
    return {
      text: 'Chào buổi tối! Sau một ngày bận rộn, hãy cùng thư giãn và tìm hiểu bản thân nhé! 🌙',
      mood: 'idle',
    }
  }
}

/**
 * Get result message based on percentage
 */
export function getResultMessage(percentage: number, isCrisis: boolean = false): ContextMessage {
  if (isCrisis) {
    return getRandomMessage(RESULTS_MESSAGES.crisis)
  }

  if (percentage >= 70) {
    return getRandomMessage(RESULTS_MESSAGES.high)
  } else if (percentage >= 40) {
    return getRandomMessage(RESULTS_MESSAGES.moderate)
  } else {
    return getRandomMessage(RESULTS_MESSAGES.low)
  }
}
