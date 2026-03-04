const MarketplaceItem = require('../models/MarketplaceItem');

// @desc    Get all marketplace items (with optional filters)
// @route   GET /api/marketplace
// @access  Public
exports.getItems = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort } = req.query;
        let query = { available: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price_low') sortOption = { price: 1 };
        if (sort === 'price_high') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const items = await MarketplaceItem.find(query)
            .sort(sortOption)
            .populate('seller', 'name email');

        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single marketplace item
// @route   GET /api/marketplace/:id
// @access  Public
exports.getItem = async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id).populate('seller', 'name email profilePicture');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create marketplace item
// @route   POST /api/marketplace
// @access  Private
exports.createItem = async (req, res) => {
    try {
        const { name, description, price, category, images, location, contact, tags } = req.body;

        const newItem = new MarketplaceItem({
            name,
            description,
            price,
            category,
            images: images || [],
            seller: req.user.id,
            sellerName: req.user.name || '',
            location,
            contact: contact || {},
            tags: tags || []
        });

        const item = await newItem.save();
        res.status(201).json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update marketplace item
// @route   PUT /api/marketplace/:id
// @access  Private (owner only)
exports.updateItem = async (req, res) => {
    try {
        let item = await MarketplaceItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Check ownership
        if (item.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        item = await MarketplaceItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete marketplace item
// @route   DELETE /api/marketplace/:id
// @access  Private (owner or admin)
exports.deleteItem = async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await MarketplaceItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ===================== ORDER CONTROLLERS =====================

const MarketplaceOrder = require('../models/MarketplaceOrder');

// @desc    Place a new order
// @route   POST /api/marketplace/order
// @access  Public
exports.placeOrder = async (req, res) => {
    try {
        const { buyerName, email, phone, address, itemId, quantity, paymentMethod } = req.body;

        if (!buyerName || !email || !phone || !address || !itemId || !quantity || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const item = await MarketplaceItem.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const totalAmount = item.price * quantity;

        // Simulate payment processing
        let paymentStatus = 'pending';
        let transactionId = '';

        if (paymentMethod === 'upi' || paymentMethod === 'card' || paymentMethod === 'qr') {
            // Simulate successful payment
            paymentStatus = 'paid';
            transactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        // COD stays as 'pending' payment

        const order = new MarketplaceOrder({
            buyerName,
            email,
            phone,
            address,
            itemId,
            itemName: item.name,
            itemPrice: item.price,
            itemImage: item.images && item.images[0] ? item.images[0] : '',
            quantity,
            totalAmount,
            paymentMethod,
            paymentStatus,
            transactionId,
            orderStatus: 'confirmed'
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/marketplace/orders
// @access  Private (admin)
exports.getOrders = async (req, res) => {
    try {
        const orders = await MarketplaceOrder.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update order status
// @route   PUT /api/marketplace/orders/:id
// @access  Private (admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const update = {};
        if (orderStatus) update.orderStatus = orderStatus;
        if (paymentStatus) update.paymentStatus = paymentStatus;

        const order = await MarketplaceOrder.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete an order
// @route   DELETE /api/marketplace/orders/:id
// @access  Private (admin)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await MarketplaceOrder.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
