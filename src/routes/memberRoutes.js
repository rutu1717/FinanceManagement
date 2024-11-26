const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const validateRequest = require('../middleware/validator');

router.post('/member', validateRequest('member'), async (req, res) => {
    try {
        const { mobile, email, occupation, createpassword } = req.body;
        
        const existingMember = await Member.findOne({ 
            $or: [{ mobile }, { email }] 
        });
        
        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: 'Member already exists with this mobile or email'
            });
        }

        const member = new Member({
            mobile,
            email,
            occupation,
            createpassword
        });

        await member.save();
        res.status(201).json({
            success: true,
            data: member
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/updatepassword',validateRequest('updatePassword'), async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const member = await Member.findOneAndUpdate(
            { mobile },
            { createpassword: password },
            { new: true, runValidators: true }
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


router.delete('/cancelmember', async (req, res) => {
    try {
        const { mobile } = req.body;
        const member = await Member.findOneAndDelete({ mobile });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.json({
            success: true,
            message: 'Membership cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;