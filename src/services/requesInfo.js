const { XMLHttpRequest } = require("xmlhttprequest");

const requestHtml = (url, path) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url +path , true);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const html = xhr.responseText;
        if (xhr.status === 200) {
          resolve(html);
        } else {
          reject(new Error("Request Promise Error"));
        }
      }
    };
  });




module.exports = { requestHtml };
