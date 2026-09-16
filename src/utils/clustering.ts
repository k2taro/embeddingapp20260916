/**
 * クラスタリング及びトピックキーワード抽出ユーティリティモジュール
 * 
 * ml-kmeans を用いて論文ベクトルまたは2D座標をクラスタリングし、
 * クラスタごとの特徴的なキーワード（トピック）を自動抽出します。
 * すべて純粋関数として構成されています。
 */

import { kmeans } from 'ml-kmeans';
import { ExtractedPaper, ClusterGroup } from '../types';

/**
 * 論文クラスタリング用の識別しやすいカラーパレット（最大10系統）
 * WCAGコントラストや見やすさを考慮した学術向けパレット
 */
export const CLUSTER_PALETTE: string[] = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#4f46e5', // Indigo
  '#16a34a', // Green
  '#9333ea', // Violet
];

/** 一般的な英語および学術ストップワード（キーワード抽出から除外） */
const STOP_WORDS = new Set([
  'the', 'and', 'a', 'an', 'of', 'in', 'to', 'for', 'with', 'on', 'at', 'by',
  'from', 'as', 'is', 'are', 'was', 'were', 'be', 'this', 'that', 'these', 'those',
  'we', 'our', 'it', 'its', 'they', 'their', 'which', 'or', 'but', 'not', 'can',
  'has', 'have', 'had', 'been', 'paper', 'study', 'presents', 'proposed', 'method',
  'results', 'using', 'based', 'approach', 'model', 'analysis', 'show', 'shows',
  'new', 'also', 'such', 'into', 'than', 'more', 'both', 'between', 'during', 'through',
]);

/**
 * データ件数から適切なクラスタ数 K を自動推定する純粋関数
 * 
 * @param sampleCount - 論文の総件数
 * @param requestedK - ユーザーが指定したK（0または未指定なら自動算出）
 * @returns 1以上の安全なクラスタ数
 */
export function determineOptimalClusterCount(
  sampleCount: number,
  requestedK: number = 0
): number {
  if (sampleCount <= 1) return 1;
  if (sampleCount === 2) return 2;

  // ユーザーが有効な数値を指定している場合はそれを尊重（最大サンプル数まで）
  if (requestedK > 0) {
    return Math.max(1, Math.min(requestedK, sampleCount));
  }

  // 自動決定ヒューリスティクス: ceil(sqrt(N / 2)) を基準に 2〜6 の範囲に収める
  const heuristic = Math.ceil(Math.sqrt(sampleCount / 2));
  return Math.max(2, Math.min(heuristic, 6, sampleCount));
}

/**
 * ml-kmeans を使用してベクトル群を K 個のクラスタに分類する純粋関数
 * 
 * @param dataVectors - 各論文のベクトル配列 (N × D)
 * @param k - クラスタ数
 * @returns 各データのクラスタ所属ID (0 〜 k-1) の配列
 */
export function clusterVectors(
  dataVectors: number[][],
  k: number
): { clusters: number[]; centroids: number[][] } {
  const sampleCount = dataVectors.length;

  if (sampleCount === 0) {
    return { clusters: [], centroids: [] };
  }

  // サンプル数が1の場合
  if (sampleCount === 1) {
    return { clusters: [0], centroids: [dataVectors[0]] };
  }

  // 安全な k の調整
  const safeK = Math.max(1, Math.min(k, sampleCount));

  try {
    const result = kmeans(dataVectors, safeK, {
      maxIterations: 100,
      tolerance: 1e-4,
    });

    return {
      clusters: result.clusters,
      centroids: result.centroids,
    };
  } catch (error) {
    console.warn('ml-kmeans 実行時エラー。インデックスによるフォールバック割り当てを行います:', error);
    // フォールバック: 単純なラウンドロビン割り当て
    const fallbackClusters = dataVectors.map((_, i) => i % safeK);
    return {
      clusters: fallbackClusters,
      centroids: [],
    };
  }
}

/**
 * クラスタに属する論文群から、特徴的なトピックキーワードを抽出する純粋関数
 * 
 * 単語の頻度とストップワード除外によって、クラスタを代表する英単語・専門用語を抽出します。
 * 
 * @param papersInCluster - 当該クラスタに属する論文配列
 * @param topN - 抽出する上位キーワード数（デフォルト: 3）
 * @returns 上位キーワードの文字列配列
 */
export function extractClusterKeywords(
  papersInCluster: ExtractedPaper[],
  topN: number = 3
): string[] {
  if (papersInCluster.length === 0) return ['General'];

  const wordFrequencies = new Map<string, number>();

  for (const paper of papersInCluster) {
    // タイトルとアブストラクトを合算して解析（タイトルは重要度を重み付け2倍）
    const combinedText = `${paper.title} ${paper.title} ${paper.abstract}`.toLowerCase();
    const tokens = combinedText.match(/\b[a-zA-Z]{3,20}\b/g) || [];

    for (const token of tokens) {
      if (!STOP_WORDS.has(token)) {
        const count = wordFrequencies.get(token) || 0;
        wordFrequencies.set(token, count + 1);
      }
    }
  }

  // 頻度順にソート
  const sortedWords = Array.from(wordFrequencies.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

  if (sortedWords.length === 0) {
    return ['Academic'];
  }

  return sortedWords.slice(0, topN);
}

/**
 * クラスタIDの割り当て結果と論文情報から、ClusterGroup一覧を生成する関数
 * 
 * @param papers - 全論文配列
 * @param clusterAssignments - 各論文のクラスタID配列
 * @returns クラスタ情報の配列
 */
export function buildClusterGroups(
  papers: ExtractedPaper[],
  clusterAssignments: number[]
): ClusterGroup[] {
  // クラスタごとに論文をグループ化
  const clusterMap = new Map<number, ExtractedPaper[]>();

  for (let index = 0; index < papers.length; index++) {
    const clusterId = clusterAssignments[index] ?? 0;
    const existing = clusterMap.get(clusterId) || [];
    existing.push(papers[index]);
    clusterMap.set(clusterId, existing);
  }

  const clusterGroups: ClusterGroup[] = [];
  const uniqueClusterIds = Array.from(clusterMap.keys()).sort((a, b) => a - b);

  for (const clusterId of uniqueClusterIds) {
    const papersInThisCluster = clusterMap.get(clusterId) || [];
    const keywords = extractClusterKeywords(papersInThisCluster, 3);
    const color = CLUSTER_PALETTE[clusterId % CLUSTER_PALETTE.length];
    
    // クラスタ表示名（例: "Group 1: Vision, Detection"）
    const name = `Group ${clusterId + 1}: ${keywords.join(', ')}`;

    clusterGroups.push({
      id: clusterId,
      name,
      color,
      paperCount: papersInThisCluster.length,
      keywords,
    });
  }

  return clusterGroups;
}
