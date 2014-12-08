/*******

Until there is a message from the background asking if there should be an icon, nothing should be checked or reported (so if it changes, the changes get caught). At the moment this will just fire when the script is run, irrespective of whether it is even firing on the right tab.

And there is also no provision yet for talking to frames and finding out if they have longdescs. That's to be done soon.

*******/
console.log("started processing");

//if you need to report, then...
    var longdescs = document.querySelectorAll('img[longdesc]');

    if (longdescs.length) { //otherwise, fuggedaboudit
console.log((longdescs.length + " images found with longdesc attribute"));
//make a title message for the icon
      numberOfImages = document.querySelectorAll('img').length;
      iconTitle = longdescs.length + " images of " + numberOfImages + " have a long description";
      if (window.frames.length > 0) {
        iconTitle += ". There are also " + window.frames.length + " frames I haven't checked yet";
      }
//ask the background to show the default_icon
      chrome.extension.sendMessage({"type":"longdescPresent", "title": iconTitle}, function(response) {
          console.log(response);
      });
    }



// Build an individual object to send across, for an image.
// 
// parameter item is an element that has a longdesc (presumably img or frame, but can be anything)
// derive a title and max 100x100 thumbnail (or use defaults) and make an object representing it
// e.g. { "src": <a dataURL> ; title : <guess ;) > ; href: <the longdesc URL>}

  function buildDesc(item) {
    var tempObj = {};

//Get a thumbnail
    try {
      var imgData, canvas, ctx;
      var img = new Image();
      img.src = item.src;
      canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      ctx = canvas.getContext("2d"); ctx.drawImage(img, 0, 0);
// Set the image size to 100px with the original aspect ratio.
      if (canvas.width > canvas.height) {
        canvas.style.width = "100px";
        canvas.style.height = (img.height / img.width * 100) + "px";
      } else {
        canvas.style.height = "100px";
        canvas.style.width = (img.width / img.height * 100) + "px";
      } 
      tempObj.src = canvas.toDataURL();
console.log(tempObj.src);
    } catch(error) {
//Otherwise use a dummy icon
console.log( error + "Using dummy image");
      tempObj.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAAIXRFWHRTb2Z0d2FyZQBHcmFwaGljQ29udmVydGVyIChJbnRlbCl3h/oZAAABKUlEQVR4nOzX3Q2DIBAH8P8KruAKLOCDK7CCK7CCK7CCK/DiAF2BFVjBgk2qJHAekj40ck813P3Kx1VSrAMqYlhRVY+9fKuIHWkABTgzK6XM6yZgRkAI0fkUaW8AE+Tnq63ySVMxMMJ8Py9hEoXAhPPKpU9TRYBFr93xqEOeS+RlgTkMHDtnwuNSAoR9wxwDqTXQwFFRDuwV8TGULWFbpDzq/ZlEW8IBonDINQITCG3Qp06RCehsPQ8w2UbmAS7qiBuAJOo5gM3PnwfI3P5xgXND3gEWCJq/AiZyAgxA0MPXQDdWAulX4cOA/O+AB2iij1nARTwAcCP61H3CBvr4gioG9guOeqP9HNi6yiVsL4FOE+N/0AcNaEAD+MCAqhhQ+/f/DQAA//8DAOJ/aO3Iwa32AAAAAElFTkSuQmCC"
    }
//Get the link
    tempObj.href = item.longDesc;

//And here is your object
    return tempObj;
  }

  chrome.extension.onMessage.addListener(function(msg,sender,sendResponse) {
console.log(msg);


/*** If we aren't, top, pass the message up instead of to the popup. or should background pass it to all frames? Should be a synch step of getting reply from children ***/

    if (msg.msg == "Please send me the longdescs") {
      var descriptionList = [], j=1; //note this covers the repetition below too… :S
      if (top === window) { //make 'em and do it
        if (longdescs.length) { //if there are any we deal with them...

          for(var i=0;i<longdescs.length;i++) {
            var gather = {}, regather;
console.log(('Processing ' + i));
//Get a title
            var tempTitle = "unlabeled image " + j;
            if (longdescs[i].alt) {
              tempTitle = longdescs[i].alt;
            } else if (longdescs[i].title) {
              tempTitle = longdescs[i].title;
            } else j++;
            gather = buildDesc(longdescs[i]);
            gather.title = tempTitle;
            descriptionList.push(gather);
          }
        }
        sendResponse(descriptionList);
        return true;
      } else { //we're a frame. Pass the message up the line.
//take this repeated code and make a clean function.
        if (longdescs.length) { //if there are any we deal with them...

          for(var i=0;i<longdescs.length;i++) {
            var gather = {}, regather;
console.log(('Processing ' + i));
//Get a title
            var tempTitle = "unlabeled image " + j;
            if (longdescs[i].alt) {
              tempTitle = longdescs[i].alt;
            } else if (longdescs[i].title) {
              tempTitle = longdescs[i].title;
            } else j++;
            gather = buildDesc(longdescs[i]);
            gather.title = tempTitle;
            descriptionList.push(gather);

            parent.window.postMessage(gather,"*");
          }
        }
//send the message to the parent
        
      }
    } else { //if a frame sent the message, post the descriptions and say it's from a frame.
console.log(('some other message, from '+sender));
    }
  });





