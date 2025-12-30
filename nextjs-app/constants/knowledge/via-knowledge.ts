/**
 * VIA Character Strengths Knowledge Base
 * 
 * PRIMARY SOURCES:
 * ================
 * 
 * FOUNDATIONAL:
 * - Peterson, C., & Seligman, M. E. P. (2004). Character Strengths and Virtues:
 *   A Handbook and Classification. Oxford University Press & APA.
 *   [Original VIA Classification - 24 strengths, 6 virtues - the "DSM of positive psychology"]
 * - VIA Institute on Character: https://www.viacharacter.org/
 *   [Free VIA Survey of Character Strengths assessment]
 * 
 * VIA-BIG5 CORRELATIONS (all values in big5Correlations are from):
 * - Noftle, E. E., Schnitker, S. A., & Robins, R. W. (2007). Character and personality:
 *   Connections between positive psychology and personality psychology.
 *   Personality and Individual Differences, 43, 1273-1286.
 *   [Key correlations: Perseverance↔C r=.62, Zest↔E r=.58, Creativity↔O r=.58,
 *    Kindness↔A r=.62, Self-regulation↔C r=.58]
 * 
 * WELL-BEING CORRELATIONS (wellbeingCorrelation values from):
 * - Park, N., Peterson, C., & Seligman, M. E. P. (2004). Strengths of character and well-being.
 *   Journal of Social and Clinical Psychology, 23(5), 603-619.
 *   [Top well-being correlates: Hope r=.52, Zest r=.52, Gratitude r=.50, Curiosity r=.45]
 * - Brdar, I., & Kashdan, T. B. (2010). Character strengths and well-being in Croatia.
 *   Journal of Research in Personality, 44(1), 151-154. [Cross-cultural validation]
 * 
 * SIGNATURE STRENGTHS:
 * - Niemiec, R. M. (2019). Character Strengths Interventions: A Field Guide for Practitioners.
 *   Hogrefe. [Signature strengths criteria and interventions]
 * - Seligman, M. E. P., Steen, T. A., Park, N., & Peterson, C. (2005). Positive psychology
 *   progress: Empirical validation of interventions. American Psychologist, 60(5), 410-421.
 *   DOI: 10.1037/0003-066X.60.5.410 [Using signature strengths in new ways intervention]
 * 
 * STRENGTH DEVELOPMENT:
 * - Quinlan, D., Swain, N., & Vella-Brodrick, D. A. (2012). Character strengths interventions.
 *   Journal of Happiness Studies, 13(6), 1145-1163. DOI: 10.1007/s10902-011-9311-5
 *   [Effect of strength-based interventions on well-being]
 */

// ============================================
// CORE TYPES
// ============================================

export interface VIAStrength {
    id: string
    name: string
    nameVi: string
    virtue: 'wisdom' | 'courage' | 'humanity' | 'justice' | 'temperance' | 'transcendence'
    definition: string
    definitionVi: string
    underuse: string
    overuse: string
    // Correlations with well-being (r values from meta-analyses)
    wellbeingCorrelation: number
    // Big5 correlations from Noftle et al. (2007)
    big5Correlations: { O: number; C: number; E: number; A: number; N: number }
    // Signature strength indicators
    signatureIndicators: string[]
    // Development exercises
    developmentExercises: string[]
    developmentExercisesVi: string[]
}

export interface VIAVirtue {
    id: string
    name: string
    nameVi: string
    description: string
    strengths: string[]  // IDs of strengths in this virtue
}

// ============================================
// 6 VIRTUES
// ============================================

export const VIA_VIRTUES: VIAVirtue[] = [
    {
        id: 'wisdom',
        name: 'Wisdom & Knowledge',
        nameVi: 'Trí tuệ & Kiến thức',
        description: 'Cognitive strengths that entail the acquisition and use of knowledge',
        strengths: ['creativity', 'curiosity', 'judgment', 'love_of_learning', 'perspective']
    },
    {
        id: 'courage',
        name: 'Courage',
        nameVi: 'Dũng cảm',
        description: 'Emotional strengths that involve the exercise of will to accomplish goals in the face of opposition',
        strengths: ['bravery', 'perseverance', 'honesty', 'zest']
    },
    {
        id: 'humanity',
        name: 'Humanity',
        nameVi: 'Nhân văn',
        description: 'Interpersonal strengths that involve tending and befriending others',
        strengths: ['love', 'kindness', 'social_intelligence']
    },
    {
        id: 'justice',
        name: 'Justice',
        nameVi: 'Công lý',
        description: 'Civic strengths that underlie healthy community life',
        strengths: ['teamwork', 'fairness', 'leadership']
    },
    {
        id: 'temperance',
        name: 'Temperance',
        nameVi: 'Tiết độ',
        description: 'Strengths that protect against excess',
        strengths: ['forgiveness', 'humility', 'prudence', 'self_regulation']
    },
    {
        id: 'transcendence',
        name: 'Transcendence',
        nameVi: 'Siêu việt',
        description: 'Strengths that forge connections to the larger universe and provide meaning',
        strengths: ['appreciation_of_beauty', 'gratitude', 'hope', 'humor', 'spirituality']
    }
]

// ============================================
// 24 CHARACTER STRENGTHS
// ============================================

export const VIA_STRENGTHS: VIAStrength[] = [
    // WISDOM
    {
        id: 'creativity',
        name: 'Creativity',
        nameVi: 'Sáng tạo',
        virtue: 'wisdom',
        definition: 'Thinking of novel and productive ways to do things',
        definitionVi: 'Suy nghĩ về các cách mới và hiệu quả để làm việc',
        underuse: 'Conformity, traditional',
        overuse: 'Eccentricity, impractical',
        wellbeingCorrelation: 0.32,
        big5Correlations: { O: 0.58, C: -0.05, E: 0.22, A: 0.08, N: -0.12 },
        signatureIndicators: ['Constantly producing new ideas', 'Feeling energized by brainstorming', 'Bored by routine'],
        developmentExercises: ['Try a new creative medium weekly', 'Brainstorm 10 solutions before choosing', 'Combine unrelated concepts'],
        developmentExercisesVi: ['Thử một phương tiện sáng tạo mới hàng tuần', 'Brainstorm 10 giải pháp trước khi chọn', 'Kết hợp các khái niệm không liên quan']
    },
    {
        id: 'curiosity',
        name: 'Curiosity',
        nameVi: 'Tò mò',
        virtue: 'wisdom',
        definition: 'Taking an interest in ongoing experience; finding all subjects fascinating',
        definitionVi: 'Quan tâm đến trải nghiệm đang diễn ra; thấy mọi chủ đề đều hấp dẫn',
        underuse: 'Disinterest, boredom',
        overuse: 'Nosiness, intrusiveness',
        wellbeingCorrelation: 0.45,
        big5Correlations: { O: 0.52, C: 0.12, E: 0.38, A: 0.15, N: -0.22 },
        signatureIndicators: ['Asking lots of questions', 'Exploring unfamiliar topics', 'Never feeling bored'],
        developmentExercises: ['Ask "Why?" 5 times deep', 'Learn something new daily', 'Explore unfamiliar neighborhoods'],
        developmentExercisesVi: ['Hỏi "Tại sao?" 5 lần sâu', 'Học điều mới mỗi ngày', 'Khám phá các khu phố xa lạ']
    },
    {
        id: 'judgment',
        name: 'Judgment/Critical Thinking',
        nameVi: 'Phán đoán/Tư duy phản biện',
        virtue: 'wisdom',
        definition: 'Thinking things through and examining them from all sides; weighing evidence fairly',
        definitionVi: 'Suy nghĩ thấu đáo và xem xét từ mọi phía; cân nhắc bằng chứng công bằng',
        underuse: 'Unreflective, gullible',
        overuse: 'Cynical, critical',
        wellbeingCorrelation: 0.28,
        big5Correlations: { O: 0.38, C: 0.25, E: -0.08, A: -0.12, N: -0.18 },
        signatureIndicators: ['Changing mind with new evidence', 'Playing devil\'s advocate', 'Distrusting simple answers'],
        developmentExercises: ['Argue the opposite position', 'Seek disconfirming evidence', 'Evaluate sources critically'],
        developmentExercisesVi: ['Lập luận vị trí ngược lại', 'Tìm kiếm bằng chứng phản bác', 'Đánh giá nguồn một cách phê phán']
    },
    {
        id: 'love_of_learning',
        name: 'Love of Learning',
        nameVi: 'Yêu thích Học hỏi',
        virtue: 'wisdom',
        definition: 'Mastering new skills, topics, and bodies of knowledge',
        definitionVi: 'Thành thạo các kỹ năng, chủ đề và khối kiến thức mới',
        underuse: 'Complacency, self-satisfaction',
        overuse: 'Know-it-all, snobbery',
        wellbeingCorrelation: 0.35,
        big5Correlations: { O: 0.48, C: 0.32, E: 0.12, A: 0.08, N: -0.15 },
        signatureIndicators: ['Reading/studying for pleasure', 'Taking courses voluntarily', 'Excited by new subjects'],
        developmentExercises: ['Take an online course monthly', 'Teach others what you learn', 'Visit museums/lectures'],
        developmentExercisesVi: ['Tham gia khóa học trực tuyến hàng tháng', 'Dạy người khác những gì bạn học', 'Tham quan bảo tàng/bài giảng']
    },
    {
        id: 'perspective',
        name: 'Perspective/Wisdom',
        nameVi: 'Góc nhìn/Trí tuệ',
        virtue: 'wisdom',
        definition: 'Being able to provide wise counsel to others; having ways of looking at the world that make sense',
        definitionVi: 'Có thể đưa ra lời khuyên khôn ngoan cho người khác; có cách nhìn thế giới có ý nghĩa',
        underuse: 'Shallow, superficial',
        overuse: 'Overbearing, preachy',
        wellbeingCorrelation: 0.42,
        big5Correlations: { O: 0.35, C: 0.18, E: 0.15, A: 0.28, N: -0.25 },
        signatureIndicators: ['Others seek your advice', 'Seeing the big picture', 'Integrating diverse viewpoints'],
        developmentExercises: ['Mentor someone younger', 'Write about life lessons', 'Consider long-term consequences'],
        developmentExercisesVi: ['Hướng dẫn người trẻ hơn', 'Viết về bài học cuộc sống', 'Xem xét hậu quả dài hạn']
    },

    // COURAGE
    {
        id: 'bravery',
        name: 'Bravery',
        nameVi: 'Dũng cảm',
        virtue: 'courage',
        definition: 'Not shrinking from threat, challenge, difficulty, or pain; speaking up for what is right',
        definitionVi: 'Không lùi bước trước mối đe dọa, thách thức, khó khăn hoặc đau đớn; lên tiếng vì điều đúng',
        underuse: 'Cowardice, timidity',
        overuse: 'Recklessness, foolhardiness',
        wellbeingCorrelation: 0.38,
        big5Correlations: { O: 0.22, C: 0.18, E: 0.35, A: -0.05, N: -0.32 },
        signatureIndicators: ['Standing up against injustice', 'Taking unpopular positions', 'Facing fears head-on'],
        developmentExercises: ['Face one small fear daily', 'Speak up in meetings', 'Defend someone being treated unfairly'],
        developmentExercisesVi: ['Đối mặt với một nỗi sợ nhỏ mỗi ngày', 'Lên tiếng trong các cuộc họp', 'Bảo vệ người bị đối xử bất công']
    },
    {
        id: 'perseverance',
        name: 'Perseverance',
        nameVi: 'Kiên trì',
        virtue: 'courage',
        definition: 'Finishing what one starts; persisting in a course of action in spite of obstacles',
        definitionVi: 'Hoàn thành những gì đã bắt đầu; kiên trì theo đuổi hành động bất chấp trở ngại',
        underuse: 'Laziness, giving up easily',
        overuse: 'Obsessiveness, stubbornness',
        wellbeingCorrelation: 0.42,
        big5Correlations: { O: 0.08, C: 0.62, E: 0.15, A: 0.12, N: -0.28 },
        signatureIndicators: ['Finishing projects', 'Working through difficulties', 'Not giving up'],
        developmentExercises: ['Set and complete 30-day challenges', 'Work on one long-term project', 'Track daily progress'],
        developmentExercisesVi: ['Đặt và hoàn thành thử thách 30 ngày', 'Làm việc trên một dự án dài hạn', 'Theo dõi tiến trình hàng ngày']
    },
    {
        id: 'honesty',
        name: 'Honesty/Authenticity',
        nameVi: 'Trung thực/Chân thật',
        virtue: 'courage',
        definition: 'Speaking the truth; presenting oneself in a genuine way; being without pretense',
        definitionVi: 'Nói sự thật; thể hiện bản thân một cách chân thực; không giả tạo',
        underuse: 'Phoniness, deceptiveness',
        overuse: 'Bluntness, hurtfulness',
        wellbeingCorrelation: 0.40,
        big5Correlations: { O: 0.15, C: 0.32, E: 0.08, A: 0.38, N: -0.22 },
        signatureIndicators: ['Cannot lie comfortably', 'Value authenticity', 'Dislike pretense'],
        developmentExercises: ['Speak truthfully even when difficult', 'Admit mistakes promptly', 'Express genuine feelings'],
        developmentExercisesVi: ['Nói thật ngay cả khi khó khăn', 'Thừa nhận lỗi lầm ngay lập tức', 'Bày tỏ cảm xúc chân thật']
    },
    {
        id: 'zest',
        name: 'Zest/Enthusiasm',
        nameVi: 'Hăng hái/Nhiệt huyết',
        virtue: 'courage',
        definition: 'Approaching life with excitement and energy; feeling alive and activated',
        definitionVi: 'Tiếp cận cuộc sống với sự hào hứng và năng lượng; cảm thấy sống động và tràn đầy sức sống',
        underuse: 'Sedentary, lifeless',
        overuse: 'Hyperactive, exhausting',
        wellbeingCorrelation: 0.52,  // Highest correlation with well-being
        big5Correlations: { O: 0.28, C: 0.25, E: 0.58, A: 0.18, N: -0.42 },
        signatureIndicators: ['High energy levels', 'Excited about activities', 'Enthusiasm is contagious'],
        developmentExercises: ['Start mornings with energizing routine', 'Try one new activity weekly', 'Exercise regularly'],
        developmentExercisesVi: ['Bắt đầu buổi sáng với thói quen tràn đầy năng lượng', 'Thử một hoạt động mới hàng tuần', 'Tập thể dục thường xuyên']
    },

    // HUMANITY
    {
        id: 'love',
        name: 'Love',
        nameVi: 'Tình yêu',
        virtue: 'humanity',
        definition: 'Valuing close relations with others; being close to people',
        definitionVi: 'Đánh giá cao các mối quan hệ thân thiết với người khác; gần gũi với mọi người',
        underuse: 'Emotional isolation',
        overuse: 'Emotional promiscuity',
        wellbeingCorrelation: 0.48,
        big5Correlations: { O: 0.12, C: 0.08, E: 0.45, A: 0.42, N: -0.18 },
        signatureIndicators: ['Deep relationships matter most', 'Express affection easily', 'Feel loved and loving'],
        developmentExercises: ['Express appreciation to loved ones daily', 'Schedule quality time', 'Practice active listening'],
        developmentExercisesVi: ['Bày tỏ sự trân trọng với người thân hàng ngày', 'Lên lịch thời gian chất lượng', 'Thực hành lắng nghe tích cực']
    },
    {
        id: 'kindness',
        name: 'Kindness',
        nameVi: 'Tử tế',
        virtue: 'humanity',
        definition: 'Doing favors and good deeds for others; helping them; taking care of them',
        definitionVi: 'Làm ơn và việc tốt cho người khác; giúp đỡ họ; chăm sóc họ',
        underuse: 'Indifference, coldness',
        overuse: 'Intrusiveness, martyrdom',
        wellbeingCorrelation: 0.45,
        big5Correlations: { O: 0.08, C: 0.15, E: 0.28, A: 0.62, N: -0.12 },
        signatureIndicators: ['Always helping others', 'Generous with time', 'Putting others first'],
        developmentExercises: ['Perform 3 acts of kindness daily', 'Volunteer regularly', 'Pay it forward'],
        developmentExercisesVi: ['Thực hiện 3 hành động tử tế mỗi ngày', 'Tình nguyện thường xuyên', 'Làm điều tốt cho người khác']
    },
    {
        id: 'social_intelligence',
        name: 'Social Intelligence',
        nameVi: 'Trí tuệ Xã hội',
        virtue: 'humanity',
        definition: 'Being aware of the motives and feelings of others and oneself',
        definitionVi: 'Nhận thức được động cơ và cảm xúc của người khác và của bản thân',
        underuse: 'Cluelessness, social blindness',
        overuse: 'Manipulation, cunning',
        wellbeingCorrelation: 0.42,
        big5Correlations: { O: 0.18, C: 0.12, E: 0.42, A: 0.35, N: -0.15 },
        signatureIndicators: ['Reading social situations easily', 'Adapting to different groups', 'Understanding emotions'],
        developmentExercises: ['Practice perspective-taking', 'Observe social dynamics', 'Ask about others\' feelings'],
        developmentExercisesVi: ['Thực hành nhìn từ góc nhìn người khác', 'Quan sát động lực xã hội', 'Hỏi về cảm xúc của người khác']
    },

    // JUSTICE
    {
        id: 'teamwork',
        name: 'Teamwork',
        nameVi: 'Làm việc Nhóm',
        virtue: 'justice',
        definition: 'Working well as a member of a group or team; being loyal to the group',
        definitionVi: 'Làm việc tốt với tư cách là thành viên của nhóm; trung thành với nhóm',
        underuse: 'Selfishness, individualism',
        overuse: 'Groupthink, loss of identity',
        wellbeingCorrelation: 0.35,
        big5Correlations: { O: 0.05, C: 0.22, E: 0.35, A: 0.48, N: -0.08 },
        signatureIndicators: ['Thrive in groups', 'Loyal to team', 'Put group before self'],
        developmentExercises: ['Join a team activity', 'Support team members', 'Celebrate group success'],
        developmentExercisesVi: ['Tham gia hoạt động nhóm', 'Hỗ trợ thành viên nhóm', 'Ăn mừng thành công của nhóm']
    },
    {
        id: 'fairness',
        name: 'Fairness',
        nameVi: 'Công bằng',
        virtue: 'justice',
        definition: 'Treating all people the same according to notions of fairness and justice',
        definitionVi: 'Đối xử bình đẳng với mọi người theo quan niệm về công bằng và công lý',
        underuse: 'Favoritism, bias',
        overuse: 'Detachment, lack of empathy',
        wellbeingCorrelation: 0.32,
        big5Correlations: { O: 0.12, C: 0.18, E: 0.05, A: 0.42, N: -0.12 },
        signatureIndicators: ['Strong sense of justice', 'Cannot stand unfairness', 'Treat everyone equally'],
        developmentExercises: ['Examine own biases', 'Volunteer for justice causes', 'Advocate for underrepresented'],
        developmentExercisesVi: ['Xem xét thiên kiến của bản thân', 'Tình nguyện cho các hoạt động công lý', 'Ủng hộ những người bị bỏ quên']
    },
    {
        id: 'leadership',
        name: 'Leadership',
        nameVi: 'Lãnh đạo',
        virtue: 'justice',
        definition: 'Encouraging a group of which one is a member to get things done; maintaining good relations within the group',
        definitionVi: 'Khuyến khích nhóm mà mình là thành viên hoàn thành công việc; duy trì quan hệ tốt trong nhóm',
        underuse: 'Passive, follower-only',
        overuse: 'Despotic, controlling',
        wellbeingCorrelation: 0.38,
        big5Correlations: { O: 0.15, C: 0.28, E: 0.52, A: 0.18, N: -0.22 },
        signatureIndicators: ['Naturally organizing groups', 'Others look to you for direction', 'Enjoy leading'],
        developmentExercises: ['Take leadership role in project', 'Practice public speaking', 'Mentor others'],
        developmentExercisesVi: ['Đảm nhận vai trò lãnh đạo trong dự án', 'Thực hành nói trước công chúng', 'Hướng dẫn người khác']
    },

    // TEMPERANCE
    {
        id: 'forgiveness',
        name: 'Forgiveness',
        nameVi: 'Tha thứ',
        virtue: 'temperance',
        definition: 'Forgiving those who have done wrong; giving people a second chance',
        definitionVi: 'Tha thứ cho những người đã làm sai; cho người khác cơ hội thứ hai',
        underuse: 'Mercilessness, vengefulness',
        overuse: 'Permissiveness, doormat',
        wellbeingCorrelation: 0.38,
        big5Correlations: { O: 0.08, C: 0.05, E: 0.12, A: 0.52, N: -0.28 },
        signatureIndicators: ['Let go of grudges', 'Believe in redemption', 'Don\'t hold resentment'],
        developmentExercises: ['Practice letting go of minor offenses', 'Write forgiveness letters', 'Focus on empathy'],
        developmentExercisesVi: ['Thực hành buông bỏ những xúc phạm nhỏ', 'Viết thư tha thứ', 'Tập trung vào sự đồng cảm']
    },
    {
        id: 'humility',
        name: 'Humility/Modesty',
        nameVi: 'Khiêm tốn',
        virtue: 'temperance',
        definition: 'Letting accomplishments speak for themselves; not seeking the spotlight',
        definitionVi: 'Để thành tựu tự nói lên; không tìm kiếm sự chú ý',
        underuse: 'Arrogance, boastfulness',
        overuse: 'Self-deprecation, low confidence',
        wellbeingCorrelation: 0.25,
        big5Correlations: { O: 0.02, C: 0.08, E: -0.18, A: 0.38, N: -0.05 },
        signatureIndicators: ['Comfortable with achievements', 'Don\'t brag', 'Acknowledge others\' contributions'],
        developmentExercises: ['Credit others publicly', 'Seek feedback openly', 'Celebrate others\' success'],
        developmentExercisesVi: ['Công nhận người khác công khai', 'Tìm kiếm phản hồi cởi mở', 'Ăn mừng thành công của người khác']
    },
    {
        id: 'prudence',
        name: 'Prudence',
        nameVi: 'Thận trọng',
        virtue: 'temperance',
        definition: 'Being careful about choices; not taking undue risks',
        definitionVi: 'Cẩn thận về các lựa chọn; không chấp nhận rủi ro không cần thiết',
        underuse: 'Recklessness, impulsivity',
        overuse: 'Stuffiness, rigidity',
        wellbeingCorrelation: 0.28,
        big5Correlations: { O: -0.08, C: 0.52, E: -0.12, A: 0.15, N: -0.18 },
        signatureIndicators: ['Think before acting', 'Consider consequences', 'Avoid regrettable decisions'],
        developmentExercises: ['Pause before decisions', 'Consider long-term effects', 'Create decision criteria'],
        developmentExercisesVi: ['Tạm dừng trước khi quyết định', 'Xem xét tác động dài hạn', 'Tạo tiêu chí quyết định']
    },
    {
        id: 'self_regulation',
        name: 'Self-Regulation',
        nameVi: 'Tự điều chỉnh',
        virtue: 'temperance',
        definition: 'Regulating what one feels and does; being disciplined; controlling appetites and emotions',
        definitionVi: 'Điều chỉnh những gì mình cảm thấy và làm; có kỷ luật; kiểm soát ham muốn và cảm xúc',
        underuse: 'Self-indulgence, impulsivity',
        overuse: 'Inhibition, rigidity',
        wellbeingCorrelation: 0.35,
        big5Correlations: { O: -0.05, C: 0.58, E: -0.08, A: 0.12, N: -0.35 },
        signatureIndicators: ['Disciplined habits', 'Control impulses', 'Manage emotions well'],
        developmentExercises: ['Build one habit at a time', 'Practice delaying gratification', 'Use implementation intentions'],
        developmentExercisesVi: ['Xây dựng từng thói quen một', 'Thực hành trì hoãn sự hài lòng', 'Sử dụng implementation intentions']
    },

    // TRANSCENDENCE
    {
        id: 'appreciation_of_beauty',
        name: 'Appreciation of Beauty & Excellence',
        nameVi: 'Trân trọng Cái đẹp & Sự xuất sắc',
        virtue: 'transcendence',
        definition: 'Noticing and appreciating beauty, excellence, and/or skilled performance',
        definitionVi: 'Nhận ra và trân trọng cái đẹp, sự xuất sắc và/hoặc biểu diễn kỹ năng',
        underuse: 'Obliviousness, indifference',
        overuse: 'Snobbery, perfectionism',
        wellbeingCorrelation: 0.32,
        big5Correlations: { O: 0.55, C: 0.05, E: 0.12, A: 0.18, N: -0.08 },
        signatureIndicators: ['Moved by beauty', 'Notice excellence in others', 'Appreciate nature/art'],
        developmentExercises: ['Notice 3 beautiful things daily', 'Visit art/nature', 'Acknowledge others\' excellence'],
        developmentExercisesVi: ['Nhận ra 3 điều đẹp mỗi ngày', 'Tham quan nghệ thuật/thiên nhiên', 'Công nhận sự xuất sắc của người khác']
    },
    {
        id: 'gratitude',
        name: 'Gratitude',
        nameVi: 'Biết ơn',
        virtue: 'transcendence',
        definition: 'Being aware of and thankful for good things that happen; taking time to express thanks',
        definitionVi: 'Nhận thức và biết ơn những điều tốt đẹp xảy ra; dành thời gian bày tỏ lòng biết ơn',
        underuse: 'Entitlement, taking for granted',
        overuse: 'Ingratiation, sycophancy',
        wellbeingCorrelation: 0.50,
        big5Correlations: { O: 0.15, C: 0.22, E: 0.28, A: 0.42, N: -0.25 },
        signatureIndicators: ['Count blessings regularly', 'Express thanks often', 'Appreciate small things'],
        developmentExercises: ['Write 3 gratitudes daily', 'Send thank-you notes', 'Gratitude visits'],
        developmentExercisesVi: ['Viết 3 điều biết ơn mỗi ngày', 'Gửi thư cảm ơn', 'Thăm hỏi bày tỏ lòng biết ơn']
    },
    {
        id: 'hope',
        name: 'Hope/Optimism',
        nameVi: 'Hy vọng/Lạc quan',
        virtue: 'transcendence',
        definition: 'Expecting the best in the future and working to achieve it',
        definitionVi: 'Mong đợi điều tốt nhất trong tương lai và làm việc để đạt được nó',
        underuse: 'Pessimism, hopelessness',
        overuse: 'Pollyannaism, denial',
        wellbeingCorrelation: 0.52,
        big5Correlations: { O: 0.18, C: 0.28, E: 0.42, A: 0.15, N: -0.48 },
        signatureIndicators: ['Believe in positive future', 'Plan for success', 'Optimistic outlook'],
        developmentExercises: ['Best Possible Self exercise', 'Set inspiring goals', 'Visualize success'],
        developmentExercisesVi: ['Bài tập Best Possible Self', 'Đặt mục tiêu truyền cảm hứng', 'Hình dung thành công']
    },
    {
        id: 'humor',
        name: 'Humor',
        nameVi: 'Hài hước',
        virtue: 'transcendence',
        definition: 'Liking to laugh and tease; bringing smiles to other people',
        definitionVi: 'Thích cười và trêu đùa; mang nụ cười đến cho người khác',
        underuse: 'Over-seriousness, humorlessness',
        overuse: 'Buffoonery, inappropriate jokes',
        wellbeingCorrelation: 0.45,
        big5Correlations: { O: 0.25, C: -0.05, E: 0.48, A: 0.15, N: -0.18 },
        signatureIndicators: ['Find humor in situations', 'Make others laugh', 'Use humor to cope'],
        developmentExercises: ['Watch/read comedy', 'Find humor in daily life', 'Don\'t take self too seriously'],
        developmentExercisesVi: ['Xem/đọc hài kịch', 'Tìm sự hài hước trong cuộc sống hàng ngày', 'Không quá nghiêm trọng với bản thân']
    },
    {
        id: 'spirituality',
        name: 'Spirituality',
        nameVi: 'Tâm linh',
        virtue: 'transcendence',
        definition: 'Having coherent beliefs about the higher purpose and meaning of the universe',
        definitionVi: 'Có niềm tin mạch lạc về mục đích cao hơn và ý nghĩa của vũ trụ',
        underuse: 'Meaninglessness, anomie',
        overuse: 'Fanaticism, self-righteousness',
        wellbeingCorrelation: 0.42,
        big5Correlations: { O: 0.28, C: 0.15, E: 0.08, A: 0.32, N: -0.18 },
        signatureIndicators: ['Sense of purpose', 'Connected to something larger', 'Find meaning in life'],
        developmentExercises: ['Reflect on life purpose', 'Meditate/pray', 'Connect with nature/universe'],
        developmentExercisesVi: ['Suy ngẫm về mục đích cuộc sống', 'Thiền/cầu nguyện', 'Kết nối với thiên nhiên/vũ trụ']
    }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get signature strengths (top 5 highest scoring)
 */
export function getSignatureStrengths(scores: Record<string, number>): VIAStrength[] {
    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => VIA_STRENGTHS.find(s => s.id === id)!)
        .filter(Boolean)
}

/**
 * Get lesser strengths (bottom 5)
 */
export function getLesserStrengths(scores: Record<string, number>): VIAStrength[] {
    return Object.entries(scores)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5)
        .map(([id]) => VIA_STRENGTHS.find(s => s.id === id)!)
        .filter(Boolean)
}

/**
 * Calculate virtue profile (average of strengths in each virtue)
 */
export function getVirtueProfile(scores: Record<string, number>): Array<{ virtue: VIAVirtue; avgScore: number }> {
    return VIA_VIRTUES.map(virtue => {
        const strengthScores = virtue.strengths.map(id => scores[id] || 0)
        const avgScore = strengthScores.reduce((a, b) => a + b, 0) / strengthScores.length
        return { virtue, avgScore }
    }).sort((a, b) => b.avgScore - a.avgScore)
}

/**
 * Get strengths most correlated with well-being
 */
export function getWellbeingStrengths(): VIAStrength[] {
    return [...VIA_STRENGTHS]
        .sort((a, b) => b.wellbeingCorrelation - a.wellbeingCorrelation)
        .slice(0, 5)
}

/**
 * Match VIA strengths to Big5 profile
 */
export function matchStrengthsToBig5(big5: { O: number; C: number; E: number; A: number; N: number }): VIAStrength[] {
    return VIA_STRENGTHS.map(strength => {
        let fit = 0
        const corr = strength.big5Correlations
        fit += (big5.O - 50) * corr.O * 0.01
        fit += (big5.C - 50) * corr.C * 0.01
        fit += (big5.E - 50) * corr.E * 0.01
        fit += (big5.A - 50) * corr.A * 0.01
        fit += (50 - big5.N) * Math.abs(corr.N) * 0.01  // Invert N
        return { strength, fit }
    })
        .sort((a, b) => b.fit - a.fit)
        .slice(0, 10)
        .map(s => s.strength)
}
