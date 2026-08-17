const path = require("path");
const express = require("express");

const db = require("./data/database");
const mainRoutes = require("./routes/main.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public")); // no-op on Vercel (served via CDN instead), still needed locally

// Ensures the DB connection is ready before any route runs.
// Required for Vercel: app.listen() never fires there, so this is the
// only place a serverless cold start can safely wait on the connection.
app.use(async function (req, res, next) {
  try {
    await db.initDatabase();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    next(err);
  }
});

app.use(mainRoutes);

app.use(function (error, req, res, next) {
  console.error(error);
  res.status(500).render("500");
});

// Local dev only — Vercel imports this file and calls the exported
// app directly per request, so app.listen() is never invoked there.
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
