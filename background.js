// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/

chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
        var headers = info.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1); // Remove header
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
);

function show(qtde) {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  //var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var hour = time[1];               // The prettyprinted hour.
  //var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  var n = new Notification(hour + time[2], {
    icon: '32_w.png',
    body: 'Senhas novas adicionadas na sua fila: ' + qtde
  });
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   
  localStorage.frequency = 15;        
  localStorage.isInitialized = true; 
  localStorage.isClicked = 0;
}

// Test for notification support.
if (window.Notification) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) {
    //show('teste');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.ogmo-santos.com.br/erp/ext_pwd/check_tickets.php", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var resp = JSON.parse(xhr.responseText);
        if (resp.naoVisto > 0) {
          show(resp.naoVisto);
          localStorage.isClicked = 0;
          chrome.browserAction.setIcon({path: {'16': '16_w.png'}});
        } else if (resp.qtde > 0) {
          if (localStorage.isClicked == 1)
            chrome.browserAction.setIcon({path: {'16': '16_a.png'}});
        } else {
          if (localStorage.isClicked == 1)
            chrome.browserAction.setIcon({path: {'16': '16.png'}});
        }
      }
    }
    xhr.send();
  }

  var interval = 0; // The display interval, in minutes.

  setInterval(function() {
    interval++;

    if (JSON.parse(localStorage.isActivated) && localStorage.frequency <= interval) {
      //show("A");
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://www.ogmo-santos.com.br/erp/ext_pwd/check_tickets.php", true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var resp = JSON.parse(xhr.responseText);
          if (resp.naoVisto > 0) {
            show(resp.naoVisto);
            localStorage.isClicked = 0;
            chrome.browserAction.setIcon({path: {'16': '16_w.png'}});
          } else if (resp.qtde > 0) {
            if (localStorage.isClicked == 1) {
              chrome.browserAction.setIcon({path: {'16': '16_a.png'}});
            }
          } else {
            if (localStorage.isClicked == 1) {
              chrome.browserAction.setIcon({path: {'16': '16.png'}});
            }
          }
        }
      }
      xhr.send();
      interval = 0;
    }
  }, 1000);
}
