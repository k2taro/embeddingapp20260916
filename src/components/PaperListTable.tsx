/**
 * 論文リスト一覧テーブルコンポーネント
 * 
 * 抽出された論文のメタデータ（タイトル、ファイル名、所属クラスタ、文字数）を一覧表示し、
 * キーワード検索や並び替え、マップとの連動選択をサポートします。
 */

import React from 'react';
import { PaperVisualizationPoint, ExtractedPaper } from '../types';
import { Search, FileText, ExternalLink } from 'lucide-react';

interface PaperListTableProps {
  papers: ExtractedPaper[];
  points: PaperVisualizationPoint[];
  selectedPaperId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPaper: (paperId: string) => void;
}

export const PaperListTable: React.FC<PaperListTableProps> = ({
  papers,
  points,
  selectedPaperId,
  searchQuery,
  onSearchChange,
  onSelectPaper,
}) => {
  if (papers.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
      {/* 検索バーとヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            解析済み学術論文リスト ({papers.length}件)
          </h3>
          <p className="text-[11px] text-slate-500">
            行をクリックすると散布図上の位置と抄録にフォーカスします
          </p>
        </div>

        {/* 検索入力 */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="タイトル・抄録・キーワード検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* テーブル本体 */}
      <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold sticky top-0 z-10 backdrop-blur-xs">
              <th className="py-2.5 px-3">クラスタ</th>
              <th className="py-2.5 px-3">論文タイトル</th>
              <th className="py-2.5 px-3">ファイル名</th>
              <th className="py-2.5 px-3 text-right">ページ数</th>
              <th className="py-2.5 px-3 text-right">抽出文字数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {papers.map((paper) => {
              const point = points.find((pt) => pt.id === paper.id);
              const isSelected = selectedPaperId === paper.id;

              return (
                <tr
                  key={paper.id}
                  onClick={() => onSelectPaper(paper.id)}
                  className={`hover:bg-indigo-50/40 cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/80 font-medium' : ''
                  }`}
                >
                  <td className="py-2 px-3 whitespace-nowrap">
                    {point ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: point.clusterColor }}
                        />
                        <span className="text-[11px] font-mono text-slate-600">
                          Group {point.clusterId + 1}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-2 px-3 max-w-xs sm:max-w-md truncate text-slate-800 font-medium">
                    {paper.title}
                  </td>
                  <td className="py-2 px-3 text-slate-500 font-mono text-[11px] truncate max-w-[140px]">
                    {paper.fileName}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500 font-mono text-[11px]">
                    {paper.pageCount}P
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500 font-mono text-[11px]">
                    {paper.charCount.toLocaleString()}字
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
