const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();

const addressRoutes = require('./routes/address');

const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());

app.use("/address", addressRoutes);
app.get("/", (req, res) => res.send("Welcome to the Users API!"));
app.all("*", (req, res) =>res.send("You've tried reaching a route that doesn't exist."));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});