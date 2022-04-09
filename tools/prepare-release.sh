#!/bin/bash

CALL_DIR=$(pwd)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TARGET_DIR=${SCRIPT_DIR}/../../PotluckLabsDeploy

echo "Target directory: ${TARGET_DIR}"

echo "Removing old files..."
cd $TARGET_DIR
# Remove all files but leave .git directory untouched
find . -not -path '*/\.git*' -delete

echo "Copying new files..."
cd $SCRIPT_DIR/..
# Copies all non hidden files (skips .git dir)
cp -r ./build/* $TARGET_DIR

echo "Doing needed modifications..."
cd $TARGET_DIR

# Copy ipfs-404
cp index.html ipfs-404.html

mkdir projects
cp index.html ./projects
cd projects
sed -i 's/\"\.\//\"\.\.\//g' index.html
cp index.html ipfs-404.html
cd ..

mkdir minting
cp index.html ./minting
cd minting
sed -i 's/\"\.\//\"\.\.\//g' index.html
cp index.html ipfs-404.html
cd ..

cd $CALL_DIR