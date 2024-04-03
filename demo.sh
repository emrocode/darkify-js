#!/bin/bash
mkdir demo && cat > ./demo/index.html << EOF
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="text/javascript" src="../dist/darkify.min.js"></script>
    <title>Darkify &#x2014; Demo</title>
  </head>
  <style>
    .card,main{display:flex}*,::after,::before{margin:0;padding:0;box-sizing:border-box}:root{--pmcolor:#f1f0f9;--sdcolor:#fefefe;--ttcolor:#2e2e2e;--qncolor:#f5f5f5;--border-sm:0.25rem}:root:is([data-theme=dark]){--pmcolor:#2e2e2e;--sdcolor:#3b3b3b;--ttcolor:#e2e2e2;--qncolor:#484848}body,html{font-family:system-ui,sans-serif;font-size:100%;line-height:1.5;color:var(--ttcolor);background-color:var(--pmcolor)}main{width:90%;height:100vh;margin:0 auto;align-items:center;justify-content:center}button{font-family:inherit;font-size:inherit;cursor:pointer;border:none;background-color:transparent}.card,.card-button{border-radius:var(--border-sm)}.card{max-width:250px;flex-direction:column;row-gap:1.25rem;cursor:default;padding:1.25rem;background-color:var(--sdcolor);box-shadow:0 1px 2px 0 rgb(0 0 0 / .05)}.card-button{padding:.75rem;color:var(--ttcolor);background-color:var(--qncolor)}[data-theme=light] .card-button::before{content:'\0028🌞\0029';margin-right:.5rem}[data-theme=dark] .card-button::before{content:'\0028🌚\0029';margin-right:.5rem}
  </style>
  <body>
    <div id="root">
      <main>
        <div class="card">
          <div class="card-body">
            <h2 class="card-title">Darkify JS</h2>
            <p class="card-text">Create an easy dark mode for your site</p>
          </div>
          <button type="button" id="element" class="card-button">Toggle theme</button>
        </div>
      </main>
    </div>
    <script type="text/javascript">
      new Darkify('#element', { useSessionStorage: true });
    </script>
  </body>
</html>
EOF