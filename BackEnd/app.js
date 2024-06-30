const express = require("express");
const app = express();
const port = 8000;
app.use(express.json());
const db = require("./db");
const cors = require('cors');

// const tables = require('./tables')
app.use(cors()); 


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/addexpense", async (req, res) => {
  const { user_id, amount, type, name } = req.body;

  if (!user_id || !amount || !type || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO expenses (user_id, amount, type, name) VALUES (?, ?, ?, ?)",
      [user_id, amount, type, name]
    );

    return res.status(201).json({ message: "Expense added successfully", id: result.insertId });
  } catch (err) {
    console.error('Error adding expense:', err);
    return res.status(500).json({ error: "Error adding expense" });
  }
});

app.get("/api/getexpense", async (req, res) => {
  try {
    const [getexpense] = await db.query("SELECT * FROM expenses");
    console.log(getexpense);
    return res.status(200).json({ result: getexpense });
  } catch (err) {
    console.error('Error fetching expenses:', err);
    return res.status(500).json({ error: "Error fetching expenses" });
  }
});

app.delete("/api/deleteexpense/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM expenses WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error('Error deleting expense:', err);
    return res.status(500).json({ error: "Error deleting expense" });
  }
});

app.post("/api/adduser", async(req,res)=>{
  const { email,password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email,password]
    );

    return res.status(201).json({ message: "user added successfully", id: result });
  } catch (err) {
    console.error('Error adding user:', err);
    return res.status(500).json({ error: "Error adding user" });
  }
}) 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
