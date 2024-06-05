const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/user');
const Cart = require('./models/cart');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
        req.session.userId = user._id;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.post('/add-to-cart', async (req, res) => {
    const { userId, product } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, products: [product] });
    } else {
        cart.products.push(product);
    }

    await cart.save();
    res.json({ success: true });
});

app.get('/cart', async (req, res) => {
    const userId = req.session.userId;
    if (userId) {
        const cart = await Cart.findOne({ userId }).populate('userId');
        res.json(cart ? cart.products : []);
    } else {
        res.json([]);
    }
});

app.use(express.static(path.join(__dirname, '../')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
