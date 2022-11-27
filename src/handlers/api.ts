import CommonService from '../common.service';
import { commonError } from '../models/error';

const commonSrv = new CommonService();

const ApiHandler = async (request: any) => {
return await commonSrv.readRequestBody(request).then(async reqBody => {
	let action, signature, url, keyword, format = 'xml';
	if (request.method === 'POST') {
		reqBody = JSON.parse(reqBody);
		action = reqBody.action || null;
		signature = reqBody.signature || null;
		url = reqBody.url || null;
		keyword = reqBody.keyword || null;
		format = reqBody.format || 'xml';
	}
	if (request.method === 'GET') {
		const { searchParams } = new URL(request.url);
		action = searchParams.get('action');
		signature = searchParams.get('signature');
		url = searchParams.get('url');
		keyword = searchParams.get('keyword');
		format = searchParams.get('format') || 'xml';
	}

	if (signature === SECRET_SIGNATURE) {

	if ((action) === 'version') {
		const resp = {version: '2.0.0cf'};
		return commonSrv.responseHandler(resp, resp.version, format)
	}

	if (action === 'shorturl') {
		return await commonSrv.addNew(url, keyword).then(
			(data) => {
				return commonSrv.responseHandler(data, data.shorturl, format, data.statusCode)
			},
			(failed) => {
				return commonSrv.responseHandler(failed, failed.message, format, failed.errorCode)
			}
		);
	}
} else {
	const loginError: commonError = {
		message: 'Please Login',
		errorCode: 403,
		callback: ''
	}
	return commonSrv.responseHandler(loginError, loginError.message, format, loginError.errorCode)
}
})


};

export default ApiHandler;
