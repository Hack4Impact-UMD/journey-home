import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  listAll, 
  getMetadata,
  updateMetadata,
  StorageReference,
  UploadTaskSnapshot,
  UploadResult
} from 'firebase/storage';
import { storage } from './firebase';

// Generic Storage operations for Firebase Storage
export class StorageService {
  // Upload a file to a specific path
  static async uploadFile(
    file: File, 
    path: string, 
    metadata?: { [key: string]: string }
  ): Promise<UploadResult> {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = await uploadBytes(storageRef, file, metadata);
      return uploadTask;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Upload a file with progress tracking
  static uploadFileWithProgress(
    file: File, 
    path: string, 
    onProgress: (progress: number) => void,
    onComplete: (downloadURL: string) => void,
    onError: (error: Error) => void,
    metadata?: { [key: string]: string }
  ): void {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on('state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          onError(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onComplete(downloadURL);
          } catch (error) {
            onError(error as Error);
          }
        }
      );
    } catch (error) {
      onError(error as Error);
    }
  }

  // Get download URL for a file
  static async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // Delete a file
  static async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // List all files in a directory
  static async listFiles(path: string): Promise<StorageReference[]> {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      return result.items;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // Get file metadata
  static async getFileMetadata(path: string) {
    try {
      const storageRef = ref(storage, path);
      return await getMetadata(storageRef);
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }

  // Update file metadata
  static async updateFileMetadata(
    path: string, 
    metadata: { [key: string]: string }
  ): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await updateMetadata(storageRef, metadata);
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw error;
    }
  }

  // Generate a unique filename
  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  }

  // Upload image with automatic compression and optimization
  static async uploadImage(
    file: File,
    path: string,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<UploadResult> {
    try {
      // Create a canvas for image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img;
          const maxWidth = options?.maxWidth || 1920;
          const maxHeight = options?.maxHeight || 1080;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            async (blob) => {
              if (blob) {
                try {
                  const compressedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  
                  const result = await this.uploadFile(compressedFile, path);
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            options?.quality || 0.8
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

// Export commonly used functions for convenience
export const {
  uploadFile,
  uploadFileWithProgress,
  getDownloadURL,
  deleteFile,
  listFiles,
  getFileMetadata,
  updateFileMetadata,
  generateUniqueFilename,
  uploadImage
} = StorageService;
