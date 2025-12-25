
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Base Service class that supports Dependency Injection of the Supabase client.
 * Uses lazy initialization to prevent client creation at build time.
 */
export class BaseService {
    private _supabase?: SupabaseClient<Database>;
    private _injectedClient?: SupabaseClient<Database>;

    constructor(supabase?: SupabaseClient<Database>) {
        // Store injected client for later use
        this._injectedClient = supabase;
    }

    /**
     * Lazily creates or returns the Supabase client.
     * This prevents client creation at build time when env vars are unavailable.
     */
    protected get supabase(): SupabaseClient<Database> {
        if (this._injectedClient) {
            return this._injectedClient;
        }

        if (!this._supabase) {
            // Lazy import to prevent build-time evaluation
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { createClient } = require('@/lib/supabase/client');
            this._supabase = createClient();
        }

        return this._supabase!;
    }
}
