kango.IO=function(){};kango.IO.prototype=kango.oop.extend(kango.IOBase,{getExtensionFileUrl:function(a){return"chrome://kango/content/"+a},getResourceUrl:function(a){return"resource://kango/"+a}});kango.io=new kango.IO;
