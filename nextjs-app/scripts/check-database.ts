/**
 * CHECK DATABASE SCRIPT
 * Verify that all tables are created successfully
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Checking Database Setup...\n')

  const tables = [
    'users',
    'personality_profiles',
    'mental_health_records',
    'user_goals',
    'action_plans',
    'action_completions',
    'test_reminders'
  ]

  let allGood = true

  for (const table of tables) {
    try {
      const { error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
        allGood = false
      } else {
        console.log(`✅ ${table}: OK (${count || 0} records)`)
      }
    } catch (err: any) {
      console.log(`❌ ${table}: ${err.message}`)
      allGood = false
    }
  }

  console.log('\n' + '='.repeat(50))

  if (allGood) {
    console.log('\n🎉 All tables are ready!')
    console.log('\n✨ Next steps:')
    console.log('   1. Open http://localhost:3001')
    console.log('   2. Create an account or login')
    console.log('   3. Take your first test!')
    console.log('   4. Check the database for your results\n')
  } else {
    console.log('\n⚠️  Some tables are missing or have errors.')
    console.log('   Please run the SQL migration again.\n')
  }
}

checkDatabase()
