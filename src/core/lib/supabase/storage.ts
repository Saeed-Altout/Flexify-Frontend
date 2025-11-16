import { supabase } from './client';

export interface UploadFileOptions {
  bucket: string;
  path: string;
  file: File;
  contentType?: string;
  upsert?: boolean;
  cacheControl?: string;
}

export interface UploadFileResult {
  path: string;
  publicUrl: string;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  options: UploadFileOptions,
): Promise<UploadFileResult> {
  const { bucket, path, file, contentType, upsert = false, cacheControl = '3600' } = options;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: contentType || file.type,
      upsert,
      cacheControl,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl,
  };
}

/**
 * Upload multiple files to Supabase Storage
 */
export async function uploadFiles(
  options: Omit<UploadFileOptions, 'file'> & { files: File[] },
): Promise<UploadFileResult[]> {
  const { bucket, files, ...restOptions } = options;

  const uploadPromises = files.map((file, index) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${index}.${fileExtension}`;
    const path = `${restOptions.path}/${fileName}`;

    return uploadFile({
      ...restOptions,
      bucket,
      path,
      file,
    });
  });

  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, paths: string[]): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get public URL for a file in Supabase Storage
 */
export function getPublicUrl(bucket: string, path: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

/**
 * Download a file from Supabase Storage
 */
export async function downloadFile(
  bucket: string,
  path: string,
): Promise<Blob> {
  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }

  return data;
}

