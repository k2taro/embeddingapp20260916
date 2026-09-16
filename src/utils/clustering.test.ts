/**
 * clustering.ts の単体テスト
 */

import { describe, it, expect } from 'vitest';
import {
  determineOptimalClusterCount,
  clusterVectors,
  extractClusterKeywords,
  buildClusterGroups,
} from './clustering';
import { ExtractedPaper } from '../types';

describe('clustering - determineOptimalClusterCount', () => {
  it('サンプル数が少ない場合の境界値が適切であること', () => {
    expect(determineOptimalClusterCount(0)).toBe(1);
    expect(determineOptimalClusterCount(1)).toBe(1);
    expect(determineOptimalClusterCount(2)).toBe(2);
  });

  it('ユーザー指定のKが尊重されること', () => {
    expect(determineOptimalClusterCount(10, 4)).toBe(4);
    // サンプル数を超える場合はサンプル数にクリップ
    expect(determineOptimalClusterCount(3, 5)).toBe(3);
  });

  it('自動決定で適切なクラスタ数が返ること', () => {
    const k = determineOptimalClusterCount(8);
    expect(k).toBeGreaterThanOrEqual(2);
    expect(k).toBeLessThanOrEqual(6);
  });
});

describe('clustering - clusterVectors', () => {
  it('明らかに分離された2つのクラスタのベクトルを正しく2群に分類できること', () => {
    const cluster1 = [
      [10, 10],
      [10.1, 9.9],
      [9.8, 10.2],
    ];
    const cluster2 = [
      [-10, -10],
      [-9.9, -10.1],
      [-10.2, -9.8],
    ];
    const allVectors = [...cluster1, ...cluster2];

    const result = clusterVectors(allVectors, 2);

    expect(result.clusters).toHaveLength(6);
    // 最初の3つは同じクラスタID
    expect(result.clusters[0]).toBe(result.clusters[1]);
    expect(result.clusters[1]).toBe(result.clusters[2]);
    // 後の3つは同じクラスタID
    expect(result.clusters[3]).toBe(result.clusters[4]);
    expect(result.clusters[4]).toBe(result.clusters[5]);
    // 2つのグループは異なるクラスタID
    expect(result.clusters[0]).not.toBe(result.clusters[3]);
  });
});

describe('clustering - extractClusterKeywords and buildClusterGroups', () => {
  const dummyPapers: ExtractedPaper[] = [
    {
      id: 'p1',
      fileName: 'vision1.pdf',
      title: 'Deep Neural Network for Computer Vision and Image Detection',
      abstract: 'We present a convolutional model for real-time image detection.',
      fullText: 'Full text about computer vision and image detection.',
      pageCount: 5,
      charCount: 200,
      fileSize: 1024,
      createdAt: '2026-01-01',
    },
    {
      id: 'p2',
      fileName: 'vision2.pdf',
      title: 'Advancements in Vision Transformers for Detection',
      abstract: 'Vision transformers demonstrate high accuracy in detection tasks.',
      fullText: 'Full text about vision transformers.',
      pageCount: 6,
      charCount: 250,
      fileSize: 2048,
      createdAt: '2026-01-01',
    },
  ];

  it('論文テキストから特徴的なキーワード（ストップワード除く）を抽出できること', () => {
    const keywords = extractClusterKeywords(dummyPapers, 3);
    expect(keywords).toBeInstanceOf(Array);
    expect(keywords.length).toBeGreaterThan(0);
    // "Vision" または "Detection" が上位に来るはず
    const lower = keywords.map((k) => k.toLowerCase());
    expect(lower.some((k) => k.includes('vision') || k.includes('detection'))).toBe(true);
  });

  it('buildClusterGroups が各クラスタのグループ情報を正しく集約すること', () => {
    const groups = buildClusterGroups(dummyPapers, [0, 0]);
    expect(groups).toHaveLength(1);
    expect(groups[0].paperCount).toBe(2);
    expect(groups[0].keywords.length).toBeGreaterThan(0);
    expect(groups[0].color).toBeDefined();
  });
});
