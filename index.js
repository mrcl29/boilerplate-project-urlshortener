require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

function esFormatoURL(str) {
  const regex = /^https?:\/\/(www\.)?[a-z0-9-]+(\.[a-z]{2,})+.*$/i;
  return regex.test(str);
}

let saved_urls = {}
let num = 0;

app.post('/api/shorturl', function(req, res) {
  let url = req.body.url
  if (!url){
    return res.json({ error: 'invalid url' });
  }

  if (!esFormatoURL(url)){
    for (let clave in saved_urls) {
      if(clave.toString() == url.toString()){
        return res.redirect(saved_urls[clave]);
      }
    }
    return res.json({ error: 'invalid url' });
  }

  num = num + 1;
  saved_urls[num] = url.toString();
  return res.json({ original_url : url.toString(), short_url : num });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short = req.params.short_url;
  const originalUrl = saved_urls[short];
  
  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
