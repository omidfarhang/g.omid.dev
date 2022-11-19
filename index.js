/* eslint-disable no-undef */

import { Router } from 'itty-router';
import qr from 'qr-image';
import Mustache from 'mustache';
import * as yourlsUrl from './old-db/yourls.json';

const CACHE_FOR = 3600;

const router = Router();

router.get('/', () => Response.redirect('https://omid.dev', 302));

router.get('/favicon.ico', () => Response.redirect('https://omid.dev/favicon.ico', 301));

router.get('/:id.png', request => {
	const id = decodeURIComponent(request.params.id);
	const host = request.headers.get('Host');
	const image = qr.imageSync(`https://${host}/${id}`, {
		margin: 2,
		size: 6,
	});
	return new Response(image, { headers: { 'Content-Type': 'image/png' } });
});

router.get('/:id\\~', async request => {
	let [id, addon] = decodeURIComponent(request.params.id).split(':');
	id = id.replaceAll('-', '').toLowerCase();
	const long = await SHORTLINKS.get(id, { cacheTtl: CACHE_FOR });
	let html, status;

	if (!long) {
		html = await (await fetch('https://g.omid.dev/invalid.html')).text();
		html = Mustache.render(html, { id });
		status = 404;
	} else {
		const { hostname } = new URL(long);
		html = await (await fetch('https://g.omid.dev/preview.html')).text();
		html = Mustache.render(html, {
			hostname,
			id: addon ? id + ':' + addon : id,
			long: addon ? long + '#' + addon : long,
		});
		status = 200;
	}

	return new Response(html, {
		headers: { 'content-type': 'text/html;charset=UTF-8' },
		status,
	});
});

router.get('/:id', async request => {
	const [id, addon] = decodeURIComponent(request.params.id).split(':');
	const long = await SHORTLINKS.get(id, { cacheTtl: CACHE_FOR });

	const yourls = yourlsUrl.data.find(el => el.keyword === id);

	if (!long && !yourls) {
		let html = await (await fetch('https://g.omid.dev/invalid.html')).text();
		html = Mustache.render(html, { id });
		return new Response(html, {
			headers: { 'content-type': 'text/html;charset=UTF-8' },
			status: 404,
		});
	} else {
		if(long) {
			return Response.redirect(addon ? long + '#' + addon : long, 302);
		}
		if (yourls) {
			return Response.redirect(addon ? long + '#' + addon : yourls.url, 302);
		}
	}
});

router.all('*', () =>
	Response.redirect('https://omid.dev', 302),
);

addEventListener('fetch', event => {
	event.respondWith(router.handle(event.request));
});
