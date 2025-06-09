const express = require('express');
const cors=require('cors')
const cookieParser= require('cookie-parser');
const app = express();
require('dotenv').config();

const mongoose = require('mongoose');
const apiRouter = require('./Routes');

// Middleware to parse JSON

app.use(cors({
  origin:'https://patientcare-dashboardfrontend.vercel.app',
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials:true,
}))
app.use(cookieParser());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI,{
   useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
// Start server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



app.use('/api',apiRouter);



// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Backend working ✅' });
});



