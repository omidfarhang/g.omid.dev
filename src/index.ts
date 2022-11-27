import { Router } from 'itty-router';

import PreviewHandler from './handlers/preview';
import QrHandler from './handlers/qrcode';
import ShortlinkHandler from './handlers/shortlink';
import ApiHandler from './handlers/api';


const router = Router();


router.get('/favicon.ico', () => Response.redirect('https://omid.dev/favicon.ico', 301))
	.get('/yourls-api.php', ApiHandler)
	.post('/yourls-api.php', ApiHandler)
	.get('/api', ApiHandler)
	.post('/api', ApiHandler)
	.get('/:id.png', QrHandler)
	.get('/:id\\~', PreviewHandler)
	.get('/:id', ShortlinkHandler)
	.get('/', () => Response.redirect('https://omid.dev', 302));

export default {
	async fetch(request: Request) {
					try {
									return handleRequest(request);
					} catch (e) {
									return new Response(`${e}`);
					}
	},
};

async function handleRequest(request: Request) {
	return router.handle(request)
}
