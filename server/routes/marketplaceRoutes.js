const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const auth = require('../middleware/authMiddleware');

// =================== ITEM ROUTES ===================

// @route   GET /api/marketplace
// @desc    Get all marketplace items
// @access  Public
router.get('/', marketplaceController.getItems);

// =================== ORDER ROUTES (must be before /:id) ===================

// @route   POST /api/marketplace/order
// @desc    Place an order (public - no auth needed)
// @access  Public
router.post('/order', marketplaceController.placeOrder);

// @route   GET /api/marketplace/orders
// @desc    Get all orders (admin only)
// @access  Private
router.get('/orders', auth, marketplaceController.getOrders);

// @route   PUT /api/marketplace/orders/:id
// @desc    Update order status (admin only)
// @access  Private
router.put('/orders/:id', auth, marketplaceController.updateOrderStatus);

// @route   DELETE /api/marketplace/orders/:id
// @desc    Delete an order (admin only)
// @access  Private
router.delete('/orders/:id', auth, marketplaceController.deleteOrder);

// =================== ITEM ROUTES (continued) ===================

// @route   GET /api/marketplace/:id
// @desc    Get single item
// @access  Public
router.get('/:id', marketplaceController.getItem);

// @route   POST /api/marketplace
// @desc    Create item
// @access  Private
router.post('/', auth, marketplaceController.createItem);

// @route   PUT /api/marketplace/:id
// @desc    Update item
// @access  Private
router.put('/:id', auth, marketplaceController.updateItem);

// @route   DELETE /api/marketplace/:id
// @desc    Delete item
// @access  Private
router.delete('/:id', auth, marketplaceController.deleteItem);

module.exports = router;

