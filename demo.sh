#!/bin/bash
mkdir demo && cat > ./demo/index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="text/javascript" src="../dist/darkify.min.js"></script>
    <title>Darkify &#x2014; Demo</title>
  </head>
  <body>
    <div id="root">
      <button type="button" id="element">Button</button>
    </div>
    <script type="text/javascript">
      new Darkify("#element", { useSessionStorage: true });
    </script>
  </body>
</html>
EOF