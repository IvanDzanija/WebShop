// Requirements
const express = require('express');
const session = require('express-session');
const mydata = require('../data/mydata');

const router = express.Router();

const categories = mydata.data.categories;
var productMap = {};
for (const category of categories) {
    for (const product of category.products){
        productMap[product.id] = product.name;
    }
};
// console.log(productMap);


// Helper function if session storage isn't set, redundant here if accesed through homepage
router.use((req, res, next) => {
    if (!req.session.cartStorage) {
        req.session.cartStorage = {};
    }
    next();
});

// Rendering cart page
router.get('/', (req, res) => {
    res.render('cart', { cart: req.session.cartStorage });
    // console.log(req.session.cartStorage);
});

// add/id route
router.post('/add/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    if (!productMap.hasOwnProperty(productId)) {
        res.status(404).json({ error: 'Product does not exist!' });
    }
    else{
        let existingProduct = false;
        // console.log(typeof temp);
        if (req.session.cartStorage.hasOwnProperty(String(productId))) {
            existingProduct = true;
        }
        if (existingProduct) {
            req.session.cartStorage[String(productId)] += 1;
        } else {
            req.session.cartStorage[String(productId)] = 1;
        }
    }
    res.json(req.session.cartStorage);
    // console.log(req.session.cartStorage)
});

// remove/id route
router.post('/remove/:id', (req, res) => {
    // console.log(req.session.cartStorage)
    const productId = parseInt(req.params.id, 10);
    if (!productMap.hasOwnProperty(productId)) {
        res.status(404).json({ error: 'Product does not exist!' });
    }
    else{
        let existingProduct = false;
        // console.log(typeof temp);
        if (req.session.cartStorage.hasOwnProperty(String(productId))) {
            existingProduct = true;
        }
        if (existingProduct) {
            req.session.cartStorage[String(productId)] -= 1;
            if (req.session.cartStorage[String(productId)] === 0) {
                delete req.session.cartStorage[String(productId)];
            }
        }
    }
    res.json(req.session.cartStorage);

});

// getAll route
router.post('/getAll', (req, res) => {
    res.json(req.session.cartStorage);
});

module.exports = router;
