import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calculation } from '../entities/Calculation';
import { Like } from '../entities/Like';
import { Comment } from '../entities/Comment';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './data/mmnx.sqlite';

// Ensure data directory exists
const dbDir = path.dirname(path.resolve(DB_PATH));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: path.resolve(DB_PATH),
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: [Calculation, Like, Comment],
  });

  await dataSource.initialize();
  return dataSource;
}
