
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '../.env.local');
        const content = fs.readFileSync(envPath, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        console.error('Error reading .env.local:', e);
        return {};
    }
}

async function checkData() {
    const env = loadEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for raw access

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing env vars in .env.local');
        // Try to dump keys just to see what we have
        console.log('Available Keys:', Object.keys(env));
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user with recent analysis log or just last updated profile
    const { data: profiles, error } = await supabase
        .from('personality_profiles')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    if (profiles && profiles.length > 0) {
        const p = profiles[0];
        console.log('User ID:', p.user_id);
        console.log('MBTI:', p.mbti_type);
        console.log('Big5 Openness (raw):', p.big5_openness);
        console.log('Big5 Conscientiousness (raw):', p.big5_conscientiousness);
        console.log('Big5 Extraversion (raw):', p.big5_extraversion);
        console.log('Big5 Agreeableness (raw):', p.big5_agreeableness);
        console.log('Big5 Neuroticism (raw):', p.big5_neuroticism);
    } else {
        console.log('No profiles found.');
    }
}

checkData();
