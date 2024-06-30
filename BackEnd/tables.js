const db = require('./db');

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)`;

const createExpenseTable = `
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  amount INT,
  type VARCHAR(255),
  name VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

async function createTables() {
  try {
    // Create users table
    const [userResults] = await db.query(createUserTable);
    console.log('User table created:', userResults);

    // Create expenses table
    const [expenseResults] = await db.query(createExpenseTable);
    console.log('Expense table created:', expenseResults);
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    await db.end();
  }
}

createTables();
