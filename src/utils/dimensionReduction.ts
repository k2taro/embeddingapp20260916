/**
 * 次元削減ユーティリティモジュール
 * 
 * umap-js を使用して、高次元の埋め込みベクトル（384次元等）を
 * 散布図で可視化可能な2次元座標 (x, y) に圧縮・投影します。
 * すべて純粋関数として構成され、ブラウザ内で完結して高速に計算されます。
 */

import { UMAP } from 'umap-js';

/**
 * UMAPのパラメータ設定インターフェース
 */
export interface UMAPReductionOptions {
  /** 近傍点の探索数 (n_neighbors) */
  nNeighbors?: number;
  /** クラスタ間の最小距離 (min_dist: 0.0〜1.0) */
  minDist?: number;
  /** データの散らばり具合 (spread) */
  spread?: number;
  /** 乱数シード（再現性用） */
  randomSeed?: number;
}

/**
 * 2次元座標の型
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * 座標配列の最小値・最大値を検出し、指定された範囲 [targetMin, targetMax]（デフォルト: 10〜90）に
 * 線形スケーリングする純粋関数
 * 
 * @param points - 未正規化の2次元座標配列
 * @param targetMin - スケーリング後の最小値（デフォルト: 10）
 * @param targetMax - スケーリング後の最大値（デフォルト: 90）
 * @returns スケーリング済みの2次元座標配列
 */
export function normalizeCoordinates(
  points: Point2D[],
  targetMin: number = 10,
  targetMax: number = 90
): Point2D[] {
  if (points.length === 0) return [];
  if (points.length === 1) {
    return [{ x: (targetMin + targetMax) / 2, y: (targetMin + targetMax) / 2 }];
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const targetRange = targetMax - targetMin;

  return points.map((point) => {
    const scaledX = targetMin + ((point.x - minX) / rangeX) * targetRange;
    const scaledY = targetMin + ((point.y - minY) / rangeY) * targetRange;
    // 小数点第2位まで丸めて安定した座標値にする
    return {
      x: Math.round(scaledX * 100) / 100,
      y: Math.round(scaledY * 100) / 100,
    };
  });
}

/**
 * UMAPを用いて高次元ベクトル群を2次元平面 (x, y) に削減する純粋関数
 * 
 * サンプル数が少ない場合（1〜3件など）でもクラッシュしないよう、
 * nNeighbors を自動調整または適切なフォールバックを行います。
 * 
 * @param vectors - 各論文の高次元ベクトル配列 (例: N件 × 384次元)
 * @param options - UMAPのオプション設定
 * @returns 正規化された2次元座標の配列
 */
export function reduceDimensionsWithUmap(
  vectors: number[][],
  options: UMAPReductionOptions = {}
): Point2D[] {
  const sampleCount = vectors.length;

  // サンプル数が0または1件の場合の安全処理
  if (sampleCount === 0) return [];
  if (sampleCount === 1) {
    return [{ x: 50, y: 50 }];
  }

  // 2件の場合は対角線上に配置
  if (sampleCount === 2) {
    return [
      { x: 30, y: 30 },
      { x: 70, y: 70 },
    ];
  }

  // サンプル数に応じた安全な nNeighbors の決定
  // UMAPの数学的制約: nNeighbors はサンプル数未満である必要があります
  const requestedNeighbors = options.nNeighbors ?? 15;
  const safeNeighbors = Math.max(2, Math.min(requestedNeighbors, sampleCount - 1));

  try {
    const umap = new UMAP({
      nNeighbors: safeNeighbors,
      minDist: options.minDist ?? 0.1,
      spread: options.spread ?? 1.0,
      nComponents: 2,
    });

    // UMAP計算の実行（ブラウザ上で数十ミリ秒〜数百ミリ秒で完了）
    const rawCoordinates = umap.fit(vectors);

    const points: Point2D[] = rawCoordinates.map((coord: number[]) => ({
      x: coord[0],
      y: coord[1],
    }));

    // グラフ描画領域（10〜90のパーセンタイル範囲）に正規化
    return normalizeCoordinates(points, 10, 90);
  } catch (error) {
    console.warn('UMAP計算の例外発生、フォールバック投影を実行します:', error);
    
    // UMAPが数値的に収束しなかった場合のPCA風フォールバック
    const fallbackPoints: Point2D[] = vectors.map((vec, index) => {
      // 最初の2次元の成分またはインデックスに基づく配置
      const x = vec[0] ?? Math.cos((index / sampleCount) * 2 * Math.PI);
      const y = vec[1] ?? Math.sin((index / sampleCount) * 2 * Math.PI);
      return { x, y };
    });

    return normalizeCoordinates(fallbackPoints, 10, 90);
  }
}
