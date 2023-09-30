import { promises as fs } from "node:fs";
import { v4 as uuidv4 } from "uuid";

// creating helper functions that are responsible for reading/writing/updating/deleting data from the files with the local file system


// GET
export async function getQuotes() {
  const quotesJSON = await fs.readFile("quotes.json", "utf-8");
  const quotesJS = JSON.parse(quotesJSON);

  return quotesJS;
}

// GET(id)
export async function getQuoteById(id) {
  console.log(typeof id);
  const quotesJSON = await fs.readFile("quotes.json", "utf-8");
  const quotesJS = JSON.parse(quotesJSON);

  // looping through the array to find the quote that matches id
  for (let quote of quotesJS) {
    if (quote.id === id) {
      return quote;
    }
  }

  return null;
}

// POST
export async function postQuote(quoteObject) {
  const quotesJSON = await fs.readFile("quotes.json", "utf-8");
  const quotesJS = JSON.parse(quotesJSON);

  // creating a new book object
  const quote = {
    id: uuidv4(),
    title: quoteObject.title,
    author: quoteObject.author,
    category: quoteObject.category,
  };

  quotesJS.push(quote);
  // updating the books array with another book object
  await fs.writeFile("quotes.json", JSON.stringify(quotesJS, null, 2), "utf-8");

  return quote;
}

// PATCH(id)
export async function editQuoteById(id, quoteObject) {
  const quotesJSON = await fs.readFile("quotes.json", "utf-8");
  const quotesJS = JSON.parse(quotesJSON);

  // looping through the array to find the book that matches id

 let updatedQuote;
  for(let i = 0; i < quotesJS.length; i++) {
    if(quotesJS[i].id === id) {
      quotesJS[i] = {...quotesJS[i], ...quoteObject}
      updatedQuote = quotesJS[i]
    }
  }
 

  // testing this functionality
  await fs.writeFile("quotes.json", JSON.stringify(quotesJS, null, 2), "utf-8");
    console.log(updatedQuote)
  return updatedQuote;
}

export async function deleteQuoteById(id) {
  const quotesJSON = await fs.readFile("quotes.json", "utf-8");
  const quoteJS = JSON.parse(quoteJSON);

  // looping through the array to find the book that matches id
  let deletedQuote;
  for (let i = 0; i < quotesJS.length; i++) {
    if (quoteJS[i].id === id) {
      deletedQuote = quoteJS[i];
      quoteJS.splice(i, 1);
      break;
    }
  }

  await fs.writeFile("quotes.json", JSON.stringify(quotesJS, null, 2), "utf-8");
  return deletedQuote;
}

// // sample object to use for testing
const quoteObj = {
  title: "Bootcamper's Woes",
  author: "Napolina",
  category: "Struggling alot!!!",
};
