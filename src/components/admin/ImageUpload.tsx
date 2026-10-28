'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
  required?: boolean;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  folder = 'general',
  hint,
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('فقط فایل‌های تصویری (JPG, PNG, WebP, SVG, GIF) مجاز هستند.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('حجم فایل بیشتر از ۱۵ مگابایت است.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در آپلود تصویر.');
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'خطا در آپلود تصویر.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
          <span>{label}</span>
          {required && <span className="text-rose-400">*</span>}
        </label>

        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[10px] text-gray-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualInput ? 'حالت آپلود فایل' : 'درج مستقیم لینک/مسیر'}</span>
        </button>
      </div>

      {showManualInput ? (
        <div className="space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/media/uploads/... یا https://..."
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-500 focus:outline-none"
          />
        </div>
      ) : value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center gap-3 group">
          <div className="w-20 h-20 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0 relative flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="پیش‌نمایش"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If local image fails, show generic icon
                (e.target as any).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تصویر آپلود شده</span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono truncate dir-ltr text-right" title={value}>
              {value}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>تغییر فایل</span>
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-medium transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>حذف</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-500/10'
              : 'border-white/10 bg-white/5 hover:border-brand-500/30 hover:bg-white/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            accept="image/*"
            className="hidden"
          />

          {uploading ? (
            <div className="py-2 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
              <p className="text-xs text-brand-300 font-medium">در حال آپلود و ذخیره در سرور...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  کلیک کنید یا فایل تصویر را بکشید و رها کنید
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  پشتیبانی از فرمت‌های WebP, PNG, JPG (حداکثر ۱۵ مگابایت)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-400 font-medium">{error}</p>
      )}

      {hint && !error && (
        <p className="text-[10px] text-gray-400">{hint}</p>
      )}
    </div>
  );
}
