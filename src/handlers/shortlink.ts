import Mustache from "mustache";
import CommonService from "../common.service";
import { tmpl404 } from "../views/invalid";

const commonSrv = new CommonService();

const ShortlinkHandler = async (request: any) => {
	const [id, addon] = decodeURIComponent(request.params.id).split(':');

	const long = await commonSrv.shortToLong(id);

	if (!long) {
		const html = Mustache.render(tmpl404, { id });
		return new Response(html, {
			headers: { 'content-type': 'text/html;charset=UTF-8' },
			status: 404,
		});
	} else {
		return Response.redirect(addon ? long + '#' + addon : long, 302);
	}
};

export default ShortlinkHandler;
