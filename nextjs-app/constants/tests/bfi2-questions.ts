/**
 * BFI-2 (Big Five Inventory-2) - 60 Items
 * Phiên bản chuẩn hóa cho Việt Nam
 *
 * Cấu trúc: 5 Domains → 15 Facets → 60 Items
 * Mỗi domain có 3 facets, mỗi facet có 4 items
 *
 * Reference: Soto & John (2017)
 * Vietnamese adaptation: Based on validation studies
 */

// ============================================
// INTERFACES & TYPES
// ============================================

export interface BFI2Item {
  id: number // 1-60
  domain: 'E' | 'A' | 'C' | 'N' | 'O'
  facet: string // Mã facet (ví dụ: 'Soc', 'Ass', 'Ene')
  text: string // Câu hỏi tiếng Việt
  textEn: string // Câu hỏi tiếng Anh gốc
  reverse: boolean // true nếu là câu đảo ngược
}

export interface BFI2Facet {
  code: string
  name: string
  nameEn: string
  description: string
  domain: 'E' | 'A' | 'C' | 'N' | 'O'
}

export interface BFI2Domain {
  code: 'E' | 'A' | 'C' | 'N' | 'O'
  name: string
  nameEn: string
  description: string
  facets: string[] // Mã các facets
}

export interface BFI2Response {
  itemId: number
  value: number // 1-5
}

export interface BFI2Score {
  // Domain scores (1-5)
  domains: {
    E: number // Extraversion
    A: number // Agreeableness
    C: number // Conscientiousness
    N: number // Negative Emotionality
    O: number // Open-Mindedness
  }
  // Facet scores (1-5)
  facets: {
    [key: string]: number
  }
  // T-scores (normalized, mean=50, sd=10)
  tScores: {
    domains: {
      E: number
      A: number
      C: number
      N: number
      O: number
    }
    facets: {
      [key: string]: number
    }
  }
  // Percentiles
  percentiles: {
    domains: {
      E: number
      A: number
      C: number
      N: number
      O: number
    }
  }
}

// ============================================
// DOMAIN DEFINITIONS
// ============================================

export const BFI2_DOMAINS: BFI2Domain[] = [
  {
    code: 'E',
    name: 'Hướng Ngoại',
    nameEn: 'Extraversion',
    description: 'Mức độ năng lượng hướng về thế giới xã hội và vật chất, sự nhiệt tình trong tương tác với người khác.',
    facets: ['Soc', 'Ass', 'Ene'],
  },
  {
    code: 'A',
    name: 'Dễ Chịu',
    nameEn: 'Agreeableness',
    description: 'Định hướng tương tác xã hội dựa trên sự hợp tác, lòng trắc ẩn và tôn trọng người khác.',
    facets: ['Com', 'Res', 'Tru'],
  },
  {
    code: 'C',
    name: 'Tận Tâm',
    nameEn: 'Conscientiousness',
    description: 'Khả năng kiểm soát xung động, định hướng mục tiêu và tổ chức công việc hiệu quả.',
    facets: ['Org', 'Pro', 'Resp'],
  },
  {
    code: 'N',
    name: 'Bất Ổn Cảm Xúc',
    nameEn: 'Negative Emotionality',
    description: 'Xu hướng trải nghiệm các cảm xúc tiêu cực như lo âu, buồn bã và biến động tâm trạng.',
    facets: ['Anx', 'Dep', 'Vol'],
  },
  {
    code: 'O',
    name: 'Cởi Mở',
    nameEn: 'Open-Mindedness',
    description: 'Độ rộng, độ sâu và tính phức tạp của đời sống tinh thần, trải nghiệm và sự sáng tạo.',
    facets: ['Int', 'Aes', 'Cre'],
  },
]

// ============================================
// FACET DEFINITIONS
// ============================================

export const BFI2_FACETS: BFI2Facet[] = [
  // Extraversion Facets
  {
    code: 'Soc',
    name: 'Hòa Đồng',
    nameEn: 'Sociability',
    description: 'Xu hướng thích giao du, nói nhiều và cảm thấy thoải mái trong đám đông.',
    domain: 'E',
  },
  {
    code: 'Ass',
    name: 'Quyết Đoán',
    nameEn: 'Assertiveness',
    description: 'Khả năng gây ảnh hưởng, chiếm ưu thế trong nhóm và đảm nhận vai trò lãnh đạo.',
    domain: 'E',
  },
  {
    code: 'Ene',
    name: 'Năng Lượng',
    nameEn: 'Energy Level',
    description: 'Mức độ hoạt động thể chất, sự nhiệt tình và khả năng duy trì sự hưng phấn.',
    domain: 'E',
  },
  // Agreeableness Facets
  {
    code: 'Com',
    name: 'Lòng Trắc Ẩn',
    nameEn: 'Compassion',
    description: 'Sự quan tâm đến cảm xúc của người khác, sự mềm mỏng và thấu cảm.',
    domain: 'A',
  },
  {
    code: 'Res',
    name: 'Tôn Trọng',
    nameEn: 'Respectfulness',
    description: 'Thái độ lịch sự, nhã nhặn, tôn trọng quy tắc ứng xử và tránh xung đột.',
    domain: 'A',
  },
  {
    code: 'Tru',
    name: 'Tin Cậy',
    nameEn: 'Trust',
    description: 'Xu hướng tin tưởng vào ý định tốt đẹp của người khác, trái ngược với sự hoài nghi.',
    domain: 'A',
  },
  // Conscientiousness Facets
  {
    code: 'Org',
    name: 'Tổ Chức',
    nameEn: 'Organization',
    description: 'Sự ngăn nắp, trật tự và khả năng quản lý môi trường vật lý/công việc.',
    domain: 'C',
  },
  {
    code: 'Pro',
    name: 'Năng Suất',
    nameEn: 'Productiveness',
    description: 'Hiệu quả làm việc, khả năng hoàn thành nhiệm vụ và tránh trì hoãn.',
    domain: 'C',
  },
  {
    code: 'Resp',
    name: 'Trách Nhiệm',
    nameEn: 'Responsibility',
    description: 'Sự đáng tin cậy, giữ lời hứa và tuân thủ các cam kết đạo đức/xã hội.',
    domain: 'C',
  },
  // Negative Emotionality Facets
  {
    code: 'Anx',
    name: 'Lo Âu',
    nameEn: 'Anxiety',
    description: 'Xu hướng cảm thấy căng thẳng, sợ hãi và lo lắng về tương lai.',
    domain: 'N',
  },
  {
    code: 'Dep',
    name: 'Trầm Cảm',
    nameEn: 'Depression',
    description: 'Xu hướng cảm thấy buồn bã, chán nản, cô đơn và thiếu hy vọng.',
    domain: 'N',
  },
  {
    code: 'Vol',
    name: 'Biến Động',
    nameEn: 'Emotional Volatility',
    description: 'Sự thay đổi cảm xúc thất thường, dễ nổi nóng và khó kiểm soát tâm trạng.',
    domain: 'N',
  },
  // Open-Mindedness Facets
  {
    code: 'Int',
    name: 'Tò Mò Trí Tuệ',
    nameEn: 'Intellectual Curiosity',
    description: 'Hứng thú với các ý tưởng trừu tượng, thảo luận triết học và giải quyết vấn đề phức tạp.',
    domain: 'O',
  },
  {
    code: 'Aes',
    name: 'Thẩm Mỹ',
    nameEn: 'Aesthetic Sensitivity',
    description: 'Sự rung cảm trước nghệ thuật, âm nhạc, văn học và vẻ đẹp tự nhiên.',
    domain: 'O',
  },
  {
    code: 'Cre',
    name: 'Sáng Tạo',
    nameEn: 'Creative Imagination',
    description: 'Khả năng tạo ra ý tưởng mới, sự độc đáo và tư duy phi truyền thống.',
    domain: 'O',
  },
]

// ============================================
// 60 ITEMS - BFI-2 FULL VERSION
// ============================================

export const BFI2_ITEMS: BFI2Item[] = [
  // Items 1-12: Mixed order as per BFI-2 standard
  { id: 1, domain: 'E', facet: 'Soc', text: 'Là người cởi mở, thích giao du.', textEn: 'Is outgoing, sociable.', reverse: false },
  { id: 2, domain: 'A', facet: 'Com', text: 'Giàu lòng trắc ẩn, có trái tim nhân hậu.', textEn: 'Is compassionate, has a soft heart.', reverse: false },
  { id: 3, domain: 'C', facet: 'Org', text: 'Có xu hướng thiếu tổ chức (bừa bộn).', textEn: 'Tends to be disorganized.', reverse: true },
  { id: 4, domain: 'N', facet: 'Anx', text: 'Hay lo lắng.', textEn: 'Worries a lot.', reverse: false },
  { id: 5, domain: 'O', facet: 'Aes', text: 'Bị cuốn hút bởi nghệ thuật, âm nhạc hoặc văn học.', textEn: 'Is fascinated by art, music, or literature.', reverse: false },
  { id: 6, domain: 'E', facet: 'Ass', text: 'Có tính cách quả quyết, quyết đoán.', textEn: 'Has an assertive personality.', reverse: false },
  { id: 7, domain: 'A', facet: 'Res', text: 'Đôi khi thô lỗ với người khác.', textEn: 'Is sometimes rude to others.', reverse: true },
  { id: 8, domain: 'C', facet: 'Pro', text: 'Có xu hướng lười biếng.', textEn: 'Tends to be lazy.', reverse: true },
  { id: 9, domain: 'N', facet: 'Dep', text: 'Giữ được sự lạc quan sau khi gặp thất bại.', textEn: 'Stays optimistic after experiencing a setback.', reverse: true },
  { id: 10, domain: 'O', facet: 'Int', text: 'Tò mò về nhiều thứ khác nhau.', textEn: 'Is curious about many different things.', reverse: false },
  { id: 11, domain: 'E', facet: 'Ene', text: 'Hiếm khi cảm thấy phấn khích hoặc hăng hái.', textEn: 'Rarely feels excited or eager.', reverse: true },
  { id: 12, domain: 'A', facet: 'Com', text: 'Có xu hướng bắt lỗi người khác.', textEn: 'Tends to find fault with others.', reverse: true },

  // Items 13-24
  { id: 13, domain: 'C', facet: 'Resp', text: 'Là người đáng tin cậy, luôn có thể dựa vào.', textEn: 'Is reliable, can always be counted on.', reverse: false },
  { id: 14, domain: 'N', facet: 'Vol', text: 'Hay thay đổi tâm trạng, cảm xúc lên xuống thất thường.', textEn: 'Is moody, has up and down mood swings.', reverse: false },
  { id: 15, domain: 'O', facet: 'Cre', text: 'Có khả năng phát minh, tìm ra những cách thông minh để làm việc.', textEn: 'Is inventive, finds clever ways to do things.', reverse: false },
  { id: 16, domain: 'E', facet: 'Soc', text: 'Có xu hướng trầm lặng, ít nói.', textEn: 'Tends to be quiet.', reverse: true },
  { id: 17, domain: 'A', facet: 'Com', text: 'Cảm thấy ít sự đồng cảm với người khác.', textEn: 'Feels little sympathy for others.', reverse: true },
  { id: 18, domain: 'C', facet: 'Org', text: 'Có hệ thống, thích giữ mọi thứ trật tự.', textEn: 'Is systematic, likes to keep things in order.', reverse: false },
  { id: 19, domain: 'N', facet: 'Anx', text: 'Có thể trở nên căng thẳng.', textEn: 'Can be tense.', reverse: false },
  { id: 20, domain: 'O', facet: 'Aes', text: 'Cảm thấy thơ ca và kịch nghệ là nhàm chán.', textEn: 'Finds poetry and plays boring.', reverse: true },
  { id: 21, domain: 'E', facet: 'Ass', text: 'Có xu hướng chi phối, hành động như một người lãnh đạo.', textEn: 'Is dominant, acts as a leader.', reverse: false },
  { id: 22, domain: 'A', facet: 'Res', text: 'Thích gây gổ, bắt đầu các cuộc tranh cãi với người khác.', textEn: 'Starts arguments with others.', reverse: true },
  { id: 23, domain: 'C', facet: 'Pro', text: 'Gặp khó khăn khi bắt đầu các công việc.', textEn: 'Has difficulty getting started on tasks.', reverse: true },
  { id: 24, domain: 'N', facet: 'Dep', text: 'Cảm thấy an toàn, thoải mái với bản thân.', textEn: 'Feels secure, comfortable with self.', reverse: true },

  // Items 25-36
  { id: 25, domain: 'O', facet: 'Int', text: 'Tránh các cuộc thảo luận mang tính triết học, trí tuệ.', textEn: 'Avoids intellectual, philosophical discussions.', reverse: true },
  { id: 26, domain: 'E', facet: 'Ene', text: 'Kém năng động hơn những người khác.', textEn: 'Is less active than other people.', reverse: true },
  { id: 27, domain: 'A', facet: 'Tru', text: 'Có bản tính tha thứ.', textEn: 'Has a forgiving nature.', reverse: false },
  { id: 28, domain: 'C', facet: 'Resp', text: 'Có thể hơi bất cẩn.', textEn: 'Can be somewhat careless.', reverse: true },
  { id: 29, domain: 'N', facet: 'Vol', text: 'Là người ổn định về cảm xúc, không dễ bị kích động.', textEn: 'Is emotionally stable, not easily upset.', reverse: true },
  { id: 30, domain: 'O', facet: 'Cre', text: 'Có ít sự sáng tạo.', textEn: 'Has little creativity.', reverse: true },
  { id: 31, domain: 'E', facet: 'Soc', text: 'Đôi khi hay xấu hổ, hướng nội.', textEn: 'Is sometimes shy, introverted.', reverse: true },
  { id: 32, domain: 'A', facet: 'Com', text: 'Quan tâm và ân cần với hầu hết mọi người.', textEn: 'Is helpful and unselfish with others.', reverse: false },
  { id: 33, domain: 'C', facet: 'Org', text: 'Làm việc hiệu quả, hoàn thành công việc nhanh chóng.', textEn: 'Does things efficiently.', reverse: false },
  { id: 34, domain: 'N', facet: 'Anx', text: 'Bình tĩnh trong các tình huống căng thẳng.', textEn: 'Remains calm in tense situations.', reverse: true },
  { id: 35, domain: 'O', facet: 'Aes', text: 'Trân trọng nghệ thuật và cái đẹp.', textEn: 'Values art and beauty.', reverse: false },
  { id: 36, domain: 'E', facet: 'Ass', text: 'Cảm thấy khó gây ảnh hưởng lên người khác.', textEn: 'Finds it hard to influence people.', reverse: true },

  // Items 37-48
  { id: 37, domain: 'A', facet: 'Res', text: 'Đôi khi thô lỗ với người khác.', textEn: 'Is sometimes rude to others.', reverse: true },
  { id: 38, domain: 'C', facet: 'Pro', text: 'Làm việc hiệu quả, hoàn thành công việc.', textEn: 'Does a thorough job.', reverse: false },
  { id: 39, domain: 'N', facet: 'Dep', text: 'Thường cảm thấy buồn.', textEn: 'Often feels sad.', reverse: false },
  { id: 40, domain: 'O', facet: 'Int', text: 'Thích suy nghĩ sâu sắc, phức tạp.', textEn: 'Is complex, a deep thinker.', reverse: false },
  { id: 41, domain: 'E', facet: 'Ene', text: 'Tràn đầy năng lượng.', textEn: 'Is full of energy.', reverse: false },
  { id: 42, domain: 'A', facet: 'Tru', text: 'Nghi ngờ ý định của người khác.', textEn: 'Is suspicious of others\' intentions.', reverse: true },
  { id: 43, domain: 'C', facet: 'Resp', text: 'Là người đáng tin cậy.', textEn: 'Is reliable.', reverse: false },
  { id: 44, domain: 'N', facet: 'Vol', text: 'Giữ kiểm soát được cảm xúc của mình.', textEn: 'Keeps emotions under control.', reverse: true },
  { id: 45, domain: 'O', facet: 'Cre', text: 'Gặp khó khăn khi tưởng tượng sự việc.', textEn: 'Has difficulty imagining things.', reverse: true },
  { id: 46, domain: 'E', facet: 'Soc', text: 'Là người nói nhiều.', textEn: 'Is talkative.', reverse: false },
  { id: 47, domain: 'A', facet: 'Com', text: 'Có thể trở nên lạnh lùng và vô tâm.', textEn: 'Can be cold and uncaring.', reverse: true },
  { id: 48, domain: 'C', facet: 'Org', text: 'Để đồ đạc bừa bãi, không dọn dẹp.', textEn: 'Leaves a mess, doesn\'t clean up.', reverse: true },

  // Items 49-60
  { id: 49, domain: 'N', facet: 'Anx', text: 'Hiếm khi cảm thấy lo âu hay sợ hãi.', textEn: 'Rarely feels anxious or afraid.', reverse: true },
  { id: 50, domain: 'O', facet: 'Aes', text: 'Nghĩ rằng nghệ thuật không quan trọng.', textEn: 'Thinks art is unimportant.', reverse: true },
  { id: 51, domain: 'E', facet: 'Ass', text: 'Thích để người khác nắm quyền chỉ huy.', textEn: 'Prefers to have others take charge.', reverse: true },
  { id: 52, domain: 'A', facet: 'Res', text: 'Lịch sự, nhã nhặn với người khác.', textEn: 'Is polite, courteous to others.', reverse: false },
  { id: 53, domain: 'C', facet: 'Pro', text: 'Kiên trì, làm việc cho đến khi hoàn thành nhiệm vụ.', textEn: 'Is persistent, works until the task is finished.', reverse: false },
  { id: 54, domain: 'N', facet: 'Dep', text: 'Có xu hướng cảm thấy chán nản, buồn phiền.', textEn: 'Tends to feel depressed, blue.', reverse: false },
  { id: 55, domain: 'O', facet: 'Int', text: 'Ít quan tâm đến các ý tưởng trừu tượng.', textEn: 'Has little interest in abstract ideas.', reverse: true },
  { id: 56, domain: 'E', facet: 'Ene', text: 'Thể hiện rất nhiều sự nhiệt tình.', textEn: 'Shows a lot of enthusiasm.', reverse: false },
  { id: 57, domain: 'A', facet: 'Tru', text: 'Luôn nghĩ tốt về mọi người.', textEn: 'Assumes the best about people.', reverse: false },
  { id: 58, domain: 'C', facet: 'Resp', text: 'Đôi khi hành xử vô trách nhiệm.', textEn: 'Sometimes behaves irresponsibly.', reverse: true },
  { id: 59, domain: 'N', facet: 'Vol', text: 'Là người nóng tính, dễ xúc động.', textEn: 'Is temperamental, gets emotional easily.', reverse: false },
  { id: 60, domain: 'O', facet: 'Cre', text: 'Là người nguyên bản, đưa ra những ý tưởng mới.', textEn: 'Is original, comes up with new ideas.', reverse: false },
]

// ============================================
// RESPONSE SCALE
// ============================================

export const BFI2_SCALE = [
  { value: 1, label: 'Hoàn toàn không đồng ý', labelEn: 'Disagree strongly' },
  { value: 2, label: 'Không đồng ý một chút', labelEn: 'Disagree a little' },
  { value: 3, label: 'Trung lập / Không có ý kiến', labelEn: 'Neutral; no opinion' },
  { value: 4, label: 'Đồng ý một chút', labelEn: 'Agree a little' },
  { value: 5, label: 'Hoàn toàn đồng ý', labelEn: 'Agree strongly' },
]

// ============================================
// CONVERSION FOR QUESTION FLOW
// ============================================

export const BFI2_QUESTIONS_FLOW = BFI2_ITEMS.map((item) => ({
  id: item.id,
  question: item.text,
  options: BFI2_SCALE.map(scale => ({
    value: scale.value,
    label: scale.label,
  })),
}))

// ============================================
// NORM DATA (Placeholder - To be updated with Vietnamese norms)
// ============================================

// Mean và SD từ các nghiên cứu quốc tế (Soto & John, 2017)
// CẦN CẬP NHẬT với dữ liệu Việt Nam khi có đủ sample
export const BFI2_NORMS = {
  domains: {
    E: { mean: 3.2, sd: 0.72 },
    A: { mean: 3.8, sd: 0.61 },
    C: { mean: 3.5, sd: 0.68 },
    N: { mean: 2.8, sd: 0.82 },
    O: { mean: 3.4, sd: 0.68 },
  },
  facets: {
    Soc: { mean: 3.2, sd: 0.85 },
    Ass: { mean: 3.1, sd: 0.78 },
    Ene: { mean: 3.3, sd: 0.80 },
    Com: { mean: 3.9, sd: 0.70 },
    Res: { mean: 3.7, sd: 0.68 },
    Tru: { mean: 3.6, sd: 0.75 },
    Org: { mean: 3.4, sd: 0.82 },
    Pro: { mean: 3.5, sd: 0.76 },
    Resp: { mean: 3.6, sd: 0.71 },
    Anx: { mean: 2.9, sd: 0.88 },
    Dep: { mean: 2.6, sd: 0.91 },
    Vol: { mean: 2.9, sd: 0.87 },
    Int: { mean: 3.5, sd: 0.79 },
    Aes: { mean: 3.3, sd: 0.84 },
    Cre: { mean: 3.4, sd: 0.80 },
  } as { [key: string]: { mean: number; sd: number } },
}

export default BFI2_ITEMS
