# hy-service

huiyan backend

## 首次启动

开启 docker 容器

docker-compose up -d

## migrations

attention:生成迁移的经验法则是，在对模型进行"每次"更改后生成它们

### 自动生成 migration


yarn run typeorm migration:generate -d src/migrations -n filename

### 手动生成 migration

yarn run typeorm migration:create -d src/migrations -n filename

### 运行迁移

yarn run typeorm migration:run

### 回退迁移

yarn run typeorm migration:revert
