const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const validateRequest = require('../middleware/validator'); // Add this import

router.post('/service/:type/form', validateRequest('request'), async (req, res) => {
    try {
        const { mobile, email, amt, msg, code } = req.body;
        const type = req.params.type;

        const request = new Request({
            mobile,
            email,
            amt,
            type,
            msg,
            code
        });

        await request.save();
        res.status(201).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/service/:type/calculate', validateRequest('calculation'), async (req, res) => {
    try {
        const { amt, tenure } = req.body;
        const type = req.params.type;

        const interestRate = 0.1; 
        const monthlyRate = interestRate / 12;
        const emi = (amt * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                   (Math.pow(1 + monthlyRate, tenure) - 1);

        res.json({
            success: true,
            data: {
                emi: Math.round(emi),
                totalAmount: Math.round(emi * tenure),
                interestAmount: Math.round((emi * tenure) - amt),
                loanType: type
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/updaterequest',validateRequest('updateRequest'), async (req, res) => {
    try {
        const { mobile, service, type, remarks } = req.body;
        const request = await Request.findOneAndUpdate(
            { mobile },
            { 
                code: service, 
                type, 
                msg: remarks 
            },
            { new: true, runValidators: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


router.delete('/deleterequest', async (req, res) => {
    try {
        const { mobile } = req.body;
        const request = await Request.findOneAndDelete({ mobile });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;