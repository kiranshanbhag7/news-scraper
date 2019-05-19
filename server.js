var compression = require('compression');
var express = require('express');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
var expressSanitizer = require('express-sanitizer');
var fs = require('fs');
var newsScrapper = require('./index');

var app = express();

app.use(compression());
app.use(bodyParser.json({limit: '1mb'}));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(expressSanitizer());
app.use(express.static('./src/dist'));

app.disable('x-powered-by');
app.use(cookieParser());

app.get('/health-check', function (req, res) {
  res.send({
    "status": "SUCCESS"
  });
});

app.get('/api/v1/news/list', (req, res) => {
  const newsInfo = newsScrapper.getNewsList();
  res.status(200).json({
    newsList: newsInfo.newsData,
    lastUpdatedAt: newsInfo.lastUpdatedAt,
    status: 'SUCCESS'
  })
});

app.get('/*', function (req, res) {
    const indexHtml = fs.readFileSync('./src/dist/index.html');
    res.send(indexHtml.toString());
});

function serverStartedCB() {
  console.log('Server started listening on port 3000');
}

app.listen(3000, serverStartedCB("http://"));

