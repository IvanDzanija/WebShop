// Requirements 
const express = require('express');
const session = require('express-session');
const path = require('path');
const homeRoutes = require('./routes/home.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();

// Session initialization
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1800000 } 
}))

// Setting view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/home', homeRoutes);
app.use('/cart', cartRoutes);
app.use('/public', express.static(path.join(__dirname, 'public')));

nextSessionID = 0;
// Redirect to home page
app.get('/',function(req,res,next) {
    if (!req.session.cartStorage) { req.session.cartStorage = {};}
    console.log(req.session.cartStorage);
    res.redirect('/home');
});

// Listen on port 3000
app.listen("3000");
console.log(`Server started on port 3000`);


