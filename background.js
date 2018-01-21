var nav = new NavigationCollector();
var tempHost = "https://www.null.com";
var fbRegex = new RegExp(/facebook\.com\/(v\d\d?.\d\d?\/)?dialog\/oauth/);

chrome.webNavigation.onBeforeNavigate.addListener(function(e) {
  var navUrl = null;
  var tempUrl = e.url;
  var cont = true;
  tempHost = "";

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {  
    navUrl = tabs[0].url;    
    if (navUrl.match("oauth")) {    
      if (navUrl.match(fbRegex)||navUrl.match('facebook.com/login')) {
        var url = new URL(navUrl);
        cont = false;
        getFbHost(getFbKey(url));
        setProvider(new URL(tempHost), "Facebook");
      }
    }
  });

  if (cont&&tempUrl.match("oauth")) {
    var url = new URL(tempUrl);
          
    if (tempUrl.match('accounts.google.com/signin/oauth')) {
      setProvider(new URL(url.searchParams.get("destination")), "Google");
    }

    else if(tempUrl.match(/google.com\/o\/oauth2\/auth/)) {
      alert(tempUrl);
      setProvider(new URL(url.searchParams.get("ss_domain")), "Google");
    }

    else if((tempUrl.match(fbRegex))||(tempUrl.match('facebook.com/login'))) {      
      key = getFbKey(url);
      getFbHost(key);
      setProvider(new URL(tempHost), "Facebook");
    }

    else {}
  }
});

function getFbKey(url) {
  var key = url.searchParams.get("app_id");
  if (key == null) {
    key = url.searchParams.get("client_id");
    if (key == null) {
      key = url.searchParams.get("api_key");
    }
  }
  return key;
}

function setProvider(domainURL, provider){
  domain = getDomain(domainURL.host);
  localStorage[domain] = provider;
  alert("Logging in to "+domain+" using "+provider);
}

function getFbHost(api_key) {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://graph.facebook.com/"+api_key;

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myArr = JSON.parse(this.responseText);
      if (myArr != null && myArr != undefined) {        
        tempHost = myArr.link;
      }          
    }
  };
  xmlhttp.open("GET", url, false);
  xmlhttp.send();  
}


function getDomain(host) {
  var splitArr = host.split(".");
  var arrLen = splitArr.length;
  var domain = host;

  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 1].length == 2) {
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }
  return domain;
}