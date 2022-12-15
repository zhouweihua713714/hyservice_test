#!/bin/bash

cd /app/
yarn test
yarn m:run || yarn m:check
