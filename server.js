const express = require('express');
const cors = require('cors');
require('dotenv').config();
const seedDatabase = require('./src/config/seedData');
const { connectDB, checkDBHealth } = require('./src/config/db');

const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(async () => {
    if (process.env.NODE_ENV === 'development') {
        await seedDatabase();
    }
});

app.get('/health', async (req, res) => {
    const dbHealth = await checkDBHealth();
    res.json({
        status: 'OK',
        timestamp: new Date(),
        dbStatus: dbHealth
    });
});

const serviceRoutes = require('./src/routes/serviceRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const loanRoutes = require('./src/routes/loanRoutes');

app.use('/', serviceRoutes);
app.use('/', memberRoutes);
app.use('/', loanRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});