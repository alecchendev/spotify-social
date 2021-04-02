
export function getQueryParams() {
	var queryParams = {};
	var e, r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.search.substring(1); // search is hard-coded for my situation
	while ( e = r.exec(q)) {
		 queryParams[e[1]] = decodeURIComponent(e[2]);
	}
	return queryParams;
}