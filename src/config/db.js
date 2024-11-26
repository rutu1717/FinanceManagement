const mongoose = require('mongoose');

const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        console.log(`Database Name: ${conn.connection.name}`);
        
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(col => col.name));

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};


mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed through app termination');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

const checkDBHealth = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return {
                status: 'error',
                message: 'Database not connected',
                readyState: mongoose.connection.readyState
            };
        }

        
        await mongoose.connection.db.admin().ping();
        
        return {
            status: 'ok',
            message: 'Database is healthy',
            readyState: mongoose.connection.readyState
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message,
            readyState: mongoose.connection.readyState
        };
    }
};

const getDBStats = async () => {
    try {
        const stats = await mongoose.connection.db.stats();
        return {
            status: 'ok',
            data: {
                collections: stats.collections,
                objects: stats.objects,
                avgObjSize: stats.avgObjSize,
                dataSize: stats.dataSize,
                storageSize: stats.storageSize,
                indexes: stats.indexes,
                indexSize: stats.indexSize
            }
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        };
    }
};

module.exports = {
    connectDB,
    checkDBHealth,
    getDBStats
};