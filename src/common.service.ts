import { constants } from './constants';
import { commonError } from './models/error';
import { shorturlResponse } from './models/shorturl-response';
import { yourlsdb } from './old-db/yourls';

export default class CommonService {
	async readRequestBody(request: any) {
		const { headers } = request;
		const contentType = headers.get('content-type') || '';

		if (contentType.includes('application/json')) {
			return JSON.stringify(await request.json());
		} else if (contentType.includes('application/text')) {
			return request.text();
		} else if (contentType.includes('text/html')) {
			return request.text();
		} else if (contentType.includes('form')) {
			const formData = await request.formData();
			const body = {};
			for (const entry of formData.entries()) {
				body[entry[0]] = entry[1];
			}
			return JSON.stringify(body);
		}
	}

	randomShorturl() {
		let randomUrl = '';
		while (randomUrl.length < constants.random_shorturls_length) {
			const p = Math.floor(Math.random() * (constants.CHARSET.length + 1));
			randomUrl = randomUrl + constants.CHARSET.slice(p, p + 1);
		}
		return randomUrl;
	}

	async shortToLong(id: string) {
		const long = await SHORTLINKS.get(id, { cacheTtl: constants.CACHE_FOR });

		const yourls = yourlsdb.data.find((el) => el.keyword === id);
		if (long) {
			return long;
		}
		if (yourls && !long) {
			await SHORTLINKS.put(id, yourls.url);
			return yourls.url;
		} else {
			return false;
		}
	}

	async addNew(longUrl: string, keyword: string | null = null) {
		if (!longUrl) {
			return false;
		}
		if (!keyword) {
			keyword = this.randomShorturl();
		}

		return await this.shortToLong(keyword).then(async (found) => {
			if (found) {
				const resp: shorturlResponse = {
					errorCode: '400',
					code: 'error:url',
					message: longUrl + 'already exists in database (short URL: ' + constants.urlDomain + keyword + ')',
					status: 'fail',
					statusCode: 400,
					title: longUrl,
					shorturl: constants.urlDomain + keyword,
					url: {
						keyword: keyword?.toString() || '',
						title: longUrl,
						url: longUrl,
						ip: '',
						date: '',
					},
				};
				return resp;
			} else {
				return await SHORTLINKS.put(keyword, longUrl).then(
					() => {
						const resp: shorturlResponse = {
							errorCode: '',
							code: '',
							message: longUrl + ' added to database',
							status: 'success',
							statusCode: 200,
							title: longUrl,
							shorturl: constants.urlDomain + keyword,
							url: {
								keyword: keyword?.toString() || '',
								title: longUrl,
								url: longUrl,
								ip: '',
								date: '',
							},
						};
						return resp;
					},
					(error: string) => {
						const errorResp: commonError = {
							message: 'Something went wrong',
							errorCode: 400,
							callback: ''
						}
						return errorResp;
					}
				);
			}
		});
	}
}
