
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { DASS21_QUESTIONS } from '../constants/tests/dass21-questions';

// Manually load env vars from .env.local
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
        }
    } catch (e) {
        console.warn('Could not load .env.local', e);
    }
};

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Or SERVICE_ROLE_KEY if needed

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDass21Data() {
    console.log('Starting DASS-21 Data Repair...');

    // 1. Fetch all DASS-21 records from mental_health_records
    const { data: records, error } = await supabase
        .from('mental_health_records')
        .select('*')
        .eq('test_type', 'DASS21');

    if (error) {
        console.error('Error fetching records:', error);
        return;
    }

    console.log(`Found ${records.length} DASS-21 records.`);

    let updatedCount = 0;

    for (const record of records) {
        // Check if subscale_scores is missing or empty
        if (!record.subscale_scores || Object.keys(record.subscale_scores).length === 0) {
            console.log(`Fixing record ${record.id}...`);

            if (!record.raw_responses || !Array.isArray(record.raw_responses)) {
                console.log(`Skipping record ${record.id}: No valid raw_responses`);
                continue;
            }

            // Calculate scores
            const subscaleScores = {
                depression: 0,
                anxiety: 0,
                stress: 0
            };

            record.raw_responses.forEach((answer: any) => {
                // answer matches { questionId: number, value: number } (value 0-3) from DASS21TestPage
                // DASS21_QUESTIONS has id and subscale
                // The questionId in raw_responses might be index+1 or the actual ID.
                // In page.tsx: questionId is from DASS21_QUESTIONS_FLOW which maps to DASS21_QUESTIONS.
                // Let's assume questionId in answer corresponds to DASS21_QUESTIONS.id

                const question = DASS21_QUESTIONS.find(q => q.id === answer.questionId);
                if (question) {
                    subscaleScores[question.subscale as keyof typeof subscaleScores] += answer.value;
                }
            });

            // Multiply by 2 for normalized scores (DASS-21 rule)
            const normalizedScores = {
                depression: subscaleScores.depression * 2,
                anxiety: subscaleScores.anxiety * 2,
                stress: subscaleScores.stress * 2
            };

            // Update record
            const { error: updateError } = await supabase
                .from('mental_health_records')
                .update({ subscale_scores: normalizedScores } as any)
                .eq('id', record.id);

            if (updateError) {
                console.error(`Failed to update record ${record.id}:`, updateError);
            } else {
                console.log(`Successfully updated record ${record.id} with scores:`, normalizedScores);
                updatedCount++;
            }
        }
    }

    console.log(`Repair complete. Updated ${updatedCount} records.`);
}

fixDass21Data();
