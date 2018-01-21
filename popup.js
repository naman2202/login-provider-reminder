function getOne() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {  
  var url = new URL(tabs[0].url);
  var domain = getDomain(url.host);
  document.getElementById("domain").innerHTML = domain;
  var provider = null;


  provider = localStorage[domain];
  if (provider == null) {
    provider = "Not Set Yet";
  }
  document.getElementById("domain").style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://logo.clearbit.com/"+domain+")";
  document.getElementById("provider").innerHTML = provider;
  });
}

function reset() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {  
    var url = new URL(tabs[0].url);
    var domain = getDomain(url.host);  
    var provider = null;
    localStorage[domain] = provider;
    document.getElementById("provider").innerHTML = "Not Set Yet";
  });
}

function getDomain(host) {
  var splitArr = host.split(".");
  var arrLen = splitArr.length;
  var domain = host;

  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];    
    if (splitArr[arrLen - 1].length == 2) {
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }

  return domain;
}

function getAll() {
    var archive = [],
        keys = Object.keys(localStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
        // archive.push( key + '=' + localStorage.getItem(key));
      document.body.innerHTML += key+" : "+localStorage.getItem(key)+"<br>";
    }
}

getOne();

document.getElementById("reset").click = function(){
  reset();
}

document.getElementById("getAll").click = function(){
  getAll();
}
