var nav = new NavigationCollector();
var tempHost = "https://www.null.com";
chrome.webNavigation.onBeforeNavigate.addListener(function(e) {    
        if (e.url.match("oauth")) {          
          var url = new URL(e.url);
          var host = "Null";
          var flag = -1;
          var provider = "";
          tempHost = "https://www.null.com";
          
          if (e.url.match('accounts.google.com/signin/oauth')) {
            provider = "Google"
            host = new URL(url.searchParams.get("destination"));
            flag = 1;
          }

          else
          if ((e.url.match(/facebook\.com\/(v\d\d?.\d\d?\/)?dialog\/oauth/))||(e.url.match('facebook.com/login'))) {            
            provider = "Facebook"
            flag = 1;
            key = url.searchParams.get("app_id");
            if (key == null) {
              key = url.searchParams.get("client_id");
              if (key == null) {
                key = url.searchParams.get("api_key"); 
              }
            }            
            facebookHost(key);
            host = new URL(tempHost);            
          }
          else {}
          
          if (flag) {            
            domain = getDomain(host.host);            
            localStorage[domain] = provider;
            // alert("Logging in to "+domain+" using "+provider);            
          }
        }
});

function facebookHost(api_key) {
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