import { useState } from "react";
import { Preview } from "../preview/Preview";
import { AvatarDialog } from "../avatar/AvatarDialog";
import { ScreenCaptureDialog } from "../screen-capture/ScreenCaptureDialog";

export function Editor() {
  const [markdownText, setMarkdownText] = useState(`# CubeStage

**3D空間プレゼンテーションツール**

CubeStageは、3D空間を利用した新しいプレゼンテーション体験を作成するツールです。
従来の平面的なスライドショーを超え、Markdownコンテンツを3Dビジュアライゼーションとして表示できます。

## 🌟 主な特徴

### ✨ 革新的な3D表示
- リアルなプレゼンテーション会場環境
- プロジェクタースクリーン風の投影表示
- インタラクティブなカメラコントロール

### 📝 シンプルなMarkdown編集
- リアルタイム編集・プレビュー
- 2D/3D表示の切り替え
- 美しいタイポグラフィ

## 🎯 使い方

右上のボタンで **2D** と **3D** の表示を切り替えてみてください。

3D表示では：
- **ドラッグ**: カメラの回転
- **スクロール**: ズーム
- **右ドラッグ**: パン（移動）

## 📊 サンプルコンテンツ

### チーム紹介
- 開発者A: フロントエンド担当
- 開発者B: 3D表示担当
- 開発者C: UX/UI担当

### 技術スタック
1. **React + TypeScript**: モダンなUI構築
2. **Three.js**: WebGL 3Dグラフィックス
3. **Tailwind CSS**: スタイリング

---

**このエディターで自由にMarkdownを編集して、3D空間での新しいプレゼンテーション体験をお楽しみください！**


::textinput{name=text defaultValue=ABC}

:::js{eventId=script}
export const answer = "Hello, world!" + inputs.text;
console.log("Answer: " + answer);
:::

::button[Execute]{eventId=script}

Answer -> :value{name=answer}

::screencapture

`);

  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(
    "split",
  );
  // 2D / 3D プレビュー切替（Markdown 基本機能と独立した追加機能）
  const [previewMode, setPreviewMode] = useState<"2d" | "3d">("2d");
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showScreenCaptureDialog, setShowScreenCaptureDialog] = useState(false);
  const [debugMode, setDebugMode] = useState({
    enabled: false,
    showCameraInfo: true,
    showGrid: true,
  });

  return (
    <div className="h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="bg-gray-100 border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">エディター</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowScreenCaptureDialog(true)}
            className="px-3 py-1 rounded text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            スクリーンキャプチャ
          </button>
          <button
            onClick={() => setShowAvatarDialog(true)}
            className="px-3 py-1 rounded text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors"
          >
            アバター設定
          </button>
          <button
            onClick={() => setViewMode("edit")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === "edit"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            編集
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === "split"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            分割
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === "preview"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            プレビュー
          </button>
        </div>
      </div>

      {/* エディターとプレビューエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* エディターエリア */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div
            className={`${viewMode === "split" ? "w-1/2" : "w-full"} flex flex-col border-r`}
          >
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h2 className="text-sm font-medium text-gray-700">
                Markdown編集
              </h2>
            </div>
            <textarea
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              className="flex-1 p-4 font-mono text-sm resize-none border-none focus:outline-none focus:ring-0"
              placeholder="Markdownを入力してください..."
              spellCheck={false}
            />
          </div>
        )}

        {/* プレビューエリア */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`${viewMode === "split" ? "w-1/2" : "w-full"} flex flex-col`}
          >
            <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-700">
                プレビュー ({previewMode.toUpperCase()})
              </h2>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-500 select-none">表示:</span>
                <button
                  onClick={() => setPreviewMode("2d")}
                  className={`px-2 rounded text-xs font-medium transition-colors ${
                    previewMode === "2d"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  2D
                </button>
                <button
                  onClick={() => setPreviewMode("3d")}
                  className={`px-2 rounded text-xs font-medium transition-colors ${
                    previewMode === "3d"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  3D
                </button>
                <span className="text-xs text-gray-500 select-none ml-2">
                  デバッグ:
                </span>
                <button
                  onClick={() =>
                    setDebugMode((prev) => ({
                      ...prev,
                      enabled: !prev.enabled,
                    }))
                  }
                  className={`px-2 rounded text-xs font-medium transition-colors ${
                    debugMode.enabled
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {debugMode.enabled ? "ON" : "OFF"}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-white flex justify-center">
              <div className="w-full flex justify-center">
                <Preview
                  text={markdownText}
                  previewMode={previewMode}
                  debugMode={debugMode.enabled ? debugMode : undefined}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* アバターダイアログ */}
      {showAvatarDialog && (
        <AvatarDialog onClose={() => setShowAvatarDialog(false)} />
      )}
      
      {/* スクリーンキャプチャダイアログ */}
      <ScreenCaptureDialog 
        isOpen={showScreenCaptureDialog}
        onClose={() => setShowScreenCaptureDialog(false)} 
      />
    </div>
  );
}
