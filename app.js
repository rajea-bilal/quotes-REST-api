import express from "express";
import morgan from "morgan";
import cors from "cors"
const app = express();
const PORT = 5000;

import {
  getQuotes,
  getQuoteById,
  getRandomQuote,
  getQuoteByParams,
  postQuote,
  editQuoteById,
  deleteQuoteById,
} from "./helperFunctions.js";

// middleware
app.use(cors())
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

// GET random quotes
app.get("/random-quote", async function (req, res) {
  try {
    const randomQuote = await getRandomQuote();
    // console.log(randomQuote)
    if (!randomQuote) {
      throw new Error();
    }

    res.status(200).json(randomQuote);
  } catch (error) {
    res.status(400).send("No quote found. :( ");
  }
});

// GET quote by params
app.get("/quotes/search", async function(req, res) {
  try {
    const query = req.query.q
    console.log(query)

    const findQuote = await getQuoteByParams(query)

     if (!findQuote) {
      throw new Error();
    }

    res.status(201).json(findQuote);

  } catch(error) {
    res.status(400).send("No quote found. :( ");
  }
})


// POST
app.post("/quotes", async function (req, res) {
  try {
    // check to ensure body is not empty when user makes POST request
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).send("Request body is empty or missing required fields.");
      return;
    }

    const quote = req.body;
    console.log(quote)
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
