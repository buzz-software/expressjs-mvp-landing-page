


const panel = [{name: "Leads", link: "/leads"}, {name: "Plans", link: "/plans"}];



exports.panelLinks = function(req, res, next) {
	req.panel = panel;
	next();
}