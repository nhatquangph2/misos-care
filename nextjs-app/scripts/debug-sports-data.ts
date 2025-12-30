
import { getPersonalizedRecommendations } from '@/services/recommendation.service'
import { getFlowStateRecommendations } from '@/services/enhanced-intervention.service'
import { MisoAnalysisResult } from '@/types/miso-v3'

async function main() {
    console.log('Starting MOCK Debug for Sports Data...')

    // Mock Big5 Raw Input
    const big5_raw = {
        O: 50,
        C: 50,
        E: 50,
        A: 50,
        N: 50,
    }

    console.log('Testing getFlowStateRecommendations...')
    try {
        const flowStates = getFlowStateRecommendations(big5_raw)
        console.log('Flow States Count:', flowStates.length)
        inspectFlowStates(flowStates)
    } catch (e) {
        console.error('getFlowStateRecommendations FAILED:', e)
    }

    // Mock Miso Result
    // We need to approximate the MisoAnalysisResult structure
    const mockMisoResult: any = {
        normalized: {
            big5: {
                O: { percentile: 50, level: 'moderate', raw: 50 },
                C: { percentile: 50, level: 'moderate', raw: 50 },
                E: { percentile: 50, level: 'moderate', raw: 50 },
                A: { percentile: 50, level: 'moderate', raw: 50 },
                N: { percentile: 50, level: 'moderate', raw: 50 },
            }
        },
        profile: {
            name: 'Balanced',
            risk_level: 'low'
        },
        // Fill other required fields with dummy data if needed by getPersonalizedRecommendations
        completeness: { mode: 'FULL' },
        temporal: {},
        discrepancies: [],
        via_analysis: null,
        interventions: { immediate: [], short_term: [], long_term: [] },
        mechanisms: {},
        scientific_analysis: {},
        predictions: {},
        summary: ''
    }

    console.log('Testing getPersonalizedRecommendations...')
    try {
        const recommendations = getPersonalizedRecommendations(mockMisoResult as MisoAnalysisResult)
        console.log('Recommendations generated.')

        if (recommendations && recommendations.sports) {
            inspectSportsData(recommendations.sports)
        } else {
            console.error('No sports recommendations found!')
        }

    } catch (e) {
        console.error('getPersonalizedRecommendations FAILED:', e)
    }
}

function inspectFlowStates(flowStates: any[]) {
    console.log('--- FLOW STATES INSPECTION ---')
    flowStates.forEach((f, i) => {
        // console.log(`Flow[${i}]:`, JSON.stringify(f, null, 2))
        checkSafeForRender(`flow[${i}].condition.nameVi`, f.condition?.nameVi)
        checkSafeForRender(`flow[${i}].currentStatus`, f.currentStatus)
        if (f.tipsVi && f.tipsVi.length > 0) {
            checkSafeForRender(`flow[${i}].tipsVi[0]`, f.tipsVi[0])
        }
        // Inspect condition deeply
        if (typeof f.condition === 'object') {
            // ensure it doesn't contain bad things
        } else {
            console.error(`Flow[${i}].condition is NOT object`, f.condition)
        }

    })
}

function inspectSportsData(sports: any) {
    console.log('--- SPORTS DATA INSPECTION ---')
    // console.log('Sports Data:', JSON.stringify(sports, null, 2))

    checkSafeForRender('sports.mentalToughnessScore', sports.mentalToughnessScore)

    sports.dimensions.forEach((d: any, i: number) => {
        checkSafeForRender(`dim[${i}].dimension`, d.dimension)
        checkSafeForRender(`dim[${i}].score`, d.score)
        checkSafeForRender(`dim[${i}].level`, d.level)
    })

    sports.activities.forEach((a: any, i: number) => {
        checkSafeForRender(`act[${i}].nameVi`, a.nameVi)
        checkSafeForRender(`act[${i}].category`, a.category)
        if (Array.isArray(a.mentalBenefitsVi)) {
            a.mentalBenefitsVi.forEach((b: any, j: number) => {
                checkSafeForRender(`act[${i}].benefit[${j}]`, b)
            })
        } else {
            console.error(`ERROR: mentalBenefitsVi is not array at index ${i}`, a.mentalBenefitsVi)
        }
    })
}

function checkSafeForRender(path: string, value: any) {
    if (typeof value === 'object' && value !== null) {
        // Arrays are technically objects but if mapped are ok. But here we check primitives.
        console.error(`RENDER HAZARD at ${path}: Value is object/array!`, value)
    } else if (value === undefined) {
        console.warn(`RENDER HAZARD at ${path}: Value is undefined!`)
    } else if (value === null) {
        // Null is safe in react
    } else {
        // Safe (string, number, boolean)
        // console.log(`OK: ${path} = ${value}`)
    }
}

main().catch(console.error)
