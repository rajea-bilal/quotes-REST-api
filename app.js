import express from "express";
import morgan from "morgan";
const app = express();
const PORT = 5000;

import {
  getQuotes,
  getQuoteById,
  postQuote,
  editQuoteById,
  deleteQuoteById,
} from "./helperFunctions.js";

app.use(express.json());

app.use(morgan("tiny"));

// GET Quotes
app.get("/quotes", async function (req, res) {
  try {
    const listAllQuotes = await getQuotes();

    if (!listAllQuotes) {
      throw new Error();
    }

    res.status(200).json(listAllQuotes);
  } catch (error) {
    res.status(400).send("No quote found. :( ");
  }
});

//GET quote by ID
app.get("/quotes/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const selectedQuote = await getQuoteById(id);

    // custom error handling
    if (selectedQuote === null) {
      res
        .status(404)
        .send(
          "Sorry, couldn't find book. Please try again with a different id."
        );
      return;
    } else if (!selectedQuote) {
      throw new Error();
    }

    res.status(200).json(selectedQuote);
  } catch (error) {
    res.status(400).send("Bad Request. Couldn't retrieve list of books. :( ");
  }
});

// POST
app.post("/quotes", async function (req, res) {
  try {
    // check to ensure body is not empty when user makes POST request
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).send("Request body is empty or missing required fields.");
      return;
    }

    const quote = req.body;
    const createdQuote = await postQuote(quote);

    if (!createdQuote) {
      throw new Error();
    }
    res.status(201).json(createdQuote);
  } catch (error) {
    res.status(400).send("Cannot create book.");
  }
});

//PATCH request
app.patch("/quotes/:id", async function (req, res) {
  try {
    // check to ensure body is not empty when user makes POST request
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).send("Request body is empty or missing required fields.");
      return;
    }

    const quoteId = req.params.id;
    const updatedQuote = req.body;

    const editedQuote = await editQuoteById(quoteId, updatedQuote);

    // custom error handling
    if (editedQuote === null) {
      res
        .status(404)
        .send(
          "Sorry, couldn't find book. Please try again with a different id."
        );
      return;
    } else if (!editedQuote) {
      throw new Error();
    }

    res.status(200).json(editedQuote);
  } catch (error) {
    res.status(400).send("Bad Request. Book couldn't be updated.");
  }
});

// DELETE
app.delete("/quotes/:id", async function (req, res) {
  try {
    const quoteId = req.params.id;
    const deletedQuote = await deleteQuoteById(quoteId);

    // custom error handling
    if (deletedQuote === null) {
      res
        .status(404)
        .send(
          "Sorry, couldn't find book. Please try again with a different id."
        );
      return;
    } else if (!deletedQuote) {
      throw new Error();
    }

    res.status(200).json(deletedQuote);
  } catch (error) {
    res.status(400).send("Bad Request. Book could not be deleted.");
  }
});

app.listen(PORT, function () {
  console.log(`Server running and listening to http://localhost:${PORT}/.`);
});
