import Mustache from 'mustache';
import CommonService from '../common.service';
import { tmpl404 } from '../views/invalid';
import { tmplPreview } from '../views/preview';

const commonSrv = new CommonService();

const YourlsHandler = async (request: any) => {
	const reqBody = await commonSrv.readRequestBody(request);
		const { searchParams } = new URL(request.url);
		const action = searchParams.get('action') || reqBody.action;
		const signature = searchParams.get('signature') || reqBody.signature;
		const url = searchParams.get('url') || reqBody.url;
		const keyword = searchParams.get('keyword') || reqBody.keyword;

	if (action === 'version') {
		const resp = '2.0.0cf';
		return new Response(resp, {
			headers: { 'Content-Type': 'text/html;charset=UTF-8' },
		});
	}

	if (action === 'shortlink') {
		if (signature === SECRET_SIGNATURE) {
			return await commonSrv.addNew(url, keyword).then(
				(data) => data,
				(failed) => failed
			);
		} else {
			return new Response('Invalid Secret', { status: 403 });
		}
	}

	return new Response(action, {
		headers: { 'Content-Type': 'text/html;charset=UTF-8' },
	});
};

export default YourlsHandler;
