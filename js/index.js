

const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener("click", function () {
  ATlogin();
});
function ATlogin() {
  const clientName = document.getElementById('client-name');
  if (!(/\s/.test(clientName.value))) {
    fetch('/capability-token', {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: 'POST',
      body: JSON.stringify({
        clientName: clientName.value
      })
    })
      .then(data => { return data.json() })
      .then(response => {
        let token = response.token;
        const at = new Africastalking.Client(token, {
          // sounds: {
          //   dialing: 'sounds/dial.mp3',
          //   ringing: 'sounds/ring.mp3'
          // }
        })
        return at;
      })
      .then(client => {
        const logoutBtn = document.getElementById('logout-btn'),
          hangupBtn = document.getElementById('hangup-btn'),
          answerBtn = document.getElementById('answer-btn'),
          callBtn = document.getElementById('call-btn'),
          callto = document.getElementById('call-to'),
          outputLabel = document.getElementById('output-lbl'),
          dtmfKeyboard = document.getElementById('dtmf-keyboard');

        logoutBtn.addEventListener("click", function () {
          client.hangup();
          client.logout();
        });

        hangupBtn.addEventListener("click", function () {
          client.hangup();
        });

        answerBtn.addEventListener("click", function () {
          client.answer();
        });

        callBtn.addEventListener("click", function () {
          let to = document.getElementById('call-to').value;
          client.call(to, false);
        });

        for (const key of dtmfKeyboard.querySelectorAll('td')) {
          key.addEventListener("click", function (events) {
            const text = events.target.innerHTML;
            client.dtmf(text);
          });
        }

        ////////////////////////webrtc events////////////////////////////

        client.on('ready', function () {
          loginBtn.setAttribute('disabled', 'disabled');
          clientName.setAttribute('disabled', 'disabled');
          logoutBtn.removeAttribute('disabled');
          callto.removeAttribute('disabled');
          callBtn.removeAttribute('disabled');
          callto.focus();
          outputLabel.textContent = 'Ready to make calls';
        }, false);


        client.on('notready', function () {
          loginBtn.removeAttribute('disabled');
          clientName.removeAttribute('disabled');
          logoutBtn.setAttribute('disabled', 'disabled');
          callto.setAttribute('disabled', 'disabled');
          callBtn.setAttribute('disabled', 'disabled');
          outputLabel.textContent = 'Login';
        }, false);

        client.on('calling', function () {
          hangupBtn.removeAttribute('disabled');
          callto.setAttribute('disabled', 'disabled');
          callBtn.setAttribute('disabled', 'disabled');
          outputLabel.textContent = 'Calling ' + client.getCounterpartNum() + '...';
        }, false);

        client.on('incomingcall', function (params) {
          hangupBtn.removeAttribute('disabled');
          answerBtn.removeAttribute('disabled');
          callBtn.setAttribute('disabled', 'disabled');
          callto.setAttribute('disabled', 'disabled');
          outputLabel.textContent = '...incoming call from ' + params.from;
        }, false);

        client.on('callaccepted', function () {
          hangupBtn.removeAttribute('disabled');
          callBtn.setAttribute('disabled', 'disabled');
          callto.setAttribute('disabled', 'disabled');
          answerBtn.setAttribute('disabled', 'disabled');
          dtmfKeyboard.style.display = 'initial';
          outputLabel.textContent = 'In conversation with ' + client.getCounterpartNum();
        }, false);


        client.on('hangup', function () {
          hangupBtn.setAttribute('disabled', 'disabled');
          answerBtn.setAttribute('disabled', 'disabled');
          callBtn.removeAttribute('disabled');
          callto.removeAttribute('disabled');
          dtmfKeyboard.style.display = 'none';
          outputLabel.textContent = 'Registered';
        }, false);


        //////////////////////add this
        client.on('offline', function () {
          outputLabel.textContent = 'Token expired, refresh page';
        }, false);

        client.on('closed', function () {
          outputLabel.textContent = 'connection closed, refresh page';
        }, false);
      })
      .catch(error => console.log(error));
  }
  else {
    clientName.value = 'make sure client name is valid';
  }
}


