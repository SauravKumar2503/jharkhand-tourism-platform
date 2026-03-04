const crypto = require('crypto');
const User = require('../models/User');

// @desc    Verify a guide (Admin only)
// @route   POST /api/guides/:id/verify
// @access  Private (Admin)
exports.verifyGuide = async (req, res) => {
    try {
        const guide = await User.findById(req.params.id);
        if (!guide || guide.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // Generate blockchain-like verification hash
        const dataToHash = `${guide._id}-${guide.name}-${Date.now()}-JHARKHAND_CONNECT`;
        const verificationHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        // Generate gov ID hash (simulated)
        const govIdHash = crypto.createHash('sha256').update(`GOV-${guide._id}-${guide.email}`).digest('hex');

        guide.guideProfile.isVerified = true;
        guide.guideProfile.verificationHash = verificationHash;
        guide.guideProfile.verifiedAt = new Date();
        guide.guideProfile.govIdHash = govIdHash;

        await guide.save();

        res.json({
            message: 'Guide verified successfully',
            verificationHash,
            govIdHash,
            verifiedAt: guide.guideProfile.verifiedAt
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get guide verification certificate
// @route   GET /api/guides/:id/certificate
// @access  Public
exports.getCertificate = async (req, res) => {
    try {
        const guide = await User.findById(req.params.id).select('name guideProfile email');
        if (!guide || guide.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }

        if (!guide.guideProfile.isVerified) {
            return res.status(400).json({ message: 'Guide is not verified' });
        }

        res.json({
            name: guide.name,
            email: guide.email,
            isVerified: guide.guideProfile.isVerified,
            verificationHash: guide.guideProfile.verificationHash,
            verifiedAt: guide.guideProfile.verifiedAt,
            certifications: guide.guideProfile.certifications,
            govIdHash: guide.guideProfile.govIdHash
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add certification to guide
// @route   POST /api/guides/:id/certifications
// @access  Private (Admin)
exports.addCertification = async (req, res) => {
    try {
        const { name, issuer } = req.body;
        const guide = await User.findById(req.params.id);
        if (!guide || guide.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }

        if (!guide.guideProfile.certifications) {
            guide.guideProfile.certifications = [];
        }

        guide.guideProfile.certifications.push({
            name,
            issuer,
            date: new Date()
        });

        await guide.save();
        res.json({ message: 'Certification added', certifications: guide.guideProfile.certifications });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
