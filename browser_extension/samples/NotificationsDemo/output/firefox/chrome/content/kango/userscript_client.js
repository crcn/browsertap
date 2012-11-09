/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
NotificationsDemo_kango.UserscriptEngineClient=function(){};NotificationsDemo_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;NotificationsDemo_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new NotificationsDemo_kango.UserscriptApi(c);a.kango=NotificationsDemo_kango;NotificationsDemo_kango.lang.evalInSandbox(c,a,b)}catch(d){NotificationsDemo_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};NotificationsDemo_kango.UserscriptApi=function(){};
NotificationsDemo_kango.UserscriptApi.prototype={};
