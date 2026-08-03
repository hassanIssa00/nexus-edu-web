import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    listAll
} from 'firebase/storage'
import { storage } from './config'
import { getCurrentUser } from './auth'

/**
 * Upload file to Firebase Storage
 */
export async function uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> {
    const user = getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const storageRef = ref(storage, `${path}/${file.name}`)

    if (onProgress) {
        // Upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file)

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    onProgress(progress)
                },
                (error) => reject(error),
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref)
                    resolve({ url, path: uploadTask.snapshot.ref.fullPath })
                }
            )
        })
    } else {
        // Simple upload without progress
        const snapshot = await uploadBytes(storageRef, file)
        const url = await getDownloadURL(snapshot.ref)
        return { url, path: snapshot.ref.fullPath }
    }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
    files: File[],
    basePath: string,
    onProgress?: (progress: number) => void
): Promise<Array<{ url: string; path: string; file: File }>> {
    const user = getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    let totalProgress = 0
    const results: Array<{ url: string; path: string; file: File }> = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file) continue;
        const result = await uploadFile(file, basePath, (fileProgress) => {
            totalProgress = ((i + fileProgress / 100) / files.length) * 100
            onProgress?.(totalProgress)
        })
        results.push({ ...result, file })
    }

    return results
}

/**
 * Get download URL for a file
 */
export async function getFileURL(path: string): Promise<string> {
    const storageRef = ref(storage, path)
    return await getDownloadURL(storageRef)
}

/**
 * Delete a file
 */
export async function deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
}

/**
 * List all files in a directory
 */
export async function listFiles(path: string): Promise<string[]> {
    const storageRef = ref(storage, path)
    const result = await listAll(storageRef)
    return result.items.map((item) => item.fullPath)
}
