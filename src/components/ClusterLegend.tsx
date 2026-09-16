/**
 * クラスタ凡例およびフィルタリングコンポーネント
 * 
 * K-meansにより生成されたトピッククラスタの一覧と、各クラスタの特徴キーワード、
 * 論文件数を表示し、クリックで対象クラスタの絞り込み表示を行えます。
 */

import React from 'react';
import { ClusterGroup } from '../types';
import { Layers, Check } from 'lucide-react';

interface ClusterLegendProps {
  clusterGroups: ClusterGroup[];
  activeClusterId: number | null;
  onSelectCluster: (clusterId: number | null) => void;
}

export const ClusterLegend: React.FC<ClusterLegendProps> = ({
  clusterGroups,
  activeClusterId,
  onSelectCluster,
}) => {
  if (clusterGroups.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-800">
            抽出されたトピッククラスタ
          </h3>
        </div>

        {/* フィルター解除ボタン */}
        {activeClusterId !== null && (
          <button
            type="button"
            onClick={() => onSelectCluster(null)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
          >
            全クラスタ表示に戻す
          </button>
        )}
      </div>

      {/* クラスタカード一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {clusterGroups.map((group) => {
          const isSelected = activeClusterId === group.id;

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onSelectCluster(isSelected ? null : group.id)}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
              }`}
            >
              {/* クラスタ色インジケータ */}
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: group.color }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    Cluster {group.id + 1}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-mono shrink-0">
                    {group.paperCount}件
                  </span>
                </div>

                {/* 特徴キーワードタグ */}
                <div className="flex flex-wrap gap-1">
                  {group.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
