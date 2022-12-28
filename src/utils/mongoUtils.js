import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { SIMPLE_MODELS } from '../../models/SIMPLE_MODELS.js';

dotenv.config();

const { ACTIVE_ENV, MONGO_URI } = process.env;

const { DB_NAME, COLLECTION_NAME } = SIMPLE_MODELS;

const client = new MongoClient(MONGO_URI);

const collection = ACTIVE_ENV === 'test' ? 'test' : COLLECTION_NAME;

export const connectDb = async () => {
  try {
    await client.connect();
    const connect = client.db(DB_NAME);
    // collection name should be passed in, in the future
    const db = connect.collection(collection);
    // need to export the client so that it can be closed in testing otherwise Jest will freak out
    return { db, client };
  } catch (error) {
    console.log(error);
    throw new Error('Failed to connect to DB');
  }
};
