var n_dark_themes = 1;
var link = document.getElementById("dark-mode");
var head = document.documentElement || document.head || document.querySelector("head");

var hostname = function (url) {
  url = url.replace("www.", '');
  var s = url.indexOf("//") + 2;
  if (s > 1) {
    var o = url.indexOf('/', s);
    if (o > 0) return url.substring(s, o);
    else {
      o = url.indexOf('?', s);
      if (o > 0) return url.substring(s, o);
      else return url.substring(s);
    }
  } else return url;
};

var custom = {
  "ebay": ".ebay.com",
  "yahoo": "www.yahoo.",
  "twitch": ".twitch.tv",
  "github": "github.com",
  "docs": "docs.google.",
  "bing": "www.bing.com",
  "amazon": "www.amazon.",
  "gmail": "mail.google.",
  "tumblr": "www.tumblr.",
  "twitter": "twitter.com",
  "inbox": "inbox.google.",
  "drive": "drive.google.",
  "sites": "sites.google.",
  "youtube": "www.youtube.",
  "dropbox": "www.dropbox.",
  "reddit": "www.reddit.com",
  "maps": ".google.com/maps/",
  "facebook": "www.facebook.",
  "wikipedia": "wikipedia.org",
  "instagram": "www.instagram.",
  "duckduckgo": "duckduckgo.com",
  "stackoverflow": "stackoverflow.com",
  "vimeo":"vimeo.com",
  "liveleak":"liveleak.com",
  "dailymotion":"dailymotion.com",
  "nytimes":"nytimes.com",
  "aljazeera":"aljazeera.com",
  "microsoft":"microsoft.com",
  "analytics":"analytics.google.",
  "chicagotribune":"chicagotribune.com",
  "newsday":"newsday.com",
  "khanacademy":"khanacademy.org",
  "schoology":"schoology.com",
  "pinterest":".pinterest.com"
};

var fill = function () {
  chrome.storage.local.get({"whitelist": [], "state": "OFF", "custom": ''}, function (e) {
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("type", "text/css");
      link.setAttribute("id", "dark-mode");
      link.setAttribute("rel", "stylesheet");
      if (head) head.appendChild(link);
    }
    document.getElementById('whitelist').value = e.whitelist.join(', ');
    //link.setAttribute("href", href);
  });
};

var handle = function () {
  var id = this.id, checked = this.checked;
  if (id.indexOf("dark_") !== -1) {
    for (var i = 1; i <= n_dark_themes; i++) document.getElementById('dark_'+i).checked = false;
    document.getElementById(id).checked = checked;
  }
  /*  */
  var tmp = {};
  for (var name in custom) tmp[name] = document.getElementById(name).checked;
  for (var i = 1; i <= n_dark_themes; i++) tmp['dark_'+i] = document.getElementById('dark_'+i).checked;
  chrome.storage.local.set(tmp, function () {});
};

var restore = function () {
  var tmp = {};
  for (var name in custom) tmp[name] = true;
  document.removeEventListener('DOMContentLoaded', restore, false);
  for (var i = 1; i <= n_dark_themes; i++) tmp['dark_'+i] = false;
  tmp["dark_1"] = true;
  chrome.storage.local.get(tmp, function (e) {
    for (var name in custom) document.getElementById(name).checked = e[name];
    for (var i = 1; i <= n_dark_themes; i++) document.getElementById('dark_'+i).checked = e['dark_'+i];
  });
};

var load = function () {
  fill();
  window.removeEventListener("load", load, false);
  for (var name in custom) document.getElementById(name).addEventListener('click', handle);
  for (var i = 1; i <= n_dark_themes; i++) document.getElementById('dark_'+i).addEventListener('click', handle);
  document.getElementById('whitelist').addEventListener("change", function () {
    var whitelist_tmp = [];
    var whitelist = document.getElementById('whitelist').value || '';
    var hosts = whitelist.split(/\s*\,\s*/);
    for (var i = 0; i < hosts.length; i++) whitelist_tmp.push(hostname(hosts[i]));
    whitelist_tmp = whitelist_tmp.filter(function (element, index, array) {return element && array.indexOf(element) === index});
    chrome.storage.local.set({"whitelist": whitelist_tmp}, function () {});
  });
};

chrome.storage.onChanged.addListener(fill);
window.addEventListener("load", load, false);
document.addEventListener('DOMContentLoaded', restore, false);
