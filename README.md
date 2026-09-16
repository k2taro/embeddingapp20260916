# Local Paper Visualizer (学術論文ローカル解析・2D可視化)

学術論文（PDF）をブラウザ上で完全ローカル処理（WebAssembly / Transformers.js ONNX）し、ベクトル埋め込み（Embedding）、K-Means クラスタリング、UMAP 次元削減によって2次元マップ上に可視化するWebアプリケーションです。

ファイルや本文データは外部サーバーやクラウドに一切送信されず、完全にクライアント端末内でプライベートに処理されます。

## GitHub Pages への自動デプロイ手順

このリポジトリには `.github/workflows/deploy.yml` が含まれており、GitHub Pages への自動ビルド・デプロイに対応しています。

1. **GitHub にリポジトリを作成してプッシュ**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **GitHub Pages の設定を「GitHub Actions」に変更**:
   - GitHub リポジトリのページを開きます
   - 上部メニューの **Settings** をクリック
   - 左側サイドバーの **Pages** をクリック
   - **Build and deployment** > **Source** のプルダウンで **「GitHub Actions」** を選択します

3. **公開の完了**:
   - `main` または `master` ブランチへのプッシュを検知して自動でビルド＆デプロイが実行されます
   - 完了すると `https://<あなたのユーザー名>.github.io/<リポジトリ名>/` にてWebアプリが公開されます

## ローカル開発手順

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動 (ポート 3000)
npm run dev

# プロダクションビルド
npm run build
```

## 技術スタック
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Local AI Engine**: `@huggingface/transformers` (ONNX Runtime Web / WebAssembly)
- **PDF Extraction**: `pdfjs-dist` (Client-side Web Worker)
- **Clustering**: `ml-kmeans` (K-Means)
- **Dimensionality Reduction**: `umap-js` (UMAP 2D Projection)
- **Visualization**: Recharts, Lucide Icons, Motion
