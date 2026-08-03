'use client';

import { useState, useCallback } from 'react';
import { Upload, X, File, FileImage, FileVideo, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UploadedFile {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    uploadDate: Date;
    preview?: string;
}

interface FileUploaderProps {
    acceptedTypes?: string[];
    maxSizeMB?: number;
    onFilesChange?: (files: UploadedFile[]) => void;
}

export function FileUploader({
    acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
    maxSizeMB = 50,
    onFilesChange
}: FileUploaderProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <FileImage className="w-8 h-8" />;
        if (type.startsWith('video/')) return <FileVideo className="w-8 h-8" />;
        if (type === 'application/pdf') return <File className="w-8 h-8" />;
        return <File className="w-8 h-8" />;
    };

    const createPreview = async (file: File): Promise<string | undefined> => {
        if (file.type.startsWith('image/')) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });
        }
        return undefined;
    };

    const handleFiles = async (fileList: FileList) => {
        const newFiles: UploadedFile[] = [];
        const maxSize = maxSizeMB * 1024 * 1024;

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (!file) continue;

            if (file.size > maxSize) {
                alert(`File ${file.name} is too large. Max size is ${maxSizeMB}MB`);
                continue;
            }

            const preview = await createPreview(file);

            newFiles.push({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date(),
                preview
            });
        }

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [files]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (id: string) => {
        const updatedFiles = files.filter(f => f.id !== id);
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 dark:border-gray-700 hover:border-primary'
                    }`}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInput}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                        <Upload className={`w-12 h-12 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                        <p className="text-lg font-medium">
                            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                        </p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Supported: Images, Videos, PDFs (max {maxSizeMB}MB)
                        </p>
                    </div>
                </label>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Uploaded Files ({files.length})</h3>
                    <div className="space-y-2">
                        {files.map((file) => (
                            <Card key={file.id} className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Preview or Icon */}
                                    <div className="flex-shrink-0">
                                        {file.preview ? (
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400">
                                                {getFileIcon(file.type)}
                                            </div>
                                        )}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                            <span>{formatFileSize(file.size)}</span>
                                            <span>•</span>
                                            <span>{(file.type.split('/')[1] || 'FILE').toUpperCase()}</span>
                                            <span>•</span>
                                            <span>{file.uploadDate.toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Success & Remove */}
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFile(file.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
