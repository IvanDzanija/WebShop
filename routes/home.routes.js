const express = require('express');
const session = require('express-session');
const mydata = require('../data/mydata');

const router = express.Router();

const categories = mydata.data.categories;
var categoryMap = {};
for (const category of categories) {
    categoryMap[category.id] = category.name;
};

// Render home page
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Hats home'
    });
});

// Getting categories and rendering home page
// router.get('/getCategories', (req, res) => {
    
// });

router.post('/getCategories',function(req,res) {   
    res.json(mydata.data.categories);
});

// Getting category products 
router.post('/getProducts/:id', (req, res) => {
    const categoryId = parseInt(req.params.id, 10);
    // console.log(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        res.json(category.products);
    } else {
        res.status(404).send('Category does not exist');
    }
});

module.exports = router;
