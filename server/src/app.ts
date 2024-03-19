import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/hi", (req, res) => {
  res.send("Hi");
});

app.listen(3000, () => console.log("Server running biatch."));
