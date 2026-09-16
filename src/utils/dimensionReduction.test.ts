/**
 * dimensionReduction.ts の単体テスト
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeCoordinates,
  reduceDimensionsWithUmap,
  Point2D,
} from './dimensionReduction';

describe('dimensionReduction - normalizeCoordinates', () => {
  it('座標を正しく指定範囲 [10, 90] に正規化できること', () => {
    const rawPoints: Point2D[] = [
      { x: -100, y: 0 },
      { x: 0, y: 50 },
      { x: 100, y: 100 },
    ];

    const normalized = normalizeCoordinates(rawPoints, 10, 90);

    expect(normalized).toHaveLength(3);
    // 最小値は 10 になる
    expect(normalized[0].x).toBe(10);
    expect(normalized[0].y).toBe(10);
    // 最大値は 90 になる
    expect(normalized[2].x).toBe(90);
    expect(normalized[2].y).toBe(90);
    // 中間値は 50 になる
    expect(normalized[1].x).toBe(50);
    expect(normalized[1].y).toBe(50);
  });

  it('1件のみの場合は中心 [50, 50] を返すこと', () => {
    const single = [{ x: 999, y: -999 }];
    const normalized = normalizeCoordinates(single, 10, 90);
    expect(normalized).toEqual([{ x: 50, y: 50 }]);
  });

  it('空配列の場合は空配列を返すこと', () => {
    expect(normalizeCoordinates([])).toEqual([]);
  });
});

describe('dimensionReduction - reduceDimensionsWithUmap', () => {
  it('少数の多次元ベクトル（例: 4件の10次元ベクトル）から正常に2次元座標が計算されること', () => {
    // 異なるクラスタを模した合成ベクトル
    const vectors = [
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0.9, 1.1, 0.8, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0.8, 1.2, 0.9, 1],
    ];

    const points = reduceDimensionsWithUmap(vectors, { nNeighbors: 2 });

    expect(points).toHaveLength(4);
    for (const pt of points) {
      expect(pt.x).toBeGreaterThanOrEqual(10);
      expect(pt.x).toBeLessThanOrEqual(90);
      expect(pt.y).toBeGreaterThanOrEqual(10);
      expect(pt.y).toBeLessThanOrEqual(90);
    }
  });

  it('1件または2件の境界値ケースでもエラーにならず座標を返すこと', () => {
    const single = [[1, 2, 3]];
    expect(reduceDimensionsWithUmap(single)).toEqual([{ x: 50, y: 50 }]);

    const two = [[1, 2, 3], [4, 5, 6]];
    const pointsTwo = reduceDimensionsWithUmap(two);
    expect(pointsTwo).toHaveLength(2);
  });
});
