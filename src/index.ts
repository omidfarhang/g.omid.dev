import { Router } from 'itty-router';

import PreviewHandler from './handlers/preview';
import QrHandler from './handlers/qrcode';
import ShortlinkHandler from './handlers/shortlink';
import YourlsHandler from './handlers/yourls';


const router = Router();


router.get('/favicon.ico', () => Response.redirect('https://omid.dev/favicon.ico', 301))
	.get('/yourls-api.php', YourlsHandler)
	.post('/yourls-api.php', YourlsHandler)
	.get('/:id.png', QrHandler)
	.get('/:id\\~', PreviewHandler)
	.get('/:id', ShortlinkHandler)
	.get('/', () => Response.redirect('https://omid.dev', 302));


addEventListener('fetch', event => {
	event.respondWith(router.handle(event.request));
});
