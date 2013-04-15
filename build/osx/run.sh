#!/usr/bin/env bash

NODE_WEBKIT_PATH=node-webkit.app/Contents/MacOS/node-webkit
BUILD_DIR=$PWD

if [[ ! $BUILD_DIR =~ osx$ ]]; then
    BUILD_DIR="${BUILD_DIR}/build/osx"
fi

BASE_DIR="${BUILD_DIR}/../.."

$BUILD_DIR/$NODE_WEBKIT_PATH $BASE_DIR/app &
