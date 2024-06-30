const db = require('./db');

const getAllTablesQuery = `
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'expensetracker' AND table_type = 'BASE TABLE';
`;

async function deleteTables() {
  try {
    const [results] = await db.query(getAllTablesQuery);

    console.log('Tables:', results);

    const tableNames = results.map(row => row.TABLE_NAME);

    if (tableNames.length > 0) {
      const dropTablesQuery = `DROP TABLE ${tableNames.join(', ')}`;
      console.log('Executing SQL:', dropTablesQuery);

      await db.query(dropTablesQuery);
      console.log('All tables dropped successfully.');
    } else {
      console.log('No tables found to drop.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

deleteTables();
