const Contact = require('../models/Contact');

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newContact = new Contact({
            name,
            email,
            message
        });

        const contact = await newContact.save();
        res.status(201).json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
