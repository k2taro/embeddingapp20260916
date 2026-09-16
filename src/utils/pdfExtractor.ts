/**
 * PDFテキスト抽出ユーティリティモジュール
 * 
 * pdfjs-dist を使用して、ユーザーのブラウザ内（クライアントサイド）のみで
 * PDFファイルを解析し、タイトル・アブストラクト・本文テキストを抽出します。
 * 外部サーバーへの通信は一切行われません。
 */

import * as pdfjsLib from 'pdfjs-dist';
import { ExtractedPaper } from '../types';

// PDF.js の Worker スクリプトを初期化（ブラウザ環境でのみ設定）
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    // CDN経由で一致するバージョンのWorkerを安全に読み込み
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch (error) {
    console.warn('PDF.js Workerの初期化警告（Workerなしで継続します）:', error);
  }
}

/**
 * 抽出されたテキストから、タイトルおよび抄録（Abstract）をヒューリスティクスで推定する純粋関数
 * 
 * @param fullText - PDFから抽出された全文テキスト
 * @param fallbackFileName - タイトルが見つからない場合に使用するファイル名
 * @returns 推定されたタイトルと抄録
 */
export function estimateTitleAndAbstract(
  fullText: string,
  fallbackFileName: string
): { title: string; abstract: string } {
  // テキストを行ごとに分割し、前後の空白を除去
  const lines = fullText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // デフォルト値の準備
  const cleanFileName = fallbackFileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  let estimatedTitle = cleanFileName;
  let estimatedAbstract = '';

  if (lines.length > 0) {
    // 最初の有効な数行の中から、長すぎず短すぎない行をタイトル候補として探索
    for (let index = 0; index < Math.min(lines.length, 5); index++) {
      const candidate = lines[index];
      // 記号のみやページ番号、極端に短い行は除外
      if (candidate.length >= 6 && candidate.length <= 150 && !candidate.match(/^\d+$/)) {
        estimatedTitle = candidate;
        break;
      }
    }
  }

  // 「Abstract」または「要旨」「概要」というキーワードを大文字小文字を問わず探索
  const abstractMatch = fullText.match(/(?:abstract|要旨|概要)[\s:：\n]+([\s\S]{50,1500}?)(?:\n\s*(?:1[\.\s]|introduction|はじめに|key\s*words|index\s*terms)|\n\n)/i);

  if (abstractMatch && abstractMatch[1]) {
    // 余分な改行をスペースに統合してクリーンアップ
    estimatedAbstract = abstractMatch[1].replace(/\s+/g, ' ').trim();
  } else {
    // Abstractの見出しが見つからない場合、本文の先頭部分から一部を抜粋
    const fallbackExcerpt = lines.slice(1, 6).join(' ');
    estimatedAbstract = fallbackExcerpt.slice(0, 300) + (fallbackExcerpt.length > 300 ? '...' : '');
  }

  return {
    title: estimatedTitle,
    abstract: estimatedAbstract,
  };
}

/**
 * PDFのバイナリバッファ（ArrayBuffer）からテキストを抽出する純粋関数
 * 
 * @param arrayBuffer - PDFファイルのArrayBufferデータ
 * @param fileName - ファイル名
 * @param fileSize - ファイルサイズ (バイト)
 * @returns 抽出された論文情報オブジェクト
 */
export async function extractTextFromBuffer(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  fileSize: number = 0
): Promise<ExtractedPaper> {
  // PDFドキュメントをブラウザ内で読み込み
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdfDocument = await loadingTask.promise;
  const pageCount = pdfDocument.numPages;
  const extractedTextChunks: string[] = [];

  // 各ページからテキストコンテンツを順次抽出
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    
    // ページ内のテキストアイテムを結合
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    
    extractedTextChunks.push(pageText);
  }

  const fullText = extractedTextChunks.join('\n\n').trim();
  const { title, abstract } = estimateTitleAndAbstract(fullText, fileName);

  const paper: ExtractedPaper = {
    id: 'paper_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
    fileName,
    title,
    abstract,
    fullText,
    pageCount,
    charCount: fullText.length,
    fileSize,
    createdAt: new Date().toISOString(),
  };

  return paper;
}

/**
 * ユーザーがドラッグ＆ドロップまたはファイルダイアログで選択した File オブジェクトから
 * テキストを抽出する高レベル関数
 * 
 * @param file - 選択されたPDFファイルオブジェクト
 * @returns 抽出された論文情報オブジェクト
 */
export async function extractTextFromPdf(file: File): Promise<ExtractedPaper> {
  const arrayBuffer = await file.arrayBuffer();
  return extractTextFromBuffer(arrayBuffer, file.name, file.size);
}
