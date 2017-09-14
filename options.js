// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function ghost(isDeactivated) {
  options.style.color = isDeactivated ? 'lightgray' : 'black';
                                              // The label color.
  options.frequency.disabled = isDeactivated; // The control manipulability.
}

window.addEventListener('load', function() {
  // Initialize the option controls.
  if (localStorage.frequency < 15) {
    localStorage.frequency = 15;
  }
  
  options.isActivated.checked = JSON.parse(localStorage.isActivated);
  options.frequency.value = localStorage.frequency;

  if (!options.isActivated.checked) { ghost(true); }

  // Set the display activation and frequency.
  options.isActivated.onchange = function() {
    localStorage.isActivated = options.isActivated.checked;
    ghost(!options.isActivated.checked);
  };

  options.frequency.onchange = function() {
    localStorage.frequency = options.frequency.value;
  };
});
