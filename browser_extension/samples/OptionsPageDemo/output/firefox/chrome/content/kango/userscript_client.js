/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
OptionsPageDemo_kango.UserscriptEngineClient=function(){};OptionsPageDemo_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;OptionsPageDemo_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new OptionsPageDemo_kango.UserscriptApi(c);a.kango=OptionsPageDemo_kango;OptionsPageDemo_kango.lang.evalInSandbox(c,a,b)}catch(d){OptionsPageDemo_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};OptionsPageDemo_kango.UserscriptApi=function(){};
OptionsPageDemo_kango.UserscriptApi.prototype={};
