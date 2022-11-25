export interface shorturlResponse {
	status: string;
	code: string;
	message: string;
	errorCode: string;
	statusCode: number;
	url: {
		keyword: string;
		url: string;
		title: string;
		date: string;
		ip: string;
	};
	title: string;
	shorturl: string;
}
