exports.urlPath = function(url)
{
	return url.indexOf('://') > -1 ? url.split('/').slice(3).join('/') : url;
}