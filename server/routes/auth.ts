import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (username === 'demo' && password === 'demo') {
      const token = jwt.sign(
        { userId: 'demo', username: 'demo' },
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '24h' }
      )

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: 'demo',
            username: 'demo',
            accountValue: 125420.69,
            buyingPower: 45230.50
          }
        }
      })
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed'
    })
  }
})

router.post('/verify', (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret')
    
    res.json({
      success: true,
      data: { valid: true, user: decoded }
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    })
  }
})

export default router