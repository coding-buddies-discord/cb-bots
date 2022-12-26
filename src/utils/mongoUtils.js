import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { SIMPLE_MODELS } from '../../models/SIMPLE_MODELS';

dotenv.config();

const { ACTIVE_ENV, MONGO_URI } = process.env;

const { DB_NAME, COLLECTION_NAME } = SIMPLE_MODELS;

const client = new MongoClient(MONGO_URI);

const collection = ACTIVE_ENV === 'test' ? 'test' : COLLECTION_NAME;

export const connectDb = async () => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    // collection name should be passed in, in the future
    const buddies = db.collection(collection);
    // need to export the client so that it can be closed in testing otherwise Jest will freak out
    return [buddies, client];
  } catch (error) {
    console.log(error);
    throw new Error('Failed to connect to DB');
  }
};
