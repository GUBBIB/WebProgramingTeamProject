# github 자동 업로드 코드

GIT_NAME="GUBBIB"
GIT_EMAIL="moon.dragon250@gmail.com"
CURRENT_DIR=$(pwd)

echo ---------------------------
while [ ! -d ".git" ]; do
    cd ..
    echo "$(pwd)"
done
echo ---------------------------

if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    echo "⚠️  user.name or user.email is not set."
    git config user.name "$GIT_NAME"
    git config user.email "$GIT_EMAIL"
    echo "done."
fi

git add .
git commit -m "Upload"
git push origin main

cd $CURRENT_DIR