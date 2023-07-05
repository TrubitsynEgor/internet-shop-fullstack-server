import { v4 } from 'uuid'
import path from 'path'
import { Device } from '../models/models.js'
import ApiError from '../error/ApiError.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body
      const { image } = req.files
      let fileName = v4() + '.jpg'
      image.mv(path.resolve(__dirname, '../static', fileName))

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        image: fileName,
      })

      return res.json(device)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    const { brandId, typeId } = req.body
  }

  async getOne(req, res) {}
}

export default new DeviceController()
