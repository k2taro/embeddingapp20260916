/**
 * パイプライン処理進行状況表示コンポーネント
 * 
 * ブラウザ上での重い計算（Wasm/ONNXモデルロード、ベクトル計算、UMAP等）の進捗を
 * ユーザーに分かりやすく段階的に伝えます。
 */

import React from 'react';
import { EngineProgress, EngineStage } from '../types';
import { FileText, Cpu, Network, Compass, CheckCircle2, AlertCircle } from 'lucide-react';

interface EngineProgressBarProps {
  progress: EngineProgress;
}

interface StageStep {
  key: EngineStage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StageStep[] = [
  { key: 'extracting', label: 'PDF抽出', icon: FileText },
  { key: 'loading-model', label: 'モデルロード', icon: Cpu },
  { key: 'embedding', label: 'ベクトル化', icon: Network },
  { key: 'reducing', label: 'UMAP投影', icon: Compass },
  { key: 'clustering', label: 'クラスタリング', icon: CheckCircle2 },
];

export const EngineProgressBar: React.FC<EngineProgressBarProps> = ({ progress }) => {
  if (progress.stage === 'idle') {
    return null;
  }

  const isError = progress.stage === 'error';
  const isCompleted = progress.stage === 'completed';

  // 現在のステージインデックスを判定
  const stageOrder: EngineStage[] = ['extracting', 'loading-model', 'embedding', 'reducing', 'clustering'];
  const currentIndex = stageOrder.indexOf(progress.stage);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6">
      {/* 上部ステータスバー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <span className="text-sm font-semibold text-slate-800">
            {progress.message}
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 self-end sm:self-auto">
          {progress.percentage}%
        </span>
      </div>

      {/* プログレスバー本体 */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-300 ${
            isError
              ? 'bg-rose-500'
              : isCompleted
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-indigo-500 to-blue-600'
          }`}
          style={{ width: `${Math.max(2, progress.percentage)}%` }}
        />
      </div>

      {/* ステップ一覧 */}
      <div className="grid grid-cols-5 gap-1 pt-1 border-t border-slate-100 text-center">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isPast = isCompleted || (currentIndex !== -1 && idx < currentIndex);
          const isCurrent = progress.stage === stage.key;

          return (
            <div
              key={stage.key}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                isCurrent
                  ? 'text-indigo-600 font-bold'
                  : isPast
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCurrent
                    ? 'bg-indigo-100 text-indigo-600'
                    : isPast
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="truncate max-w-[70px]">{stage.label}</span>
            </div>
          );
        })}
      </div>

      {progress.detail && (
        <p className="mt-2 text-xs text-slate-400 font-mono text-center">
          {progress.detail}
        </p>
      )}
    </div>
  );
};
