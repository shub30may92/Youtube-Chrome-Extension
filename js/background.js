chrome.commands.getAll(function(commands){
  console.log(commands)
})


chrome.commands.onCommand.addListener(function(command) {
  console.log('onCommand event received for message: ', command);
  var TabId = 0;
  chrome.tabs.query({'url':'*://www.youtube.com/watch*'},function(tab){
      // console.log(tab[0].url);
      TabId = tab[0].id;
      if(command == "play_pause"){
	      chrome.tabs.executeScript(TabId,{
	        code: "document.querySelector('.ytp-play-button').click();"
	      });
	  }
	  if(command == "play_next"){
	      chrome.tabs.executeScript(TabId,{
	        code: "document.querySelector('.ytp-next-button').click();"
	      });
	  }
	  if(command == "play_previous"){
	      chrome.tabs.executeScript(TabId,{
	        code: "document.querySelector('.ytp-prev-button').click();"
	      });
	  }
  });
});