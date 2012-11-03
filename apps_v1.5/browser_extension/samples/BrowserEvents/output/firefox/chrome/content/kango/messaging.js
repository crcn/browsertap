/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.MessageRouter=function(){};BrowserEvents_kango.MessageRouter.prototype={_onMessage:function(a){this.onmessage(a)},onmessage:function(){},dispatchMessage:function(a,b){var c={name:a,data:b,origin:"background",target:BrowserEvents_kango,source:BrowserEvents_kango},d=this;window.setTimeout(function(){d.onmessage(c)},1);return!0}};
