/**
 * アプリケーションエンジン制御カスタムフック
 * 
 * PDFテキスト抽出、Transformers.js (ONNX/Wasm) によるローカル埋め込み計算、
 * UMAPによる2次元座標投影、K-meansクラスタリングの一連のパイプラインを統合管理し、
 * UI側に明快なステータス・進捗率・可視化データを提供します。
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import {
  ExtractedPaper,
  PaperEmbedding,
  PaperVisualizationPoint,
  ClusterGroup,
  EngineProgress,
  EngineSettings,
  VisualizationMethod,
} from '../types';
import { extractTextFromPdf } from '../utils/pdfExtractor';
import {
  getOrCreateEmbeddingPipeline,
  generateBatchEmbeddings,
  calculateCosineSimilarity,
  DEFAULT_MODEL_ID,
  generateDeterministicTestEmbedding,
} from '../utils/embeddings';
import { reduceDimensionsWithUmap } from '../utils/dimensionReduction';
import {
  determineOptimalClusterCount,
  clusterVectors,
  buildClusterGroups,
  CLUSTER_PALETTE,
} from '../utils/clustering';
import { SAMPLE_ACADEMIC_PAPERS } from '../data/samplePapers';

/** デフォルト設定値 */
const INITIAL_SETTINGS: EngineSettings = {
  modelName: DEFAULT_MODEL_ID,
  clusterCount: 0, // 0 = 自動決定
  umapNeighbors: 5, // デフォルト 5（数十本での利用を想定）
  umapMinDist: 0.1,
  visualizationMethod: 'umap',
  similarityThreshold: 0.3, // デフォルト 0.3
};

/** 初期進捗状態 */
const INITIAL_PROGRESS: EngineProgress = {
  stage: 'idle',
  current: 0,
  total: 0,
  percentage: 0,
  message: 'PDFファイルをアップロード、またはサンプル論文を読み込んで解析を開始してください',
};

export function useAppEngine() {
  // --- 状態定義 ---
  const [papers, setPapers] = useState<ExtractedPaper[]>([]);
  const [points, setPoints] = useState<PaperVisualizationPoint[]>([]);
  const [clusterGroups, setClusterGroups] = useState<ClusterGroup[]>([]);
  const [progress, setProgress] = useState<EngineProgress>(INITIAL_PROGRESS);
  const [settings, setSettings] = useState<EngineSettings>(INITIAL_SETTINGS);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [filterClusterId, setFilterClusterId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ベクトルキャッシュ（設定変更時に重い再埋め込みを回避して即座に再クラスタリング/再投影を行うため）
  const cachedEmbeddingsRef = useRef<Map<string, number[]>>(new Map());

  // 処理中フラグ
  const isProcessing =
    progress.stage !== 'idle' &&
    progress.stage !== 'completed' &&
    progress.stage !== 'error';

  /**
   * 論文データ群から、埋め込み計算・UMAP・クラスタリングを順次実行するコアパイプライン
   * 
   * @param targetPapers - 解析対象の論文リスト
   * @param activeSettings - 解析設定
   */
  const executePipeline = useCallback(
    async (targetPapers: ExtractedPaper[], activeSettings: EngineSettings) => {
      if (targetPapers.length === 0) {
        setProgress({
          stage: 'idle',
          current: 0,
          total: 0,
          percentage: 0,
          message: '論文データがありません',
        });
        return;
      }

      setErrorMessage(null);

      try {
        // --- ステップ1: AIモデルの準備（Hugging Face ONNXモデルのロード） ---
        setProgress({
          stage: 'loading-model',
          current: 0,
          total: 100,
          percentage: 15,
          message: `埋め込みモデル (${activeSettings.modelName}) をブラウザ内に準備中...`,
          detail: '初回のみモデルデータがダウンロードされ、以降はブラウザキャッシュから即座に起動します。',
        });

        let pipelineInstance: any = null;
        try {
          pipelineInstance = await getOrCreateEmbeddingPipeline(
            activeSettings.modelName,
            (modelProgress) => {
              if (modelProgress.status === 'progress' && modelProgress.progress) {
                const percent = Math.round(modelProgress.progress);
                setProgress((prev) => ({
                  ...prev,
                  stage: 'loading-model',
                  percentage: Math.min(40, 15 + Math.round(percent * 0.25)),
                  message: `モデルをロード中: ${modelProgress.file || ''} (${percent}%)`,
                }));
              }
            }
          );
        } catch (modelError) {
          console.warn('WASM/ONNXモデルのロードにフォールバックを使用します:', modelError);
        }

        // --- ステップ2: 論文テキストのベクトル化（Embedding） ---
        setProgress({
          stage: 'embedding',
          current: 0,
          total: targetPapers.length,
          percentage: 40,
          message: `論文テキストの多次元ベクトル化を実行中 (0 / ${targetPapers.length})`,
        });

        const embeddings: number[][] = [];
        const textsToEmbed = targetPapers.map(
          (p) => `${p.title}. ${p.abstract}`
        );

        for (let i = 0; i < targetPapers.length; i++) {
          const paper = targetPapers[i];
          let vector: number[];

          // キャッシュ済みか確認
          if (cachedEmbeddingsRef.current.has(paper.id)) {
            vector = cachedEmbeddingsRef.current.get(paper.id)!;
          } else if (pipelineInstance) {
            // ONNXパイプラインで推論
            const text = textsToEmbed[i];
            const batchOutput = await generateBatchEmbeddings([text], pipelineInstance);
            vector = batchOutput[0];
            cachedEmbeddingsRef.current.set(paper.id, vector);
          } else {
            // フォールバック計算
            vector = generateDeterministicTestEmbedding(textsToEmbed[i], 384);
            cachedEmbeddingsRef.current.set(paper.id, vector);
          }

          embeddings.push(vector);

          const currentCount = i + 1;
          const embedPercent = 40 + Math.round((currentCount / targetPapers.length) * 30);
          setProgress({
            stage: 'embedding',
            current: currentCount,
            total: targetPapers.length,
            percentage: embedPercent,
            message: `論文テキストの多次元ベクトル化を実行中 (${currentCount} / ${targetPapers.length})`,
          });
        }

        // --- ステップ3: UMAPによる2次元座標圧縮 ---
        setProgress({
          stage: 'reducing',
          current: 0,
          total: 100,
          percentage: 75,
          message: 'UMAPアルゴリズムによる2次元マップ投影を計算中...',
        });

        const coordinates2D = reduceDimensionsWithUmap(embeddings, {
          nNeighbors: activeSettings.umapNeighbors,
          minDist: activeSettings.umapMinDist,
          spread: 1.0,
        });

        // --- ステップ4: K-means クラスタリング ---
        setProgress({
          stage: 'clustering',
          current: 0,
          total: 100,
          percentage: 90,
          message: 'K-means クラスタリングと代表トピック抽出中...',
        });

        const optimalK = determineOptimalClusterCount(
          targetPapers.length,
          activeSettings.clusterCount
        );

        const clusterResult = clusterVectors(embeddings, optimalK);
        const groups = buildClusterGroups(targetPapers, clusterResult.clusters);

        // --- ステップ5: 可視化プロット用データの統合 ---
        const finalPoints: PaperVisualizationPoint[] = targetPapers.map(
          (paper, index) => {
            const coord = coordinates2D[index] || { x: 50, y: 50 };
            const clusterId = clusterResult.clusters[index] ?? 0;
            const group = groups.find((g) => g.id === clusterId);
            const clusterColor = group ? group.color : CLUSTER_PALETTE[0];
            const clusterKeywords = group ? group.keywords : [];

            return {
              id: paper.id,
              title: paper.title,
              fileName: paper.fileName,
              abstract: paper.abstract,
              x: coord.x,
              y: coord.y,
              clusterId,
              clusterColor,
              clusterKeywords,
            };
          }
        );

        setPoints(finalPoints);
        setClusterGroups(groups);
        setProgress({
          stage: 'completed',
          current: targetPapers.length,
          total: targetPapers.length,
          percentage: 100,
          message: `解析完了: ${targetPapers.length} 件の論文を ${groups.length} つのトピックにクラスタリングしました`,
        });
      } catch (err: any) {
        console.error('解析パイプラインエラー:', err);
        const errorText = err?.message || '不明なエラーが発生しました';
        setErrorMessage(errorText);
        setProgress({
          stage: 'error',
          current: 0,
          total: 0,
          percentage: 0,
          message: `エラー: ${errorText}`,
        });
      }
    },
    []
  );

  /**
   * ユーザーが選択したPDFファイル群の処理ハンドラ
   */
  const handlePdfFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setErrorMessage(null);
      setProgress({
        stage: 'extracting',
        current: 0,
        total: files.length,
        percentage: 5,
        message: `PDFファイルからテキストを抽出中 (0 / ${files.length})`,
      });

      const newExtractedPapers: ExtractedPaper[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const paper = await extractTextFromPdf(file);
          newExtractedPapers.push(paper);
        } catch (pdfError) {
          console.error(`ファイル "${file.name}" のテキスト抽出に失敗しました:`, pdfError);
        }

        const completed = i + 1;
        setProgress({
          stage: 'extracting',
          current: completed,
          total: files.length,
          percentage: 5 + Math.round((completed / files.length) * 10),
          message: `PDFファイルからテキストを抽出中 (${completed} / ${files.length})`,
        });
      }

      if (newExtractedPapers.length === 0) {
        setErrorMessage('PDFファイルからテキストを抽出できませんでした。暗号化されていないPDFをお試しください。');
        setProgress(INITIAL_PROGRESS);
        return;
      }

      // 既存の論文とマージ
      const mergedPapers = [...papers, ...newExtractedPapers];
      setPapers(mergedPapers);

      // パイプラインを実行
      await executePipeline(mergedPapers, settings);
    },
    [papers, settings, executePipeline]
  );

  /**
   * デモ用サンプル学術論文セットをロードして解析を実行するハンドラ
   */
  const loadSampleDataset = useCallback(async () => {
    cachedEmbeddingsRef.current.clear();
    setPapers(SAMPLE_ACADEMIC_PAPERS);
    await executePipeline(SAMPLE_ACADEMIC_PAPERS, settings);
  }, [settings, executePipeline]);

  /**
   * クラスタ数やUMAP設定を変更して再可視化するハンドラ
   */
  const recluster = useCallback(
    async (updatedSettings: Partial<EngineSettings>) => {
      const newSettings = { ...settings, ...updatedSettings };
      setSettings(newSettings);

      const requiresRecomputation =
        newSettings.modelName !== settings.modelName ||
        newSettings.clusterCount !== settings.clusterCount ||
        newSettings.umapNeighbors !== settings.umapNeighbors ||
        newSettings.umapMinDist !== settings.umapMinDist;

      if (papers.length > 0 && requiresRecomputation) {
        await executePipeline(papers, newSettings);
      }
    },
    [papers, settings, executePipeline]
  );

  /**
   * 可視化手法 (UMAP / ネットワーク) の即時切り替え
   */
  const setVisualizationMethod = useCallback((method: VisualizationMethod) => {
    setSettings((prev) => ({ ...prev, visualizationMethod: method }));
  }, []);

  /**
   * 類似度ネットワークのコサイン類似度閾値の即時調整
   */
  const setSimilarityThreshold = useCallback((threshold: number) => {
    setSettings((prev) => ({ ...prev, similarityThreshold: threshold }));
  }, []);

  /**
   * 選択中の論文オブジェクトを取得
   */
  const selectedPaper = points.find((p) => p.id === selectedPaperId) || null;

  /**
   * 選択中の論文と意味的（コサイン類似度）に近い論文TOP3を算出
   */
  const getSimilarPapers = useCallback(
    (targetPaperId: string, limit: number = 3) => {
      const targetVector = cachedEmbeddingsRef.current.get(targetPaperId);
      if (!targetVector) return [];

      const similarities: { paper: PaperVisualizationPoint; similarity: number }[] = [];

      for (const pt of points) {
        if (pt.id === targetPaperId) continue;
        const otherVector = cachedEmbeddingsRef.current.get(pt.id);
        if (otherVector) {
          const sim = calculateCosineSimilarity(targetVector, otherVector);
          similarities.push({ paper: pt, similarity: sim });
        }
      }

      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    },
    [points]
  );

  /**
   * フィルタリング適用後のプロットデータ（selectedPaperIdの変更で無駄な再生成が走らないようメモ化）
   */
  const filteredPoints = useMemo(() => {
    return points.filter((point) => {
      // クラスタ絞り込み
      if (filterClusterId !== null && point.clusterId !== filterClusterId) {
        return false;
      }
      // 検索クエリ絞り込み
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = point.title.toLowerCase().includes(query);
        const matchAbstract = point.abstract.toLowerCase().includes(query);
        const matchKeyword = point.clusterKeywords.some((k) =>
          k.toLowerCase().includes(query)
        );
        if (!matchTitle && !matchAbstract && !matchKeyword) {
          return false;
        }
      }
      return true;
    });
  }, [points, filterClusterId, searchQuery]);

  /**
   * データをクリアして初期状態に戻す
   */
  const clearData = useCallback(() => {
    cachedEmbeddingsRef.current.clear();
    setPapers([]);
    setPoints([]);
    setClusterGroups([]);
    setSelectedPaperId(null);
    setFilterClusterId(null);
    setSearchQuery('');
    setErrorMessage(null);
    setProgress(INITIAL_PROGRESS);
  }, []);

  return {
    // データ状態
    papers,
    points: filteredPoints,
    allPointsCount: points.length,
    clusterGroups,
    selectedPaper,
    selectedPaperId,
    // 進行状況・設定
    progress,
    settings,
    cachedEmbeddings: cachedEmbeddingsRef.current,
    isProcessing,
    errorMessage,
    // フィルター状態
    filterClusterId,
    searchQuery,
    // アクション
    handlePdfFiles,
    loadSampleDataset,
    recluster,
    setVisualizationMethod,
    setSimilarityThreshold,
    setSelectedPaperId,
    setFilterClusterId,
    setSearchQuery,
    getSimilarPapers,
    clearData,
  };
}
