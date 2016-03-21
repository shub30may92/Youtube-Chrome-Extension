
var loaded_tab_id;

function execute_code(TabId, class_div){
	 var script = "document.querySelector('" + class_div + "').click();";
	 // console.log(script);
	 
	chrome.tabs.executeScript(TabId,{
		code: script
	});
}

function save_data(key_name, data){
	var obj = {};
	obj[key_name] = data;
	chrome.storage.local.set(obj);
	console.log('data saved: 	',key_name, data);
}

function load_data(key_name){
	chrome.storage.local.get(key_name, function(result){
		console.log('data loaded: 	', JSON.stringify(result));
		loaded_tab_id = result[key_name];

	});
}

function clear_storage(key_name){
	chrome.storage.local.remove(key_name, function(){
		console.log('cleared');
	});
}

function play_pause(tab){
	var TabId = tab.id;
	var result_tab = tab.url.search("gaana");
	// console.log('gaana'+result_tab);
	if(result_tab != -1){
		execute_code(TabId, '.playPause');
	}
	else{
		result_tab = tab.url.search("saavn");
		// console.log('saavn'+result_tab);
		if(result_tab != -1){
			if(tab.audible){
				execute_code(TabId, '#pause');
			}
			else{
				execute_code(TabId, '#play');
			}
		}
	}
}

var current_tab = 'current_tabid';
function random_func(){
	load_data(current_tab);
	var other_tab_found = false;	//tab other than youtube
	
	chrome.tabs.query({'url' : ['*://gaana.com/*', '*://www.saavn.com/*']},function(tab){
		if(tab.length>0){

			other_tab_found = true;

			//load data, if there is any tabid stored
			if(loaded_tab_id != undefined){
				console.log('tab found: 	',loaded_tab_id);
				var current_tabid_exist = false;
				//still saved tab exist
				for(i=0; i<tab.length; i++){
					if(loaded_tab_id == tab[i].id){
						console.log('tab exist', tab[i].id);	//tab found break and take action
						current_tabid_exist = true;
						play_pause(tab[i]);
						break;
					}
				}
				if(!current_tabid_exist){
					console.log('tab_not_exist');
					play_pause(tab[0]);							//take action on first tab
					clear_storage(current_tab);					//tab not found clear storage
					save_data(current_tab, tab[0].id);			//save current tab
				}
			}
			else{
				console.log('undefined, clear storage');
				//if a tab is audible
				//save tabid then take actions on that tab
				for(i = 0; i<tab.length; i++){
					if(tab[i].audible){
						save_data(current_tab, tab[i].id);
						break;
					}
				}
			}
			
		}
		else{
			other_tab_found = false;		//if gaana or saavan tabs not found, go for youtube
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
