import jwt from 'jsonwebtoken'

export default function (role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next()
    }

    try {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return res.status(401).json({ message: 'User is no auth' })
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      if (decoded.role !== role) {
        res.status(403).json({ message: 'Success denied' })
      }
      req.user = decoded
      next()
    } catch (e) {
      res.status(401).json({ message: 'User is not auth' })
    }
  }
}
