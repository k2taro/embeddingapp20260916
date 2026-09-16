/**
 * アプリケーションヘッダーコンポーネント
 * 
 * アプリのタイトル、完全ローカル実行（プライバシー保護）ステータス、
 * サンプル論文読み込み、設定モーダルボタンを提供します。
 */

import React from 'react';
import { ShieldCheck, Cpu, Sliders, RefreshCw, Trash2, BookOpen } from 'lucide-react';

interface HeaderProps {
  paperCount: number;
  isProcessing: boolean;
  onOpenSettings: () => void;
  onLoadSample: () => void;
  onClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  paperCount,
  isProcessing,
  onOpenSettings,
  onLoadSample,
  onClear,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-30 px-4 lg:px-8 py-3.5 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* アプリ名とアイコン */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Local Paper Visualizer
              </h1>
              {/* 完全ローカル処理のプライバシーバッジ */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                完全ローカルWasm / サーバー送信0%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              PDFテキスト抽出・埋め込みベクトル・UMAP・クラスタリングをブラウザ内完結処理
            </p>
          </div>
        </div>

        {/* 右側アクションボタングループ */}
        <div className="flex items-center flex-wrap gap-2">
          {paperCount === 0 && (
            <button
              id="load-sample-btn"
              type="button"
              onClick={onLoadSample}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              サンプル論文で即座にお試し
            </button>
          )}

          {paperCount > 0 && (
            <button
              id="clear-all-btn"
              type="button"
              onClick={onClear}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              title="解析データをリセット"
            >
              <Trash2 className="w-4 h-4" />
              リセット
            </button>
          )}

          <button
            id="open-settings-btn"
            type="button"
            onClick={onOpenSettings}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            解析パラメータ設定
          </button>
        </div>
      </div>
    </header>
  );
};
