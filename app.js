const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const axios = require('axios');


app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.post('/events', async (req, res) => {
    console.log({events: req.body});
    //res.status(200).send('Ok');
});

app.post('/capability-token', async (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));
    const params = {
        'clientName': req.body.clientName,
    }
    await capabilityToken(params)
    .then(token => {
        res.send(token);
    })
    .catch(error => {
        res.status(500).send(error.message);
    })
    //res.status(200).send('Ok');
});

app.post('/webrtc', (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));
    const clientDialedNumber = req.body.clientDialedNumber;
    if (req.body.clientDialedNumber){
    	// callActions = `<Dial phoneNumbers="${clientDialedNumber}"/>`;
        callActions = `<GetDigits timeout="30" finishOnKey="#" callbackUrl="https://at-voice.herokuapp.com/dtmf">
				        <Say>Press one then hash to listen to the voice team mixtape</Say>
				    </GetDigits>`;

    }
    else {
        callActions = `<Dial phoneNumbers="${lastRegisteredClient}"/>`;   
    }
    responseAction = '<?xml version="1.0" encoding="UTF-8"?><Response>' + `${callActions}` + '</Response>';
    res.send(responseAction);
});


app.post('/dtmf', (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));
    const client = req.body;
    if (client.dtmfDigits === '1'){
    	callActions = `<Play url="https://at-voice.herokuapp.com/sounds/babyshark.mp3"/>`;
	}
	else{
		callActions = `<Say>Wrong input added</Say>`;
	}
    responseAction = '<?xml version="1.0" encoding="UTF-8"?><Response>' + `${callActions}` + '</Response>';
    res.send(responseAction);
});


////////////////////////////////////////////////////////////////////////////////////////////

let lastRegisteredClient = 'mwirigiApp.mike';
const capabilityToken = async (params) => {
    let token;
    const querystring = require('querystring');
    const url = 'https://webrtc.africastalking.com/capability-token/request';
    console.log({clientName:params.clientName})
    lastRegisteredClient = 'mwirigiApp.' + params.clientName;
    let data = {
        'username': 'mwirigiApp',
        'clientName': params.clientName || 'michael_is_here',
        'phoneNumber': '+254711082316',
        'incoming': 'true',
        'outgoing': 'true',
        'expire': '7200s'
    }
    if (data.username && data.clientName && data.phoneNumber ) {
        axios.defaults.headers.common['APIKEY'] = '00518498ffaa6217d01c9a539e76b3fbc3b918ea7f65b2a087ef0eb1c5467fa8';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        token = await axios({
            method: 'post',
            url,
            data
        })
        .then(response => {
            console.log({data:response.data})
            return response.data;
        })
        .catch(error => {
            console.log({error})
        });
    }
    console.log({token})
    return token;
}







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//add the router
app.use(express.static('views'));
app.use('/js', express.static('js'));
app.use('/sounds', express.static('sounds'));

//add the router
app.use('/', router);
app.listen(process.env.PORT || 5000);

console.log('Im alive');