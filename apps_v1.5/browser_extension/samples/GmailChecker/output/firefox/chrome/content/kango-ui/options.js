/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
GmailnChecker_kango.ui.OptionsPage=function(){var a=GmailnChecker_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=GmailnChecker_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();GmailnChecker_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=GmailnChecker_kango)})}};
GmailnChecker_kango.ui.OptionsPage.prototype=GmailnChecker_kango.oop.extend(GmailnChecker_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);GmailnChecker_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});GmailnChecker_kango.ui.optionsPage=new GmailnChecker_kango.ui.OptionsPage;
