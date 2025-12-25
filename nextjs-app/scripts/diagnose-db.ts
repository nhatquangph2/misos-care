
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manually load env vars
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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    console.log('Available Env Vars:', Object.keys(process.env));
    process.exit(1);
}

console.log(`Using key type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE (Admin)' : 'ANON (Public)'}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('Diagnosing Mental Health Records...');

    // 1. Count records
    const { count, error: countError } = await supabase
        .from('mental_health_records')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting records:', countError);
        return;
    }

    console.log(`Total records in mental_health_records: ${count}`);

    // 2. Check DASS-21 records
    const { data: dassRecords, error: dassError } = await supabase
        .from('mental_health_records')
        .select('id, test_type, subscale_scores, raw_responses, created_at')
        .eq('test_type', 'DASS21')
        .order('created_at', { ascending: false })
        .limit(5);

    if (dassError) {
        console.error('Error fetching DASS records:', dassError);
        return;
    }

    console.log(`Found ${dassRecords?.length} recent DASS-21 records.`);

    dassRecords?.forEach(r => {
        console.log(`Record ${r.id}:`);
        console.log(`  Created: ${r.created_at}`);
        console.log(`  Subscale Scores:`, r.subscale_scores);
        console.log(`  Raw Responses Present:`, !!r.raw_responses);
        if (r.raw_responses) {
            console.log(`  Raw Responses Length:`, Array.isArray(r.raw_responses) ? r.raw_responses.length : 'Not Array');
        }
    });

    // 3. Check for any other test types just in case
    const { data: types } = await supabase
        .from('mental_health_records')
        .select('test_type')
        .limit(10);

    const uniqueTypes = [...new Set(types?.map(t => t.test_type))];
    console.log('Test types found:', uniqueTypes);
}

diagnose();
