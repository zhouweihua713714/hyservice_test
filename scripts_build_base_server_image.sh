#!/usr/bin/env bash

set -e

echo 'base image: building ...'

root="$(if [ "`git rev-parse --show-cdup`" != "" ]; then cd `git rev-parse --show-cdup`; fi; pwd)"
echo $root

cd "$root/nest-server"

echo "system password then namespace password"
sudo docker login --username=ccnuyan@live.com registry.cn-shanghai.aliyuncs.com

sudo docker build -f Dockerfile.base -t registry.cn-shanghai.aliyuncs.com/mathits/its:base-rest-image .
sudo docker push registry.cn-shanghai.aliyuncs.com/mathits/its:base-rest-image
