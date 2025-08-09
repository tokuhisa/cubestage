import { useState } from "react"
import { MarkdownView } from "./MarkdownView"
import { Markdown3DView } from "./Markdown3DView"

export function MarkdownEditor() {
  const [markdownText, setMarkdownText] = useState(`# ビジュアルノベル作成システム

Visvelを使用してインタラクティブなビジュアルノベルを作成できます。

**---** を使ってシーンを分けることができます。

## シーン1: 主人公の紹介

あなたは魔法学院の新入生です。

::textinput[お名前]{id="name" placeholder="あなたの名前を入力してください"}

::button[自己紹介]{eventId="introduction" variant="primary"}

:::js{eventId="introduction" resultId="intro-result"}
const name = inputs.name || "名無しの魔法使い";
const introduction = \`私の名前は\${name}です。魔法学院での生活が楽しみです！\`;
introduction;
:::

::resultdisplay[]{resultId="intro-result"}

---

## シーン2: 魔法の選択

魔法学院では様々な魔法を学ぶことができます。

### どの系統の魔法を学びますか？

::textinput[魔法系統]{id="magic-type" placeholder="火、水、風、土のいずれかを入力"}

::button[魔法を選択]{eventId="magic-choice" variant="primary"}

:::js{eventId="magic-choice" resultId="magic-result"}
const name = inputs.name || "名無しの魔法使い";
const magicType = inputs["magic-type"] || "汎用";
const result = \`\${name}は\${magicType}系統の魔法を選択しました！\`;
result;
:::

::resultdisplay[]{resultId="magic-result"}

---

## シーン3: 冒険の始まり

魔法を習得したあなたは、初めての冒険に出発します。

### 装備を選択してください

- 魔法の杖
- 魔法の本
- 護符

::button[冒険開始]{eventId="adventure" variant="primary"}

:::js{eventId="adventure" resultId="adventure-result"}
const name = inputs.name || "名無しの魔法使い";
const magicType = inputs["magic-type"] || "汎用";
const adventure = \`魔法使い\${name}の\${magicType}魔法を使った冒険が始まりました！\\n\\n運命はあなたの手の中にあります...\`;
adventure;
:::

::resultdisplay[]{resultId="adventure-result"}

**物語はまだ続きます...**
`)
  
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split')
  // 2D / 3D プレビュー切替（Markdown 基本機能と独立した追加機能）
  const [previewMode, setPreviewMode] = useState<'2d' | '3d'>('2d')

  return (
    <div className="h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="bg-gray-100 border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Markdownエディター</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'edit'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            編集
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'split'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            分割
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            プレビュー
          </button>
        </div>
      </div>

      {/* エディターとプレビューエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* エディターエリア */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col border-r`}>
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h2 className="text-sm font-medium text-gray-700">Markdown編集</h2>
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
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-700">プレビュー ({previewMode.toUpperCase()})</h2>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-500 select-none">表示:</span>
                <button
                  onClick={() => setPreviewMode('2d')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    previewMode === '2d'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  2D
                </button>
                <button
                  onClick={() => setPreviewMode('3d')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    previewMode === '3d'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  3D
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-white flex justify-center">
              <div className="w-full max-w-4xl p-4 flex justify-center">
                {previewMode === '2d' ? (
                  <MarkdownView text={markdownText} />
                ) : (
                  <Markdown3DView text={markdownText} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}