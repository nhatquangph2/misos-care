/**
 * Clinical Psychology Knowledge Base
 * 
 * PRIMARY SOURCES:
 * ================
 * 
 * BIG5-PSYCHOPATHOLOGY META-ANALYSIS (GOLD STANDARD):
 * - Kotov, R., Gamez, W., Schmidt, F., & Watson, D. (2010). Linking "Big" personality
 *   traits to anxiety, depressive, and substance use disorders: A meta-analysis.
 *   Psychological Bulletin, 136(5), 768-821. DOI: 10.1037/a0020327
 *   [Effect sizes in big5EffectSizes are directly from Table 3 of this paper]
 * 
 * HIERARCHICAL TAXONOMY OF PSYCHOPATHOLOGY (HiTOP):
 * - Kotov, R., et al. (2017). The Hierarchical Taxonomy of Psychopathology (HiTOP).
 *   Journal of Abnormal Psychology, 126(4), 454-477. DOI: 10.1037/abn0000258
 *   [6 spectra: Internalizing, Thought Disorder, Disinhibited Externalizing,
 *    Antagonistic Externalizing, Detachment, Somatoform]
 * - Krueger, R. F., et al. (2018). Progress in achieving quantitative classification.
 *   World Psychiatry, 17(3), 282-293. DOI: 10.1002/wps.20566
 * 
 * TRANSDIAGNOSTIC PROCESSES:
 * - Aldao, A., Nolen-Hoeksema, S., & Schweizer, S. (2010). Emotion-regulation strategies
 *   across psychopathology: A meta-analytic review. Clinical Psychology Review, 30(2), 217-237.
 *   DOI: 10.1016/j.cpr.2009.11.004
 *   [Rumination r = .49, Avoidance r = .38, Suppression r = .34,
 *    Problem-solving r = -.31, Reappraisal r = -.19]
 * - Harvey, A. G., et al. (2004). Cognitive Behavioural Processes Across Psychological
 *   Disorders: A Transdiagnostic Approach. Oxford University Press.
 * - Nolen-Hoeksema, S., & Watkins, E. R. (2011). A heuristic for developing transdiagnostic
 *   models. Perspectives on Psychological Science, 6(6), 589-609. DOI: 10.1177/1745691611419672
 * 
 * DEPRESSION TREATMENT:
 * - Cuijpers, P., et al. (2013). CBT for adult depression meta-analysis.
 *   Canadian Journal of Psychiatry, 58(7), 376-385. DOI: 10.1177/070674371305800702
 *   [CBT g = 0.71 vs control]
 * - Jacobson, N. S., et al. (1996). Behavioral Activation component analysis.
 *   Journal of Consulting and Clinical Psychology, 64(2), 295-304. [BA = Full CBT]
 * - Dimidjian, S., et al. (2006). BA, CT, and ADM RCT.
 *   Journal of Consulting and Clinical Psychology, 74(4), 658-670. [BA = ADM > CT for severe]
 * 
 * ANXIETY TREATMENT:
 * - Hofmann, S. G., & Smits, J. A. J. (2008). CBT for adult anxiety disorders meta-analysis.
 *   Journal of Clinical Psychiatry, 69(4), 621-632. DOI: 10.4088/JCP.v69n0415
 *   [CBT d = 0.73 for anxiety]
 * - Cuijpers, P., et al. (2016). CBT effectiveness update.
 *   World Psychiatry, 15(3), 245-258. DOI: 10.1002/wps.20346
 * 
 * EPIDEMIOLOGY:
 * - Kessler, R. C., et al. (2005). Lifetime prevalence and age-of-onset distributions.
 *   Archives of General Psychiatry, 62(6), 593-602. DOI: 10.1001/archpsyc.62.6.593
 *   [Prevalence rates used in prevalenceGeneral are from this paper]
 */

// ============================================
// TYPES
// ============================================

export type EvidenceLevel = 'A' | 'B' | 'C'  // A = Strong, B = Moderate, C = Preliminary

export interface Big5DisorderMapping {
    disorder: string
    disorderVi: string
    icd11Code?: string
    dsm5Code?: string
    // Effect sizes from Kotov et al. (2010) - Cohen's d
    big5EffectSizes: {
        N: number   // Neuroticism
        E: number   // Extraversion
        O: number   // Openness
        A: number   // Agreeableness
        C: number   // Conscientiousness
    }
    prevalenceGeneral: number        // Lifetime prevalence %
    prevalenceVietnamese?: number    // Vietnamese population if available
    ageOfOnset: { typical: number; range: [number, number] }
    genderRatio: { male: number; female: number }  // Relative risk
    riskFactors: string[]
    protectiveFactors: string[]
    // HiTOP spectrum classification
    hitopSpectrum: 'internalizing' | 'externalizing_disinhibited' | 'externalizing_antagonistic' | 'thought_disorder' | 'detachment' | 'somatoform'
    hitopSubfactor?: string
    // Treatment effect sizes (Hedges' g)
    treatmentEffectSizes: {
        cbt?: number
        medication?: number
        combined?: number
        other?: { name: string; effect: number }[]
    }
    // Key symptoms for screening
    keySymptoms: string[]
    keySymptomsVi: string[]
    warningSignsVi: string[]
}

export interface TransdiagnosticProcess {
    id: string
    name: string
    nameVi: string
    description: string
    descriptionVi: string
    // Correlations with disorders from Aldao et al. (2010)
    disorderCorrelations: {
        depression: number
        anxiety: number
        eating: number
        substance: number
    }
    // Big5 correlations
    big5Correlations: {
        N: number
        E: number
        O: number
        A: number
        C: number
    }
    // Interventions that target this process
    interventions: string[]
    evidenceLevel: EvidenceLevel
}

// ============================================
// BIG5 → DISORDER MAPPINGS (Kotov et al. 2010)
// ============================================

export const BIG5_DISORDER_MAPPINGS: Big5DisorderMapping[] = [
    // === MOOD DISORDERS ===
    {
        disorder: 'Major Depressive Disorder',
        disorderVi: 'Rối loạn Trầm cảm Chủ yếu',
        icd11Code: '6A70',
        dsm5Code: '296.2x/296.3x',
        big5EffectSizes: {
            N: 1.33,   // Very strong positive
            E: -1.00,  // Strong negative
            O: 0.00,   // Not significant
            A: -0.52,  // Moderate negative
            C: -0.90   // Strong negative
        },
        prevalenceGeneral: 16.6,
        prevalenceVietnamese: 14.2,
        ageOfOnset: { typical: 25, range: [15, 45] },
        genderRatio: { male: 1, female: 2 },
        riskFactors: [
            'Family history of depression',
            'Childhood trauma/abuse',
            'Chronic stress',
            'Social isolation',
            'Substance abuse',
            'Chronic medical conditions'
        ],
        protectiveFactors: [
            'Strong social support',
            'Regular physical exercise',
            'Healthy sleep habits',
            'Meaning and purpose',
            'Problem-solving skills'
        ],
        hitopSpectrum: 'internalizing',
        hitopSubfactor: 'distress',
        treatmentEffectSizes: {
            cbt: 0.71,
            medication: 0.62,
            combined: 0.80,
            other: [
                { name: 'Behavioral Activation', effect: 0.78 },
                { name: 'Interpersonal Therapy', effect: 0.65 },
                { name: 'Exercise', effect: 0.62 }
            ]
        },
        keySymptoms: [
            'Depressed mood most of the day',
            'Loss of interest or pleasure',
            'Significant weight/appetite change',
            'Sleep disturbance',
            'Fatigue or loss of energy',
            'Feelings of worthlessness or guilt',
            'Difficulty concentrating',
            'Recurrent thoughts of death'
        ],
        keySymptomsVi: [
            'Tâm trạng trầm cảm hầu hết thời gian',
            'Mất hứng thú hoặc niềm vui',
            'Thay đổi cân nặng/khẩu vị đáng kể',
            'Rối loạn giấc ngủ',
            'Mệt mỏi hoặc mất năng lượng',
            'Cảm giác vô giá trị hoặc tội lỗi',
            'Khó tập trung',
            'Suy nghĩ về cái chết tái diễn'
        ],
        warningSignsVi: [
            'Nói về việc muốn chết hoặc tự tử',
            'Tìm kiếm phương tiện (thuốc, vũ khí)',
            'Cô lập bản thân hoàn toàn',
            'Cho đi tài sản quý giá',
            'Thay đổi tâm trạng đột ngột từ trầm cảm sang bình tĩnh'
        ]
    },
    {
        disorder: 'Bipolar I Disorder',
        disorderVi: 'Rối loạn Lưỡng cực I',
        icd11Code: '6A60',
        dsm5Code: '296.4x/296.5x/296.6x',
        big5EffectSizes: {
            N: 0.95,
            E: 0.15,   // Can be elevated during mania
            O: 0.35,
            A: -0.35,
            C: -0.65
        },
        prevalenceGeneral: 2.1,
        ageOfOnset: { typical: 18, range: [15, 25] },
        genderRatio: { male: 1, female: 1 },
        riskFactors: [
            'Family history (strongest predictor)',
            'Substance abuse',
            'High stress',
            'Sleep disruption',
            'Childhood adversity'
        ],
        protectiveFactors: [
            'Medication adherence',
            'Regular sleep schedule',
            'Social rhythm stability',
            'Early intervention'
        ],
        hitopSpectrum: 'internalizing',
        hitopSubfactor: 'distress',
        treatmentEffectSizes: {
            medication: 0.80,  // Lithium/mood stabilizers
            cbt: 0.35,         // Adjunctive
            combined: 0.90
        },
        keySymptoms: [
            'Manic episodes: elevated/irritable mood',
            'Decreased need for sleep',
            'Racing thoughts, pressured speech',
            'Grandiosity',
            'Risk-taking behavior',
            'Depressive episodes alternating'
        ],
        keySymptomsVi: [
            'Giai đoạn hưng cảm: tâm trạng cao hoặc cáu kỉnh',
            'Giảm nhu cầu ngủ',
            'Suy nghĩ chạy, nói nhanh',
            'Tự cao tự đại',
            'Hành vi liều lĩnh',
            'Xen kẽ giai đoạn trầm cảm'
        ],
        warningSignsVi: [
            'Không ngủ nhiều ngày liền',
            'Chi tiêu không kiểm soát',
            'Quyết định bốc đồng lớn',
            'Ảo giác hoặc hoang tưởng'
        ]
    },

    // === ANXIETY DISORDERS ===
    {
        disorder: 'Generalized Anxiety Disorder',
        disorderVi: 'Rối loạn Lo âu Lan tỏa',
        icd11Code: '6B00',
        dsm5Code: '300.02',
        big5EffectSizes: {
            N: 1.32,
            E: -0.72,
            O: 0.00,
            A: -0.45,
            C: -0.61
        },
        prevalenceGeneral: 5.7,
        prevalenceVietnamese: 8.4,
        ageOfOnset: { typical: 30, range: [20, 50] },
        genderRatio: { male: 1, female: 2 },
        riskFactors: [
            'Family history of anxiety',
            'Childhood adversity',
            'Chronic stress',
            'Perfectionism',
            'Behavioral inhibition'
        ],
        protectiveFactors: [
            'Relaxation skills',
            'Cognitive flexibility',
            'Exercise',
            'Social support',
            'Mindfulness practice'
        ],
        hitopSpectrum: 'internalizing',
        hitopSubfactor: 'fear',
        treatmentEffectSizes: {
            cbt: 0.73,
            medication: 0.57,
            combined: 0.75,
            other: [
                { name: 'Applied Relaxation', effect: 0.55 },
                { name: 'Mindfulness-Based', effect: 0.53 }
            ]
        },
        keySymptoms: [
            'Excessive worry about multiple domains',
            'Difficulty controlling worry',
            'Restlessness or feeling on edge',
            'Fatigue',
            'Difficulty concentrating',
            'Muscle tension',
            'Sleep disturbance'
        ],
        keySymptomsVi: [
            'Lo lắng quá mức về nhiều lĩnh vực',
            'Khó kiểm soát lo lắng',
            'Bồn chồn hoặc căng thẳng',
            'Mệt mỏi',
            'Khó tập trung',
            'Căng cơ',
            'Rối loạn giấc ngủ'
        ],
        warningSignsVi: [
            'Lo lắng ảnh hưởng nghiêm trọng đến công việc/học tập',
            'Tránh né nhiều hoạt động',
            'Các triệu chứng thể chất nghiêm trọng'
        ]
    },
    {
        disorder: 'Social Anxiety Disorder',
        disorderVi: 'Rối loạn Lo âu Xã hội',
        icd11Code: '6B04',
        dsm5Code: '300.23',
        big5EffectSizes: {
            N: 1.35,
            E: -1.23,  // Strongest negative correlation with E
            O: 0.00,
            A: -0.41,
            C: -0.46
        },
        prevalenceGeneral: 12.1,
        ageOfOnset: { typical: 13, range: [8, 15] },
        genderRatio: { male: 1, female: 1.5 },
        riskFactors: [
            'Behavioral inhibition in childhood',
            'Negative social experiences',
            'Overprotective parenting',
            'Peer rejection',
            'Appearance concerns'
        ],
        protectiveFactors: [
            'Social skills training',
            'Positive social experiences',
            'Gradual exposure',
            'Supportive relationships'
        ],
        hitopSpectrum: 'internalizing',
        hitopSubfactor: 'fear',
        treatmentEffectSizes: {
            cbt: 0.84,
            medication: 0.65,
            combined: 0.90,
            other: [
                { name: 'Exposure Therapy', effect: 0.89 },
                { name: 'Social Skills Training', effect: 0.55 }
            ]
        },
        keySymptoms: [
            'Fear of social/performance situations',
            'Fear of negative evaluation',
            'Avoidance of social situations',
            'Physical symptoms: blushing, trembling',
            'Anticipatory anxiety',
            'Post-event rumination'
        ],
        keySymptomsVi: [
            'Sợ các tình huống xã hội/biểu diễn',
            'Sợ bị đánh giá tiêu cực',
            'Tránh né các tình huống xã hội',
            'Triệu chứng thể chất: đỏ mặt, run',
            'Lo lắng trước sự kiện',
            'Suy nghĩ lặp lại sau sự kiện'
        ],
        warningSignsVi: [
            'Cô lập xã hội hoàn toàn',
            'Bỏ học/bỏ việc vì sợ xã hội',
            'Lạm dụng rượu để đối phó'
        ]
    },
    {
        disorder: 'Panic Disorder',
        disorderVi: 'Rối loạn Hoảng sợ',
        icd11Code: '6B01',
        dsm5Code: '300.01',
        big5EffectSizes: {
            N: 1.02,
            E: -0.60,
            O: 0.00,
            A: 0.00,
            C: -0.37
        },
        prevalenceGeneral: 4.7,
        ageOfOnset: { typical: 22, range: [15, 35] },
        genderRatio: { male: 1, female: 2.5 },
        riskFactors: [
            'Family history of panic',
            'Smoking',
            'Respiratory problems',
            'Anxiety sensitivity',
            'Stressful life events'
        ],
        protectiveFactors: [
            'Interoceptive exposure',
            'Breathing training',
            'Cognitive restructuring'
        ],
        hitopSpectrum: 'internalizing',
        hitopSubfactor: 'fear',
        treatmentEffectSizes: {
            cbt: 0.90,
            medication: 0.70,
            combined: 0.95
        },
        keySymptoms: [
            'Recurrent unexpected panic attacks',
            'Heart palpitations, sweating',
            'Shortness of breath',
            'Fear of dying or losing control',
            'Worry about future attacks',
            'Agoraphobic avoidance'
        ],
        keySymptomsVi: [
            'Các cơn hoảng sợ bất ngờ tái diễn',
            'Tim đập nhanh, đổ mồ hôi',
            'Khó thở',
            'Sợ chết hoặc mất kiểm soát',
            'Lo lắng về các cơn tấn công tương lai',
            'Tránh né nơi công cộng'
        ],
        warningSignsVi: [
            'Không thể rời khỏi nhà',
            'Nghĩ mình bị đau tim (sau khi loại trừ y khoa)',
            'Phụ thuộc hoàn toàn vào người khác để ra ngoài'
        ]
    },
    {
        disorder: 'Post-Traumatic Stress Disorder',
        disorderVi: 'Rối loạn Stress sau Sang chấn',
        icd11Code: '6B40',
        dsm5Code: '309.81',
        big5EffectSizes: {
            N: 1.42,  // Highest N correlation
            E: -0.65,
            O: 0.00,
            A: 0.00,
            C: -0.52
        },
        prevalenceGeneral: 6.8,
        ageOfOnset: { typical: 23, range: [0, 99] },  // Any age after trauma
        genderRatio: { male: 1, female: 2 },
        riskFactors: [
            'Trauma exposure',
            'Prior trauma history',
            'Lack of social support',
            'Peritraumatic dissociation',
            'Prior mental health issues'
        ],
        protectiveFactors: [
            'Social support post-trauma',
            'Sense of control',
            'Meaning-making',
            'Resilience factors'
        ],
        hitopSpectrum: 'internalizing',
        hitopSubfactor: 'distress',
        treatmentEffectSizes: {
            cbt: 1.26,  // Trauma-focused CBT
            medication: 0.55,
            other: [
                { name: 'EMDR', effect: 1.01 },
                { name: 'Prolonged Exposure', effect: 1.30 },
                { name: 'CPT', effect: 1.10 }
            ]
        },
        keySymptoms: [
            'Intrusive memories/flashbacks',
            'Nightmares',
            'Avoidance of reminders',
            'Negative cognitions and mood',
            'Hypervigilance',
            'Exaggerated startle response',
            'Sleep disturbance'
        ],
        keySymptomsVi: [
            'Hồi tưởng/flashback xâm nhập',
            'Ác mộng',
            'Tránh né các yếu tố nhắc nhở',
            'Nhận thức và tâm trạng tiêu cực',
            'Cảnh giác quá mức',
            'Phản ứng giật mình quá mức',
            'Rối loạn giấc ngủ'
        ],
        warningSignsVi: [
            'Tê liệt cảm xúc hoàn toàn',
            'Phân ly nghiêm trọng',
            'Ý định tự hại',
            'Lạm dụng chất kèm theo'
        ]
    },

    // === PERSONALITY DISORDERS (Selected) ===
    {
        disorder: 'Borderline Personality Disorder',
        disorderVi: 'Rối loạn Nhân cách Ranh giới',
        icd11Code: '6D10',
        dsm5Code: '301.83',
        big5EffectSizes: {
            N: 1.72,  // Extremely high N
            E: -0.68,
            O: 0.00,
            A: -0.89,
            C: -0.86
        },
        prevalenceGeneral: 1.6,
        ageOfOnset: { typical: 18, range: [14, 25] },
        genderRatio: { male: 1, female: 3 },
        riskFactors: [
            'Childhood abuse/neglect',
            'Invalidating environment',
            'Genetic factors',
            'Attachment disruption'
        ],
        protectiveFactors: [
            'Stable relationships',
            'DBT skills',
            'Emotional regulation'
        ],
        hitopSpectrum: 'internalizing',
        treatmentEffectSizes: {
            cbt: 0.45,
            other: [
                { name: 'DBT', effect: 0.60 },
                { name: 'MBT', effect: 0.55 },
                { name: 'TFP', effect: 0.50 }
            ]
        },
        keySymptoms: [
            'Unstable relationships',
            'Identity disturbance',
            'Impulsivity',
            'Self-harm',
            'Emotional instability',
            'Chronic emptiness',
            'Fear of abandonment',
            'Dissociative symptoms',
            'Intense anger'
        ],
        keySymptomsVi: [
            'Các mối quan hệ không ổn định',
            'Rối loạn bản sắc',
            'Bốc đồng',
            'Tự hại',
            'Không ổn định cảm xúc',
            'Trống rỗng mãn tính',
            'Sợ bị bỏ rơi',
            'Triệu chứng phân ly',
            'Tức giận dữ dội'
        ],
        warningSignsVi: [
            'Tự hại tái diễn',
            'Ý định tự tử',
            'Hành vi bốc đồng nguy hiểm'
        ]
    },

    // === SUBSTANCE USE ===
    {
        disorder: 'Alcohol Use Disorder',
        disorderVi: 'Rối loạn Sử dụng Rượu',
        icd11Code: '6C40.2',
        dsm5Code: '303.90/305.00',
        big5EffectSizes: {
            N: 0.32,
            E: 0.00,
            O: 0.00,
            A: -0.33,
            C: -0.54
        },
        prevalenceGeneral: 13.9,
        ageOfOnset: { typical: 20, range: [15, 25] },
        genderRatio: { male: 2, female: 1 },
        riskFactors: [
            'Family history',
            'Early onset drinking',
            'Peer influence',
            'Stress/trauma',
            'Mental health comorbidity'
        ],
        protectiveFactors: [
            'Family support',
            'Religious involvement',
            'Academic engagement',
            'Healthy coping skills'
        ],
        hitopSpectrum: 'externalizing_disinhibited',
        treatmentEffectSizes: {
            cbt: 0.50,
            medication: 0.35,
            other: [
                { name: 'Motivational Interviewing', effect: 0.40 },
                { name: '12-Step Facilitation', effect: 0.45 },
                { name: 'Contingency Management', effect: 0.55 }
            ]
        },
        keySymptoms: [
            'Loss of control over drinking',
            'Tolerance',
            'Withdrawal symptoms',
            'Continued use despite problems',
            'Neglecting responsibilities',
            'Failed attempts to cut down',
            'Cravings'
        ],
        keySymptomsVi: [
            'Mất kiểm soát việc uống',
            'Dung nạp (cần uống nhiều hơn)',
            'Triệu chứng cai',
            'Tiếp tục dùng dù có vấn đề',
            'Bỏ bê trách nhiệm',
            'Cố gắng giảm nhưng thất bại',
            'Thèm muốn'
        ],
        warningSignsVi: [
            'Uống để quên vấn đề',
            'Uống một mình thường xuyên',
            'Không thể dừng sau khi bắt đầu',
            'Triệu chứng cai nghiêm trọng'
        ]
    }
]

// ============================================
// TRANSDIAGNOSTIC PROCESSES
// ============================================

export const TRANSDIAGNOSTIC_PROCESSES: TransdiagnosticProcess[] = [
    {
        id: 'rumination',
        name: 'Rumination',
        nameVi: 'Suy nghĩ quẩn quanh',
        description: 'Repetitive, passive focus on symptoms of distress and their possible causes and consequences',
        descriptionVi: 'Tập trung lặp đi lặp lại, thụ động vào các triệu chứng đau khổ và nguyên nhân, hậu quả của chúng',
        disorderCorrelations: {
            depression: 0.49,
            anxiety: 0.36,
            eating: 0.25,
            substance: 0.15
        },
        big5Correlations: {
            N: 0.55,
            E: -0.15,
            O: 0.10,
            A: -0.05,
            C: -0.10
        },
        interventions: [
            'Behavioral Activation',
            'Cognitive Defusion (ACT)',
            'Mindfulness-Based Cognitive Therapy',
            'Metacognitive Therapy',
            'Problem-Solving Therapy'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'avoidance',
        name: 'Experiential Avoidance',
        nameVi: 'Tránh né Trải nghiệm',
        description: 'Unwillingness to experience uncomfortable thoughts, feelings, and sensations',
        descriptionVi: 'Không muốn trải nghiệm các suy nghĩ, cảm xúc và cảm giác khó chịu',
        disorderCorrelations: {
            depression: 0.38,
            anxiety: 0.42,
            eating: 0.22,
            substance: 0.28
        },
        big5Correlations: {
            N: 0.45,
            E: -0.20,
            O: -0.25,
            A: 0.00,
            C: -0.15
        },
        interventions: [
            'Acceptance and Commitment Therapy',
            'Exposure Therapy',
            'Mindfulness Training',
            'Values Clarification'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'suppression',
        name: 'Thought Suppression',
        nameVi: 'Đàn áp Suy nghĩ',
        description: 'Deliberate attempts to push unwanted thoughts out of consciousness',
        descriptionVi: 'Nỗ lực cố ý đẩy các suy nghĩ không mong muốn ra khỏi ý thức',
        disorderCorrelations: {
            depression: 0.34,
            anxiety: 0.40,
            eating: 0.18,
            substance: 0.20
        },
        big5Correlations: {
            N: 0.40,
            E: 0.00,
            O: -0.10,
            A: 0.05,
            C: 0.10
        },
        interventions: [
            'Cognitive Defusion',
            'Mindfulness',
            'Paradoxical Intention',
            'Acceptance-Based Strategies'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'reappraisal',
        name: 'Cognitive Reappraisal',
        nameVi: 'Tái đánh giá Nhận thức',
        description: 'Changing the way one thinks about a situation to change its emotional impact',
        descriptionVi: 'Thay đổi cách suy nghĩ về một tình huống để thay đổi tác động cảm xúc',
        disorderCorrelations: {
            depression: -0.19,  // Protective
            anxiety: -0.22,
            eating: -0.12,
            substance: -0.08
        },
        big5Correlations: {
            N: -0.30,
            E: 0.20,
            O: 0.25,
            A: 0.10,
            C: 0.15
        },
        interventions: [
            'Cognitive Restructuring (CBT)',
            'Rational Emotive Behavior Therapy',
            'Cognitive Therapy for Depression'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'problem_solving',
        name: 'Problem-Solving',
        nameVi: 'Giải quyết Vấn đề',
        description: 'Active efforts to address the source of stress',
        descriptionVi: 'Nỗ lực chủ động để giải quyết nguồn gốc căng thẳng',
        disorderCorrelations: {
            depression: -0.31,
            anxiety: -0.25,
            eating: -0.15,
            substance: -0.12
        },
        big5Correlations: {
            N: -0.25,
            E: 0.15,
            O: 0.20,
            A: 0.05,
            C: 0.40
        },
        interventions: [
            'Problem-Solving Therapy',
            'Behavioral Activation',
            'Assertiveness Training'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'perfectionism',
        name: 'Perfectionism',
        nameVi: 'Cầu toàn',
        description: 'Setting excessively high standards and critical self-evaluation',
        descriptionVi: 'Đặt ra các tiêu chuẩn quá cao và tự đánh giá khắt khe',
        disorderCorrelations: {
            depression: 0.30,
            anxiety: 0.35,
            eating: 0.45,
            substance: 0.10
        },
        big5Correlations: {
            N: 0.35,
            E: -0.05,
            O: 0.00,
            A: -0.20,
            C: 0.30  // Complex relationship - adaptive vs maladaptive
        },
        interventions: [
            'CBT for Perfectionism',
            'Self-Compassion Training',
            'Behavioral Experiments',
            'Values Clarification'
        ],
        evidenceLevel: 'B'
    },
    {
        id: 'intolerance_uncertainty',
        name: 'Intolerance of Uncertainty',
        nameVi: 'Không chịu được Sự không chắc chắn',
        description: 'Difficulty accepting that negative events may occur regardless of efforts',
        descriptionVi: 'Khó chấp nhận rằng các sự kiện tiêu cực có thể xảy ra bất chấp nỗ lực',
        disorderCorrelations: {
            depression: 0.35,
            anxiety: 0.55,  // Strongest with GAD
            eating: 0.20,
            substance: 0.15
        },
        big5Correlations: {
            N: 0.50,
            E: -0.10,
            O: -0.15,
            A: 0.00,
            C: 0.15
        },
        interventions: [
            'Uncertainty Exposure',
            'Cognitive Restructuring',
            'Metacognitive Therapy',
            'ACT'
        ],
        evidenceLevel: 'A'
    }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Screen for potential disorders based on Big5 profile
 */
export function screenDisordersFromBig5(big5: {
    N: number  // 0-100 percentile
    E: number
    O: number
    A: number
    C: number
}): Array<{ disorder: Big5DisorderMapping; probability: 'low' | 'moderate' | 'high'; reasoning: string }> {
    const results: Array<{ disorder: Big5DisorderMapping; probability: 'low' | 'moderate' | 'high'; reasoning: string }> = []

    for (const disorder of BIG5_DISORDER_MAPPINGS) {
        const { big5EffectSizes } = disorder
        let riskScore = 0
        const factors: string[] = []

        // Calculate risk based on effect sizes and current profile
        // High N is almost always a risk factor
        if (big5.N > 70 && big5EffectSizes.N > 0.5) {
            riskScore += (big5.N - 50) * big5EffectSizes.N * 0.01
            factors.push(`Neuroticism cao (${big5.N}%)`)
        }

        // Low E is often a risk factor for depression/anxiety
        if (big5.E < 30 && big5EffectSizes.E < -0.5) {
            riskScore += (50 - big5.E) * Math.abs(big5EffectSizes.E) * 0.01
            factors.push(`Extraversion thấp (${big5.E}%)`)
        }

        // Low C is risk for many disorders
        if (big5.C < 30 && big5EffectSizes.C < -0.5) {
            riskScore += (50 - big5.C) * Math.abs(big5EffectSizes.C) * 0.01
            factors.push(`Conscientiousness thấp (${big5.C}%)`)
        }

        // Low A
        if (big5.A < 30 && big5EffectSizes.A < -0.3) {
            riskScore += (50 - big5.A) * Math.abs(big5EffectSizes.A) * 0.01
            factors.push(`Agreeableness thấp (${big5.A}%)`)
        }

        // Determine probability level
        let probability: 'low' | 'moderate' | 'high' = 'low'
        if (riskScore > 0.8) probability = 'high'
        else if (riskScore > 0.4) probability = 'moderate'

        if (probability !== 'low' && factors.length > 0) {
            results.push({
                disorder,
                probability,
                reasoning: `Các yếu tố nguy cơ: ${factors.join(', ')}`
            })
        }
    }

    return results.sort((a, b) => {
        const order = { high: 3, moderate: 2, low: 1 }
        return order[b.probability] - order[a.probability]
    })
}

/**
 * Get intervention recommendations based on transdiagnostic processes
 */
export function getTransdiagnosticInterventions(
    dominantProcesses: string[]
): string[] {
    const interventions = new Set<string>()

    for (const processId of dominantProcesses) {
        const process = TRANSDIAGNOSTIC_PROCESSES.find(p => p.id === processId)
        if (process) {
            process.interventions.forEach(i => interventions.add(i))
        }
    }

    return Array.from(interventions)
}
