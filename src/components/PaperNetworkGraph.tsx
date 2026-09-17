/**
 * 学術論文 コサイン類似度ネットワーク可視化コンポーネント (vis-network)
 * 
 * 論文テキストから抽出した高次元ベクトル間のコサイン類似度を計算し、
 * 指定された類似度閾値以上のペアにエッジ（辺）を結んだフォース主導型ネットワークグラフを描画します。
 * ノードサイズは統一（16px）。
 * 初回表示や閾値変更時に最適配置を計算・安定化させた後は、位置を自動固定（ノードクリックや選択で位置が跳ばない設計）。
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Network, Node, Edge, Options } from 'vis-network';
import { DataSet } from 'vis-data';
import { PaperVisualizationPoint, SimilarityEdge } from '../types';
import { buildSimilarityEdges } from '../utils/embeddings';
import {
  Share2,
  Maximize2,
  Lock,
  Play,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

interface PaperNetworkGraphProps {
  points: PaperVisualizationPoint[];
  embeddingsMap: Map<string, number[]>;
  threshold: number;
  onThresholdChange: (newThreshold: number) => void;
  selectedPaperId: string | null;
  onSelectPaper: (paperId: string) => void;
}

export const PaperNetworkGraph: React.FC<PaperNetworkGraphProps> = ({
  points,
  embeddingsMap,
  threshold,
  onThresholdChange,
  selectedPaperId,
  onSelectPaper,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesDataSetRef = useRef<DataSet<Node>>(new DataSet<Node>([]));
  const edgesDataSetRef = useRef<DataSet<Edge>>(new DataSet<Edge>([]));
  const [isPhysicsActive, setIsPhysicsActive] = useState<boolean>(true);
  const isFirstMountRef = useRef<boolean>(true);

  // 類似度閾値に基づいてエッジを計算
  const paperIds = useMemo(() => points.map((p) => p.id), [points]);
  const edges: SimilarityEdge[] = useMemo(() => {
    return buildSimilarityEdges(paperIds, embeddingsMap, threshold);
  }, [paperIds, embeddingsMap, threshold]);

  // 各ノードの接続次数（エッジ数）を計算（ツールチップ表示用）
  const degreeMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const edge of edges) {
      map.set(edge.from, (map.get(edge.from) || 0) + 1);
      map.set(edge.to, (map.get(edge.to) || 0) + 1);
    }
    return map;
  }, [edges]);

  // 孤立ノード数
  const isolatedCount = useMemo(() => {
    return points.filter((p) => (degreeMap.get(p.id) || 0) === 0).length;
  }, [points, degreeMap]);

  // 物理演算を停止して配置を固定するヘルパー
  const freezePhysics = () => {
    if (networkRef.current) {
      networkRef.current.setOptions({ physics: { enabled: false } });
      setIsPhysicsActive(false);
    }
  };

  // vis-network インスタンスの初期化（コンテナ初期化時のみ1回実行）
  useEffect(() => {
    if (!containerRef.current) return;

    const data = {
      nodes: nodesDataSetRef.current,
      edges: edgesDataSetRef.current,
    };

    const options: Options = {
      nodes: {
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.08)',
          size: 4,
          x: 1,
          y: 2,
        },
      },
      edges: {
        shadow: false,
        selectionWidth: 2.5,
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -45,
          centralGravity: 0.015,
          springLength: 95,
          springConstant: 0.08,
          damping: 0.45,
        },
        stabilization: {
          enabled: true,
          iterations: 120,
          updateInterval: 25,
          fit: true,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 150,
        zoomView: true,
        dragView: true,
        dragNodes: true,
        multiselect: false,
      },
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    // ノードクリックイベント（選択のみ実行、位置は動かさない）
    network.on('click', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        const clickedId = String(params.nodes[0]);
        onSelectPaper(clickedId);
      }
    });

    // 安定化完了時に物理演算をオフにして配置を完全固定
    network.on('stabilizationIterationsDone', () => {
      freezePhysics();
    });
    network.on('stabilized', () => {
      freezePhysics();
    });

    // 安全策：万一イベントが来ない場合でも2秒後に自動固定
    const safetyTimer = setTimeout(() => {
      freezePhysics();
    }, 2000);

    return () => {
      clearTimeout(safetyTimer);
      network.destroy();
      networkRef.current = null;
    };
  }, []);

  // ノードデータの更新（points または degreeMap が変化した時）
  // 既存ノードの (x, y) 座標を保持し、クリック時にノード位置が跳ばないよう防御
  useEffect(() => {
    if (points.length === 0) return;

    // 現在のノードIDと新規ノードIDを比較
    const currentIds = new Set(nodesDataSetRef.current.getIds().map(String));
    const isSameNodeSet =
      currentIds.size === points.length &&
      points.every((p) => currentIds.has(p.id));

    // 既存ノードの現在座標を取得
    const existingPositions = networkRef.current
      ? networkRef.current.getPositions()
      : {};

    const visNodes: Node[] = points.map((point) => {
      const degree = degreeMap.get(point.id) || 0;
      // すべてのノードサイズを統一 (16px)
      const nodeSize = 16;

      // タイトルの短縮表示（ノード下）
      const shortTitle =
        point.title.length > 22
          ? point.title.slice(0, 22) + '…'
          : point.title;

      // ツールチップHTML（ホバー時に表示）
      const tooltipText = `
        <div style="padding: 4px; max-width: 260px; font-family: sans-serif; font-size: 11px; line-height: 1.4;">
          <div style="font-weight: bold; color: ${point.clusterColor}; margin-bottom: 2px;">
            Cluster ${point.clusterId + 1} (${degree}件接続)
          </div>
          <div style="font-weight: bold; color: #0f172a; margin-bottom: 4px;">
            ${point.title}
          </div>
          <div style="color: #64748b; font-size: 10px;">
            ${point.abstract.slice(0, 120)}…
          </div>
        </div>
      `;

      const existingPos = existingPositions[point.id];

      return {
        id: point.id,
        label: shortTitle,
        title: tooltipText,
        shape: 'dot',
        size: nodeSize,
        // 既存の座標を保持して位置飛びを防止
        x: existingPos?.x,
        y: existingPos?.y,
        color: {
          background: point.clusterColor,
          border: '#ffffff',
          highlight: {
            background: point.clusterColor,
            border: '#0f172a',
          },
          hover: {
            background: point.clusterColor,
            border: '#334155',
          },
        },
        borderWidth: 1.5,
        font: {
          size: 11,
          face: 'ui-sans-serif, system-ui, sans-serif',
          color: '#475569',
          strokeWidth: 2,
          strokeColor: '#ffffff',
        },
      };
    });

    if (isSameNodeSet) {
      // ノード構成が同じ場合は update のみ（位置は一切リセットしない）
      nodesDataSetRef.current.update(visNodes);
    } else {
      // フィルタ切り替え等でノード集合自体が変わった場合
      nodesDataSetRef.current.clear();
      nodesDataSetRef.current.add(visNodes);

      // 新規ノードの配置計算のため一時的に物理演算を行い、安定化後に自動固定
      if (networkRef.current) {
        networkRef.current.setOptions({ physics: { enabled: true } });
        setIsPhysicsActive(true);
        networkRef.current.stabilize(100);
      }
    }

    // 選択中ノードの安全な再選択
    if (selectedPaperId && points.some((p) => p.id === selectedPaperId)) {
      try {
        networkRef.current?.selectNodes([selectedPaperId]);
      } catch {
        // 安全ガード
      }
    } else {
      try {
        networkRef.current?.unselectAll();
      } catch {
        // 安全ガード
      }
    }
  }, [points, degreeMap]);

  // エッジデータの更新（edges または threshold が変化した時）
  useEffect(() => {
    const visEdges: Edge[] = edges.map((edge) => {
      // 類似度が高いほど太く濃く表示
      const similarityDiff = Math.max(0, edge.similarity - threshold);
      const maxDiff = Math.max(0.01, 1.0 - threshold);
      const ratio = similarityDiff / maxDiff;
      const width = 1 + ratio * 3;
      const percent = Math.round(edge.similarity * 100);

      return {
        id: edge.id,
        from: edge.from,
        to: edge.to,
        width,
        color: {
          color: `rgba(99, 102, 241, ${0.25 + ratio * 0.55})`,
          highlight: '#4338ca',
          hover: '#6366f1',
        },
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.15,
        },
        title: `コサイン類似度: ${percent}%`,
      };
    });

    edgesDataSetRef.current.clear();
    edgesDataSetRef.current.add(visEdges);
  }, [edges, threshold]);

  // 閾値変更時：新しいエッジ接続関係に基づいて位置を再計算し、完了後に再び固定
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    if (networkRef.current) {
      networkRef.current.setOptions({ physics: { enabled: true } });
      setIsPhysicsActive(true);
      networkRef.current.stabilize(90);
    }
  }, [threshold]);

  // 外部からの選択状態変更に安全に追従（位置は動かさず選択スタイルのみ反映）
  useEffect(() => {
    if (!networkRef.current) return;

    const nodeExists =
      Boolean(selectedPaperId) &&
      Boolean(nodesDataSetRef.current.get(selectedPaperId!));

    if (nodeExists && selectedPaperId) {
      try {
        networkRef.current.selectNodes([selectedPaperId]);
      } catch {
        // RangeError等の例外をキャッチして防ぐ
      }
    } else {
      try {
        networkRef.current.unselectAll();
      } catch {
        // 安全ガード
      }
    }
  }, [selectedPaperId]);

  // 画面全体にフィット
  const handleFit = () => {
    if (networkRef.current && points.length > 0) {
      try {
        networkRef.current.fit({
          animation: {
            duration: 500,
            easingFunction: 'easeInOutQuad',
          },
        });
      } catch {
        // 安全ガード
      }
    }
  };

  // 物理演算のON/OFF手動切り替え（ユーザーが任意で位置を再調整したい場合）
  const togglePhysics = () => {
    setIsPhysicsActive((prev) => {
      const next = !prev;
      if (networkRef.current) {
        networkRef.current.setOptions({ physics: { enabled: next } });
      }
      return next;
    });
  };

  if (points.length === 0) {
    return (
      <div className="h-[460px] flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/40 text-slate-400">
        <Share2 className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">解析完了後にここに類似度ネットワークが表示されます</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col">
      {/* 上部コントロールバー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800">
                コサイン類似度ネットワーク
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-medium">
                {points.length} ノード / {edges.length} エッジ
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              類似度が閾値以上の論文間にエッジを形成してクラスタ関係を可視化（配置固定中）
            </p>
          </div>
        </div>

        {/* ツールボタン群 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePhysics}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              isPhysicsActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={
              isPhysicsActive
                ? 'クリックで配置を固定します'
                : 'クリックで物理演算（自動再配置）を再開します'
            }
          >
            {isPhysicsActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>演算中 (クリックで固定)</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>配置固定中</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleFit}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="全体を画面内に収める"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>全体表示</span>
          </button>
        </div>
      </div>

      {/* 類似度閾値コントローラー（リアルタイムスライダー） */}
      <div className="mb-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>類似度 接続閾値:</span>
          <span className="font-mono text-indigo-600 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
            {Math.round(threshold * 100)}% ({threshold.toFixed(2)})
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            （閾値変更時に最適配置を自動再計算）
          </span>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-xs sm:max-w-sm">
          <span className="text-[10px] text-slate-400 font-mono">0%</span>
          <input
            id="network-threshold-slider"
            type="range"
            min={0}
            max={0.95}
            step={0.01}
            value={threshold}
            onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <span className="text-[10px] text-slate-400 font-mono">95%</span>
        </div>
      </div>

      {/* グラフ描画キャンバス */}
      <div
        ref={containerRef}
        id="vis-network-canvas"
        className="w-full h-[460px] rounded-xl border border-slate-100 bg-slate-50/30 cursor-grab active:cursor-grabbing"
      />

      {/* フッター補足情報 */}
      <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-400 px-2 pt-2 mt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400" />
          ノードクリックで詳細表示（位置は固定） / ノードドラッグで手動調整可能 / スクロールでズーム
        </span>
        {isolatedCount > 0 && (
          <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
            閾値未満の独立ノード: {isolatedCount}件
          </span>
        )}
      </div>
    </div>
  );
};
