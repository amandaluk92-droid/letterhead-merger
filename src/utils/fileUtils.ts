import { DocumentFile } from '../types';

export const validateDocxFile = (file: File): boolean => {
  const validExtensions = ['.docx'];
  const validMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];
  
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  const isValidExtension = validExtensions.includes(extension);
  const isValidMimeType = validMimeTypes.includes(file.type) || file.type === '';
  
  return isValidExtension || isValidMimeType;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const createDocumentFile = (file: File): DocumentFile => {
  return {
    file,
    name: file.name,
    size: file.size,
  };
};


