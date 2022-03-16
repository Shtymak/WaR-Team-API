require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');
const errorMiddleware = require('./middleware/ErrorHandlingMiddleware');
const formData = require('express-form-data');
const path = require('path');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 5000;
const app = express();
const os = require('os');
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true,
};

app.use(express.json());

app.use(cookieParser());
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {});

        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start().then();
