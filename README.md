# CubeStage

**3D空間プレゼンテーションツール**

CubeStageは、3D空間を利用した新しいプレゼンテーション体験を作成するツールです。
従来の平面的なスライドショーを超え、Markdownコンテンツを3Dビジュアライゼーションとして表示できます。

## 🚀 セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール
```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 利用可能なスクリプト
```bash
npm run dev      # 開発サーバーを起動
npm run build    # プロダクションビルド
npm run preview  # ビルド結果をプレビュー
npm run lint     # ESLintでコードチェック
npm run format   # Prettierでコードフォーマット
```

## 🎯 使い方

1. **エディターでMarkdownを記述**
   - 左側のエディターでMarkdownコンテンツを作成・編集

2. **表示モードを選択**
   - プレビューエリア上部のトグルボタンで2D/3D表示を切り替え

3. **3D空間を探索**
   - マウスでカメラを操作（ドラッグで回転、スクロールでズーム）
