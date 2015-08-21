/**
 */

module.exports = function(app) {
  document.body.addEventListener("click", function(event) {
    var nodeName = event.target.nodeName;
    if (!/a/i.test(nodeName) || event.ctrlKey) return;
    var href = event.target.getAttribute("href");
    if (/:\/\//.test(href)) return;
    app.router.redirect(href);
    event.preventDefault();
  });
}