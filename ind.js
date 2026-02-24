const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5980;

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(
  'mongodb+srv://mc24ms5066_db_user:aajvi161202@sanjeevne-db.nljallf.mongodb.net/Paper?retryWrites=true&w=majority'
)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// ==========================================
// ✅ Schema + Model inside ind.js (merged)
// ==========================================
const FamilySchema = new mongoose.Schema({
  State: String,
  Plant: String,
  Family: String,
  Phytochemical: String
});

// "Family" → Name of MongoDB collection
const FamilyModel = mongoose.model('Family', FamilySchema, 'Family');


// ==========================================
// ✅ Root API
// ==========================================
app.get('/', (req, res) => {
  res.send('✅ Backend is running correctly');
});


// ==========================================
// ✅ GET Route for fetching family data
// ==========================================
app.get('/getFamily', async (req, res) => {
  try {
    const familyData = await FamilyModel.find();
    res.json(familyData);
  } catch (err) {
    console.error('❌ Route Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


// ==========================================
// ✅ Start server
// ==========================================
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://127.0.0.1:${5980}`);
});
