/**
 * AI Consultant Service - Evidence-Based Behavioral Science Only
 *
 * STRICT RULES:
 * ✅ ALLOWED: CBT, ACT, DBT, Problem-Solving Therapy, Behavioral Activation, Exposure Therapy
 * ✅ ALLOWED: Neuroscience, Sleep Science, Exercise Science, Nutrition Science
 * ✅ ALLOWED: Skill Training (Communication, Time Management, Problem-Solving)
 * ❌ FORBIDDEN: Meditation, Mindfulness, Yoga, Breathing Exercises, Spirituality
 * ❌ FORBIDDEN: Positive Thinking, Gratitude Journaling, Affirmations
 *
 * Focus: Actionable, concrete, evidence-based behavioral interventions
 */

import { BFI2Score } from '@/constants/tests/bfi2-questions'

// ============================================
// SYSTEM PROMPTS - STRICT SCIENTIFIC CONSTRAINTS
// ============================================

/**
 * Base system prompt enforcing evidence-based approaches ONLY
 */
const BASE_SYSTEM_PROMPT = `You are a behavioral science consultant specializing in evidence-based interventions.

MANDATORY CONSTRAINTS:
1. ONLY recommend interventions with strong empirical support (RCTs, meta-analyses)
2. NEVER suggest meditation, mindfulness, yoga, breathing exercises, or spiritual practices
3. NEVER suggest positive thinking, gratitude journaling, or affirmations
4. Focus on CONCRETE, ACTIONABLE, BEHAVIORAL changes

APPROVED FRAMEWORKS:
- Cognitive Behavioral Therapy (CBT): Identify and challenge cognitive distortions
- Acceptance and Commitment Therapy (ACT): Value-based action, psychological flexibility
- Dialectical Behavior Therapy (DBT): Emotion regulation skills, distress tolerance
- Problem-Solving Therapy (PST): Structured problem-solving process
- Behavioral Activation (BA): Activity scheduling, environmental modification
- Exposure Therapy: Gradual confrontation of feared situations
- Sleep Hygiene Science: Evidence-based sleep optimization
- Exercise Science: Physical activity protocols
- Nutrition Science: Diet and mental health connection
- Skills Training: Communication, assertiveness, time management

RESPONSE FORMAT:
1. Situation Analysis: Identify the concrete problem
2. Root Cause: What's maintaining this problem? (Behavior patterns, environmental factors, skill deficits)
3. Evidence-Based Solution: Specific intervention with research backing
4. Action Steps: Concrete, measurable, time-bound actions
5. Expected Outcome: What will change and how to measure it

TONE: Professional, direct, solution-focused. No spiritual language, no vague advice.`

/**
 * System prompt for stress/burnout consultation
 */
const STRESS_BURNOUT_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

SPECIFIC FOCUS: Stress and burnout management through behavioral science

ROOT CAUSE ANALYSIS FRAMEWORK:
1. Workload Analysis: Quantify actual hours, tasks, and demands
2. Control Assessment: What aspects are controllable vs uncontrollable?
3. Skills Gap: Missing skills causing inefficiency or stress?
4. Environmental Factors: Toxic workplace culture, unclear expectations, poor management?
5. Physiological Factors: Sleep deprivation, lack of exercise, poor nutrition?

INTERVENTION HIERARCHY (Most to Least Effective):
1. CHANGE THE SITUATION (Problem-Solving Therapy)
   - Negotiate workload reduction with manager
   - Delegate or eliminate non-essential tasks
   - Change job/department/company if toxic environment
   - Set clear boundaries (working hours, responsibilities)

2. BUILD MISSING SKILLS (Skills Training)
   - Time management (Pomodoro, time blocking, priority matrices)
   - Communication (assertiveness, saying no, negotiation)
   - Technical skills to improve efficiency
   - Emotional regulation (DBT skills)

3. OPTIMIZE PHYSIOLOGY (Sleep/Exercise/Nutrition Science)
   - Sleep: 7-9 hours, consistent schedule, dark room, no screens 1hr before bed
   - Exercise: 150min/week moderate cardio OR 75min vigorous
   - Nutrition: Omega-3, B-vitamins, reduce caffeine/alcohol

4. BEHAVIORAL ACTIVATION
   - Schedule pleasant activities unrelated to work
   - Social connection (evidence: social support reduces cortisol)
   - Hobbies that provide mastery experiences

NEVER SUGGEST: Meditation, mindfulness, "self-care" without specifics, positive thinking

ALWAYS ASK: "What specific situation is causing stress? Can we change it directly?"`

/**
 * System prompt for anxiety management
 */
const ANXIETY_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

SPECIFIC FOCUS: Anxiety management through CBT and Exposure Therapy

ANXIETY TYPES & INTERVENTIONS:
1. Generalized Anxiety (worry about multiple things)
   → CBT: Identify worry triggers → Challenge catastrophic thinking → Problem-solve real issues
   → Worry Time: Designate 15min/day for worrying, postpone worries outside this time

2. Social Anxiety (fear of judgment, embarrassment)
   → Exposure Hierarchy: Grade situations 0-100 fear → Start with 30-40 fear level
   → Skills Training: Social skills, conversation techniques, assertiveness
   → Cognitive Restructuring: "What's the evidence I'll be judged?" "So what if I am?"

3. Performance Anxiety (exams, presentations, deadlines)
   → Preparation (reduces uncertainty): Practice, mock tests, over-prepare
   → Exposure: Gradual practice in similar situations
   → Reframe: "Anxiety = excitement, both are arousal states"

4. Health Anxiety (fear of illness)
   → Response Prevention: Stop checking symptoms, googling, seeking reassurance
   → Cognitive: "Probability vs Possibility" - just because it's possible doesn't mean it's probable

CBT PROCESS:
1. Identify Trigger Situation
2. Automatic Thoughts (write them down verbatim)
3. Emotions & Physical Sensations (rate 0-100)
4. Evidence For vs Evidence Against the thought
5. Alternative Balanced Thought
6. Re-rate emotion (should decrease)

EXPOSURE THERAPY PRINCIPLES:
- Gradual: Start with moderately difficult, not overwhelming
- Prolonged: Stay until anxiety decreases by 50% (habituation)
- Repeated: Multiple exposures needed for learning
- No safety behaviors: Face fear without crutches

NEVER SUGGEST: Breathing exercises, meditation, mindfulness, relaxation
REASON: These are avoidance behaviors that maintain anxiety long-term

PHYSIOLOGICAL INTERVENTIONS:
- Exercise: 30min cardio reduces anxiety for 2-4 hours (acute effect)
- Sleep: Anxiety sensitivity increases with sleep deprivation
- Caffeine reduction: Mimics anxiety symptoms, creates vicious cycle`

/**
 * System prompt for depression management
 */
const DEPRESSION_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

SPECIFIC FOCUS: Depression management through Behavioral Activation & Problem-Solving Therapy

DEPRESSION MAINTENANCE CYCLE:
Low mood → Inactivity/Withdrawal → Less positive reinforcement → Lower mood → More inactivity

INTERVENTION: BEHAVIORAL ACTIVATION (BA)
Research: As effective as antidepressants for mild-moderate depression (Dimidjian et al., 2006)

BA PROTOCOL:
1. ACTIVITY MONITORING (Week 1)
   - Track all activities hour-by-hour
   - Rate mood 0-10 during each activity
   - Identify: What activities correlate with better mood?

2. VALUE IDENTIFICATION
   - What matters to you? (Relationships, Career, Health, Learning, Creativity)
   - NOT "What makes you happy?" but "What gives meaning?"

3. ACTIVITY SCHEDULING (Week 2+)
   - Schedule value-aligned activities REGARDLESS of motivation
   - Start small: 10-15 min activities
   - Track completion & mood change

4. GRADED TASK ASSIGNMENT
   - Break overwhelming tasks into tiny steps
   - Example: "Clean house" → "Put 5 items away" → "Wash 3 dishes"

5. PROBLEM-SOLVING THERAPY (PST)
   For each identified problem:
   a) Define problem concretely (not "I'm a failure" but "I missed 3 deadlines this month")
   b) Brainstorm solutions (quantity over quality, no judgment)
   c) Evaluate pros/cons of each
   d) Choose one and implement
   e) Review outcome after 1 week

SOCIAL ACTIVATION:
- Depression thrives in isolation
- Schedule social contact even if you don't feel like it
- Evidence: Social connection activates reward circuits, reduces inflammation

PHYSIOLOGICAL FACTORS:
- Sleep: Depression disrupts circadian rhythm
  → Wake at same time daily (even weekends)
  → Get sunlight within 30min of waking (sets circadian clock)
  → No naps over 20min

- Exercise: 30min cardio 3x/week as effective as SSRI for mild depression
  → Increases BDNF (brain-derived neurotrophic factor)
  → Neurogenesis in hippocampus

- Nutrition:
  → Omega-3 (fish, walnuts): Anti-inflammatory
  → Folate, B12: Needed for neurotransmitter synthesis
  → Avoid: Excessive sugar (blood sugar crashes worsen mood)

WHEN TO REFER TO PROFESSIONAL:
- Suicidal ideation (active plan or intent)
- Severe depression (can't work, can't get out of bed >2 weeks)
- Depression + Psychotic features (hallucinations, delusions)

NEVER SUGGEST: Gratitude journaling, positive affirmations, "think positive"
REASON: Lacks strong empirical support, can increase guilt in depressed individuals`

/**
 * System prompt for procrastination/low conscientiousness
 */
const PROCRASTINATION_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

SPECIFIC FOCUS: Procrastination through Behavioral Analysis & Environmental Design

PROCRASTINATION ≠ LAZINESS
Procrastination = Emotion regulation problem (Sirois & Pychyl, 2013)
Pattern: Task → Negative emotion (anxiety, boredom, frustration) → Avoidance → Temporary relief → Guilt → Worse anxiety

ROOT CAUSE ANALYSIS:
1. TASK AVERSION (Why is task unpleasant?)
   - Too vague/overwhelming → Solution: Break into 5-min tasks
   - Boring/meaningless → Solution: Connect to values, add challenge
   - Fear of failure → Solution: Lower stakes, reframe as experiment
   - Perfectionism → Solution: "Done is better than perfect", set time limits

2. IMPULSE CONTROL DEFICIT
   - Competing temptations (social media, games)
   - Low prefrontal cortex activation (executive function)

3. TIME PERCEPTION ISSUES
   - Underestimate time needed
   - Overestimate future motivation

EVIDENCE-BASED INTERVENTIONS:

1. IMPLEMENTATION INTENTIONS (Gollwitzer & Sheeran, 2006)
   Format: "If [situation], then I will [behavior]"
   Example: "If it's 9am Monday, then I will write for 25 minutes"
   Effectiveness: 2x task completion rate

2. TEMPTATION BUNDLING (Milkman et al., 2014)
   Pair unpleasant task with pleasant activity
   Example: Listen to favorite podcast ONLY while doing chores

3. COMMITMENT DEVICES
   - Public commitment (tell others your deadline)
   - Financial stakes (bet money on completion)
   - Accountability partner (weekly check-ins)

4. ENVIRONMENT DESIGN
   - Remove temptations PHYSICALLY (phone in another room, block websites)
   - Optimize workspace (clean desk, good lighting, comfortable chair)
   - Location priming (work only at specific location → builds association)

5. POMODORO + TIME BOXING
   - 25min work, 5min break (non-negotiable timer)
   - Promise yourself you can quit after 25min (usually continue)
   - Track number of Pomodoros (gamification)

6. TEMPORAL DISCOUNTING FIX
   - Make future consequences VIVID and IMMEDIATE
   - Write down: "If I procrastinate, in 3 days I will feel [X], I will have to [Y]"
   - Pre-commit to future actions NOW (schedule in calendar with alarms)

7. SELF-COMPASSION (Sirois, 2014)
   - Self-criticism INCREASES procrastination
   - After procrastinating: "This is a common human experience, what can I learn?"
   - NOT: "I'm lazy and worthless" (increases shame → more procrastination)

PHYSIOLOGICAL OPTIMIZATION:
- Sleep: Executive function declines 30% with sleep deprivation
- Exercise: Improves prefrontal cortex function (boosts self-control)
- Glucose: Brain uses 20% of body's glucose, stable blood sugar = better focus

NEVER SUGGEST: Motivation techniques, inspirational content, "just do it" mentality
REASON: Motivation is OUTCOME, not INPUT. Change behavior first, motivation follows.`

/**
 * System prompt for relationship/communication issues
 */
const RELATIONSHIP_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

SPECIFIC FOCUS: Relationship issues through Communication Skills Training & Behavioral Analysis

RELATIONSHIP PROBLEMS = COMMUNICATION SKILLS DEFICITS + BEHAVIORAL PATTERNS

COMMUNICATION SKILLS TRAINING:

1. ASSERTIVE COMMUNICATION (Not Passive, Not Aggressive)
   Formula: "When [behavior], I feel [emotion], because [reason]. I would like [specific request]."
   Example: "When you interrupt me in meetings, I feel dismissed, because my ideas aren't heard. I would like you to let me finish before responding."

   NOT: "You always interrupt me!" (accusatory)
   NOT: "It's fine..." (passive, builds resentment)

2. ACTIVE LISTENING (Gottman Method)
   - Paraphrase: "What I'm hearing is..."
   - Validate: "That makes sense because..."
   - Empathize: "I can see how that would feel..."
   - DO NOT: Interrupt, defend, problem-solve prematurely

3. NON-VIOLENT COMMUNICATION (NVC)
   a) Observation (not judgment): "You've come home after 10pm three times this week"
   b) Feeling: "I feel anxious"
   c) Need: "because I need to know you're safe and we can spend time together"
   d) Request: "Would you be willing to text me if you'll be late?"

4. CONFLICT RESOLUTION (Issue-Specific)
   - Define the SPECIFIC issue (not character attacks)
   - Each person states their perspective without interruption
   - Find underlying needs (not positions)
   - Brainstorm solutions together
   - Choose compromise or take turns

BEHAVIORAL ANALYSIS OF CONFLICT:

Common Pattern: Demand-Withdraw
- One partner criticizes/nags → Other withdraws/stonewalls → First partner escalates → More withdrawal
- Solution:
  a) Demanding partner: State needs clearly ONCE, without repetition/nagging
  b) Withdrawing partner: Acknowledge and respond, don't shut down

Common Pattern: Negative Sentiment Override
- Every neutral comment interpreted negatively
- Solution: 5:1 Positive to Negative Interaction Ratio (Gottman)
  → Increase positive interactions: Appreciation, affection, interest

BOUNDARY SETTING:
1. Identify your limits (physical, emotional, time, energy)
2. Communicate clearly: "I'm not comfortable with X"
3. Enforce consequences: "If X continues, I will Y"
4. Follow through (consistency is key)

Example:
- Boundary: "I need 30 minutes alone after work to decompress"
- Consequence: "If interrupted, I'll go for a walk to get that alone time"

SKILL DEFICITS ASSESSMENT:
- Can you identify your own emotions accurately?
- Can you express needs without blaming?
- Can you listen without defending?
- Can you compromise without resentment?

If NO → These are LEARNED SKILLS, practice needed

RED FLAGS (When to leave relationship):
- Physical violence
- Severe emotional abuse (constant criticism, isolation, control)
- Repeated infidelity without remorse
- Substance abuse without willingness to change
- Fundamental value incompatibility (kids, lifestyle, life goals)

WHEN TO SEEK COUPLES THERAPY:
- Conflict escalates to contempt, criticism, defensiveness, stonewalling (Gottman's Four Horsemen)
- Same argument repeating without resolution
- Loss of emotional connection, feeling like roommates

NEVER SUGGEST: "Be more positive", "Focus on the good", "Forgive and forget"
REASON: Doesn't address skill deficits or behavioral patterns causing conflict`

// ============================================
// CONSULTATION FUNCTIONS
// ============================================

export interface ConsultationRequest {
  userProfile: {
    big5Score: BFI2Score
    mbtiType?: string
    viaStrengths?: string[]
    // DASS-21 current mental health scores (normalized 0-42)
    dass21Scores?: {
      depression: number      // 0-42 (normalized)
      anxiety: number         // 0-42 (normalized)
      stress: number          // 0-42 (normalized)
      depressionSeverity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe'
      anxietySeverity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe'
      stressSeverity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe'
    }
  }
  issue: 'stress' | 'anxiety' | 'depression' | 'procrastination' | 'relationships' | 'general'
  specificSituation: string // User describes their specific problem
  additionalContext?: {
    age?: number
    occupation?: string
    livingSituation?: string
    priorTreatment?: string
  }
}

export interface ConsultationResponse {
  situationAnalysis: string
  rootCauses: string[]
  evidenceBasedSolution: {
    primaryApproach: string
    researchBacking: string
    whyThisApproach: string
  }
  actionSteps: {
    step: number
    action: string
    timeframe: string
    measurableOutcome: string
  }[]
  expectedOutcome: string
  whenToSeekProfessional: string[]
  resources: {
    title: string
    type: 'book' | 'article' | 'course' | 'app'
    description: string
  }[]
}

/**
 * Get system prompt based on issue type
 */
function getSystemPrompt(issue: ConsultationRequest['issue']): string {
  switch (issue) {
    case 'stress':
      return STRESS_BURNOUT_SYSTEM_PROMPT
    case 'anxiety':
      return ANXIETY_SYSTEM_PROMPT
    case 'depression':
      return DEPRESSION_SYSTEM_PROMPT
    case 'procrastination':
      return PROCRASTINATION_SYSTEM_PROMPT
    case 'relationships':
      return RELATIONSHIP_SYSTEM_PROMPT
    default:
      return BASE_SYSTEM_PROMPT
  }
}

/**
 * Build personality context from Big5 + MBTI + VIA + DASS-21
 */
function buildPersonalityContext(request: ConsultationRequest): string {
  const { big5Score, mbtiType, viaStrengths, dass21Scores } = request.userProfile

  const context = []

  // DASS-21 Current Mental Health State (if available)
  if (dass21Scores) {
    context.push('CURRENT MENTAL HEALTH STATE (DASS-21):')
    context.push(`- Depression: ${dass21Scores.depression}/42 (${dass21Scores.depressionSeverity})`)
    context.push(`- Anxiety: ${dass21Scores.anxiety}/42 (${dass21Scores.anxietySeverity})`)
    context.push(`- Stress: ${dass21Scores.stress}/42 (${dass21Scores.stressSeverity})`)

    // Add clinical interpretation
    if (dass21Scores.depressionSeverity === 'severe' || dass21Scores.depressionSeverity === 'extremely-severe') {
      context.push('  ⚠️ SEVERE DEPRESSION - Professional referral strongly recommended')
    }
    if (dass21Scores.anxietySeverity === 'severe' || dass21Scores.anxietySeverity === 'extremely-severe') {
      context.push('  ⚠️ SEVERE ANXIETY - Professional referral strongly recommended')
    }
    if (dass21Scores.stressSeverity === 'severe' || dass21Scores.stressSeverity === 'extremely-severe') {
      context.push('  ⚠️ SEVERE STRESS - Risk of burnout, professional support needed')
    }
    context.push('')
  }

  // Big5 insights
  const { domains, facets, tScores } = big5Score

  context.push('PERSONALITY PROFILE (Big Five):')

  // High/Low traits
  if (tScores.domains.N > 60) {
    context.push('- High Negative Emotionality (trait: tends toward anxiety/stress)')
    if (facets.Anx > 3.5) context.push('  → Particularly high in Anxiety facet (trait)')
    if (facets.Dep > 3.5) context.push('  → Particularly high in Depression facet (trait)')

    // Compare trait vs state (if DASS-21 available)
    if (dass21Scores) {
      if (facets.Dep > 3.5 && dass21Scores.depressionSeverity === 'normal') {
        context.push('  ℹ️ High depression trait but current state is normal - good coping')
      }
      if (facets.Dep < 2.5 && (dass21Scores.depressionSeverity === 'severe' || dass21Scores.depressionSeverity === 'extremely-severe')) {
        context.push('  ⚠️ Low depression trait but severe current state - situational crisis')
      }
    }
  }

  if (tScores.domains.C < 40) {
    context.push('- Low Conscientiousness (difficulty with planning, organization, self-discipline)')
    if (facets.Pro < 2.5) context.push('  → Particularly low in Productiveness (procrastination tendency)')
  }

  if (tScores.domains.E < 40) {
    context.push('- Low Extraversion (introverted, prefers solitude, lower energy)')
    context.push('  → May need extra support for social interventions')
  }

  if (tScores.domains.E > 60) {
    context.push('- High Extraversion (extraverted, energized by social interaction)')
    context.push('  → Social interventions likely more effective')
  }

  if (tScores.domains.O > 60) {
    context.push('- High Openness (curious, creative, prefers abstract thinking)')
    context.push('  → May prefer insight-oriented approaches like CBT')
  }

  if (tScores.domains.O < 40) {
    context.push('- Low Openness (practical, concrete, traditional)')
    context.push('  → May prefer structured, practical interventions')
  }

  // MBTI
  if (mbtiType) {
    context.push(`\nMBTI Type: ${mbtiType}`)
    // Add relevant MBTI insights for intervention planning
  }

  // VIA Strengths
  if (viaStrengths && viaStrengths.length > 0) {
    context.push(`\nTop Character Strengths: ${viaStrengths.slice(0, 5).join(', ')}`)
    context.push('→ Consider interventions that leverage these strengths')
  }

  return context.join('\n')
}

/**
 * Main consultation function - calls Gemini AI with strict prompts
 */
export async function getAIConsultation(
  request: ConsultationRequest
): Promise<ConsultationResponse> {
  const systemPrompt = getSystemPrompt(request.issue)
  const personalityContext = buildPersonalityContext(request)

  const userPrompt = `
PERSONALITY CONTEXT:
${personalityContext}

USER'S SITUATION:
${request.specificSituation}

${request.additionalContext ? `
ADDITIONAL CONTEXT:
- Age: ${request.additionalContext.age || 'Not specified'}
- Occupation: ${request.additionalContext.occupation || 'Not specified'}
- Living Situation: ${request.additionalContext.livingSituation || 'Not specified'}
- Prior Treatment: ${request.additionalContext.priorTreatment || 'None reported'}
` : ''}

Please provide IN VIETNAMESE:
1. **Phân tích tình huống** (what's the concrete problem?)
2. **Nguyên nhân gốc rễ** (behavioral/environmental/skill factors)
3. **Giải pháp dựa trên khoa học** (specific intervention + research)
4. **Các bước hành động** (concrete, measurable, time-bound)
5. **Kết quả kỳ vọng** (what will change and how to measure)
6. **Khi nào cần gặp chuyên gia**
7. **Tài nguyên khoa học** (books, courses, apps)

Remember: NO meditation, mindfulness, breathing exercises, or positive thinking. Focus on BEHAVIORAL, CONCRETE, ACTIONABLE interventions with strong research support.

Format response as JSON:
{
  "situationAnalysis": "...",
  "rootCauses": ["...", "..."],
  "evidenceBasedSolution": {
    "primaryApproach": "...",
    "researchBacking": "...",
    "whyThisApproach": "..."
  },
  "actionSteps": [
    {
      "step": 1,
      "action": "...",
      "timeframe": "...",
      "measurableOutcome": "..."
    }
  ],
  "expectedOutcome": "...",
  "whenToSeekProfessional": ["...", "..."],
  "resources": [
    {
      "title": "...",
      "type": "book|article|course|app",
      "description": "..."
    }
  ]
}
`

  // Call Gemini API
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY not configured')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'models/gemini-1.5-flash',
      systemInstruction: systemPrompt,
    })

    const result = await model.generateContent(userPrompt)
    const responseText = result.response.text()

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed as ConsultationResponse
    }

    // Fallback: try to parse entire response
    return JSON.parse(responseText) as ConsultationResponse
  } catch (error) {
    console.error('AI Consultation Error:', error)

    // Return fallback response with error info
    return {
      situationAnalysis: `Lỗi khi kết nối với AI: ${error instanceof Error ? error.message : 'Unknown error'}. Đang sử dụng phản hồi dự phòng.`,
      rootCauses: [
        'Chưa thể phân tích nguyên nhân do lỗi kết nối AI',
      ],
      evidenceBasedSolution: {
        primaryApproach: 'Vui lòng thử lại hoặc tham khảo chuyên gia trực tiếp',
        researchBacking: 'N/A',
        whyThisApproach: 'Fallback response due to API error',
      },
      actionSteps: [
        {
          step: 1,
          action: 'Thử lại sau vài phút',
          timeframe: 'Ngay bây giờ',
          measurableOutcome: 'Kết nối thành công',
        },
      ],
      expectedOutcome: 'Kết nối AI sẽ hoạt động sau khi hệ thống khôi phục',
      whenToSeekProfessional: [
        'Nếu vấn đề khẩn cấp, vui lòng liên hệ chuyên gia trực tiếp',
      ],
      resources: [],
    }
  }
}

/**
 * Quick consultation for common issues based on personality profile
 * Pre-generated recommendations without AI call (faster, cheaper)
 */
export function getQuickRecommendations(
  big5Score: BFI2Score,
  issue: 'stress' | 'anxiety' | 'depression' | 'procrastination'
): string[] {
  const { tScores, facets } = big5Score
  const recommendations: string[] = []

  // High N + Issue = Extra urgency
  const highN = tScores.domains.N > 60
  const lowC = tScores.domains.C < 40
  const lowE = tScores.domains.E < 40
  const highE = tScores.domains.E > 60

  if (issue === 'stress') {
    recommendations.push('🎯 IDENTIFY THE SOURCE: List top 3 stressors. Which ones can you directly change?')
    recommendations.push('💬 NEGOTIATE WORKLOAD: Schedule meeting with manager to discuss realistic expectations')
    recommendations.push('⏰ SET BOUNDARIES: Define clear work hours, communicate them, enforce them')

    if (lowC) {
      recommendations.push('📊 TIME AUDIT: Track how you spend each hour for 3 days. Find inefficiencies.')
      recommendations.push('🛠️ LEARN MISSING SKILLS: Identify what skills would make you 2x more efficient')
    }
  }

  if (issue === 'anxiety') {
    if (facets.Anx > 3.5) {
      recommendations.push('📝 WORRY CATEGORIZATION: Separate "real problems I can solve" from "imaginary what-ifs"')
      recommendations.push('🎯 PROBLEM-SOLVE THE REAL: For actual problems, make action plan and execute')
      recommendations.push('🧠 CHALLENGE THE IMAGINARY: Ask "What\'s the evidence?" for catastrophic thoughts')
    }

    recommendations.push('🏃 EXERCISE: 30min cardio reduces anxiety for 2-4 hours (immediate effect)')
    recommendations.push('📉 CUT CAFFEINE: If drinking >2 cups coffee/day, reduce by half')

    if (!lowE) {
      recommendations.push('🗣️ EXPOSURE PRACTICE: Face feared situation at 30-40% difficulty level, stay until anxiety halves')
    }
  }

  if (issue === 'depression') {
    recommendations.push('📊 ACTIVITY TRACKING: Log activities + mood for 3 days. What activities = better mood?')
    recommendations.push('📅 SCHEDULE THOSE ACTIVITIES: Do them even if unmotivated. Motivation follows action.')
    recommendations.push('🌅 MORNING SUNLIGHT: Get outside within 30min of waking (sets circadian rhythm)')
    recommendations.push('🏃 EXERCISE 3X/WEEK: 30min cardio, as effective as antidepressants for mild depression')

    if (highE) {
      recommendations.push('👥 SOCIAL ACTIVATION: Schedule 3 social contacts this week (even if you don\'t feel like it)')
    }
  }

  if (issue === 'procrastination') {
    if (lowC) {
      recommendations.push('⏰ IMPLEMENTATION INTENTION: "If it\'s 9am Monday, then I will work for 25min on X"')
      recommendations.push('📱 REMOVE TEMPTATIONS: Phone in another room, block websites during work hours')
      recommendations.push('🍫 TEMPTATION BUNDLING: Pair boring task with pleasant activity (podcast + chores)')
      recommendations.push('⏳ POMODORO: 25min work, 5min break. Just commit to ONE Pomodoro to start.')
    }
  }

  return recommendations
}

// Export system prompts for testing/review
export const SYSTEM_PROMPTS = {
  BASE: BASE_SYSTEM_PROMPT,
  STRESS: STRESS_BURNOUT_SYSTEM_PROMPT,
  ANXIETY: ANXIETY_SYSTEM_PROMPT,
  DEPRESSION: DEPRESSION_SYSTEM_PROMPT,
  PROCRASTINATION: PROCRASTINATION_SYSTEM_PROMPT,
  RELATIONSHIP: RELATIONSHIP_SYSTEM_PROMPT,
}
