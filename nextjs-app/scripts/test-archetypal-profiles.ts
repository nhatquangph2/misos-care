/**
 * MISO V3 Deep Integration - Archetypal Profile Testing
 * Tests the MISO analysis engine with 3 representative user profiles
 */

import { runMisoAnalysis } from '../lib/miso';
import type { UserInputData } from '../types/miso-v3';

// ============================================
// TEST PROFILE 1: Resilient Creator
// ============================================
const resilientCreator: UserInputData = {
    dass21_raw: { D: 22, A: 18, S: 14 },
    big5_raw: { N: 34, E: 12, O: 38, A: 34, C: 21 }, // N:85%, E:25%, O:75%, A:68%, C:42%
    via_raw: {
        Hope: 3.5,
        Zest: 3.0,
        'Self-Regulation': 2.5,
        Gratitude: 3.2,
        Creativity: 4.5, // Top strength
        Perseverance: 4.2, // Second strength
        Curiosity: 3.8,
        'Love': 3.5
    },
    mbti: 'INFP'
};

// ============================================
// TEST PROFILE 2: Anxious Achiever
// ============================================
const anxiousAchiever: UserInputData = {
    dass21_raw: { D: 12, A: 16, S: 18 },
    big5_raw: { N: 30, E: 24, O: 36, A: 18, C: 34 }, // N:75%, E:60%, O:72%, A:36%, C:85%
    via_raw: {
        Hope: 2.0, // Low
        Zest: 2.5,
        'Self-Regulation': 4.0,
        Gratitude: 2.8,
        Perspective: 4.3, // Top strength
        Prudence: 3.9,
        Perseverance: 4.0,
        Love: 3.0
    },
    mbti: 'INTJ'
};

// ============================================
// TEST PROFILE 3: Social Withdrawn
// ============================================
const socialWithdrawn: UserInputData = {
    dass21_raw: { D: 24, A: 12, S: 16 },
    big5_raw: { N: 32, E: 8, O: 28, A: 35, C: 14 }, // N:80%, E:15%, O:56%, A:70%, C:35%
    via_raw: {
        Hope: 2.8,
        Zest: 2.2,
        'Self-Regulation': 2.5,
        Gratitude: 3.5,
        Kindness: 4.0, // Top strength
        Love: 3.8,
        Humility: 3.5,
        Forgiveness: 3.2
    },
    mbti: 'ISFJ'
};

// ============================================
// TEST RUNNER
// ============================================
async function testArchetypes() {
    console.log('🧪 MISO V3 Deep Integration - Archetypal Profile Testing\n');
    console.log('='.repeat(80));

    const profiles = [
        { name: 'Resilient Creator', data: resilientCreator, expectedInterventions: ['creative', 'art', 'behavioral_activation'] },
        { name: 'Anxious Achiever', data: anxiousAchiever, expectedInterventions: ['strategic', 'logic', 'problem_solving'] },
        { name: 'Social Withdrawn', data: socialWithdrawn, expectedInterventions: ['micro_connection', 'social', 'kindness'] }
    ];

    for (const profile of profiles) {
        console.log(`\n📋 Testing Profile: ${profile.name}\n`);
        console.log('-'.repeat(80));

        try {
            const result = await runMisoAnalysis(profile.data, `test-${profile.name.toLowerCase().replace(/\s+/g, '-')}`);

            // 1. Profile Classification
            console.log('\n1️⃣ PROFILE CLASSIFICATION:');
            console.log(`   ID: ${result.profile.id}`);
            console.log(`   Name: ${result.profile.name}`);
            console.log(`   Risk Level: ${result.profile.risk_level}`);

            // 2. Scores
            if (result.scores) {
                console.log('\n2️⃣ SCORES:');
                console.log(`   BVS (Vulnerability): ${result.scores.BVS.toFixed(3)}`);
                console.log(`   RCS (Resilience): ${result.scores.RCS.toFixed(3)}`);
            }

            // 3. Active Mechanisms
            if (result.mechanisms?.active) {
                console.log('\n3️⃣ ACTIVE RISK MECHANISMS:');
                result.mechanisms.active.forEach((mech, idx) => {
                    console.log(`   ${idx + 1}. ${mech.pathway}`);
                    console.log(`      Strength: ${(mech.strength * 100).toFixed(0)}%`);
                    console.log(`      Predicted Impact: D:${mech.predictedDASS.D || 0}, A:${mech.predictedDASS.A || 0}, S:${mech.predictedDASS.S || 0}`);
                });
            }

            // 4. VIA Compensations
            if (result.mechanisms?.compensations) {
                console.log('\n4️⃣ VIA COMPENSATORY PATHWAYS:');
                result.mechanisms.compensations.forEach((comp, idx) => {
                    console.log(`   ${idx + 1}. ${comp.strength} (${comp.percentile}%)`);
                    console.log(`      Mechanism: ${comp.mechanism}`);
                });
            }

            // 5. Residual Distress
            if (result.mechanisms?.residual) {
                console.log('\n5️⃣ RESIDUAL DISTRESS:');
                console.log(`   D: ${result.mechanisms.residual.D}, A: ${result.mechanisms.residual.A}, S: ${result.mechanisms.residual.S}`);
                console.log(`   Interpretation: ${result.mechanisms.residual.interpretation}`);
            }

            // 6. VIA-Problem Matches
            if (result.mechanisms?.via_problem_matches) {
                console.log('\n6️⃣ VIA-PROBLEM QUICK MATCHES:');
                result.mechanisms.via_problem_matches.forEach((match, idx) => {
                    console.log(`   ${idx + 1}. ${match.intervention}`);
                    console.log(`      Technique: ${match.technique}`);
                    console.log(`      Expected Effect: ${(match.expected_effect * 100).toFixed(0)}%`);
                });
            }

            // 7. Top 3 Scored Interventions
            if (result.interventions && 'immediate' in result.interventions) {
                console.log('\n7️⃣ TOP INTERVENTION RECOMMENDATIONS:');
                const scored = result.interventions.immediate.slice(0, 3);
                scored.forEach((intervention: any, idx: number) => {
                    if (intervention.score !== undefined) {
                        console.log(`   ${idx + 1}. ${intervention.intervention?.name || intervention.type} (Score: ${(intervention.score * 100).toFixed(0)}%)`);
                        if (intervention.reasoning && intervention.reasoning.length > 0) {
                            console.log(`      Top Reason: ${intervention.reasoning[0]}`);
                        }
                    } else {
                        console.log(`   ${idx + 1}. ${intervention.type || 'Unknown'}`);
                    }
                });
            }

            // 8. Validation
            console.log('\n8️⃣ VALIDATION:');
            console.log(`   ✅ Profile Classified: ${result.profile.id ? 'YES' : 'NO'}`);
            console.log(`   ✅ Mechanisms Detected: ${result.mechanisms?.active?.length || 0} mechanisms`);
            console.log(`   ✅ Compensations Found: ${result.mechanisms?.compensations?.length || 0} compensations`);
            console.log(`   ✅ VIA Matches Generated: ${result.mechanisms?.via_problem_matches?.length || 0} matches`);

        } catch (error) {
            console.error(`   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
        }

        console.log('\n' + '='.repeat(80));
    }

    console.log('\n✅ Testing Complete!\n');
}

// Run tests
testArchetypes().catch(console.error);
