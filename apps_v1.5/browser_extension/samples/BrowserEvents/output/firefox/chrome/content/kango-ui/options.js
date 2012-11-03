/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.ui.OptionsPage=function(){var a=BrowserEvents_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=BrowserEvents_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();BrowserEvents_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=BrowserEvents_kango)})}};
BrowserEvents_kango.ui.OptionsPage.prototype=BrowserEvents_kango.oop.extend(BrowserEvents_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);BrowserEvents_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});BrowserEvents_kango.ui.optionsPage=new BrowserEvents_kango.ui.OptionsPage;
