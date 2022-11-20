/* eslint-disable no-undef */

import { Router } from 'itty-router';
import qr from 'qr-image';
import Mustache from 'mustache';
import * as yourlsUrl from './old-db/yourls.json';

const CACHE_FOR = 3600;

const router = Router();

async function shortToLong(id) {
	const long = await SHORTLINKS.get(id, { cacheTtl: CACHE_FOR });

	const yourls = yourlsUrl.data.find(el => el.keyword === id);
	if (long) {
		return long;
	}
	if (yourls && !long) {
		await SHORTLINKS.put(id, yourls.url);
		return yourls.url;
	}
}

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
	const [id, addon] = decodeURIComponent(request.params.id).split(':');
	const long = await shortToLong(id);
	let html, status;

	if (!long) {
		html = Mustache.render(tmpl404, { id });
		status = 404;
	} else {
		const { hostname } = new URL(long);
		html = Mustache.render(tmplPreview, {
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

	const long = await shortToLong(id);

	if (!long) {
		const html = Mustache.render(tmpl404, { id });
		return new Response(html, {
			headers: { 'content-type': 'text/html;charset=UTF-8' },
			status: 404,
		});
	} else {
		return Response.redirect(addon ? long + '#' + addon : long, 302);
	}
});

router.get('/', () => Response.redirect('https://omid.dev', 302));

router.all('*', () =>
	Response.redirect('https://omid.dev', 302),
);

addEventListener('fetch', event => {
	event.respondWith(router.handle(event.request));
});


const tmpl404 = `
<!DOCTYPE html>
<html>
<head>
<title>Error • eartharoid:go</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.8.1/darkly/bulmaswatch.min.css">
<link rel="icon" href="/favicon.ico" type="image/icon">
<link rel="icon" href="https://eartharoid.me/favicon.ico" type="image/icon">
</head>
<body>
<section class="section">
<container class="container box has-text-centered" style="max-width:500px;">
<img class="block" src="https://img.eartharoid.me/insecure/plain/s3://eartharoid/eartharoid/logo/c/wordmark-with-blur.png@webp" style="max-width:300px;margin-top:1em;">
<div class="content">
<h6 class="is-uppercase">Error</h6>
<p>
<b>
No links exist with the name
<br>
<span class="tag is-primary is-family-code">{{id}}</span>
</b>
</p>
<p>
Check your spelling and try again.
</p>
</div>
</container>
</section>
</body>
</html>`;

const tmplPreview = `<!DOCTYPE html>
<html>
<head>
<title>Link Preview • eartharoid:go</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="theme-color" content="#00FFFF">
<meta name="title" content="Link Preview">
<meta name="og:title" content="Link Preview" />
<meta name="og:site_name" content="eartharoid:go" />
<meta name="description" content="Link preview for {{id}}">
<meta name="og:description" content="Link preview for {{id}}" />
<meta name="url" content="/{{id}}~">
<meta name="og:url" content="/{{id}}~" />
<meta name="og:image" content="https://img.eartharoid.me/insecure/plain/s3://eartharoid/eartharoid/logo/c/icon.png@webp" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.8.1/darkly/bulmaswatch.min.css">
<link rel="icon" href="/favicon.ico" type="image/icon">
<link rel="icon" href="https://eartharoid.me/favicon.ico" type="image/icon">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
</head>
<body>
<section class="section">
<container class="container box has-text-centered" style="max-width:500px;">
<img class="block" src="https://img.eartharoid.me/insecure/plain/s3://eartharoid/eartharoid/logo/c/wordmark-with-blur.png@webp" style="max-width:300px;margin-top:1em;">
<div class="content">
<h6 class="is-uppercase">Link Preview</h6>
<img src="/{{id}}.png" width="150px" height="auto" style="padding:1em;" />
<p>
<b><span class="tag is-primary is-family-code">{{id}}</span></b>
<br>
<b>redirects to</b>
<br>
<a href="{{long}}">{{long}}</a>
</p>
</div>
<div class="buttons is-centered" style="margin-bottom:1em;">
<a href="{{long}}" id="QR" class="button is-info">
<span>Continue to {{hostname}}</span>
<span class="icon">
<i class="fas fa-chevron-right"></i>
</span>
</a>
</div>
</container>
</section>
</body>
</html>`;
