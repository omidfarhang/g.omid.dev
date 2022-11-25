import Mustache from 'mustache';
import xml2js from 'xml2js';
import CommonService from '../common.service';
import { commonError } from '../models/error';
import { tmpl404 } from '../views/invalid';
import { tmplPreview } from '../views/preview';


const commonSrv = new CommonService();
const xmlbuilder = new xml2js.Builder();

const YourlsHandler = async (request: any) => {
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
		if(format === 'json') {
			return new Response(JSON.stringify(resp), { headers: { 'Content-Type': 'application/json;charset=UTF-8' },});
		}
		if(format === 'jsonp') {
			return new Response('('+JSON.stringify(resp)+')', { headers: { 'Content-Type': 'application/javascript;charset=UTF-8' },});
		}
		if(format === 'xml') {
			return new Response(xmlbuilder.buildObject(resp), { headers: {'content-type': 'application/xml;charset=utf-8'},});
		}
		if(format === 'simple') {
			return new Response(resp.version, { headers: { 'Content-Type': 'text/html;charset=UTF-8' },});
		}
	}

	if (action === 'shorturl') {
		return await commonSrv.addNew(url, keyword).then(
			(data) => {
				if(format === 'json') {
					return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json;charset=UTF-8' }, status: data.statusCode});
				}
				if(format === 'jsonp') {
					return new Response('('+JSON.stringify(data)+')', { headers: { 'Content-Type': 'application/javascript;charset=UTF-8' }, status: data.statusCode});
				}
				if(format === 'xml') {
					return new Response(xmlbuilder.buildObject(data), { headers: {'content-type': 'application/xml;charset=utf-8'}, status: data.statusCode});
				}
				if(format === 'simple') {
					return new Response(data.shorturl, { headers: { 'Content-Type': 'text/html;charset=UTF-8' }, status: data.statusCode});
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
	if(format === 'json') {
		return new Response(JSON.stringify(loginError), { headers: { 'Content-Type': 'application/json;charset=UTF-8' }, status: loginError.errorCode});
	}
	if(format === 'jsonp') {
		return new Response('('+JSON.stringify(loginError)+')', { headers: { 'Content-Type': 'application/javascript;charset=UTF-8' }, status: loginError.errorCode});
	}
	if(format === 'xml') {
		return new Response(xmlbuilder.buildObject(loginError), { headers: {'content-type': 'application/xml;charset=utf-8'}, status: loginError.errorCode});
	}
	if(format === 'simple') {
		return new Response(loginError.message, { headers: { 'Content-Type': 'text/html;charset=UTF-8' }, status: loginError.errorCode});
	}
}
})


};

export default YourlsHandler;
