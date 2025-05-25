const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // อนุญาตให้ React ใช้ Session
app.use(express.json());

// ใช้ session-based authentication
app.use(
  session({
    secret: "your-secret-key", // ควรใช้ค่า Random และเก็บไว้เป็นความลับ
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // ใช้ secure mode เมื่ออยู่บน production
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 ชั่วโมง
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);


const port = 5000;

// เชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "photobooth",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// ✅ API: สมัครสมาชิก (Register)
app.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    
    const sql = "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)";
    const values = [username, password, email];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      return res.json({ success: "User registered successfully" });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ API: เข้าสู่ระบบ (Login)
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบว่ามีการป้อนข้อมูลทั้ง username และ password หรือไม่
  if (!username || !password) {
    return res.status(400).json({ error: "Please enter both username and password" });
  }

  const cleanUsername = username.trim().toLowerCase();  // กำจัดช่องว่างและทำให้เป็นตัวพิมพ์เล็ก

  // คำสั่ง SQL เพื่อดึงข้อมูลผู้ใช้จากฐานข้อมูล
  const sql = "SELECT * FROM accounts WHERE LOWER(username) = LOWER(?) AND password = ?";

  try {
    // ใช้ db.query() เพื่อดึงข้อมูลผู้ใช้จากฐานข้อมูล
    db.query(sql, [cleanUsername, password], (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      // ถ้าผู้ใช้ไม่พบในฐานข้อมูล
      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid username or password" });
      }

      const user = results[0];

      // เริ่มการตั้งค่า session หลังจากผู้ใช้เข้าสู่ระบบ
      req.session.regenerate((err) => {
        if (err) return res.status(500).json({ error: "Session error" });

        req.session.userId = user.id;  // บันทึก userId ใน session
        req.session.username = user.username;  // บันทึก username ใน session
        res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




// ✅ API: ตรวจสอบสถานะเข้าสู่ระบบ (Check Login)
app.get("/check-auth", (req, res) => {
  if (req.session.userId) {
    res.json({ isAuthenticated: true, user: { id: req.session.userId, username: req.session.username } });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// ✅ API: บันทึกข้อความ Contact
app.post("/contact", (req, res) => {
  const { contactname } = req.body;

  // เช็คว่าผู้ใช้ล็อกอินหรือยัง
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized, please login" });
  }

  const acc_id = req.session.userId; // ใช้ acc_id จาก session
  if (!contactname) {
    return res.status(400).json({ error: "Please enter a message" });
  }

  const sql = "INSERT INTO contacts (contactname, acc_id) VALUES (?, ?)";
  db.query(sql, [contactname, acc_id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.json({ success: "Message sent successfully" });
  });
});


// ✅ API: ดึงข้อมูล Contact ของผู้ใช้ที่ล็อกอิน
app.get("/contacts", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized, please login" });
  }

  const acc_id = req.session.userId;
  const sql = "SELECT * FROM contacts WHERE acc_id = ?";
  db.query(sql, [acc_id], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.json(results);
  });
});


// ✅ API: ออกจากระบบ (Logout)
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid", { path: "/" }); // 🔥 ลบ Cookie session
    res.json({ message: "Logged out successfully" });
  });
});

// ฟังก์ชันสุ่มคำตอบของคอมพิวเตอร์
const getComputerChoice = () => {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
};

// ฟังก์ชันคำนวณผลการแข่งขัน
const determineWinner = (userChoice, computerChoice) => {
  if (userChoice === computerChoice) {
    return 'draw';
  }
  if (
    (userChoice === 'rock' && computerChoice === 'scissors') ||
    (userChoice === 'scissors' && computerChoice === 'paper') ||
    (userChoice === 'paper' && computerChoice === 'rock')
  ) {
    return 'user';
  }
  return 'computer';
};

app.post('/play', (req, res) => {
  const userChoice = req.body.userChoice?.toLowerCase();

  if (!["rock", "paper", "scissors"].includes(userChoice)) {
    return res.status(400).json({ message: "Invalid choice. Choose rock, paper, or scissors." });
  }

  const computerChoice = getComputerChoice();
  const winner = determineWinner(userChoice, computerChoice);

  res.json({
    userChoice,
    computerChoice,
    winner,
  });
});






// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
