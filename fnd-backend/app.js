const express = require("express");
const app = express();

app.use(express.json());

// routes
const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
