import CommonService from '../common.service';
import { commonError } from '../models/error';
import { D1QB } from 'workers-qb'
import { yourlsdb } from '../old-db/yourls';

const qb = new D1QB(DB)
const commonSrv = new CommonService();

const YourlsHandler = async (request: any) => {
	yourlsdb.data.forEach(async element => {
		await qb.insert({
			tableName: 'urls',
			data: {
				keyword: element.keyword,
				url: element.url,
				title: element.title,
				timestamp: element.timestamp,
				ip: element.ip,
				clicks: element.clicks
			},
			returning: '*',
	})
	});

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
		if(format === 'simple') {
			return commonSrv.responseHandler(resp.version, format)
		} else {
			return commonSrv.responseHandler(resp, format)
		}
	}

	if (action === 'shorturl') {
		return await commonSrv.addNew(url, keyword).then(
			(data) => {
				if(format === 'simple') {
					return commonSrv.responseHandler(data.shorturl, format, data.statusCode)
				} else {
					return commonSrv.responseHandler(data, format, data.statusCode)
				}
			},
			(failed) => failed
		);
	}
} else {
	const loginError: commonError = {
		message: 'Please Login',
		errorCode: 403,
		callback: ''
	}

	if(format === 'simple') {
		return commonSrv.responseHandler(loginError.message, format, loginError.errorCode)
	} else {
		return commonSrv.responseHandler(loginError, format, loginError.errorCode)
	}
}
})


};

export default YourlsHandler;
