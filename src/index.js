const { requestHtml } = require("./services/requesInfo");
const cheerio = require("cheerio");
const { insertBook } = require("./services/database");
const {config} = require('dotenv');
const fs = require('fs');
config();
const createBook = (id, link, description) => {
  return {
    id,
    link,
    description,
  };
};
function createBookFile(books) {
  const fileContent = books.join('\n\n');
  fs.writeFileSync('books.txt', fileContent);
}

const getDescription = (html) => {
  const $ = cheerio.load(html);
  const description = $(
    "#mw-content-text > div.mw-parser-output > div > table > tbody > tr > td > div"
  ).text();
  return removeOriginalText(description);
};

function removeOriginalText(text) {
  const originalTextIndex = text.indexOf("Texto Original:");
  if (originalTextIndex >= 0) {
    const lineBreakIndex = text.indexOf("\n", originalTextIndex);
    if (lineBreakIndex >= 0) {
      return text.slice(lineBreakIndex + 1).trim();
    }
  }
  return text.trim();
}

async function main() {
  try {
    const booksHtml = await requestHtml(
      "https://www.tibiawiki.com.br",
      "/wiki/Biblioteca(s)_de_Hellgate"
    );
    const bookList = await getBookList(booksHtml);
    const books = bookList.map((book) => book.description);
    // await Promise.all(bookList.map(insertBook));
    createBookFile(books);
  } catch (error) {
    console.error(error);
  }
}

async function getBookList(html) {
  const $ = cheerio.load(html);
  const bookLinks = $("#tabelaDPL > tbody > tr > td > a");
  const bookPromises = bookLinks.toArray().map((bookLink) => {
    const link = $(bookLink).attr("href");
    return requestHtml("https://www.tibiawiki.com.br", link);
  });

  const bookPagesHtml = await Promise.all(bookPromises);

  const bookList = [];
  bookPagesHtml.forEach((bookPageHtml, index) => {
    const bookLink = $(bookLinks[index]);
    const name = bookLink.text().split("\n").join(" ");
    const link = bookLink.attr("href");
    const description = getDescription(bookPageHtml);
    const book = createBook(name, link, description);
    bookList.push(book);
  });

  return bookList;
}

main();
