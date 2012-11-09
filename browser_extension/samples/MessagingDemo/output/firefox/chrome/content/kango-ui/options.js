/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
MessagingDemo_kango.ui.OptionsPage=function(){var a=MessagingDemo_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=MessagingDemo_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();MessagingDemo_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=MessagingDemo_kango)})}};
MessagingDemo_kango.ui.OptionsPage.prototype=MessagingDemo_kango.oop.extend(MessagingDemo_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);MessagingDemo_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});MessagingDemo_kango.ui.optionsPage=new MessagingDemo_kango.ui.OptionsPage;
