
var loaded_tab_id;

function execute_code(TabId, class_div){
	 var str1 = "document.querySelector('" + class_div + "').click();";
	 // console.log(str1);
	 
	chrome.tabs.executeScript(TabId,{
		code: str1
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

var current_tabid = 'current_tabid';
function random_func(){
	load_data(current_tabid);
	var other_tab_found = false;
	
	chrome.tabs.query({'url' : ['*://gaana.com/*', '*://www.saavn.com/*']},function(tab){
		if(tab.length>0){
			//load data, if there is any tabid stored
			//clear_storage(current_tabid);
			
			console.log('123',loaded_tab_id);
			//use only if load_data async call is completed
			if(tab_id != undefined){
				console.log('tab found: 	',tab_id);
			}
			else{
				console.log('undefined clear storage');
			}
			console.log('tab',tab_id);
			//if a tab is audible
			//save tabid then take actions on that tab
			for(i = 0; i<tab.length; i++){
				if(tab[i].audible){
					save_data(current_tabid, tab[i].id);
					break;
				}
			}

			var TabId = 0;
			TabId = tab[0].id;
			other_tab_found = true;

			
			
			//if any tab is not audible go for first tab
			// console.log(tab[0].id);
			// console.log(tab[1].id);
			

			var result_tab = tab[0].url.search("gaana");
			// console.log('gaana'+result_tab);
			if(result_tab != -1){
				execute_code(TabId, '.playPause');
			}
			else{
				result_tab = tab[0].url.search("saavn");
				// console.log('saavn'+result_tab);
				if(result_tab != -1){
					if(tab[0].audible){
						execute_code(TabId, '#pause');
					}
					else{
						execute_code(TabId, '#play');
					}
				}
			}
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
