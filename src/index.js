const puppeteer = require('puppeteer');
const fs = require('fs');

function pad(s) {
  while (s.length < 3) 
    s = '0' + s; 
  return s;
}

function generateNumbers () {
  const start = 1;
  const end = 890;
  const numbers = [];

  for (var i=start; i<=end; i++) { 
    numbers.push(pad(''+i));
  }

  return numbers;
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  const numbers = generateNumbers();

  for (let i = 0; i < numbers.length; i++) {
    try {
      await fs.promises.stat(`./images/${numbers[i]}.png`);
      continue;
    } catch {
    }
    let viewSource = await page.goto(`https://serebii.net/swordshield/pokemon/${numbers[i]}.png`);

    try {
      await fs.promises.writeFile(`./images/${numbers[i]}.png`, await viewSource.buffer());
    } catch(err) {
      console.log(`Something went wrong on image: ${numbers[i]}`);
      console.log(err);
    }
  }

  console.log("Images saved");

  await browser.close();
})();