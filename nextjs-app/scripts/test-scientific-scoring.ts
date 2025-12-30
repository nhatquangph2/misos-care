
import { runMisoAnalysis } from '../lib/miso/engine'
import { UserInputData } from '../types/miso-v3'

async function testScientificScoring() {
    console.log('🧪 TESTING MISO V3 DEEP INTELLIGENCE (SCIENTIFIC SCORING)\n')

    // CASE 1: High Distress User (Need Scaffolding)
    // High DASS, High Neuroticism, Low Conscientiousness
    const crisisUser: UserInputData = {
        dass21_raw: { D: 38, A: 30, S: 35 }, // Severe/Extreme
        big5_raw: { N: 38, E: 15, O: 20, A: 20, C: 15 }, // High N, Low C
    }

    console.log('--- CASE 1: CRISIS USER (High Distress) ---')
    const crisisResult = await runMisoAnalysis(crisisUser, 'test-crisis')

    console.log('ZPD Level:', crisisResult.scientific_analysis?.zpd.level, '(Expected: 1)')
    console.log('SDT Needs:', JSON.stringify(crisisResult.scientific_analysis?.sdt))

    console.log('\nTop Immediate Interventions:')
    crisisResult.interventions.immediate.slice(0, 3).forEach((i: any) => {
        console.log(`- ${i.type} (ZPD: ${i.intervention?.details?.zpd_complexity || '?'})`)
    })

    // CASE 2: Growth User (Autonomous)
    // Low DASS, High Openness, High Conscientiousness
    const growthUser: UserInputData = {
        dass21_raw: { D: 2, A: 4, S: 6 }, // Normal
        big5_raw: { N: 12, E: 30, O: 38, A: 35, C: 38 }, // Low N, High O/C
    }

    console.log('\n--- CASE 2: GROWTH USER (High Capacity) ---')
    const growthResult = await runMisoAnalysis(growthUser, 'test-growth')

    console.log('ZPD Level:', growthResult.scientific_analysis?.zpd.level, '(Expected: 3)')

    console.log('\nTop Long-Term Interventions:')
    growthResult.interventions.long_term.slice(0, 3).forEach((i: any) => {
        console.log(`- ${i.type} (ZPD: ${i.intervention?.details?.zpd_complexity || '?'})`)
    })
}

testScientificScoring().catch(console.error)
