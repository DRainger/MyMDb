import { BaseDAL } from './base.dal.js'
import User from '../models/User.js'

/**
 * Example DAL class showing how to extend BaseDAL
 * This is for demonstration purposes - not used in the actual application
 */

export class ExampleUserDAL extends BaseDAL {
  constructor() {
    super(User)
  }

  // Custom method specific to users
  async findUsersByRole(role) {
    try {
      return await this.model.find({ role }).select('-password')
    } catch (error) {
      throw error
    }
  }

  // Custom method with aggregation
  async getUserStats() {
    try {
      return await this.model.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            avgCreatedAt: { $avg: { $dateToString: { date: '$createdAt' } } }
          }
        }
      ])
    } catch (error) {
      throw error
    }
  }

  // Override base method with custom logic
  async findById(id, select = null) {
    try {
      let query = this.model.findById(id)
      if (select) {
        query = query.select(select)
      } else {
        // Default to excluding password
        query = query.select('-password')
      }
      return await query
    } catch (error) {
      throw error
    }
  }
}

// Usage example:
// const userDAL = new ExampleUserDAL()
// const adminUsers = await userDAL.findUsersByRole('admin')
// const userStats = await userDAL.getUserStats()
// const user = await userDAL.findById(userId) 