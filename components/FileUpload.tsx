
import React from 'react';
import PhotoIcon from './icons/PhotoIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <label
        htmlFor="file-upload"
        className="relative block w-full rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-12 text-center hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer transition-colors"
      >
        <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
        <span className="mt-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Upload a photo of your ingredients</span>
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF up to 10MB</span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
