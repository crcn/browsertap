/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
PopupDemo_kango.UserscriptEngineClient=function(){};PopupDemo_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;PopupDemo_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new PopupDemo_kango.UserscriptApi(c);a.kango=PopupDemo_kango;PopupDemo_kango.lang.evalInSandbox(c,a,b)}catch(d){PopupDemo_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};PopupDemo_kango.UserscriptApi=function(){};
PopupDemo_kango.UserscriptApi.prototype={};
