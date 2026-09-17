/**
 * PDFファイルアップローダーコンポーネント
 * 
 * ドラッグ＆ドロップおよびファイル選択ダイアログに対応し、
 * クライアントサイドでの完全ローカル読み込みを保証します。
 */

import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, ShieldAlert, Sparkles } from 'lucide-react';

interface PdfUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onLoadSample: () => void;
  disabled?: boolean;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({
  onFilesSelected,
  onLoadSample,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    const pdfFiles = droppedFiles.filter(
      (file: File) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length > 0) {
      onFilesSelected(pdfFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesSelected(selected);
      // リセットして同一ファイル再選択を可能にする
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        id="pdf-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/70 scale-[1.005]'
            : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-2xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-1">
            学術論文（PDF）をドロップ または クリックして選択
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            複数のPDFファイルを同時にアップロード可能です。PDF.js によりブラウザ上で直接テキストを抽出します。
          </p>

          <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 mb-5">
            <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>完全ローカル処理：ファイルや文章が外部サーバーに送信されることはありません</span>
          </div>

          {/* サンプルデータ読み込みボタン */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-200/80 w-full justify-center"
          >
            <span className="text-xs text-slate-500">PDFをお持ちでない場合:</span>
            <button
              id="load-sample-in-uploader-btn"
              type="button"
              onClick={onLoadSample}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              ノーベル賞・AI・量子等のサンプル論文30件で試す
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
