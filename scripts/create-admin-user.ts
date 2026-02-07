
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zowlqqtsqyobkpjssrzo.supabase.co'
const supabaseKey = 'sb_publishable_WZceFcr7FySXUPlUz1kTSg_sdkqKl5A'
const supabase = createClient(supabaseUrl, supabaseKey)

async function signUp() {
    const email = 'admin@nextlevel.com'
    const password = 'adminpassword123'

    console.log(`Attempting to sign up ${email}...`)

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        console.error('Error creating user:', error.message)
        // If user already exists, we can't get the password, so we just inform the user.
    } else {
        console.log('User created successfully:', data.user?.email)
        console.log('Please check your email to confirm the account if email confirmation is enabled.')
        console.log('Credentials:')
        console.log(`Email: ${email}`)
        console.log(`Password: ${password}`)
    }
}

signUp()
