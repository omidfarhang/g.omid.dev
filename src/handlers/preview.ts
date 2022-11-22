import Mustache from "mustache";
import CommonService from "../common.service";
import { tmpl404 } from "../views/invalid";
import { tmplPreview } from "../views/preview";

const commonSrv = new CommonService();

const PreviewHandler = async (request: any) => {
	const [id, addon] = decodeURIComponent(request.params.id).split(':');
	const long = await commonSrv.shortToLong(id);
	let html, status;

	if (!long) {
		html = Mustache.render(tmpl404, { id });
		status = 404;
	} else {
		const { hostname } = new URL(long);
		html = Mustache.render(tmplPreview, {
			hostname,
			id: addon ? id + ':' + addon : id,
			long: addon ? long + '#' + addon : long,
		});
		status = 200;
	}

	return new Response(html, {
		headers: { 'content-type': 'text/html;charset=UTF-8' },
		status,
	});
};

export default PreviewHandler;
