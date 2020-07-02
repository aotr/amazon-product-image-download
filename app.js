const fs = require('fs');
const https = require('https');
const { Cluster } = require('puppeteer-cluster');
const puppeteer = require('puppeteer');
(async () => {
  const requests = [
    {
      file_name:
        'A Light to Yourself (The Collected Works of J. Krishnamurti 1956-1957 Book 10)',
      page_url:
        'https://www.amazon.in/Light-Yourself-Collected-Krishnamurti-1956-1957-ebook/dp/B07HM79S6B/',
    },
    {
      file_name:
        'A Psychological Revolution (The Collected Works of J. Krishnamurti: 1962-1963 Volume 13)',
      page_url:
        'https://www.amazon.in/Psychological-Revolution-Collected-Krishnamurti-Revolution2-ebook/dp/B07HMF5M8Q/',
    },
  ];
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 1,
    puppeteer,
    puppeteerOptions: {
      headless: false,
      width: 4000,
      height: 1400,
      deviceScaleFactor: 3,
      timeout: 60000,
    },
  });
  function isDataURL(s) {
    return !!s.match(isDataURL.regex);
  }
  isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
  /* ============================================================
  Promise-Based Download Function
============================================================ */
  const download = async (url, destination, page_url) =>
    new Promise((resolve, reject) => {
      if (isDataURL(url)) {
        let file = destination;
        // var file = fs.createWriteStream(destination);
        var base64Data = url.replace(/data:image\/[^;]+;base64,+/g, '');
        // console.log(`base64Data :=>`, base64Data);
        // console.log(
        //   `url.substring(url.indexOf('/') + 1, url.indexOf(';base64')) :=>`,
        //   url.substring(url.indexOf("/") + 1, url.indexOf(";base64"))
        // );
        var pos = destination.lastIndexOf('.');
        file =
          destination.substr(0, pos < 0 ? file.length : pos) +
          '.' +
          url.substring(url.indexOf('/') + 1, url.indexOf(';base64'));
        // console.log(`file :=>`, file);
        file = fs.createWriteStream(file);
        try {
          fs.writeFile(file, base64Data, { encoding: 'base64' }, (err, res) => {
            console.log(err);
            // fs.unlink(destination);
            // reject(err.message);
            console.log(page_url);
          });
        } catch (err) {
          console.log(page_url);
        }
      } else {
        var file = fs.createWriteStream(destination);
        https
          .get(url, (response) => {
            response.pipe(file);

            file.on('finish', () => {
              file.close(resolve(true));
            });
          })
          .on('error', (error) => {
            console.log(`error :=>`, error);

            fs.unlink(destination);
            reject(error.message);
          });
      }
    });
  await cluster.task(async ({ page, data }) => {
    let { url, file_name } = data;
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 3 });
    await page.goto(url).catch((e) => {
      console.error(e.message, `This was a failure go to.Url is ${url}`);
    });

    await page
      .evaluate(() => {
        var imagesSrc = null;
        var imageBlockContainer = document.querySelector(
          '#imageBlockContainer',
        );
        if (imageBlockContainer) {
          var imageTag = imageBlockContainer.querySelector('img');
          imagesSrc = imageTag.getAttribute('src');
          return imagesSrc;
        }
        var imageBlockContainer = document.querySelector(
          '#ebooksImageBlockContainer',
        );
        if (imageBlockContainer) {
          var imageTag = imageBlockContainer.querySelector('img');
          imagesSrc = imageTag.getAttribute('src');
          return imagesSrc;
        }
      })
      .then((re) => {
        download(re, 'J_Krishnamurti/' + file_name + '.jpg', url);
      })
      .catch((err) => {
        // console.log(`err :=>`, err);
        console.log(`Error in ${url}`);
      });
  });
  requests.forEach((url) => {
    try {
      cluster.queue({
        url: url.page_url.trim(),
        file_name: url.file_name.trim(),
      });
    } catch (err) {
      // console.log(`err :=>`, err);
    }
  });
  await cluster.idle();
  await cluster.close();
})();
