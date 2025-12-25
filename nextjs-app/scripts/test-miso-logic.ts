

import { runMisoAnalysis } from '../lib/miso/engine';
import { UserInputData } from '../types/miso-v3';

async function test() {
    console.log('🧪 Testing MISO V3 Full Integration...');
    console.log('Setting up a complex profile (High N, Low E/C/A) with strong VIA compensations.\n');

    const mockUser: UserInputData = {
        dass21_raw: { D: 18, A: 12, S: 22 }, // Moderate to Severe scores
        big5_raw: {
            N: 36, // High (~95th percentile)
            E: 14, // Low (~5th percentile) 
            O: 36, // Average
            A: 26, // Low (~2nd percentile)
            C: 22  // Low (~1st percentile)
        },
        via_raw: {
            // High strengths to trigger compensations
            'Hope': 4.6,
            'Self-Regulation': 4.5,
            'Zest': 4.7,
            'Social Intelligence': 4.6,
            'Perseverance': 4.5,
            'Forgiveness': 4.4,
            'Appreciation of Beauty': 4.5,
            'Creativity': 4.6,

            // Other 16 strengths at baseline
            'Curiosity': 3.5,
            'Judgment': 3.6,
            'Love of Learning': 3.5,
            'Perspective': 3.8,
            'Bravery': 3.4,
            'Honesty': 3.9,
            'Love': 4.0,
            'Kindness': 4.0,
            'Teamwork': 3.6,
            'Fairness': 3.9,
            'Leadership': 3.5,
            'Humility': 3.4,
            'Prudence': 3.4,
            'Humor': 3.7,
            'Spirituality': 3.4,
            'Gratitude': 3.8
        },
        mbti: 'INFP',
    };

    try {
        const result = await runMisoAnalysis(mockUser, 'test-heavy-user');

        console.log('✅ Analysis Successful!');
        console.log('----------------------------------------------------');
        console.log(`📊 Profile Name: ${result.profile.name}`);
        console.log(`🛡️  Risk Level: ${result.profile.risk_level}`);
        console.log(`📉 BVS (Vulnerability): ${result.scores?.BVS.toFixed(3)}`);
        console.log(`💪 RCS (Resilience): ${result.scores?.RCS.toFixed(3)}`);

        console.log('\n🧠 ACTIVE CAUSAL MECHANISMS:');
        result.mechanisms?.active.forEach(m => {
            console.log(`   - [RISK] ${m.id}: ${m.pathway} (Strength: ${(m.strength * 100).toFixed(0)}%)`);
        });

        console.log('\n🛡️  VIA COMPENSATIONS TRIGGERED:');
        if (result.mechanisms?.compensations && result.mechanisms.compensations.length > 0) {
            result.mechanisms.compensations.forEach(c => {
                console.log(`   - ✅ ${c.id}: ${c.mechanism}`);
                console.log(`       Using: ${c.strength} (${c.percentile.toFixed(1)}%)`);
            });
        } else {
            console.log('   (No compensations triggered - check thresholds)');
        }

        console.log('\n⚠️  DETECTED DISCREPANCIES:');
        result.discrepancies.forEach(d => console.log(`   - ${d.name} (${d.severity}) | ${d.interpretation.slice(0, 60)}...`));

        console.log('\n🌟 VIA VIRTUE PROFILE:');
        result.via_analysis?.virtue_profile.slice(0, 3).forEach(v => {
            console.log(`   - ${v.name}: ${v.score}%`);
        });

        console.log('----------------------------------------------------');

        const hasCompensations = (result.mechanisms?.compensations?.length || 0) > 0;
        const hasFullVIA = result.via_analysis?.signature_strengths.length === 5;

        if (hasCompensations && hasFullVIA) {
            console.log("✅ SUCCESS: Full VIA data processed and Compensations triggered!");
        } else {
            if (!hasFullVIA) console.log("❌ FAIL: VIA Analysis didn't return full signature strengths.");
            if (!hasCompensations) console.log("❌ FAIL: No compensations triggered. Check Big5/VIA raw scoring logic.");
        }

    } catch (error) {
        console.error('❌ MISO V3 Failed:', error);
    }
}

test();

