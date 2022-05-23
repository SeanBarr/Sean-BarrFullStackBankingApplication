const mongoose = require('mongoose');

const databaseConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('The connection to MongoDB has been established successfully.');
    }
    catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = databaseConnection