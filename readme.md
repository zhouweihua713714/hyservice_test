## nest-server

1.  切到 nest-server 目录

```
    cd nest-server
```

2.  安装依赖

```
    yarn install
```

3.  同步数据库模型

```
    yarn db
```

4.  格式化自动生成的模型文件

```
    yarn lint:fix
```

5.  启动服务

```
    yarn start:dev or yarn start
```

6. 本地启动xapi服务

```
    yarn start:xapi
```

## 项目访问地址

    服务访问地址：http://localhost:7005
    swagger服务访问地址： http://localhost:7005/api/docs

## 关于typeorm几个坑
    1. relations 查询的时候数组里面包含的是关联字段, 而不是表名

```
    // dao
    async findOne(id: string): Promise<UserExerciseDetails | undefined> {
        return this.userExerciseDetailsRepository.findOne(
        { id },
        {
            select: ['id', 'user', 'question', 'type'],
            relations: ['question', 'user', 'type'],
        });
    }
```

``` 
    // entity 此处关联的是 ExerciseTypes实体, 但是relations 里面使用'type' 才能关联查询到
    @ManyToOne(() => ExerciseTypes, (exerciseTypes) => exerciseTypes.userExerciseDetails, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'type', referencedColumnName: 'enumId' }])
    type: ExerciseTypes;

```

    2. 插入外键字段或者查询外键字段的时候需要使用以下方式

```
    // userExercise里面插入userId 需要通过 user: {id: userId} 的方式
    const userExercise = await userExercisesRepository.save({
        user: {
            id: payloads[0].userId,
        },
        startedAt: new Date(),
        node: {
            id: payloads[0].nodeId ? payloads[0].nodeId : null,
        },
        test: {
            id: payloads[0].testId ? payloads[0].testId : null,
        },
        paperType: Paper_Types_Enum.MathOne,
        type: payloads[0].type ? payloads[0].type : Exercise_Types_Enum.DailyExercise,
        endedAt: payloads[0].endedAt ? payloads[0].endedAt : null,
    } as unknown as Partial<UserExercises>);
```

