/**
 * Mascot Service
 * AI-powered personality and conversation logic for Dory the Dolphin
 */

import type { MascotMood } from '@/stores/mascotStore'

// =====================================================
// AI PERSONALITY CONFIGURATION
// =====================================================

export const DORY_PERSONALITY = {
  name: 'Dory',
  nameVi: 'Dory',
  species: 'Dolphin',
  role: 'Mental Health Companion',
  traits: [
    'Empathetic and caring',
    'Playful and friendly',
    'Supportive without being pushy',
    'Wise but humble',
    'Vietnamese Gen Z friendly',
    'Uses emojis naturally',
    'Never judgmental',
    'Celebrates small wins',
  ],
  systemPrompt: `You are Dory, a friendly dolphin mascot for Miso's Care - a mental health and personality testing platform for Vietnamese Gen Z users.

PERSONALITY:
- You are warm, empathetic, and playful
- You speak Vietnamese naturally with Gen Z slang when appropriate
- You use emojis to express emotions (🐬💙✨🎉)
- You're supportive but never pushy or annoying
- You celebrate achievements and encourage users gently
- You're aware of mental health sensitivity - never dismiss concerns
- You're like a caring friend, not a therapist

TONE:
- Casual and friendly (dùng "mình" cho I, "bạn" cho you)
- Short, conversational messages (2-3 sentences max)
- Encourage without pressure
- Show genuine interest in user's wellbeing

CONTEXT AWARENESS:
- You know which test the user is taking
- You remember user's achievements and streaks
- You adjust mood based on test results (celebrate high scores, comfort low scores)
- If crisis detected (PHQ-9 high), show concern and suggest professional help

RESTRICTIONS:
- Never give medical advice or diagnoses
- Always emphasize tests are for self-awareness, not professional assessment
- If user shows distress, gently suggest speaking to a professional
- Don't be overly chatty - respect user's space

Keep responses concise, warm, and contextual.`,
}

// =====================================================
// CONVERSATION CONTEXT
// =====================================================

export interface ConversationContext {
  page: 'home' | 'tests' | 'test-taking' | 'results' | 'dashboard' | 'profile'
  testType?: string
  testProgress?: number
  testResult?: {
    score: number
    percentage: number
    severity?: string
    isCrisis?: boolean
  }
  userStats?: {
    testsCompleted: number
    currentStreak: number
    level: number
  }
  recentAchievement?: string
}

// =====================================================
// AI RESPONSE GENERATION
// =====================================================

/**
 * Generate AI response using OpenAI (placeholder - will integrate later)
 * For now, returns contextual pre-defined messages
 */
export async function generateMascotResponse(
  userMessage: string,
  context: ConversationContext
): Promise<{ text: string; mood: MascotMood }> {
  // TODO: Integrate with OpenAI API
  // For MVP, use rule-based responses

  const message = userMessage.toLowerCase()

  // Greeting responses
  if (message.match(/^(hi|hello|chào|xin chào|hey)/)) {
    return {
      text: 'Chào bạn! Mình là Dory đây! Có gì mình giúp được bạn không? 🐬',
      mood: 'waving',
    }
  }

  // Help requests
  if (message.match(/(help|giúp|hỗ trợ|support)/)) {
    return {
      text: 'Mình ở đây để hỗ trợ bạn! Bạn có thể làm các bài test để hiểu rõ bản thân, xem kết quả, hoặc chat với mình bất cứ lúc nào! 💙',
      mood: 'encouraging',
    }
  }

  // Test recommendations
  if (message.match(/(test|bài test|làm gì|recommend|gợi ý)/)) {
    if (context.userStats?.testsCompleted === 0) {
      return {
        text: 'Bạn chưa làm bài test nào à? Mình gợi ý bắt đầu với MBTI hoặc SISRI-24 - hai bài rất thú vị đấy! 🎯',
        mood: 'encouraging',
      }
    } else {
      return {
        text: 'Dựa vào những gì bạn đã làm, mình nghĩ bạn nên thử PHQ-9 hoặc DASS-21 để hiểu rõ hơn về sức khỏe tinh thần nhé! 💚',
        mood: 'thinking',
      }
    }
  }

  // Feeling queries
  if (message.match(/(cảm thấy|feel|mood|tâm trạng|buồn|vui|sad|happy)/)) {
    return {
      text: 'Cảm xúc của bạn rất quan trọng đấy! Nếu bạn muốn, hãy làm bài PHQ-9 để đánh giá tâm trạng gần đây. Hoặc cứ chia sẻ với mình nếu muốn! 🤗',
      mood: 'concerned',
    }
  }

  // Achievements
  if (message.match(/(thành tích|achievement|điểm|points|level)/)) {
    const stats = context.userStats
    return {
      text: `Bạn đã hoàn thành ${stats?.testsCompleted || 0} bài test, có ${stats?.currentStreak || 0} ngày streak, và đang ở level ${stats?.level || 1}! Tuyệt vời! 🎉`,
      mood: 'celebrating',
    }
  }

  // Default response
  return {
    text: 'Mình hiểu! Bạn có thể nói rõ hơn được không? Hoặc hãy thử hỏi mình về các bài test, thành tích, hoặc cách cải thiện sức khỏe tinh thần nhé! 😊',
    mood: 'thinking',
  }
}

// =====================================================
// CONTEXTUAL MESSAGE GENERATOR
// =====================================================

/**
 * Generate contextual message based on page and user state
 */
export function getContextualMessage(context: ConversationContext): {
  text: string
  mood: MascotMood
} {
  const { page, testProgress, testResult, userStats, recentAchievement } = context

  // Recent achievement - celebrate!
  if (recentAchievement) {
    return {
      text: `Chúc mừng! Bạn vừa mở khóa thành tích "${recentAchievement}"! 🎉`,
      mood: 'celebrating',
    }
  }

  // Page-specific messages
  switch (page) {
    case 'home':
      return {
        text: 'Chào mừng đến với Miso\'s Care! Sẵn sàng khám phá bản thân chưa? 🐬',
        mood: 'waving',
      }

    case 'tests':
      if (userStats?.testsCompleted === 0) {
        return {
          text: 'Đây là lần đầu bạn làm test à? Đừng lo, mình sẽ ở bên bạn! Chọn bài test mà bạn tò mò nhất nhé! ✨',
          mood: 'encouraging',
        }
      }
      return {
        text: 'Bạn muốn khám phá thêm về bản thân à? Tuyệt vời! Chọn bài test bạn thích nhé! 🎯',
        mood: 'happy',
      }

    case 'test-taking':
      if (testProgress && testProgress > 50) {
        return {
          text: 'Hơn nửa rồi! Bạn làm tốt lắm! Tiếp tục nào! 💪',
          mood: 'encouraging',
        }
      }
      return {
        text: 'Hãy trả lời thật lòng để kết quả chính xác nhất nhé! Mình tin bạn! 🌟',
        mood: 'happy',
      }

    case 'results':
      if (testResult?.isCrisis) {
        return {
          text: 'Mình thấy bạn có vẻ đang gặp khó khăn. Đừng ngại tìm kiếm sự hỗ trợ từ chuyên gia nhé! Mình luôn ở đây! 💙',
          mood: 'concerned',
        }
      }
      if (testResult && testResult.percentage >= 70) {
        return {
          text: 'Kết quả tuyệt vời! Bạn đang phát triển rất tốt! Mình tự hào về bạn! 🎉',
          mood: 'celebrating',
        }
      }
      return {
        text: 'Cảm ơn bạn đã hoàn thành! Hãy đọc kỹ kết quả và khuyến nghị để phát triển bản thân nhé! 📊',
        mood: 'happy',
      }

    case 'dashboard':
      const streak = userStats?.currentStreak || 0
      if (streak >= 7) {
        return {
          text: `Wow! Streak ${streak} ngày rồi! Bạn thật kiên trì! Tiếp tục duy trì nhé! 🔥`,
          mood: 'celebrating',
        }
      }
      return {
        text: 'Dashboard của bạn đây! Xem lại các thành tích và tiếp tục hành trình phát triển bản thân nha! 📈',
        mood: 'happy',
      }

    default:
      return {
        text: 'Mình đang ở đây nếu bạn cần gì! Cứ thoải mái nói chuyện với mình nhé! 😊',
        mood: 'idle',
      }
  }
}

// =====================================================
// MOOD DETERMINATION
// =====================================================

/**
 * Determine mascot mood based on context
 */
export function determineMood(context: ConversationContext): MascotMood {
  // Crisis detected - show concern
  if (context.testResult?.isCrisis) {
    return 'concerned'
  }

  // Achievement unlocked - celebrate
  if (context.recentAchievement) {
    return 'celebrating'
  }

  // High test score - happy
  if (context.testResult && context.testResult.percentage >= 70) {
    return 'celebrating'
  }

  // Low test score - concerned but supportive
  if (context.testResult && context.testResult.percentage < 40) {
    return 'concerned'
  }

  // Good streak - excited
  if (context.userStats?.currentStreak && context.userStats.currentStreak >= 7) {
    return 'excited'
  }

  // Taking test - encouraging
  if (context.page === 'test-taking') {
    return 'encouraging'
  }

  // Default - happy idle
  return 'happy'
}

// =====================================================
// SUGGESTION GENERATOR
// =====================================================

/**
 * Generate personalized suggestions for user
 */
export function generateSuggestions(context: ConversationContext): string[] {
  const suggestions: string[] = []

  const { userStats, testResult } = context

  // Suggest first test
  if (userStats?.testsCompleted === 0) {
    suggestions.push('Làm bài test MBTI để khám phá tính cách')
    suggestions.push('Thử SISRI-24 để hiểu về trí tuệ tâm linh')
    suggestions.push('Đánh giá sức khỏe tinh thần với PHQ-9')
  }

  // Suggest completing more tests
  if (userStats && userStats.testsCompleted > 0 && userStats.testsCompleted < 7) {
    suggestions.push(`Hoàn thành thêm ${7 - userStats.testsCompleted} bài test nữa`)
  }

  // Suggest building streak
  if (userStats && userStats.currentStreak < 7) {
    suggestions.push('Quay lại mỗi ngày để xây dựng streak')
  }

  // Suggest professional help if needed
  if (testResult?.isCrisis) {
    suggestions.push('Tìm kiếm hỗ trợ từ chuyên gia sức khỏe tinh thần')
  }

  // Suggest viewing results
  if (userStats && userStats.testsCompleted > 0) {
    suggestions.push('Xem lại kết quả các bài test trước đó')
  }

  return suggestions.slice(0, 3) // Return max 3 suggestions
}
