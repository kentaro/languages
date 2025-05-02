# Languages

効率的に外国語を学ぶためのオンライン学習プラットフォーム。Next.js、TypeScript、shadcn/uiを使用した静的サイトです。

## プロジェクト概要

このプロジェクトは、言語学習のための構造化されたコンテンツを提供するウェブアプリケーションです。学習者が体系的に言語を学ぶために必要な文法解説、単語リスト、例文、練習問題などを含みます。

現在は以下のコースが利用可能です：

- **ドイツ語検定3級に50日で合格** - ドイツ語検定3級合格に必要な文法、単語、リスニングなどを網羅した7週間のコース

## 技術スタック

- **フレームワーク**: Next.js 15.3
- **言語**: TypeScript
- **CSS**: Tailwind CSS v4
- **UIコンポーネント**: shadcn/ui
- **データ形式**: YAML
- **デプロイ**: GitHub Pages

## ローカル開発

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/languages.git
cd languages

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## コンテンツ構造

コンテンツはYAMLファイルとして`data`ディレクトリに保存されています：

```
data/
  german-diploma-in-japan-grade-3/
    overview.yaml  # コース概要
    week1/
      index.yaml   # 第1週の詳細
    week2/
      index.yaml   # 第2週の詳細
    ...
```

## 新しいコースの追加方法

1. `data`ディレクトリに新しいコースディレクトリを作成（例：`data/spanish-beginner`）
2. `overview.yaml`ファイルを作成してコース概要を定義
3. 週ごとのディレクトリを作成し、各`index.yaml`ファイルに詳細なコンテンツを追加
4. 新しいルートコンポーネントを作成（`src/app/[course-name]/page.tsx`）

## デプロイ

メインブランチへのプッシュ時に、GitHub Actionsが自動的にサイトをビルドし、GitHub Pagesにデプロイします。

## ライセンス

MIT
