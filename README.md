# hy-service

huiyan backend

## 首次启动

rename .env.shadow to .env and fill all envs

```
docker-compose up -d
```
## migration

we develop and synchronize entities in `development` schema, and maintain master branch schema in `public` schema
every time before we submit a pr, we should sync the master schema and generate diff migration

```
git checkout -b your.name/ticket-number

// update entities and complete the features

git fetch origin master:master
git rebase master
git checkout -- master src/migrations
git m:run
git m:gen-diff

// manually move diff migration to src/migrations
``