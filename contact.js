const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5987;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // serves HTML, CSS, JS files

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://mc24ms5066_db_user:aajvi161202@sanjeevne-db.nljallf.mongodb.net/test?retryWrites=true&w=majority'
)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// ✅ Define Feedback Schema and Model
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// ✅ Serve Contact Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// ✅ Handle Feedback Form Submission
app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("📩 Received form data:", req.body);

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).send('❌ Missing form data');
    }

    const feedback = new Feedback({ name, email, message });
    await feedback.save();

    console.log('✅ Feedback saved successfully:', feedback);
    res.send('✅ Feedback saved successfully!');
  } catch (error) {
    console.error('❌ Error saving feedback:', error);
    res.status(500).send('❌ Error saving feedback');
  }
});

// ✅ Start the Server
app.listen(5987, () => {
  console.log(`🚀 Server running at http://localhost:${5987}`);
});