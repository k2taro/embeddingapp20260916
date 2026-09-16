/**
 * 学術論文2次元マップ散布図コンポーネント (Recharts)
 * 
 * UMAPにより次元削減された2次元座標上に、クラスタ別のカラーで各論文をプロットします。
 * ホバー時の詳細ツールチップ、クリックによる論文選択、ハイライト表示をサポートします。
 */

import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { PaperVisualizationPoint } from '../types';
import { Sparkles, MousePointerClick } from 'lucide-react';

interface PaperScatterPlotProps {
  points: PaperVisualizationPoint[];
  selectedPaperId: string | null;
  onSelectPaper: (paperId: string) => void;
}

/**
 * Recharts のカスタムツールチップ
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const data: PaperVisualizationPoint = payload[0].payload;

    return (
      <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs max-w-xs backdrop-blur-xs z-50 pointer-events-none">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: data.clusterColor }}
          />
          <span className="font-semibold text-slate-300">
            Cluster {data.clusterId + 1}
          </span>
        </div>
        <p className="font-bold text-white mb-1.5 leading-snug line-clamp-2">
          {data.title}
        </p>
        <p className="text-slate-300 line-clamp-3 text-[11px] mb-2 leading-relaxed">
          {data.abstract}
        </p>
        <div className="flex flex-wrap gap-1">
          {data.clusterKeywords.map((kw, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]"
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const PaperScatterPlot: React.FC<PaperScatterPlotProps> = ({
  points,
  selectedPaperId,
  onSelectPaper,
}) => {
  if (points.length === 0) {
    return (
      <div className="h-[460px] flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/40 text-slate-400">
        <MousePointerClick className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">解析完了後にここに2次元学術マップが表示されます</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs relative overflow-hidden">
      {/* グラフ上部ステータス */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">
            意味論的学術マップ（UMAP 2D Projection）
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            ({points.length}件プロット)
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          ※ ノードをクリックすると抄録や類似論文が閲覧できます
        </span>
      </div>

      {/* 散布図描画コンテナ */}
      <div className="w-full h-[460px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 100]}
              hide
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              hide
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              name="Papers"
              data={points}
              onClick={(entry) => onSelectPaper(entry.id)}
              className="cursor-pointer"
            >
              {points.map((entry) => {
                const isSelected = entry.id === selectedPaperId;
                return (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={entry.clusterColor}
                    stroke={isSelected ? '#0f172a' : '#ffffff'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    r={isSelected ? 10 : 7}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* 軸の概念説明フッター */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 px-2 pt-1 border-t border-slate-100">
        <span>← 意味的特徴軸 A (UMAP Dim 1) →</span>
        <span>← 意味的特徴軸 B (UMAP Dim 2) →</span>
      </div>
    </div>
  );
};
