import { db } from '../db'
import { validationResult } from 'express-validator'

export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw { status: 400, errors: errors.array(), message: 'Invalid input' }
    }

    const { email, name, password } = req.body
    const insertUser = db.prepare(`INSERT INTO users(email, name, password) VALUES(?,?,?)`)
    const result = insertUser.run(email, name, password)

    res.status(201).json(`User registered: ${result.lastInsertRowid}`)
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw { status: 400, errors: errors.array(), message: 'Invalid input' }
    }

    const { email, password } = req.body
    const userExists = db.prepare('SELECT * FROM users WHERE email= ? AND password = ?')
    const user = userExists.get(email, password)
    console.log('user: ', user)

    if (user) {
      res.json({ message: 'user exists', validCredentials: true, id: user.id })
    } else {
      throw { status: 404, message: 'User not found' }
    }
  } catch (error) {
    next(error)
  }
}
