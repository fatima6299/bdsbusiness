const express = require('express');
const router = express.Router();


// Define routes for user operations

// Create a new user
router.post("/", (req, res) => {
    res.json({message: req.body.message});
});

// Get all users
router.get("/", (req, res) => {
    res.json({message: "Here is the list of users from backend!"});
});

// Get user by ID
router.get("/:id", (req, res) => {
    res.json({message: `Details of user with ID ${req.params.id}`});
});

// Update user by ID
router.put("/:id", (req, res) => {
    res.json({message: `User with ID ${req.params.id} has been updated!`});
});

// Delete user by ID
router.delete("/:id", (req, res) => {
    res.json({message: `User with ID ${req.params.id} has been deleted!`});
}); 


// Export the router to be used in server.js
module.exports = router;