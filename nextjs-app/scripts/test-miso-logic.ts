
import { runMisoAnalysis } from '../lib/miso/engine';
import { UserInputData } from '../types/miso-v3';

async function test() {
    console.log('🧪 Testing MISO V3 Logic...');

    const mockUser: UserInputData = {
        dass21_raw: { D: 12, A: 8, S: 14 }, // Moderate scores
        big5_raw: { N: 28, E: 24, O: 38, A: 36, C: 32 }, // Input raw scores
        via_raw: {
            Hope: 3.5,
            Zest: 3.2,
            'Self-Regulation': 3.0,
            Gratitude: 3.8,
        },
        mbti: 'INFP',
    };

    try {
        const result = await runMisoAnalysis(mockUser, 'test-user-id');

        console.log('✅ Analysis Successful!');
        console.log('-----------------------------------');
        console.log(`📊 Profile: ${'name' in result.profile ? result.profile.name : 'N/A'}`);
        console.log(`🛡️  Risk Level: ${'risk_level' in result.profile ? result.profile.risk_level : 'N/A'}`);
        console.log(`📉 BVS (Vulnerability): ${result.scores?.BVS}`);
        console.log(`💪 RCS (Resilience): ${result.scores?.RCS}`);
        console.log(`⚠️ Discrepancies: ${result.discrepancies.length}`);
        result.discrepancies.forEach(d => console.log(`   - ${d.name} (${d.severity})`));

        console.log('-----------------------------------');
        if (result.scores && result.scores.BVS > 0) {
            console.log("✅ Math engine seems to be working (Scores calculated)");
        } else {
            console.log("❌ Math engine might have issues (Scores 0 or missing)");
        }

    } catch (error) {
        console.error('❌ MISO V3 Failed:', error);
    }
}

test();
