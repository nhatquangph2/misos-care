
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const createMockSupabaseClient = () => {
    const mockClient = {
        auth: {
            getUser: async () => ({ data: { user: { id: 'test-user-id' } }, error: null }),
            signInWithPassword: async () => ({ data: null, error: null }),
            signOut: async () => ({ error: null }),
        },
        from: function () { return this; },
        select: function () { return this; },
        insert: function () { return this; },
        update: function () { return this; },
        delete: function () { return this; },
        upsert: function () { return this; },
        eq: function () { return this; },
        single: async function () { return { data: null, error: null }; },
        maybeSingle: async function () { return { data: null, error: null }; },
        order: function () { return this; },
        limit: function () { return this; },
        storage: {
            from: function () { return this; },
            upload: async () => ({ data: { path: 'test' }, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: 'https://test.com/test.png' } }),
        },
    } as unknown as SupabaseClient<Database>;

    return mockClient;
};
