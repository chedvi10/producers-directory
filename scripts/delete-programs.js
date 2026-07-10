/*
  scripts/delete-programs.js
  -- Deletes all program documents from the MongoDB database.
  -- Reads `DATABASE_URL` from process.env or .env file.
  IMPORTANT: This is destructive and irreversible. Use with care.
*/

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('ERROR: DATABASE_URL not found. Create a .env file with DATABASE_URL or export it to the environment.');
    process.exit(1);
  }

  // Newer mongodb drivers don't accept the old options; use default client
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(); // uses database from connection string

    const collectionsToTry = ['Program', 'program', 'programs', 'Programs'];

    for (const name of collectionsToTry) {
      try {
        const col = db.collection(name);
        const count = await col.countDocuments();
        if (count > 0) {
          const res = await col.deleteMany({});
          console.log(`Deleted ${res.deletedCount} documents from collection '${name}'.`);
        } else {
          console.log(`Collection '${name}' exists but has ${count} documents (no deletion).`);
        }
      } catch (err) {
        // ignore missing collection errors
        console.log(`Skipping collection '${name}': ${err.message}`);
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Failed to connect or delete:', err);
  } finally {
    await client.close();
  }
}

main();
