import Mustache from 'mustache';
import CommonService from '../common.service';
import { tmpl404 } from '../views/invalid';
import { tmplPreview } from '../views/preview';

const commonSrv = new CommonService();

const YourlsHandler = async (request: any) => {
return await commonSrv.readRequestBody(request).then(async reqBody => {
	let action, signature, url, keyword;
	if (request.method === 'POST') {
		reqBody = JSON.parse(reqBody);
		action = reqBody.action || null;
		signature = reqBody.signature || null;
		url = reqBody.url || null;
		keyword = reqBody.keyword || null;
	}
	if (request.method === 'GET') {
		const { searchParams } = new URL(request.url);
		action = searchParams.get('action');
		signature = searchParams.get('signature');
		url = searchParams.get('url');
		keyword = searchParams.get('keyword');
	}

	if ((action) === 'version') {
		const resp = '2.0.0cf';
		return new Response(resp, {
			headers: { 'Content-Type': 'text/html;charset=UTF-8' },
		});
	}

	if (action === 'shorturl') {
		if (signature === SECRET_SIGNATURE) {
			return await commonSrv.addNew(url, keyword).then(
				(data) => data,
				(failed) => failed
			);
		} else {
			return new Response('Invalid Secret', { status: 403 });
		}
	}

	return new Response(reqBody, {
		headers: { 'Content-Type': 'text/html;charset=UTF-8' },
	});

})


};

export default YourlsHandler;
