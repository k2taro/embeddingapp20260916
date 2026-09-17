/**
 * 文書埋め込みベクトル生成ユーティリティモジュール
 * 
 * @huggingface/transformers を使用し、ブラウザのWasm/WebGPU上で
 * ONNXモデルを直接ロードして学術テキストの多次元ベクトル化を行います。
 * 外部APIやサーバーへのリクエストは発生せず、すべてクライアントローカルで完結します。
 */

import { pipeline, env } from '@huggingface/transformers';
import { SimilarityEdge } from '../types';

// ブラウザ環境向けの設定
// ローカルファイルシステムの読み込みを無効化し、Hugging Face HubのWebキャッシュを活用
if (typeof window !== 'undefined') {
  env.allowLocalModels = false;
  env.useBrowserCache = true;
}

/** 推奨される埋め込みモデルの候補 */
export const AVAILABLE_EMBEDDING_MODELS = [
  {
    id: 'Xenova/all-MiniLM-L6-v2',
    name: 'all-MiniLM-L6-v2 (標準・高速・軽量、英語論文に最適)',
    description: '英語学術論文や国際会議プロシーディングスで最も広く利用される標準軽量埋め込みモデル。高速かつ高い意味検索性能を持ちます。',
    dimension: 384,
    recommended: true,
    languages: '英語（国際学術論文）',
  },
  {
    id: 'cl-nagoya/ruri-v3-30m',
    name: 'ruri-v3-30m (日本語専用・超軽量30Mパラメータ)',
    description: '日本語テキスト専用の最先端高精度モデル。国内論文や日本語文書の解析に最適です。',
    dimension: 384,
    recommended: false,
    languages: '日本語専用',
  },
  {
    id: 'Xenova/multilingual-e5-small',
    name: 'multilingual-e5-small (多言語対応・約100言語・高精度)',
    description: '英語・日本語を含む多言語混在論文や国際学術誌に対応した小型強力モデル。',
    dimension: 384,
    recommended: false,
    languages: '多言語（日本語・英語・他100言語）',
  },
  {
    id: 'Xenova/bge-small-en-v1.5',
    name: 'bge-small-en-v1.5 (英語学術検索・類似度計算に高精度)',
    description: '高密度検索ベンチマークで高いスコアを記録する英語向け学術モデル。',
    dimension: 384,
    recommended: false,
    languages: '英語',
  },
] as const;

/** デフォルトの埋め込みモデルID */
export const DEFAULT_MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

/** パイプラインの型（@huggingface/transformers の FeatureExtractionPipeline） */
type FeatureExtractionPipeline = any;

/** モデルのシングルトンキャッシュ（再ダウンロード・再初期化を防止） */
let cachedPipeline: FeatureExtractionPipeline | null = null;
let currentLoadedModelId: string | null = null;

/**
 * 埋め込みパイプラインのロード進行状況コールバック
 */
export type ModelLoadProgressCallback = (progress: {
  status: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}) => void;

/**
 * ONNXモデルをブラウザ上で初期化し、埋め込みパイプラインを取得する関数
 * 
 * @param modelId - ロードするモデルのHugging Face識別子
 * @param onProgress - ダウンロードやコンパイルの進捗を受け取るコールバック関数
 * @returns 初期化されたFeatureExtractionPipeline
 */
export async function getOrCreateEmbeddingPipeline(
  modelId: string = DEFAULT_MODEL_ID,
  onProgress?: ModelLoadProgressCallback
): Promise<FeatureExtractionPipeline> {
  // すでに同じモデルがロード済みの場合はキャッシュを即返却
  if (cachedPipeline && currentLoadedModelId === modelId) {
    return cachedPipeline;
  }

  try {
    const extractor = await pipeline('feature-extraction', modelId, {
      progress_callback: onProgress,
      dtype: 'fp32',
    });

    cachedPipeline = extractor;
    currentLoadedModelId = modelId;
    return extractor;
  } catch (error) {
    console.warn(`モデル "${modelId}" の読み込みに失敗しました。フォールバックモデルを試みます:`, error);
    
    // ruri-v3-30m のブラウザ用ONNXが環境要因等で読めない場合は、広範に検証されている all-MiniLM-L6-v2 へ自動フォールバック
    if (modelId !== 'Xenova/all-MiniLM-L6-v2') {
      const fallbackExtractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        progress_callback: onProgress,
        dtype: 'fp32',
      });
      cachedPipeline = fallbackExtractor;
      currentLoadedModelId = 'Xenova/all-MiniLM-L6-v2';
      return fallbackExtractor;
    }
    throw error;
  }
}

/**
 * ベクトルのL2正規化（長さを1にする計算）を行う純粋関数
 * 
 * @param vector - 正規化対象の数値配列
 * @returns 長さが1に正規化された数値配列
 */
export function normalizeL2(vector: number[]): number[] {
  let sumOfSquares = 0;
  for (let i = 0; i < vector.length; i++) {
    sumOfSquares += vector[i] * vector[i];
  }
  
  const norm = Math.sqrt(sumOfSquares);
  if (norm === 0) {
    return vector;
  }

  return vector.map((value) => value / norm);
}

/**
 * 2つのベクトル間のコサイン類似度を算出する純粋関数 (-1.0 〜 +1.0)
 * 
 * @param vectorA - 1つ目のベクトル
 * @param vectorB - 2つ目のベクトル
 * @returns コサイン類似度
 */
export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length || vectorA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normASquared = 0;
  let normBSquared = 0;

  for (let index = 0; index < vectorA.length; index++) {
    dotProduct += vectorA[index] * vectorB[index];
    normASquared += vectorA[index] * vectorA[index];
    normBSquared += vectorB[index] * vectorB[index];
  }

  const denominator = Math.sqrt(normASquared) * Math.sqrt(normBSquared);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * 単一のテキストから埋め込みベクトル（配列）を生成する純粋関数
 * 
 * @param text - ベクトル化するテキスト（タイトルや抄録）
 * @param pipelineInstance - ロード済みのpipelineインスタンス
 * @returns 正規化された384次元のベクトル配列
 */
export async function generateTextEmbedding(
  text: string,
  pipelineInstance: FeatureExtractionPipeline
): Promise<number[]> {
  // テキストの前処理（極端に長い場合の安全な切り詰め）
  const sanitizedText = text.trim().slice(0, 2000);
  if (!sanitizedText) {
    // 空文字の場合はゼロベクトルを返却
    return new Array(384).fill(0);
  }

  // pooling: 'mean' と normalize: true を指定してテキストをベクトル化
  const output = await pipelineInstance(sanitizedText, {
    pooling: 'mean',
    normalize: true,
  });

  // Tensorから通常の数値配列を取り出す
  const rawData: number[] = Array.from(output.data);
  return normalizeL2(rawData);
}

/**
 * 複数のテキストを順次ベクトル化し、進捗コールバックを通知する関数
 * 
 * @param texts - ベクトル化対象のテキスト配列
 * @param pipelineInstance - ロード済みのpipelineインスタンス
 * @param onProgress - (完了件数, 総件数) を受け取る進捗コールバック
 * @returns 各テキストに対応するベクトル配列の二次元配列
 */
export async function generateBatchEmbeddings(
  texts: string[],
  pipelineInstance: FeatureExtractionPipeline,
  onProgress?: (completed: number, total: number) => void
): Promise<number[][]> {
  const embeddings: number[][] = [];
  const total = texts.length;

  for (let index = 0; index < total; index++) {
    const text = texts[index];
    const vector = await generateTextEmbedding(text, pipelineInstance);
    embeddings.push(vector);

    if (onProgress) {
      onProgress(index + 1, total);
    }
  }

  return embeddings;
}

/**
 * テスト環境やデモ環境向けのフォールバック埋め込み生成関数（TF-IDFハッシュベース）
 * ONNXモデルの読み込みが難しい環境でも正確に数学的振る舞いを検証可能にするための純粋関数です。
 * 
 * @param text - 対象テキスト
 * @param dimension - 生成する次元数（デフォルト384）
 * @returns 正規化された決定論的ベクトル
 */
export function generateDeterministicTestEmbedding(
  text: string,
  dimension: number = 384
): number[] {
  const vector = new Array(dimension).fill(0);
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash * 31 + word.charCodeAt(c)) & 0xffffffff;
    }
    const targetDim = Math.abs(hash) % dimension;
    vector[targetDim] += 1;
  }

  return normalizeL2(vector);
}

/**
 * 論文リストと埋め込みベクトルマップから、コサイン類似度が閾値以上のエッジリストを生成する純粋関数
 * 
 * @param paperIds - 対象の論文IDリスト
 * @param embeddingsMap - 論文ID -> ベクトル配列のMap
 * @param threshold - エッジを張るコサイン類似度の下限閾値 (0.0 〜 1.0)
 * @returns 類似度エッジの配列
 */
export function buildSimilarityEdges(
  paperIds: string[],
  embeddingsMap: Map<string, number[]>,
  threshold: number
): SimilarityEdge[] {
  const edges: SimilarityEdge[] = [];
  const n = paperIds.length;

  for (let i = 0; i < n; i++) {
    const idA = paperIds[i];
    const vecA = embeddingsMap.get(idA);
    if (!vecA) continue;

    for (let j = i + 1; j < n; j++) {
      const idB = paperIds[j];
      const vecB = embeddingsMap.get(idB);
      if (!vecB) continue;

      const sim = calculateCosineSimilarity(vecA, vecB);
      if (sim >= threshold) {
        edges.push({
          id: `${idA}__${idB}`,
          from: idA,
          to: idB,
          similarity: sim,
        });
      }
    }
  }

  return edges;
}
