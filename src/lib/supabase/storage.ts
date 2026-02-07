import { createClient } from './client'

const supabase = createClient()

export async function uploadImage(file: File, bucket: string = 'inventory') {
    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file)

        if (error) {
            if (error.message.includes('bucket_not_found') || error.message.includes('Bucket not found')) {
                throw new Error("Storage bucket 'inventory' not found. Please create a public bucket named 'inventory' in your Supabase dashboard.")
            }
            throw error
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

        return { url: publicUrl, error: null }
    } catch (error: any) {
        console.error('Error uploading image:', error)
        return { url: null, error: error.message || 'Failed to upload image' }
    }
}
