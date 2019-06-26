# Browser calls

### Getting started
you will need an `APIKEY`, `username` and `virtual phoneNumber` from AfricasTalking dashboard before getting started.

In the file `routes/index.js` create variables apikey, username and virtual number at the top of file.

In the file `js/index.js` create variable username at the top of the file

Add callback urls on your virtual number from Africastalking dashboard;
`https://*mydomain*/callback_url` on callback url and `https://*mydomain*/events_url` on events url

### Setup
Install dependancies using `npm install`

Run app using `npm start`

> webRTC will only work on secure pages `https://` or `localhost`. Use this for testing

> more documentation is available [here](https://www.npmjs.com/package/africastalking-client)