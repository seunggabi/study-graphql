# graphql
> https://github.com/MoonHighway/learning-graphql

### link
- http://localhost:4000/
- http://localhost:4000/graphql
- http://localhost:4000/playground

### init

```shell
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

mongosh
use admin
db.createUser({ user: "graphql" , pwd: "graphql", roles: [ "readWrite", "dbAdmin" ] })

use graphql
db.createCollection("users")
db.createCollection("photos")
```

```shell
brew install npm
```
```shell
cd backend

npm install

npm start
``` 
```shell
cd frontend

npm install

npm start
```

### query

```shell
curl --request POST \
  --header 'Content-Type: application/json' \
  --url http://localhost:4000/ \
  --data '{"query":"query {totalPhotos}"}'
```

### oauth
```
id: Iv1.73e2a9dfda956446
secret: 
```