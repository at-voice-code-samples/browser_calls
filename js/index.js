

const loginBtn = document.getElementById('login-btn'),
outputLabel = document.getElementById('output-lbl');
loginBtn.addEventListener("click", function () {
  ATlogin();
});
function ATlogin() {
  const clientName = document.getElementById('client-name');
  if (!(clientName.value.length === 0)) {
    loader.classList = "ui active dimmer";
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
          sounds: {
            dialing: '/sounds/dial.mp3',
            ringing: '/sounds/ring.mp3'
          }
        })
        return at;
      })
      .then(client => {
        const logoutBtn = document.getElementById('logout-btn'),
          hangupBtn = document.getElementById('hangup-btn'),
          answerBtn = document.getElementById('answer-btn'),
          callBtn = document.getElementById('call-btn'),
          callto = document.getElementById('call-to'),
          outputColor = document.getElementById('output-color'),
          dtmfKeyboard = document.getElementById('dtmf-keyboard'),
          loader = document.getElementById('loader');

        // logoutBtn.addEventListener("click", function () {
        //   client.hangup();
        //   client.logout();
        // });

        hangupBtn.addEventListener("click", function () {
          client.hangup();
        });

        answerBtn.addEventListener("click", function () {
          client.answer();
        });

        callBtn.addEventListener("click", function () {
          let to = document.getElementById('call-to').value;
          if (/^[a-zA-Z]+/.test(to)) { to = 'mwirigiApp.'+ to }
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
          outputColor.classList = 'ui tiny green circular label';
          outputLabel.textContent = 'Ready to make calls';
          loader.classList = "ui dimmer";
        }, false);


        client.on('notready', function () {
          loginBtn.removeAttribute('disabled');
          clientName.removeAttribute('disabled');
          logoutBtn.setAttribute('disabled', 'disabled');
          callto.setAttribute('disabled', 'disabled');
          callBtn.setAttribute('disabled', 'disabled');
          outputLabel.textContent = 'Login';
          outputColor.classList = 'ui tiny orange circular label'
        }, false);

        client.on('calling', function () {
          hangupBtn.removeAttribute('disabled');
          callto.setAttribute('disabled', 'disabled');
          callBtn.setAttribute('disabled', 'disabled');
          outputLabel.textContent = 'Calling ' + client.getCounterpartNum().replace("mwirigiApp.", "") + '...';
          outputColor.classList = 'ui tiny green circular label'
        }, false);

        client.on('incomingcall', function (params) {
          hangupBtn.removeAttribute('disabled');
          answerBtn.removeAttribute('disabled');
          callBtn.setAttribute('disabled', 'disabled');
          callto.setAttribute('disabled', 'disabled');
          outputLabel.textContent = 'Incoming call from ' + params.from.replace("mwirigiApp.", "");
          outputColor.classList = 'ui tiny green circular label'
        }, false);

        client.on('callaccepted', function () {
          hangupBtn.removeAttribute('disabled');
          callBtn.setAttribute('disabled', 'disabled');
          callto.setAttribute('disabled', 'disabled');
          answerBtn.setAttribute('disabled', 'disabled');
          dtmfKeyboard.style.display = 'initial';
          outputLabel.textContent = 'In conversation with ' + client.getCounterpartNum().replace("mwirigiApp.", "");
          outputColor.classList = 'ui tiny green circular label'
        }, false);


        client.on('hangup', function () {
          hangupBtn.setAttribute('disabled', 'disabled');
          answerBtn.setAttribute('disabled', 'disabled');
          callBtn.removeAttribute('disabled');
          callto.removeAttribute('disabled');
          dtmfKeyboard.style.display = 'none';
          outputLabel.textContent = 'Call ended';
          outputColor.classList = 'ui tiny orange circular label'
        }, false);


        //////////////////////add this
        client.on('offline', function () {
          outputLabel.textContent = 'Token expired, refresh page';
          outputColor.classList = 'ui tiny red circular label'
        }, false);

        client.on('closed', function () {
          outputLabel.textContent = 'connection closed, refresh page';
          outputColor.classList = 'ui tiny red circular label'
        }, false);
      })
      .catch(error => {
        loader.classList = "ui dimmer";
        console.log(error)
      });
  }
  else {
    outputLabel.textContent = 'make sure client name is valid';
  }
}


