# AI Consultant Implementation - Evidence-Based Behavioral Science

## Overview

The AI Consultant feature provides personalized mental health support using **strictly evidence-based behavioral science** approaches. It leverages Google's Gemini 2.0 Flash model with carefully crafted system prompts to ensure scientifically rigorous recommendations.

## 🎯 Core Principles

### ✅ ALLOWED Approaches
- **CBT (Cognitive Behavioral Therapy)**: Identifying and challenging cognitive distortions
- **ACT (Acceptance and Commitment Therapy)**: Value-based action, psychological flexibility
- **DBT (Dialectical Behavior Therapy)**: Emotion regulation, distress tolerance
- **Problem-Solving Therapy**: Structured problem-solving process
- **Behavioral Activation**: Activity scheduling, environmental modification
- **Exposure Therapy**: Gradual confrontation of feared situations
- **Skills Training**: Communication, assertiveness, time management
- **Neuroscience-based**: Sleep hygiene, exercise science, nutrition

### ❌ FORBIDDEN Approaches
- Meditation, mindfulness, yoga
- Breathing exercises (avoidance behaviors)
- Positive thinking, gratitude journaling, affirmations
- Spiritual practices
- Vague "self-care" advice without specifics

## 📁 File Structure

```
nextjs-app/
├── app/
│   ├── (dashboard)/
│   │   └── ai-consultant/
│   │       └── page.tsx                 # Main AI Consultant page
│   └── api/
│       └── ai-consultant/
│           └── route.ts                  # API endpoint
├── components/
│   └── ai/
│       └── AIConsultantChat.tsx         # Chat UI component
├── services/
│   └── ai-consultant.service.ts         # Core AI logic & prompts
└── supabase/
    └── migrations/
        └── 20241217_ai_consultations.sql # Database schema
```

## 🧠 Implementation Details

### 1. System Prompts (`ai-consultant.service.ts`)

The system uses **issue-specific prompts** to ensure targeted, evidence-based responses:

- **Base System Prompt**: Enforces scientific rigor across all consultations
- **Stress/Burnout Prompt**: Focuses on workload analysis, skill gaps, environmental factors
- **Anxiety Prompt**: Emphasizes CBT, exposure therapy, cognitive restructuring
- **Depression Prompt**: Uses Behavioral Activation, Problem-Solving Therapy
- **Procrastination Prompt**: Addresses emotion regulation, implementation intentions
- **Relationship Prompt**: Teaches assertive communication, conflict resolution

### 2. Personality Integration

The AI consultant uses the user's personality profile to tailor recommendations:

```typescript
// Big5 Profile Analysis
- High Neuroticism → Extra attention to anxiety/stress management
- Low Conscientiousness → More structure, implementation intentions
- High/Low Extraversion → Adjust social intervention recommendations
- High Openness → Prefer insight-oriented approaches (CBT)
- Low Openness → Prefer structured, practical interventions

// MBTI Type → Communication style adjustments
// VIA Strengths → Leverage character strengths in interventions
```

### 3. Response Structure

Every AI response follows this format:

```typescript
{
  situationAnalysis: string        // Concrete problem identification
  rootCauses: string[]             // Behavioral/environmental/skill factors
  evidenceBasedSolution: {
    primaryApproach: string        // Specific intervention (e.g., "CBT")
    researchBacking: string        // Research citations
    whyThisApproach: string        // Why it fits this person
  }
  actionSteps: {
    step: number
    action: string                 // Concrete, measurable action
    timeframe: string              // When to do it
    measurableOutcome: string      // How to measure success
  }[]
  expectedOutcome: string          // What will change
  whenToSeekProfessional: string[] // Crisis indicators
  resources: {
    title: string
    type: 'book' | 'article' | 'course' | 'app'
    description: string
  }[]
}
```

### 4. Database Logging

Consultations are logged to `ai_consultations` table for:
- User history (view past consultations)
- Analytics (most common issues, effectiveness tracking)
- Privacy-compliant (user can delete their data)

```sql
CREATE TABLE ai_consultations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  issue_type TEXT CHECK (issue_type IN ('stress', 'anxiety', ...)),
  situation TEXT,
  created_at TIMESTAMPTZ
);
```

## 🚀 Usage

### User Flow

1. **Navigate to AI Consultant**:
   - Click "Tư vấn AI" in the floating navigation dock
   - Or visit `/ai-consultant`

2. **Prerequisites**:
   - Must complete Big5 personality test
   - Optional: MBTI, VIA Character Strengths (for better personalization)

3. **Consultation Process**:
   - Select issue type (stress, anxiety, depression, etc.)
   - Describe specific situation in detail
   - Submit to AI
   - Receive evidence-based recommendations

### API Endpoint

```typescript
POST /api/ai-consultant

Request:
{
  userProfile: {
    big5Score: BFI2Score,      // Required
    mbtiType?: string,         // Optional
    viaStrengths?: string[]    // Optional
  },
  issue: 'stress' | 'anxiety' | 'depression' | 'procrastination' | 'relationships' | 'general',
  specificSituation: string,
  additionalContext?: {
    age?: number,
    occupation?: string,
    livingSituation?: string,
    priorTreatment?: string
  }
}

Response:
{
  success: true,
  data: ConsultationResponse
}
```

## 🔒 Safety & Ethics

### Built-in Safeguards

1. **Crisis Detection**: AI always includes "When to Seek Professional" section
2. **Disclaimer**: Prominent warning that AI is NOT a replacement for professionals
3. **Crisis Resources**: Every page displays emergency hotlines
4. **No Medical Advice**: Strictly behavioral interventions, no medication recommendations
5. **Research-Backed**: Every recommendation tied to empirical research

### Ethical Constraints

```typescript
// In system prompts:
"MANDATORY: NO meditation, mindfulness, breathing exercises"
"REASON: These lack strong RCT support OR can be avoidance behaviors"

"FOCUS: Concrete, actionable, measurable behavioral changes"
"EXAMPLES:
  ✅ 'Schedule 30min cardio 3x/week' (specific, measurable)
  ❌ 'Practice self-care' (vague, unmeasurable)"
```

## 📊 Quality Assurance

### System Prompt Validation

Each system prompt is designed to:
1. **Prevent hallucination**: Strict constraints on allowed interventions
2. **Ensure actionability**: All recommendations must be concrete, measurable
3. **Require research**: Every approach must cite empirical backing
4. **Reject pseudo-science**: Explicitly forbidden list of non-evidence-based practices

### Response Validation

```typescript
// Gemini API Response Parsing
1. Extract JSON from AI response
2. Validate structure matches ConsultationResponse type
3. Fallback response if API fails
4. Error logging for debugging
```

## 🧪 Testing Scenarios

### Test Cases

1. **High Stress + High Conscientiousness**:
   - Expected: Recommend workload negotiation, boundary setting
   - Avoid: Generic "relax" advice

2. **Anxiety + Low Extraversion**:
   - Expected: Gradual exposure hierarchy, social skills training
   - Avoid: "Just talk to more people"

3. **Depression + Low Activity**:
   - Expected: Behavioral Activation protocol (schedule activities REGARDLESS of motivation)
   - Avoid: "Think positive" or "Be grateful"

4. **Procrastination + Low Conscientiousness**:
   - Expected: Implementation intentions, environment design, Pomodoro
   - Avoid: "Just be more disciplined"

## 🔮 Future Enhancements

### Planned Features

1. **Conversation History**:
   - Store full consultation responses
   - Allow users to view past consultations
   - Track progress over time

2. **Follow-up Check-ins**:
   - Scheduled reminders to implement action steps
   - Outcome tracking: "Did this recommendation help?"
   - Adaptive recommendations based on what worked

3. **Integration with Goals System**:
   - Auto-convert action steps to trackable goals
   - Link goals to consultation context

4. **Analytics Dashboard**:
   - Most common issues
   - Effectiveness metrics
   - User satisfaction ratings

### Technical Improvements

1. **Streaming Responses**:
   - Use Gemini's streaming API for real-time display
   - Better UX for long responses

2. **Caching**:
   - Cache common responses (low N + stress → similar recommendations)
   - Reduce API costs

3. **A/B Testing**:
   - Test different prompt phrasings
   - Measure which interventions users actually implement

## 📝 Maintenance Notes

### Environment Variables Required

```bash
GOOGLE_GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Database Migration

```bash
# Apply migration to create ai_consultations table
# In Supabase SQL Editor, run:
supabase/migrations/20241217_ai_consultations.sql
```

### Monitoring

Key metrics to track:
- API latency (target: <3 seconds)
- Error rate (target: <1%)
- User satisfaction (future: rating system)
- Action step completion rate (future: tracking)

## 📚 Research References

The system prompts reference these evidence bases:

1. **CBT**: Beck, A.T. (1976). Cognitive Therapy and the Emotional Disorders
2. **Behavioral Activation**: Martell et al. (2001). Behavioral Activation for Depression
3. **Exposure Therapy**: Foa & Kozak (1986). Emotional processing of fear
4. **Problem-Solving Therapy**: D'Zurilla & Nezu (2007). Problem-Solving Therapy
5. **Implementation Intentions**: Gollwitzer & Sheeran (2006). Meta-analysis
6. **Exercise & Depression**: Blumenthal et al. (1999). Exercise vs. medication

## 🆘 Crisis Protocol

If user mentions suicidal ideation or severe crisis:

1. **AI Response**: Always includes crisis hotline in "When to Seek Professional"
2. **UI Alert**: Red banner with crisis resources
3. **No Self-Help**: AI should NOT provide self-help for severe cases
4. **Immediate Referral**: Direct to emergency services (115) or crisis hotline (1800-599-920)

---

**Version**: 1.0.0
**Last Updated**: 2024-12-17
**Author**: Claude Code
**License**: Proprietary (Miso's Care)
