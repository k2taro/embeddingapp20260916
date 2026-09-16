/**
 * 学術文献ローカル可視化アプリケーション メインコンポーネント
 * 
 * 【開発ルールの遵守】
 * 1. UI（見た目）と重い計算ロジック（Wasm/ONNX/UMAP/K-means）を完全に分離。
 * 2. 計算処理はすべて `src/utils/` 配下の純粋関数にモジュール化。
 * 3. 状態管理はカスタムフック `useAppEngine` に集約。
 * 4. 可読性と保守性を最大化するため、丁寧な日本語コメントを付与。
 */

import React, { useState } from 'react';
import { useAppEngine } from './hooks/useAppEngine';
import { Header } from './components/Header';
import { EngineProgressBar } from './components/EngineProgressBar';
import { PdfUploader } from './components/PdfUploader';
import { PaperScatterPlot } from './components/PaperScatterPlot';
import { ClusterLegend } from './components/ClusterLegend';
import { PaperDetailDrawer } from './components/PaperDetailDrawer';
import { PaperListTable } from './components/PaperListTable';
import { EngineSettingsModal } from './components/EngineSettingsModal';
import { ShieldCheck, Plus, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  // --- カスタムフックからエンジン状態とアクションを取得 ---
  const {
    papers,
    points,
    allPointsCount,
    clusterGroups,
    selectedPaper,
    selectedPaperId,
    progress,
    settings,
    isProcessing,
    errorMessage,
    filterClusterId,
    searchQuery,
    handlePdfFiles,
    loadSampleDataset,
    recluster,
    setSelectedPaperId,
    setFilterClusterId,
    setSearchQuery,
    getSimilarPapers,
    clearData,
  } = useAppEngine();

  // 設定モーダルの開閉状態
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 選択された論文の元データを取得
  const rawSelectedPaper = papers.find((p) => p.id === selectedPaperId);

  // 選択中論文の意味論的類似論文（コサイン類似度TOP 3）
  const similarPapers = selectedPaperId ? getSimilarPapers(selectedPaperId, 3) : [];

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-800">
      {/* 画面上部ヘッダー */}
      <Header
        paperCount={papers.length}
        isProcessing={isProcessing}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadSample={loadSampleDataset}
        onClear={clearData}
      />

      {/* メインコンテンツ領域 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* エラーメッセージバナー */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs shadow-2xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {/* パイプライン進行状況プログレスバー */}
        <EngineProgressBar progress={progress} />

        {/* 論文未登録の場合：アップローダーとサンプル案内を大画面で表示 */}
        {papers.length === 0 && (
          <div className="max-w-2xl mx-auto py-8">
            <PdfUploader
              onFilesSelected={handlePdfFiles}
              onLoadSample={loadSampleDataset}
              disabled={isProcessing}
            />

            {/* プライバシー保護と技術仕様の説明カード */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 text-center">
                <div className="text-indigo-600 font-bold text-sm mb-1">pdfjs-dist</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  PDFファイルの解析とテキスト抽出をブラウザ内部で完全完結
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-4 text-center">
                <div className="text-indigo-600 font-bold text-sm mb-1">ONNX / Transformers.js</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  ruri-v3-30m 等の埋め込みモデルをWasm/WebGPU上で高速ローカル実行
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-4 text-center">
                <div className="text-indigo-600 font-bold text-sm mb-1">UMAP & ml-kmeans</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  高次元ベクトルの2次元空間投影と自動トピッククラスタリング
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 論文登録済みの場合：可視化ダッシュボード */}
        {papers.length > 0 && (
          <div className="space-y-6">
            {/* 上部サブアクションバー */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">
                  登録論文: <strong className="font-bold text-slate-900">{papers.length}</strong> 件
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-semibold text-slate-700">
                  検出クラスタ: <strong className="font-bold text-indigo-600">{clusterGroups.length}</strong> トピック
                </span>
              </div>

              {/* 追加PDFアップロードボタン */}
              <label
                htmlFor="add-more-pdf-input"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors ${
                  isProcessing ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                PDF論文を追加する
                <input
                  id="add-more-pdf-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handlePdfFiles(Array.from(e.target.files));
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>

            {/* クラスタ凡例 */}
            <ClusterLegend
              clusterGroups={clusterGroups}
              activeClusterId={filterClusterId}
              onSelectCluster={setFilterClusterId}
            />

            {/* メイン分析グリッド：左側に2Dマップ、右側に詳細インスペクター */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PaperScatterPlot
                  points={points}
                  selectedPaperId={selectedPaperId}
                  onSelectPaper={setSelectedPaperId}
                />
              </div>

              <div className="lg:col-span-1">
                {selectedPaper ? (
                  <PaperDetailDrawer
                    paper={selectedPaper}
                    rawPaper={rawSelectedPaper}
                    similarPapers={similarPapers}
                    onSelectPaper={setSelectedPaperId}
                    onClose={() => setSelectedPaperId(null)}
                  />
                ) : (
                  <div className="h-[460px] bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-slate-400 shadow-2xs">
                    <Sparkles className="w-8 h-8 text-indigo-400 mb-2 opacity-70" />
                    <h4 className="text-sm font-bold text-slate-700 mb-1">
                      論文を選択してください
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                      マップ上のドットをクリックすると、その論文の抄録やキーワード、コサイン類似度が高い類似論文が表示されます。
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 下部：論文一覧テーブル */}
            <PaperListTable
              papers={papers}
              points={points}
              selectedPaperId={selectedPaperId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectPaper={setSelectedPaperId}
            />
          </div>
        )}
      </main>

      {/* 解析パラメータ設定モーダル */}
      <EngineSettingsModal
        isOpen={isSettingsOpen}
        currentSettings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onApply={recluster}
      />

      {/* フッター */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            クライアントサイド完全実行（Wasm / WebGPU / ONNX Runtime Web）
          </span>
          <span className="text-[11px] text-slate-400">
            Powered by pdfjs-dist, @huggingface/transformers, umap-js, ml-kmeans & Recharts
          </span>
        </div>
      </footer>
    </div>
  );
}
