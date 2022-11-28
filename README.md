# graphql
```shell
brew install

npm init -y
npm install apollo-server graphql nodemon

npm start
``` 

### query
```shell
curl --request POST \
  --header 'content-type: application/json' \
  --url http://localhost:4000/ \
  --data '{"query":"query {totalPhotos}"}'
```