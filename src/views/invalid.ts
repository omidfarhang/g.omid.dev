export const tmpl404 = `
<!DOCTYPE html>
<html>
<head>
<title>Error • g.omid.dev</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.8.1/sandstone/bulmaswatch.min.css">
<link rel="icon" href="https://omid.dev/assets/logo/favicon.ico" type="image/icon">
</head>
<body>
<section class="section">
<container class="container box has-text-centered" style="max-width:500px;">
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
