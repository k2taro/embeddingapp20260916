/**
 * embeddings.ts の単体テスト
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeL2,
  calculateCosineSimilarity,
  generateDeterministicTestEmbedding,
  generateTextEmbedding,
} from './embeddings';

describe('embeddings - normalizeL2', () => {
  it('ベクトルのL2ノルム（長さ）が1になること', () => {
    const rawVector = [3, 4, 0];
    const normalized = normalizeL2(rawVector);
    
    // 3^2 + 4^2 = 25 -> sqrt = 5 -> [0.6, 0.8, 0]
    expect(normalized[0]).toBeCloseTo(0.6, 4);
    expect(normalized[1]).toBeCloseTo(0.8, 4);
    expect(normalized[2]).toBe(0);

    const length = Math.sqrt(
      normalized.reduce((acc, val) => acc + val * val, 0)
    );
    expect(length).toBeCloseTo(1.0, 4);
  });

  it('ゼロベクトルの場合はエラーにならずゼロベクトルを返すこと', () => {
    const zeroVector = [0, 0, 0];
    const normalized = normalizeL2(zeroVector);
    expect(normalized).toEqual([0, 0, 0]);
  });
});

describe('embeddings - calculateCosineSimilarity', () => {
  it('同一ベクトルのコサイン類似度は1.0であること', () => {
    const vecA = [0.6, 0.8, 0];
    const sim = calculateCosineSimilarity(vecA, vecA);
    expect(sim).toBeCloseTo(1.0, 4);
  });

  it('直交するベクトルのコサイン類似度は0.0であること', () => {
    const vecA = [1, 0, 0];
    const vecB = [0, 1, 0];
    const sim = calculateCosineSimilarity(vecA, vecB);
    expect(sim).toBeCloseTo(0.0, 4);
  });

  it('逆向きのベクトルのコサイン類似度は-1.0であること', () => {
    const vecA = [1, 0];
    const vecB = [-1, 0];
    const sim = calculateCosineSimilarity(vecA, vecB);
    expect(sim).toBeCloseTo(-1.0, 4);
  });
});

describe('embeddings - generateDeterministicTestEmbedding', () => {
  it('指定した次元数の正規化ベクトルが返ること', () => {
    const text = 'Deep neural networks for image segmentation and computer vision';
    const embedding = generateDeterministicTestEmbedding(text, 384);
    
    expect(embedding).toHaveLength(384);
    const length = Math.sqrt(embedding.reduce((acc, val) => acc + val * val, 0));
    expect(length).toBeCloseTo(1.0, 4);
  });

  it('同一テキストから同一のベクトルが生成されること', () => {
    const text = 'Quantum computing algorithms';
    const emb1 = generateDeterministicTestEmbedding(text, 128);
    const emb2 = generateDeterministicTestEmbedding(text, 128);
    expect(emb1).toEqual(emb2);
  });
});

describe('embeddings - generateTextEmbedding with mock pipeline', () => {
  it('モックパイプラインから正規化された埋め込みを取得できること', async () => {
    const mockPipeline = async (text: string) => {
      // 3次元のモックTensor
      return {
        data: new Float32Array([1, 2, 2]),
      };
    };

    const result = await generateTextEmbedding('test text', mockPipeline);
    // 1^2 + 2^2 + 2^2 = 9 -> sqrt = 3 -> [1/3, 2/3, 2/3]
    expect(result).toHaveLength(3);
    expect(result[0]).toBeCloseTo(1 / 3, 4);
    expect(result[1]).toBeCloseTo(2 / 3, 4);
    expect(result[2]).toBeCloseTo(2 / 3, 4);
  });
});
