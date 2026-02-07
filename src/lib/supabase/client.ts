import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.warn("Supabase credentials missing. Utilizing mock client for UI development.");
        // Return a basic mock client that supports the auth methods used in the login page
        return {
            auth: {
                signInWithPassword: async () => ({
                    data: { user: { id: 'mock-admin-id', email: 'admin@nextlevel.com' } },
                    error: null
                }),
                signOut: async () => ({ error: null }),
                getUser: async () => ({
                    data: { user: { id: 'mock-admin-id', email: 'admin@nextlevel.com' } },
                    error: null
                }),
                getSession: async () => ({
                    data: { session: { access_token: 'mock-token' } },
                    error: null
                }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
            // Basic query builder mock
            from: () => ({
                select: () => ({
                    order: () => ({
                        data: [],
                        error: null
                    })
                })
            })
        } as any;
    }

    return createBrowserClient(url, key)
}
