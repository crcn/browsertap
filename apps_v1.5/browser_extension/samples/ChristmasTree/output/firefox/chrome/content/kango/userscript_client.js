/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
ChristmasTree_kango.UserscriptEngineClient=function(){};ChristmasTree_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;ChristmasTree_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new ChristmasTree_kango.UserscriptApi(c);a.kango=ChristmasTree_kango;ChristmasTree_kango.lang.evalInSandbox(c,a,b)}catch(d){ChristmasTree_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};ChristmasTree_kango.UserscriptApi=function(){};
ChristmasTree_kango.UserscriptApi.prototype={};
