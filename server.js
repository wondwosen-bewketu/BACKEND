const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const user = require('./routes/user');
const task = require('./routes/task');

const app = express();
env.config();

app.use(express.json());

app.use(helmet());
app.use(cors());

// Connection with Mongo Database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database connected");
}).catch((error) => {
  console.error("Database connection failed", error);
});

app.use('/user', user);
app.use('/task', task);

// Use the PORT environment variable or default to 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
