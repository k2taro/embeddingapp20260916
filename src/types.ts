/**
 * 学術文献可視化アプリケーションの共通型定義ファイル
 * 
 * 論文データの構造、ベクトル埋め込み、クラスタリング、
 * UMAPによる2次元座標、エンジンの実行状態などを定義します。
 */

/**
 * PDFから抽出された論文データの型定義
 */
export interface ExtractedPaper {
  /** 論文の一意識別子 (UUIDなど) */
  id: string;
  /** 元のファイル名 */
  fileName: string;
  /** 推定された論文タイトル */
  title: string;
  /** 推定された抄録 (Abstract) */
  abstract: string;
  /** 全文テキスト (ベクトル化やキーワード抽出に使用) */
  fullText: string;
  /** 総ページ数 */
  pageCount: number;
  /** 抽出文字数 */
  charCount: number;
  /** ファイルサイズ (バイト数) */
  fileSize: number;
  /** 抽出処理日時 */
  createdAt: string;
}

/**
 * ベクトル化された論文の埋め込み表現
 */
export interface PaperEmbedding {
  /** 対象論文のID */
  paperId: string;
  /** 多次元ベクトル配列 (例: 384次元または1024次元) */
  vector: number[];
}

/**
 * 2次元平面上にプロットするための可視化データ
 */
export interface PaperVisualizationPoint {
  /** 対象論文のID */
  id: string;
  /** 論文タイトル */
  title: string;
  /** ファイル名 */
  fileName: string;
  /** 抄録 */
  abstract: string;
  /** UMAP等で圧縮されたX座標 */
  x: number;
  /** UMAP等で圧縮されたY座標 */
  y: number;
  /** 所属するクラスタID (0始まり) */
  clusterId: number;
  /** クラスタの表示色 (HEXカラーコード) */
  clusterColor: string;
  /** クラスタの主要キーワード */
  clusterKeywords: string[];
}

/**
 * クラスタ情報
 */
export interface ClusterGroup {
  /** クラスタID */
  id: number;
  /** クラスタ名または代表ラベル */
  name: string;
  /** グラフ上での色 */
  color: string;
  /** このクラスタに属する論文数 */
  paperCount: number;
  /** 特徴キーワード一覧 */
  keywords: string[];
}

/**
 * 解析エンジンのフェーズ状態
 */
export type EngineStage =
  | 'idle'               // 待機中
  | 'extracting'         // PDFテキスト抽出中
  | 'loading-model'      // ONNXモデルダウンロード/読み込み中
  | 'embedding'          // 文書ベクトル化中
  | 'reducing'           // UMAPによる次元削減計算中
  | 'clustering'         // K-meansクラスタリング計算中
  | 'completed'          // 完了
  | 'error';             // エラー発生

/**
 * 解析エンジンの進捗状態
 */
export interface EngineProgress {
  /** 現在の処理段階 */
  stage: EngineStage;
  /** 現在完了した件数 */
  current: number;
  /** 合計件数 */
  total: number;
  /** 進捗率 (0〜100%) */
  percentage: number;
  /** ユーザー向け日本語メッセージ */
  message: string;
  /** 詳細情報（ダウンロードバイト数など、任意） */
  detail?: string;
}

/**
 * 可視化手法の種別
 */
export type VisualizationMethod = 'umap' | 'network';

/**
 * 類似度ネットワークにおけるエッジデータ構造
 */
export interface SimilarityEdge {
  /** エッジID */
  id: string;
  /** 接続元論文ID */
  from: string;
  /** 接続先論文ID */
  to: string;
  /** コサイン類似度 (0.0 〜 1.0) */
  similarity: number;
}

/**
 * 解析エンジンの各種設定パラメータ
 */
export interface EngineSettings {
  /** 使用するHugging Face埋め込みモデル名 */
  modelName: string;
  /** K-meansのクラスタ数 (0の場合は自動決定) */
  clusterCount: number;
  /** UMAP: 近傍点の数 (n_neighbors) */
  umapNeighbors: number;
  /** UMAP: 最小距離 (min_dist) */
  umapMinDist: number;
  /** 可視化手法: UMAP 2Dマップ または コサイン類似度ネットワーク */
  visualizationMethod: VisualizationMethod;
  /** 類似度ネットワーク: エッジを張るコサイン類似度の閾値 (0.0〜1.0) */
  similarityThreshold: number;
}
