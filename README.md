# Amazon Product Image Download

Scraping Amazon product image downloads from arrays of the product details page with your desire images name.

<!-- [START getstarted] -->

## Getting Started

### Installation

I use Puppeteer,https and puppeteer-cluster in project, run:

```bash
npm i puppeteer
# or "yarn add puppeteer"
```

```bash
npm i https
# or "yarn add https"
```

```bash
npm i puppeteer-cluster
# or "yarn add puppeteer-cluster"
```

Note: When you install Puppeteer, it downloads a recent version of Chromium (~170MB Mac, ~282MB Linux, ~280MB Win) that is guaranteed to work with the API. To skip the download, or to download a different browser, see [Environment variables](https://github.com/puppeteer/puppeteer/blob/v5.0.0/docs/api.md#environment-variables).

## Usage

Please replace the requests variable as per your requirement. It is a JSON object its mainly content `file_name` and `page_url`.
Note: file_name as per requirement and page_url is amazon product details page URL.

```js
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
```
