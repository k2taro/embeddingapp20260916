/**
 * 論文詳細ドロワー／インスペクターコンポーネント
 * 
 * 散布図上で選択された論文の詳細（タイトル、抄録、所属クラスタ）、
 * およびコサイン類似度に基づき算出した関連・類似論文のレコメンドを表示します。
 */

import React from 'react';
import { PaperVisualizationPoint, ExtractedPaper } from '../types';
import { X, FileText, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface PaperDetailDrawerProps {
  paper: PaperVisualizationPoint | null;
  rawPaper?: ExtractedPaper;
  similarPapers: { paper: PaperVisualizationPoint; similarity: number }[];
  onSelectPaper: (paperId: string) => void;
  onClose: () => void;
}

export const PaperDetailDrawer: React.FC<PaperDetailDrawerProps> = ({
  paper,
  rawPaper,
  similarPapers,
  onSelectPaper,
  onClose,
}) => {
  if (!paper) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* ヘッダー部 */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: paper.clusterColor }}
          />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Cluster {paper.clusterId + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="閉じる"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 論文タイトル */}
      <div>
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
          {paper.title}
        </h3>
        <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          {paper.fileName}
          {rawPaper && (
            <span>
              • {rawPaper.pageCount} ページ • {rawPaper.charCount.toLocaleString()} 文字
            </span>
          )}
        </p>
      </div>

      {/* クラスタトピックキーワード */}
      <div>
        <span className="text-xs font-semibold text-slate-700 block mb-1.5">
          抽出トピックキーワード
        </span>
        <div className="flex flex-wrap gap-1.5">
          {paper.clusterKeywords.map((keyword, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
            >
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* 抄録 (Abstract) */}
      <div>
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          抄録 (Abstract)
        </span>
        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 text-xs text-slate-700 leading-relaxed max-h-56 overflow-y-auto">
          {paper.abstract || '抄録テキストが見つかりませんでした。'}
        </div>
      </div>

      {/* 意味論的類似論文（Semantic Similar Papers） */}
      {similarPapers.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            意味的に近い論文 (Cosine Similarity TOP 3)
          </span>
          <div className="space-y-2">
            {similarPapers.map(({ paper: simPaper, similarity }) => (
              <button
                key={simPaper.id}
                type="button"
                onClick={() => onSelectPaper(simPaper.id)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                    {simPaper.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {simPaper.fileName}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {Math.round(similarity * 100)}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
