const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/allservices', async (req, res) => {
    try {
        const services = await Service.find({});
        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/service/:type', async (req, res) => {
    try {
        const service = await Service.findOne({ type: req.params.type });
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;