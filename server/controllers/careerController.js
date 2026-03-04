const JobApplication = require('../models/JobApplication');

// @desc    Submit a job application
// @route   POST /api/career/apply
// @access  Public
exports.submitApplication = async (req, res) => {
    try {
        const { name, email, phone, jobTitle } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a resume' });
        }

        const newApplication = new JobApplication({
            name,
            email,
            phone,
            jobTitle,
            resume: `/uploads/${req.file.filename}`
        });

        const application = await newApplication.save();
        res.status(201).json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all job applications
// @route   GET /api/career/applications
// @access  Private (Admin only)
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find().sort({ date: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a job application
// @route   DELETE /api/career/applications/:id
// @access  Private (Admin only)
exports.deleteApplication = async (req, res) => {
    try {
        await JobApplication.findByIdAndDelete(req.params.id);
        res.json({ message: 'Application removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
