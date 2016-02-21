// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function random_func(){
  console.log("called");
  var TabId = 0;
  chrome.tabs.query({'url':'*://www.youtube.com/watch*'},function(tab){
      // console.log(tab[0].url);
      TabId = tab[0].id;
      chrome.tabs.executeScript(TabId,{
        code: "document.querySelector('.ytp-play-button').click();"
      });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  random_func();
});
