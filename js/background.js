
var b_loaded_tab_id;
var b_current_tab = 'current_tabid';
var shortcut;

function b_execute_code(TabId, class_div){
	 var script = "document.querySelector('" + class_div + "').click();";
	 // console.log(script);
	 
	chrome.tabs.executeScript(TabId,{
		code: script
	});
}

function b_save_data(key_name, data){
	var obj = {};
	obj[key_name] = data;
	chrome.storage.local.set(obj);
	console.log('data saved: 	',key_name, data);
}

function b_load_data(key_name){
	chrome.storage.local.get(key_name, function(result){
		console.log('data loaded: 	', JSON.stringify(result));
		b_loaded_tab_id = result[key_name];

	});
}

function b_clear_storage(key_name){
	chrome.storage.local.remove(key_name, function(){
		console.log('cleared');
	});
}

function b_play_pause(tab){
	var TabId = tab.id;
	var result_tab = tab.url.search("gaana");
	// console.log('gaana'+result_tab);
	if(result_tab != -1){
		b_execute_code(TabId, '.playPause');
	}
	else{
		//result_tab = tab.url.search("saavn");
		// console.log('saavn'+result_tab);
		if(result_tab != -1){
			if(tab.audible){
				b_execute_code(TabId, '#pause');
			}
			else{
				b_execute_code(TabId, '#play');
			}
		}
		else{
			result_tab = tab.url.search("soundcloud");
			if(result_tab != -1){
				b_execute_code(TabId, '.playControl');
			}
			else{
				result_tab = tab.url.search("8tracks");
				if(result_tab != -1){
					b_execute_code(TabId, '#player_play_button');
				}
			}
		}
	}
}

function b_play_next(tab){
	var TabId = tab.id;
	var result_tab = tab.url.search("gaana");
	// console.log('gaana'+result_tab);
	if(result_tab != -1){
		b_execute_code(TabId, '.next');
	}
	else{
		//result_tab = tab.url.search("saavn");
		// console.log('saavn'+result_tab);
		if(result_tab != -1){
			b_execute_code(TabId, '#fwd');
		}
		else{
			result_tab = tab.url.search("soundcloud");
			if(result_tab != -1){
				b_execute_code(TabId, '.skipControl__next');
			}
			else{
				result_tab = tab.url.search("8tracks");
				if(result_tab != -1){
					b_execute_code(TabId, '#player_skip_button');
				}
			}
		}
	}
}

function b_play_previous(tab){
	var TabId = tab.id;
	var result_tab = tab.url.search("gaana");
	// console.log('gaana'+result_tab);
	if(result_tab != -1){
		b_execute_code(TabId, '.previous');
	}
	else{
		//result_tab = tab.url.search("saavn");
		// console.log('saavn'+result_tab);
		if(result_tab != -1){
			b_execute_code(TabId, '#rew');
		}
		else{
			result_tab = tab.url.search("soundcloud");
			if(result_tab != -1){
				b_execute_code(TabId, '.skipControl__previous');
			}
			else{
				result_tab = tab.url.search("8tracks");
				if(result_tab != -1){
					//no action, because 8tracks doesn't contain previous button
				}
			}
		}
	}
}

function b_take_action(tab){
	if(shortcut == "play_pause"){
		b_play_pause(tab);
	}
	else if(shortcut == "play_next"){
		b_play_next(tab);
	}
	else if(shortcut == "play_previous"){
		b_play_previous(tab);
	}
}

function b_find_audible_tab(tab){
	var found_audible_tab = false;
	for(i = 0; i<tab.length; i++){
		if(tab[i].audible){
			found_audible_tab = true;
			b_take_action(tab[i]);
			b_save_data(b_current_tab, tab[i].id);
			break;
		}
	}
	if(!found_audible_tab){
		b_take_action(tab[0]);
		b_save_data(b_current_tab, tab[0].id);
	}
}

function b_new_audible_tab(tab){
	for(i = 0; i<tab.length; i++){
		if(tab[i].audible){
			console.log('yo found a tab', tab[i].id);
			b_clear_storage(b_current_tab);
			b_loaded_tab_id = tab[i].id;
			b_save_data(b_current_tab, b_loaded_tab_id);
			break;
		}
	}
}

function b_random_func(){
	b_load_data(b_current_tab);
	var other_tab_found = false;	//tab other than youtube
	
	//chrome.tabs.query({'url' : ['*://gaana.com/*', '*://www.saavn.com/*', '*://soundcloud.com/*', '*://8tracks.com/*']},function(tab){
	chrome.tabs.query({'url' : ['*://gaana.com/*', '*://soundcloud.com/*', '*://8tracks.com/*']},function(tab){
		if(tab.length>0){

			other_tab_found = true;

			//load data, if there is any tabid stored
			if(b_loaded_tab_id != undefined){
				b_new_audible_tab(tab);
				
				console.log('tab found: 	',b_loaded_tab_id);
				var b_current_tabid_exist = false;
				//still saved tab exist
				for(i=0; i<tab.length; i++){
					if(b_loaded_tab_id == tab[i].id){
						console.log('tab exist', tab[i].id);	//tab found break and take action
						b_current_tabid_exist = true;
						b_take_action(tab[i]);
						break;
					}
				}
				if(!b_current_tabid_exist){
					console.log('tab_not_exist');
					b_clear_storage(b_current_tab);					//tab not found clear storage
					b_find_audible_tab(tab);
					// b_take_action(tab[0]);							//take action on first tab
					// b_save_data(b_current_tab, tab[0].id);			//save current tab
				}
			}
			else{
				console.log('undefined, clear storage');
				//if a tab is audible
				//save tabid then take actions on that tab
				b_find_audible_tab(tab);
			}
			
		}
		else{
			b_clear_storage(b_current_tab);							//tab not found clear storage
			other_tab_found = false;							//if gaana or saavan tabs not found, go for youtube
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
				if(shortcut == "play_pause"){
					chrome.tabs.executeScript(TabId,{
					code: "document.querySelector('.ytp-play-button').click();"
					});
				}
				else if(shortcut == "play_previous"){
					chrome.tabs.executeScript(TabId,{
					code: "document.querySelector('.ytp-prev-button').click();"
					});
				}
				else if(shortcut == "play_next"){
					chrome.tabs.executeScript(TabId,{
					code: "document.querySelector('.ytp-next-button').click();"
					});
				}
			}
		}
	});
}

chrome.commands.getAll(function(commands){
  console.log(commands)
})


chrome.commands.onCommand.addListener(function(command) {
	shortcut = command;
	if(command == "play_pause" || command == "play_next" || command == "play_previous")
		b_random_func();
	//document.getElementById('app-player').contentWindow.document.querySelector('#play-pause').click()	//for spotify
});