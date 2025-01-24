import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import fs from 'fs'

const userDataPath = app.getPath('userData')
const dbPath = join(userDataPath, '.router-electron.db')
export let db

export const initDb = () => {
  try {
    // Ensure userData directory exists
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true })
    }

    // Create database connection
    db = new Database(dbPath, {
      verbose: console.log // Remove in production, useful for debugging
    })

    console.log('Database created at:', dbPath)
    setupTables()
    return true
  } catch (err) {
    console.error('Database initialization error:', err)
    throw err
  }
}

const setupTables = () => {
  try {
    const createUserTable = `CREATE TABLE IF NOT EXISTS
      users(
        'id' INTEGER PRIMARY KEY AUTOINCREMENT,
        'name' VARCHAR,
        'email' VARCHAR,
        'password' VARCHAR
      );`
    db.exec(createUserTable)
  } catch (err) {
    console.error(`Error creating tables:`, err)
    throw err
  }
}

export const closeDb = () => {
  if (db) {
    console.log('Closing connection to db')
    db.close()
  }
}
