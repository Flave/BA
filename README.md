Run the project

```
$ npm start #starting the server
$ npm run bundle #starting webpack
```

## Database
Database is hosted on mlab.com. Connection details are in `config/db`.

## Uberspace
On uberspace a service with the name `ba-service` is set up. To restart the server run `svc -du ~/service/ba-service`. This will run the npm script `npm run start-uberspace`. 

## TODO
-[ ] Configure some webpack stuff to compress for production
-[ ] Set up uberspace with git?
-[ ] Run mongodb on uberspace?