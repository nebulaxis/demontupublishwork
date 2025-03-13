
// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Promise Rejection:', err);
});




import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();

// CORS Configuration
app.use(
cors({
  origin: ["https://ntuproject.24livehost.com", "https://ntuproject.24livehost.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
})
);

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Initialize MySQL Database Connection
let db;

const connectDB = async () => {
  try {
      db = await mysql.createConnection({
          host: "localhost",
          user: "ntuproject",
          password: "1hjBw9DbtNktAqz",
          database: "ntuproject"
      });

      console.log("✅ Connected to MySQL database");

      db.on('error', (err) => {
          console.error("❌ MySQL error", err);
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
              console.log("⚠️ Connection lost. Reconnecting...");
              connectDB(); // Attempt to reconnect
          }
      });
  } catch (err) {
      console.error("❌ Database connection failed:", err);
      setTimeout(connectDB, 5000); // Attempt reconnection after 5 seconds
  }
};

connectDB();


// Login Route
app.post("/api/login", async (req, res) => {
try {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const [rows] = await db.execute(
    "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1",
    [username, password]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = Math.random().toString(36).substring(7);
  res.json({ success: true, token, user: rows[0] });
} catch (error) {
  console.error("❌ Server error:", error);
  res.status(500).json({ message: "Internal server error" });
}
});

// SSL Options
const sslOptions = {
  key: fs.readFileSync('/home/ntuproject/public_html/sslfiles/ssl.key'),
  cert: fs.readFileSync('/home/ntuproject/public_html/sslfiles/ssl.cert'),
  ca: fs.readFileSync('/home/ntuproject/public_html/sslfiles/ca_bundle.cert') // Optional
};

app.post("/test", async (req, res) => {
res.status(200).json({ message: "Server is working" });
});

// ✅ Check if Bundle ID Exists
app.post("/check-bundle", async (req, res) => {
const { bundleId } = req.body;

try {
  const [rows] = await db.execute("SELECT * FROM apps WHERE bundleId = ?", [bundleId]);
  res.json({ exists: rows.length > 0 });
} catch (error) {
  console.error("❌ Error:", error);
  res.status(500).json({ message: "Internal Server Error" });
}
});

// ✅ Add a New App (Ensure Unique Bundle ID)
app.post("/add-app", async (req, res) => {
const { appName, bundleId } = req.body;

if (!appName || !bundleId) {
  return res.status(400).json({ message: "App name and Bundle ID are required" });
}

try {
  const [existingApp] = await db.execute("SELECT * FROM apps WHERE bundleId = ?", [bundleId]);

  if (existingApp.length > 0) {
    return res.status(409).json({ message: "Bundle ID already exists" });
  }

  const [result] = await db.execute("INSERT INTO apps (appName, bundleId) VALUES (?, ?)", [appName, bundleId]);
  res.json({ success: true, message: "✅ App Added Successfully!", appId: result.insertId });
} catch (error) {
  console.error("❌ Error:", error);
  res.status(500).json({ message: "Internal Server Error" });
}
});


// ✅ Create App Endpoint

app.post("/create-app", async (req, res) => {
const { appName, bundleId } = req.body;

if (!appName || !bundleId) {
  return res.status(400).json({ success: false, message: "App name and Bundle ID are required" });
}

try {
  const [existingApp] = await db.execute("SELECT * FROM apps WHERE bundleId = ?", [bundleId]);

  if (existingApp.length > 0) {
    return res.status(409).json({ success: false, message: "Bundle ID already exists" });
  }

  const [result] = await db.execute("INSERT INTO apps (appName, bundleId) VALUES (?, ?)", [appName, bundleId]);
  res.json({ success: true, message: "✅ App Created Successfully!", appId: result.insertId });
} catch (error) {
  console.error("❌ Error creating app:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
});



// ✅ Fetch All Apps
app.get("/get-apps", async (req, res) => {
try {
  const [apps] = await db.execute("SELECT * FROM apps");
  res.json({ success: true, apps });
} catch (error) {
  console.error("Error fetching apps:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
});

// ✅ Get App by ID and its related questions
app.get("/get-app/:id", async (req, res) => {
const appId = req.params.id;

try {
  const appQuery = "SELECT * FROM apps WHERE id = ?";
  const questionsQuery = "SELECT * FROM questions WHERE appId = ?";

  const [appResults] = await db.execute(appQuery, [appId]);

  if (appResults.length === 0) {
    return res.status(404).json({ message: "App not found" });
  }

  const [questionResults] = await db.execute(questionsQuery, [appResults[0].id]);

  res.json({
    app: appResults[0],
    questions: questionResults,
  });
} catch (err) {
  console.error("Error fetching app details:", err);
  return res.status(500).json({ error: "Error fetching data" });
}
});

// ✅ Get App by Bundle ID and its related questions
// Get App by Bundle ID
app.get("/get-app/bundle/:bundleId", async (req, res) => {
const { bundleId } = req.params;

try {
  const appQuery = "SELECT * FROM apps WHERE bundleId = ?";
  const questionsQuery = "SELECT * FROM questions WHERE appId = (SELECT id FROM apps WHERE bundleId = ?)";

  const [appResults] = await db.execute(appQuery, [bundleId]);

  if (appResults.length === 0) {
    return res.status(404).json({ message: "App not found" });
  }

  const [questionResults] = await db.execute(questionsQuery, [bundleId]);

  res.json({
    app: appResults[0],
    questions: questionResults,
  });
} catch (err) {
  console.error("Error fetching app details:", err);
  return res.status(500).json({ error: "Error fetching data" });
}
});



// ✅ Fetch Questions by Bundle ID
// ✅ Fetch Questions by Bundle ID
app.get("/get-questions-by-bundle/:bundleId", async (req, res) => {
const { bundleId } = req.params;

// Optional: Validate bundleId format here if needed

try {
  // Fetch the app based on the bundle ID
  const [app] = await db.execute("SELECT id, appName FROM apps WHERE bundleId = ?", [bundleId]);

  if (app.length === 0) {
    return res.status(404).json({ success: false, message: "App not found" });
  }

  // Fetch questions associated with the app ID and include appName
  const [questions] = await db.execute(`
    SELECT q.*, a.appName 
    FROM questions q 
    JOIN apps a ON q.appId = a.id 
    WHERE a.id = ?`, [app[0].id]);

  // Include appName in the response
  res.json({ success: true, appName: app[0].appName, questions });
} catch (error) {
  console.error("Error fetching questions:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
});

// ✅ Add a New Question
app.post("/add-question", async (req, res) => {
const { appId, text, answer } = req.body;

if (!appId || !text) {
  return res.status(400).json({ message: "App ID and question text are required." });
}

try {
  const [result] = await db.execute(
    "INSERT INTO questions (text, appId, answer) VALUES (?, ?, ?)",
    [text, appId, answer || null]
  );

  res.json({ success: true, message: "Question added successfully", questionId: result.insertId });
} catch (error) {
  console.error("Error adding question:", error);
  res.status(500).json({ message: "Internal Server Error" });
}
});

// ✅ Update a Question
app.put("/update-question/:id", async (req, res) => {
const { text, answer } = req.body;

if (!text) {
  return res.status(400).json({ message: "Question text is required." });
}

try {
  const [result] = await db.execute("UPDATE questions SET text = ?, answer = ? WHERE id = ?", [text, answer, req.params.id]);
  
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Question not found." });
  }

  res.json({ success: true, message: "✅ Question updated successfully" });
} catch (error) {
  console.error("Error updating question:", error);
  res.status(500).json({ message: "Internal Server Error" });
}
});

// ✅ Delete a Question
app.delete("/delete-question/:id", async (req, res) => {
try {
  const [result] = await db.execute("DELETE FROM questions WHERE id = ?", [req.params.id]);
  
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Question not found." });
  }

  res.json({ success: true, message: "✅ Question deleted successfully" });
} catch (error) {
  console.error("Error deleting question:", error);
  res.status(500).json({ message: "Internal Server Error" });
}
});

const PORT = process.env.PORT || 6003;
https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HTTPS Server running on port ${PORT}`);
});