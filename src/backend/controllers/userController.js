import { db } from '../db'

import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw { status: 400, errors: errors.array(), message: 'Invalid input' }
    }
    const { email, name, password } = req.body

    const saltRounds = 10
    const hashedPass = await bcrypt.hash(password, saltRounds)

    const userExists = db.prepare('SELECT * FROM users WHERE email= ?')
    const user = userExists.get(email)
    if (user) {
      throw { status: 409, message: 'User already exists.' }
    }

    const insertUser = db.prepare(`INSERT INTO users(email, name, password) VALUES(?,?,?)`)
    const result = insertUser.run(email, name, hashedPass)

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
    const userExists = db.prepare('SELECT * FROM users WHERE email= ?')
    const user = userExists.get(email)

    if (user) {
      const validCredentials = await bcrypt.compare(password, user.password)
      if (validCredentials) {
        res.json({ message: 'user exists', validCredentials: true, id: user.id })
      } else {
        throw { status: 401, message: 'Invalid credentials' }
      }
    } else {
      throw { status: 404, message: 'User not found' }
    }
  } catch (error) {
    next(error)
  }
}
