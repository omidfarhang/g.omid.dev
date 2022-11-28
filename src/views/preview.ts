export const tmplPreview = `<!DOCTYPE html>
<html>
<head>
<title>Link Preview • go.omid.dev</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="theme-color" content="#00FFFF">
<meta name="title" content="Link Preview">
<meta name="og:title" content="Link Preview" />
<meta name="og:site_name" content="go.omid.dev" />
<meta name="description" content="Link preview for {{id}}">
<meta name="og:description" content="Link preview for {{id}}" />
<meta name="url" content="/{{id}}~">
<meta name="og:url" content="/{{id}}~" />
<meta name="og:image" content="https://omid.dev/assets/images/2019/01/16583454_210922376050059_7816295726543011840_n-1-300x300.jpg" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.8.1/sandstone/bulmaswatch.min.css">
<link rel="icon" href="/favicon.ico" type="image/icon">
<link rel="icon" href="https://omid.dev/assets/logo/favicon.ico" type="image/icon">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
</head>
<body>
<section class="section">
<container class="container box has-text-centered" style="max-width:500px;">
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
