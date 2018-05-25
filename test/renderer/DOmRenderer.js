import {expect} from 'chai';
import nodeStatic from 'node-static';
import http from 'http';

import puppeteer from 'puppeteer';

const opts = {
    headless: false,
    slowMo:   100,
    timeout:  10000
};

const dir = new nodeStatic.Server('./');
const server = http.createServer((req, res) => dir.serve(req, res));

describe('testing API\'s using Puppeteer', () => {
    before((done) => {
        server.listen(5050, () => done());
        console.log('before Hook');
    });
    it('Puppeteer should run', async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setViewport({width: 500, height: 2400})

        await page.goto('http://localhost:5050/test/renderer/samples/testA.html');

        page.on('console', msg => console.log(msg.text()));

        await page.evaluate((e) => {
             window.showBody();
        });
        await page.waitFor(1000);

        await browser.close();

    }).timeout(5000);

    after(async () => {
        server.close();
        console.log('after Hook');
    });
});