const axios = require('axios');
const cheerio = require('cheerio');

const urlList = [
  'https://news.ycombinator.com',
  'https://github.com/trending',
];

let resultData = [];
let lastUpdatedAt;
const WEBSITE = {
  YCOMBINATOR: 0,
  GITHUB: 1,
};

function scrapeWebpage(url) {
  return axios.get(url);
}

function extractHTMLInfo(html, website) {
  const $ = cheerio.load(html);
  const newsGroup = {};
  newsGroup.name = $('head title').text();
  newsGroup.items = [];
  switch (website) {
    case WEBSITE.YCOMBINATOR:
      $('table.itemlist tr td:nth-child(3)').each((i, elem) => {
        newsGroup.items.push({
          name: $(elem).text(),
          link: $(elem).find('a.storylink').attr('href'),
        });
      });
      break;
    case WEBSITE.GITHUB:
      $('ol.repo-list li div:nth-child(1) h3').each((i, elem) => {
        newsGroup.items.push({
          name: $(elem).text().trim(),
          link: `https://github.com${$(elem).find('a').attr('href')}`,
        });
      });
      break;
    default:
      console.log('Invalid website');
      return;
  }
  resultData.push(newsGroup);
}

function fetchNews() {
  console.log(`Fetch News started at ${new Date()}`);
  resultData = [];
  return new Promise((resolve, reject) => {
    Promise.all(urlList.map(url => scrapeWebpage(url))).then((response) => {
      response.forEach((res, index) => extractHTMLInfo(res.data, index));
      console.log(`News fetch complete at ${new Date()}`);
      lastUpdatedAt = Date.now();
      resolve(resultData);
    }).catch((error) => {
      console.log('error fetching news :: ', error);
      reject(error);
    });
  });
}

function scheduleNewsScrapeEvent() {
  fetchNews();
  setInterval(fetchNews, 60 * 15 * 1000); /* News Fetch interval set for 15 mins */
}

function getNewsList() {
  return {
    newsData: resultData,
    lastUpdatedAt
  };
}

/* Initiate news scrape event on start of the app */
scheduleNewsScrapeEvent();

module.exports = {
  getNewsList: getNewsList
};
