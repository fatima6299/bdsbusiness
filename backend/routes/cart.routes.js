const express = require('express');
const router = express.Router();


//Define cart-related routes

// Add item to cart
router.post('/add', (req, res) => {
    res.json({message: 'Item added to cart'});
});

// Remove item from cart
router.delete('/remove', (req, res) => {
    res.json({message: 'Item removed from cart'});
});

// Update item quantity in cart
router.put('/update', (req, res) => {
    res.json({message: 'Cart item updated'});
});

// Clear cart
router.delete('/clear', (req, res) => {
    res.json({message: 'Cart cleared'});
});

// Get all items in cart
router.get('/', (req, res) => {
    res.json({message: 'Get all items in cart'});
});


// Export the router to be used in server.js
module.exports = router;