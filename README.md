# graphql

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

npm init -y
npm install

npm start
``` 

### query

```shell
curl --request POST \
  --header 'content-type: application/json' \
  --url http://localhost:4000/ \
  --data '{"query":"query {totalPhotos}"}'
```