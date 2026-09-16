/**
 * 解析パラメータ設定モーダルコンポーネント
 * 
 * 埋め込みモデル（ruri-v3-30m / all-MiniLM-L6-v2等）、
 * クラスタ数 K (自動決定 または 固定数)、UMAP近傍点数の調整を行えます。
 */

import React, { useState } from 'react';
import { EngineSettings } from '../types';
import { AVAILABLE_EMBEDDING_MODELS } from '../utils/embeddings';
import { X, Sliders, Check, RefreshCw } from 'lucide-react';

interface EngineSettingsModalProps {
  isOpen: boolean;
  currentSettings: EngineSettings;
  onClose: () => void;
  onApply: (newSettings: EngineSettings) => void;
}

export const EngineSettingsModal: React.FC<EngineSettingsModalProps> = ({
  isOpen,
  currentSettings,
  onClose,
  onApply,
}) => {
  const [modelName, setModelName] = useState(currentSettings.modelName);
  const [clusterCount, setClusterCount] = useState(currentSettings.clusterCount);
  const [umapNeighbors, setUmapNeighbors] = useState(currentSettings.umapNeighbors);
  const [umapMinDist, setUmapMinDist] = useState(currentSettings.umapMinDist);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      modelName,
      clusterCount,
      umapNeighbors,
      umapMinDist,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        id="settings-modal"
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              解析エンジン パラメータ設定
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* モデル選択 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ベクトル埋め込みモデル（ブラウザ内ONNX実行）
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              ブラウザ（Wasm/WebGPU）上で完全ローカル実行されるHugging Faceモデル
            </p>
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {AVAILABLE_EMBEDDING_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* クラスタ数 K */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                K-means クラスタ数 (K)
              </label>
              <span className="text-xs font-mono text-indigo-600 font-bold">
                {clusterCount === 0 ? '自動決定' : `${clusterCount} クラスタ`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              論文群をいくつのグループにトピック分類するか指定します（0で件数から最適値を自動計算）
            </p>
            <input
              type="range"
              min={0}
              max={10}
              value={clusterCount}
              onChange={(e) => setClusterCount(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 (自動決定)</span>
              <span>3</span>
              <span>6</span>
              <span>10</span>
            </div>
          </div>

          {/* UMAP: 近傍点数 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                UMAP 近傍探索数 (n_neighbors)
              </label>
              <span className="text-xs font-mono text-indigo-600 font-bold">
                {umapNeighbors}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              局所的な類似関係を重視するか、大域的なトピックの広がりを重視するかを調整します
            </p>
            <input
              type="range"
              min={2}
              max={30}
              value={umapNeighbors}
              onChange={(e) => setUmapNeighbors(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* UMAP: 最小距離 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                UMAP 最小距離 (min_dist)
              </label>
              <span className="text-xs font-mono text-indigo-600 font-bold">
                {umapMinDist}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              散布図上での点同士の密集度（小さいほど密に集まる）
            </p>
            <input
              type="range"
              min={0.01}
              max={0.5}
              step={0.01}
              value={umapMinDist}
              onChange={(e) => setUmapMinDist(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* アクションボタン */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              id="apply-settings-btn"
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              設定を適用して再計算
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
