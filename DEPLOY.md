# 🚀 デプロイ手順書(完全版)

このガイドに沿って進めれば、**30分程度で** 「https://road-to-2026.vercel.app」風のURLで友達に共有できる状態になります。

---

## 🎯 ゴール

- GitHubにコードを置く(コード倉庫)
- Vercelに連携して自動デプロイ(公開サーバー)
- 友達にURLを送れば、スマホのブラウザで開ける
- 「ホーム画面に追加」すれば、アプリアイコンから起動できる

---

## 📋 事前準備(必要なもの)

- [ ] パソコン(Windows/Mac/Linux 問わず)
- [ ] Node.js(後述、無料)
- [ ] Gmailアドレス(GitHubとVercelのアカウント作成に使う)

---

## STEP 1: Node.jsをインストール(5分)

1. https://nodejs.org/ja にアクセス
2. **「LTS」と書かれた左側の大きなボタン**をクリックしてダウンロード(今だと20.xか22.x)
3. ダウンロードしたインストーラを開いて、基本は「次へ」連打でOK

**確認**: ターミナル(Macなら「ターミナル.app」、Windowsなら「PowerShell」)を開いて以下を実行:

```bash
node -v
npm -v
```

それぞれバージョン番号(例 `v22.11.0`)が出ればOK。

---

## STEP 2: GitHubアカウントを作る(3分)

1. https://github.com にアクセス → 右上 **Sign up**
2. メールアドレス → パスワード → ユーザー名 を入力(ユーザー名はURLの一部になるので好きなものを)
3. 無料プランで登録完了

---

## STEP 3: ローカルで動かしてみる(5分)

このプロジェクトのZipファイルを解凍したフォルダに、ターミナルで移動します。

### Macの場合
```bash
cd ~/Downloads/road-to-2026    # 解凍先に合わせて
npm install                    # 依存パッケージをインストール(1〜2分)
npm run dev                    # 開発サーバー起動
```

### Windowsの場合
```powershell
cd C:\Users\あなたの名前\Downloads\road-to-2026
npm install
npm run dev
```

ターミナルに以下のようなメッセージが出たら:
```
  ➜  Local:   http://localhost:5173/
```

**ブラウザで http://localhost:5173 を開く** → アプリが動くことを確認!

確認できたら `Ctrl+C`(Macは `Cmd+.`)で一旦停止。

---

## STEP 4: GitHubに載せる(10分)

### 4-1. GitHubで空のリポジトリを作る
1. https://github.com/new
2. **Repository name**: `road-to-2026`(好きな名前でOK)
3. **Public** を選択(Vercel無料プランで使うため)
4. 他は空欄のまま → **Create repository**
5. 作成後に出るページの **SSH/HTTPS** の切り替えで **HTTPS** を選び、URLをコピー
   (例: `https://github.com/あなたのユーザー名/road-to-2026.git`)

### 4-2. プロジェクトをGitHubにプッシュ

プロジェクトフォルダで以下を順に実行:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/road-to-2026.git
git push -u origin main
```

**初回push時**: GitHubのユーザー名とパスワードを求められる場合があります。パスワードの代わりに **Personal Access Token** が必要です。

- https://github.com/settings/tokens → **Generate new token (classic)**
- 名前を適当に、有効期限は90日、スコープは **repo** をチェック
- 生成されたトークン(`ghp_...`で始まる)をコピーしてパスワード欄に貼る

完了後、GitHubの画面を更新すると全ファイルが表示されます。

---

## STEP 5: Vercelでデプロイ(5分)

1. https://vercel.com にアクセス → **Sign Up** → **Continue with GitHub**(さっき作ったGitHubアカウントでログイン)
2. 連携の許可を求められるので全部OK
3. ダッシュボードで **Add New... → Project** をクリック
4. GitHubリポジトリ一覧から **road-to-2026** を選んで **Import**
5. 設定はデフォルトのまま **Deploy** をクリック
6. 2〜3分待つ → **🎉 Congratulations!** の画面
7. そこに表示される **https://road-to-2026-xxxx.vercel.app** のURLがあなたのアプリのURLです

URLをクリックして、スマホのブラウザでも開いてみましょう。

---

## STEP 6: スマホに「アプリっぽく」インストール

### iPhone
1. Safariで公開URLを開く
2. 下の **共有ボタン(□から↑)** をタップ
3. **ホーム画面に追加** をタップ
4. ホーム画面にアプリアイコンが出現!タップすれば全画面で起動

### Android
1. Chromeで公開URLを開く
2. 右上 **︙** メニュー → **ホーム画面に追加**(または「アプリをインストール」)
3. 以上!

---

## STEP 7: 友達に共有

公開URLをLINE/メッセージで送るだけ。受け取った友達はブラウザで開いて、同じようにホーム画面に追加すれば使えます。

LINEに貼るとOGP画像(「ROAD TO 2026」のプレビュー画像)が自動で表示されます。

---

## 🔄 アプリを更新したくなったら

ファイルを編集して、以下のコマンドを打つだけ:

```bash
git add .
git commit -m "更新内容メモ"
git push
```

Vercelが自動で検知して再デプロイします。友達のスマホも次回アクセス時に自動で最新版になります(PWAのキャッシュ更新は少し時間がかかることがあります)。

---

## 🆘 困ったら

| 症状 | 対処 |
|---|---|
| `npm install` でエラー | Node.jsを最新版に更新 |
| `git push` で認証エラー | Personal Access Tokenを生成して使う(STEP 4-2参照) |
| Vercelでビルドエラー | Vercel管理画面のDeploymentsタブでログを確認。`npm run build` がローカルで通るか先に試す |
| PWAアイコンが出ない | 一度キャッシュクリアして再アクセス |
| OGP画像が出ない | LINEは初回キャッシュされるので `?v=2` のようにURLにクエリ足して再送 |

---

## 💰 料金

- GitHub: 無料(public リポジトリなら無制限)
- Vercel: 無料(Hobbyプラン、個人利用なら十分な帯域)

お金は1円もかかりません。
