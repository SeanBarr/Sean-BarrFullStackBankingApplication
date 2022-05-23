const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { corsOptions } = require('./config/corsConfig')
const databaseConnection = require('./database/mongoDatabase');
const { errorHandler } = require('./middleware/errorMiddleware');
const credentialHendler = require('./middleware/credentialMiddleware');

databaseConnection();

const app = express();

app.use(credentialHendler);
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes');
const refreshRoute = require('./routes/refreshRoute');

app.use('/api/refresh', refreshRoute)
app.use('/api/user', userRoutes);
app.use('/api/account', accountRoutes);

app.use(errorHandler)

mongoose.connection.once('open', () => {
    app.listen(process.env.PORT, () => console.log('listening on port 5000'));
});
