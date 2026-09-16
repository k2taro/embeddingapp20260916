/**
 * pdfExtractor.ts の単体テスト
 */

import { describe, it, expect } from 'vitest';
import { estimateTitleAndAbstract } from './pdfExtractor';

describe('pdfExtractor - estimateTitleAndAbstract', () => {
  it('Abstract キーワードが含まれるテキストからタイトルと抄録を正しく抽出できること', () => {
    const sampleText = `
      Deep Learning for Biomedical Image Segmentation
      John Doe, Jane Smith
      
      Abstract: This study presents a novel neural network architecture for segmenting microscopic cell images with high precision and low latency.
      
      1. Introduction
      Biomedical imaging is crucial for modern diagnosis...
    `;

    const result = estimateTitleAndAbstract(sampleText, 'biomedical_study.pdf');

    expect(result.title).toBe('Deep Learning for Biomedical Image Segmentation');
    expect(result.abstract).toContain('This study presents a novel neural network');
    expect(result.abstract).not.toContain('1. Introduction');
  });

  it('日本語の「要旨」「概要」キーワードが含まれる場合も正しく抽出できること', () => {
    const sampleText = `
      深層学習を用いた学術論文の自動分類システムに関する研究
      山田 太郎, 鈴木 花子
      
      要旨: 本稿では、PDF形式の学術論文からテキストをブラウザ上で完全抽出し、自然言語処理モデルにより高精度に分類する手法を提案する。
      
      1. はじめに
      近年、オープンアクセス論文の急速な増加に伴い...
    `;

    const result = estimateTitleAndAbstract(sampleText, 'academic_classification.pdf');

    expect(result.title).toBe('深層学習を用いた学術論文の自動分類システムに関する研究');
    expect(result.abstract).toContain('本稿では、PDF形式の学術論文からテキストをブラウザ上で完全抽出');
  });

  it('明示的なAbstract見出しが存在しない場合、フォールバック抄録を生成すること', () => {
    const sampleText = `
      An Overview of Quantum Computing Algorithms
      Physics Research Institute
      Quantum computing provides exponential speedup for specific computational problems like prime factorization and database search.
    `;

    const result = estimateTitleAndAbstract(sampleText, 'quantum_overview.pdf');

    expect(result.title).toBe('An Overview of Quantum Computing Algorithms');
    expect(result.abstract.length).toBeGreaterThan(10);
  });

  it('テキストが空の場合でもクラッシュせずファイル名から安全にフォールバックすること', () => {
    const result = estimateTitleAndAbstract('', 'machine_learning_survey.pdf');
    expect(result.title).toBe('machine learning survey');
    expect(result.abstract).toBe('');
  });
});
