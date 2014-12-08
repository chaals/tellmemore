window.addEventListener("DOMContentLoaded", function() {
  var theBod = document.body;

  function processReplyList(response) {
console.log(response);  

      var theList = document.createElement('ol');
      for (i in response) {
      try{
//Create list items with a link,
        var theItem = document.createElement("li");
        var theLink = document.createElement('a');
        theLink.href = response[i].href;
        theLink.title = "(Long description: opens in a new window)";
//Thumbnail,
        theThumb = new Image();
        theThumb.src = response[i].src;
        theThumb.alt = "image: ";
        theThumb.style.maxWidth = theThumb.style.maxHeight = "100px";
//and label
        var theText = document.createTextNode(" " + response[i].title);

//And put it together as the content of the popup
        theLink.appendChild(theThumb);
        theLink.appendChild(theText);
        theItem.appendChild(theLink);
        theList.appendChild(theItem);
        }
      catch (e) {}
      }
    theBod.innerHTML = '<div style="max-height:500px;overflow-y:scroll">'+theList.outerHTML+"</div>"; //hack to let you scroll :(

//With nasty tricksy linkses because normal ones don't work in popupses ;(
    theBod.addEventListener("click",function(evt){
      if (evt.target.href) {
        window.open(evt.target.href);
      } else if (evt.target.parentElement.href) {
        window.open(evt.target.parentElement.href);
      }
    },false)

  }

  chrome.tabs.getSelected(function(theTab){
    chrome.tabs.sendMessage(theTab.id,{msg:"Please send me the longdescs"},
      processReplyList)
  });

},false);