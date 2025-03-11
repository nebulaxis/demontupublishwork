import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection Setup
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "app_login",
});

try {
  await db.connect();
  console.log("✅ Connected to MySQL database");
} catch (err) {
  console.error("❌ Database connection failed:", err);
  process.exit(1);
}

// ✅ Login Route
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
app.get("/get-questions-by-bundle/:bundleId", async (req, res) => {
  const { bundleId } = req.params;

  try {
    const [app] = await db.execute("SELECT id FROM apps WHERE bundleId = ?", [bundleId]);

    if (app.length === 0) {
      return res.status(404).json({ message: "App not found" });
    }

    const [questions] = await db.execute("SELECT * FROM questions WHERE appId = ?", [app[0].id]);
    res.json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

// ✅ Start Server
const PORT = process.env.PORT || 6002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});