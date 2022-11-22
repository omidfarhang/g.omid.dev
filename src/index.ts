/* eslint-disable no-undef */

import { Router } from 'itty-router';
import PreviewHandler from './handlers/preview';
import QrHandler from './handlers/qrcode';
import ShortlinkHandler from './handlers/shortlink';
import YourlsHandler from './handlers/yourls';

const router = Router();


router.get('/favicon.ico', () => Response.redirect('https://omid.dev/favicon.ico', 301));
router.get('/yourls-api.php', YourlsHandler);
router.post('/yourls-api.php', YourlsHandler);
router.get('/:id.png', QrHandler);
router.get('/:id\\~', PreviewHandler);
router.get('/:id', ShortlinkHandler);
router.get('/', () => Response.redirect('https://omid.dev', 302));


addEventListener('fetch', event => {
	event.respondWith(router.handle(event.request));
});
