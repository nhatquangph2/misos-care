
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Base Service class that supports Dependency Injection of the Supabase client.
 * This allows for easier testing and prevents repeated client creation.
 */
export class BaseService {
    protected supabase: SupabaseClient<Database>;

    constructor(supabase?: SupabaseClient<Database>) {
        // If no client is provided, default to the browser client.
        this.supabase = supabase ?? createBrowserClient();
    }
}
