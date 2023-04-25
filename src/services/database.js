const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

async function insertBook(book) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const collection = client.db().collection('books');

    // Check if a book with the given ID already exists in the database
    const existingBook = await collection.findOne({ id: book.id });
    if (existingBook) {
      console.log(`Book with ID ${book.id} already exists in the collection`);
    } else {
      const result = await collection.insertOne(book);
      console.log(`Inserted book with _id: ${result.insertedId}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

module.exports = { insertBook };
