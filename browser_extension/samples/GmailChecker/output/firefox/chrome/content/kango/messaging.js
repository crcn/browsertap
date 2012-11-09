/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
GmailnChecker_kango.MessageRouter=function(){};GmailnChecker_kango.MessageRouter.prototype={_onMessage:function(a){this.onmessage(a)},onmessage:function(){},dispatchMessage:function(a,b){var c={name:a,data:b,origin:"background",target:GmailnChecker_kango,source:GmailnChecker_kango},d=this;window.setTimeout(function(){d.onmessage(c)},1);return!0}};
