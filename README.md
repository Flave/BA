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
-[ ] Check out babel-plugin-lodash to reduce filesize ([tutorial](http://knpw.rs/blog/using-lodash))
-[ ] Clean up npm packages
-[ ] Set up hooks for when someone revokes fb access n stuff
  -> If you don't do this, the URL is still (with the particular id) accessible but no feed can be fetched. Alternatively you could check for errors ("code":190,"error_subcode":460) in the facebook response