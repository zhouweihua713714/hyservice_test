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

### migration 需要注意的几个问题

1. 表中字段可能存在跨类型的变更尽量允许为空值,否则在应用 migration 会出现错误 
2. 配置类数据作为 migration 集成的且存在字段类型的变更且不允许为空的情况下,删除表中所有的数据重新集成即可
3. 在数据不可删除的情况且字段不为空且要调整字段的类型或长度不能直接用生成的migration需要用ALTER TABLE 表名 ALTER COLUMN 字段名 TYPE xx 的模式,typeorm 这里采用drop add模式会报错
4. 当前typeorm不支持索引类型默认是B-tree,需要创建其它类型的索引需要手写migration同时再entity需要设置不同步这样保持才能保持migration与entity的schema的一致

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
