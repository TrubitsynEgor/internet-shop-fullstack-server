import { v4 } from 'uuid'
import path from 'path'
import { Device, DeviceInfo } from '../models/models.js'
import ApiError from '../error/ApiError.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body
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

      if (info) {
        info = JSON.parse(info)
        info.forEach((el) => {
          DeviceInfo.create({
            title: el.title,
            description: el.description,
            deviceId: device.id,
          })
        })
      }

      return res.json(device)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, page, limit } = req.query
    page = page || 1
    limit = limit || 9
    let offset = page * limit - limit

    let devices
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset })
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      })
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      })
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      })
    }

    return res.json(devices)
  }

  async getOne(req, res) {
    const { id } = req.params
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    })

    return res.json(device)
  }
}

export default new DeviceController()
