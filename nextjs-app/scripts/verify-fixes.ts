
import { calculateMBTI, MBTIDimensionScore, MBTIQuestionResponse } from '../constants/tests/mbti-questions-full';

// Mock questions subset for testing
// ei_01: "Energy in groups" (Normal). High -> E. (Target: E)
// ei_02: "Time alone" (Reverse). High -> I. (Target: I)

function runVerification() {
    console.log('Running MBTI Scoring Verification...');

    // Test Case 1: Extreme Extrovert
    // Answers 5 (Strongly Agree) to Normal questions (ei_01) -> Should be E
    // Answers 1 (Strongly Disagree) to Reverse questions (ei_02) -> Should be E

    const answersE: MBTIQuestionResponse[] = [
        { questionId: 'ei_01', score: 5 }, // Normal, +2 -> -= 2 -> Score -2 (Strong E)
        { questionId: 'ei_02', score: 1 }, // Reverse, -2 -> += -2 -> Score -2 (Strong E)
    ];

    const resultE = calculateMBTI(answersE);
    console.log('Test Case 1 (Expect Strong E):');
    console.log('Result Type:', resultE.type); // Should contain E
    const dimE = resultE.dimensions.find(d => d.dimension === 'EI');
    console.log('EI Score:', dimE?.score, '(Expect negative)');

    if (dimE && dimE.score < 0) {
        console.log('✅ PASS: Extrovert logic correct');
    } else {
        console.log('❌ FAIL: Extrovert logic incorrect');
    }

    // Test Case 2: Extreme Introvert
    // Answers 1 (Strongly Disagree) to Normal questions (ei_01) -> Should be I
    // Answers 5 (Strongly Agree) to Reverse questions (ei_02) -> Should be I

    const answersI: MBTIQuestionResponse[] = [
        { questionId: 'ei_01', score: 1 }, // Normal, -2 -> -= -2 -> Score +2 (Strong I)
        { questionId: 'ei_02', score: 5 }, // Reverse, +2 -> += +2 -> Score +2 (Strong I)
    ];

    const resultI = calculateMBTI(answersI);
    console.log('\nTest Case 2 (Expect Strong I):');
    console.log('Result Type:', resultI.type); // Should contain I
    const dimI = resultI.dimensions.find(d => d.dimension === 'EI');
    console.log('EI Score:', dimI?.score, '(Expect positive)');

    if (dimI && dimI.score > 0) {
        console.log('✅ PASS: Introvert logic correct');
    } else {
        console.log('❌ FAIL: Introvert logic incorrect');
    }
}

runVerification();
