const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            id: Number,
            name: String,
            price: Number
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
