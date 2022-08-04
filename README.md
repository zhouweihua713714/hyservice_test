# hy-service

HY backend

## 首次启动

rename .env.shadow to .env and fill all envs

```
docker-compose up -d
yarn start:dev or yarn start
```

## migration

we develop and synchronize entities in `development` schema (需要手动创建 development), and maintain master branch schema in `public` schema
every time before we submit a pr, we should sync the master schema and generate diff migration

### migration 准备工作

```
git checkout -b your.name/ticket-number
// update entities and complete the features
git fetch origin master:master
git rebase master
git checkout master -- src/migrations

```

### 生成 migration

```
yarn m:gen diff

// manually move diff migration to src/migrations
```

### 应用 migration

```
yarn m:run
```

### 回滚 migration

```
yarn m:revert
```

## 提交规范

提交代码

```

yarn test
yarn lint
git add ..

```

提交格式:codetype:#taskId eg:git commit -m 'feat:#its-21'

codetype 说明：
feat: (new feature for the user, not a new feature for build script)
fix: (bug fix for the user, not a fix to a build script)
docs: (changes to the documentation)
style: (formatting, missing semi colons, etc; no production code change)
refactor: (refactoring production code, eg. renaming a variable)
test: (adding missing tests, refactoring tests; no production code change)
chore: (updating grunt tasks etc; no production code change)

分支命名格式:name+ task id eg:xxx.xx/HY-21

## 项目访问地址

    服务访问地址：http://localhost:5000
    swagger服务访问地址： http://localhost:5000/api/docs
