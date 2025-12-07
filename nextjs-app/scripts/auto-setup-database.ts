/**
 * AUTO SETUP DATABASE SCRIPT
 * This script will automatically create all database tables
 * using Supabase REST API
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseKey)

async function setupDatabase() {
  console.log('🚀 Miso\'s Care - Automatic Database Setup')
  console.log('==========================================\n')

  console.log(`📍 Supabase Project: ${supabaseUrl}\n`)

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '00001_initial_schema.sql')
    const sqlContent = fs.readFileSync(migrationPath, 'utf-8')

    console.log('📄 Reading migration file...')
    console.log(`   File: ${migrationPath}`)
    console.log(`   Size: ${(sqlContent.length / 1024).toFixed(2)} KB\n`)

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📊 Found ${statements.length} SQL statements\n`)
    console.log('⏳ Executing SQL statements...\n')

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      const preview = statement.substring(0, 60).replace(/\n/g, ' ') + '...'

      try {
        // Execute SQL using Supabase RPC
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        })

        if (error) {
          // Try alternative method using REST API
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql_query: statement })
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`)
          }
        }

        console.log(`✅ [${i + 1}/${statements.length}] ${preview}`)
        successCount++
      } catch (error: any) {
        console.log(`⚠️  [${i + 1}/${statements.length}] ${preview}`)
        console.log(`   Error: ${error.message}`)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Successful: ${successCount}`)
    console.log(`   ⚠️  Errors: ${errorCount}`)
    console.log(`   📝 Total: ${statements.length}\n`)

    if (errorCount === 0) {
      console.log('🎉 Database setup completed successfully!')
      console.log('\n✨ Next steps:')
      console.log('   1. Open http://localhost:3001')
      console.log('   2. Login or create an account')
      console.log('   3. Start taking tests!\n')
    } else {
      console.log('⚠️  Setup completed with some errors.')
      console.log('   Please check the errors above.')
      console.log('   You may need to run the SQL manually in Supabase Dashboard.\n')
    }

  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message)
    console.log('\n💡 Alternative method:')
    console.log('   Run: npm run setup:db:manual')
    process.exit(1)
  }
}

setupDatabase()
