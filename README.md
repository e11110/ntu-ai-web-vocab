# react-web-app-with-openai

# [https://bit.ly/ntu-ai-web-4](https://bit.ly/ntu-ai-web-4)

安裝所需套件

```
npm i
```

啟動開發伺服器

```
npm run dev
```

## 環境變數範例

.env

```
OPENAI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
```

## 安裝 Git

1. 至 [Git 官方網站](https://www.git-scm.com/) 下載並且安裝 Git
2. 設定使用者名稱與 Email

```
git config --global user.name "你的使用者名稱"
git config --global user.email 你的EMAIL
```

## 更新至 Github

```
git add .
git commit -m "這次所執行的變更"
git push origin main
```

## Initial Commit to Github

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/e11110/ntu-ai-web-vocab.git
git push -u origin main
```

# git commands

## see current branch
git status

## change branch

git checkout branch

## add new branch
git checkout -b new_branch

## list all branches

git branch -a

## send branch to github

git push origin HEAD
