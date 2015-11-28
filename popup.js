// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function getURLParameter(name, url) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').url||null));
}
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
var length = null;
var loaded = false;
var max_tab_search_counter = 0;
function new_func()
{
  max_tab_search_counter++;
  chrome.tabs.getAllInWindow(null, function(tabs){
      length = tabs.length;
      console.log(length);
      for (var i = 0; i < tabs.length; i++) {
        //while(tabs[i].url == null);
        var urls = tabs[i].url;
        var tabid = tabs[i].id;
        console.log(urls);
        if(urls != null)
        {
          var split = urls.split('?');
          if(split[0] != null)
          {
            if(split[0].search('youtube') != -1)
            {
              loaded = true;
              console.log('found');
              console.log(split[0]);
              if(split[1] != null)
              {
                chrome.tabs.executeScript(tabid, {
                  //code: '$(".ytp-play-button").click();'
                  code: "document.querySelector('.ytp-play-button').click();"
                  //play_button.click();
                });
              }
            }
          }
        }
      }
  });
}

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    //active: true,
    currentWindow: true,
    status: 'complete'

  };

  

  chrome.tabs.query({}, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];
    console.log(tabs.length);
    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tabs.url;
    //var url1 = tab1.url;
    console.log(url);
    //console.log(url1);
    var tabid = tab.id;
    console.log(tabid);
    console.log(tab.audible);
    var split = url.split('?v=');
    // if(split[0] != null)
    // {
    //   if(split[0].search('youtube') != -1)
    //   {
    //     console.log('found');
    //     console.log(split[0]);
    //   }
    //   else
    //   {
    //     console.log('not found');
    //   }
    // }
    // else
    // {
    //   console.log("NULL1");
    // }
    // if(split[1] != null)
    // {
    //   console.log(split[1]);
    // }
    // else
    // {
    //   console.log("NULL2");
    // }
    // console.log(url);
    // console.log(encodeURI(url));
    
    chrome.tabs.executeScript(tabid, {
      //code: '$(".ytp-play-button").click();'
      code: "document.querySelector('.ytp-play-button').click();"
      //play_button.click();
    });
    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url, tabid);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  
  var url;
  chrome.tabs.query(queryInfo, function(tabs) {
    url = tabs[0].url;
  });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

var intvl = setInterval(function() {
    if(!loaded)
      new_func();
    if (loaded || max_tab_search_counter > 10) { 
        console.log("finished");
        clearInterval(intvl);
    }
  }, 1000);

document.addEventListener('DOMContentLoaded', function() {
  //console.log("nonono");
  setInterval(null);
  //setInterval(new_func);
  //getCurrentTabUrl(function(url, tabid) {
    
    // // Put the image URL in Google search.
    // renderStatus('Performing Google Image search for ' + url);

    // getImageUrl(url, function(imageUrl, width, height) {
      
    //   renderStatus('Search term: ' + url + '\n' +
    //       'Google image search result: ' + imageUrl);
    //   var imageResult = document.getElementById('image-result');
    //   // Explicitly set the width/height to minimize the number of reflows. For
    //   // a single image, this does not matter, but if you're going to embed
    //   // multiple external images in your page, then the absence of width/height
    //   // attributes causes the popup to resize multiple times.
    //   imageResult.width = width;
    //   imageResult.height = height;
    //   imageResult.src = imageUrl;
    //   imageResult.hidden = false;

    // }, function(errorMessage) {
    //   renderStatus('Cannot display image. ' + errorMessage);
    // });
  //});
});

// chrome.browserAction.onClicked.addListener(){
//   setInterval(null);
//   console.log("abcd");
// }