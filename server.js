const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '#Aloku0412', 
  database: 'home_design'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log("✅ MySQL connected");
});

// === Signup Route ===
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash],
      (err, result) => {
        if (err) {
          console.error("Signup Error:", err);
          return res.status(500).send('Signup failed. Email may already exist.');
        }
        console.log("✅ New user registered:", email);
        res.status(200).send('Signup successful');
      }
    );
  } catch (err) {
    console.error("Hashing Error:", err);
    res.status(500).send('Server error');
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error("Login Query Error:", err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      console.log("✅ Login success for:", email);
      res.redirect('design.html'); 
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
