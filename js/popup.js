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
	
	var other_tab_found = false;
	chrome.tabs.query({'url' : '*://gaana.com/*'},function(tab){
		if(tab.length>0){
			other_tab_found = true;
			// console.log('1'+other_tab_found);
			var TabId = 0;
			TabId = tab[0].id;
			chrome.tabs.executeScript(TabId,{
			code: "document.querySelector('.playPause').click();"
			});
			// console.log('2'+other_tab_found);
		}
		else{
			other_tab_found = false;		//if gaana and saavan tabs not found, go for youtube
		}
	});
	chrome.tabs.query({'url' : '*://www.youtube.com/watch*'},function(tab){
		if(tab.length>0){
			TabId = tab[0].id;

			if(other_tab_found){
				if(tab[0].audible){
					chrome.tabs.executeScript(TabId,{
						code: "document.querySelector('.ytp-play-button').click();"
					});
				}
			}
			else{
				// console.log('4'+other_tab_found);
				chrome.tabs.executeScript(TabId,{
				code: "document.querySelector('.ytp-play-button').click();"
				});
			}
		}
	});
}
document.addEventListener('DOMContentLoaded', function() {
	random_func();
});
