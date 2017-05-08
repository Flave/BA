Run the project

```
$ npm start #starting the server
$ npm run bundle #starting webpack
```

## Database
Database is hosted on mlab.com. Connection details are in `config/db`.

## Uberspace
On uberspace a service with the name `ba-service` is set up. To restart the server run `svc -du ~/service/ba-service`. This will run the npm script `npm run start-uberspace`. 

To DEPLOY on Uberspace do:
1. `$ npm run build` Which builds the production assets locally because uberspace can't handle it
2. Push to uberspace
3. run `$ svc -du ~/service/ba-service` on uberspace

## TODO
-[ ] Configure some webpack stuff to compress for production
-[ ] Set up uberspace with git?
-[ ] Run mongodb on uberspace?