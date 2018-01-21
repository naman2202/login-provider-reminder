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
    localStorage.removeItem(domain);    
    document.getElementById("provider").innerHTML = "Not Set Yet";
  });
  getAll();
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
        document.getElementById("all").innerHTML = "<tr><th>Domain</th><th>Provider</th></tr>";
    for (; key = keys[i]; i++) {        
        document.getElementById("all").innerHTML += "<tr><td>"+key+"</td><td>"+localStorage.getItem(key)+"</td></tr>";
    }
}

getOne();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-112765846-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

document.getElementById("reset").onclick = function(){
  reset();
  _gaq.push(['_trackEvent', 'Reset', 'clicked']);
}

document.getElementById("getAll").onclick = function(){
  getAll();
  _gaq.push(['_trackEvent', 'Get All Data', 'clicked']);
}

