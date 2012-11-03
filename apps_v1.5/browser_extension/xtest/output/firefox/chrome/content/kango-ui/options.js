/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserTap_kango.ui.OptionsPage=function(){var a=BrowserTap_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=BrowserTap_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();BrowserTap_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=BrowserTap_kango)})}};
BrowserTap_kango.ui.OptionsPage.prototype=BrowserTap_kango.oop.extend(BrowserTap_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);BrowserTap_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});BrowserTap_kango.ui.optionsPage=new BrowserTap_kango.ui.OptionsPage;
