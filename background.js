var fromId;

function handleMessages(request, sender, sendResponse) {
console.log(request);
  fromId = sender.tab.id;
  if (request.type == "longdescPresent") {
    chrome.pageAction.show(fromId);
    chrome.pageAction.setTitle({"tabId":fromId,"title":request.title});
    console.log("Showed icon");
    console.log(("from tab " + sender.tab.id));
  } else {
    console.log(("Some message from tab " + sender.tab.id));
  }
  //huh. we never reach here? or what's happening?
  sendResponse("hello, got your call");
  return true;
}

chrome.extension.onMessage.addListener(handleMessages);

