const mongoose = require('mongoose');

const MarketplaceOrderSchema = new mongoose.Schema({
    buyerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceItem', required: true },
    itemName: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    itemImage: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'cod', 'qr'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    transactionId: { type: String, default: '' },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketplaceOrder', MarketplaceOrderSchema);
