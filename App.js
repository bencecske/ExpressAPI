const express = require('express');
const fs = require('fs');
const path = require('path');
const stripe = require("stripe")("sk_test_51RDr7k4FFIWXdfs8ItDIT7VOGQ0SZTDuyUUh6Xb28V5rSqtvys8QX22d4bqLlzg99iKCiSq33shPc8SrOUQnDjNn00kqnoofnB");

const app = express();
app.use(express.json())
const jwt = require('jsonwebtoken');
const cors = require("cors");
app.use(cors());
app.options('*', cors());

const secretKey = 'xd';

let itemList = JSON.parse(fs.readFileSync('./Data/items.json'));
let dataList = JSON.parse(fs.readFileSync('./Data/datas.json'));
let graphList = JSON.parse(fs.readFileSync('./Data/datas-graph.json'));
let userList = JSON.parse(fs.readFileSync('./Data/users.json'));
let orderList = JSON.parse(fs.readFileSync('./Data/orders.json'));
let aszf = fs.readFileSync('./Data/aszf.txt');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Acces denied (No token provided)');
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(500).send('Acces denied (Invalid token)');
      req.userId = decoded.id;
      next();
    });
  };

app.listen(3000, () => {
    console.log('Listening on port 3000')
})

app.get('/', (req, res) => {
  res.json({
    ok: true,
    verzió: "1.0",
    név: "WebShop API",
    dev: "Pánczél"
  });
})

app.get('/aszf', (req, res) => {
  res.send(aszf);
})

eval(fs.readFileSync('./EndPoints/cartEndPoints.js') + '');
eval(fs.readFileSync('./EndPoints/itemEndPoints.js') + '');
eval(fs.readFileSync('./EndPoints/userEndPoints.js') + '');
eval(fs.readFileSync('./EndPoints/dataEndPoints.js') + '');