const express = require('express');
const path = require('path');
const productsRouter = require('./routes/products');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});

module.exports = app;