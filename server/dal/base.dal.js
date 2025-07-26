/**
 * Base Data Access Layer
 * Provides common database operations that can be extended
 */

export class BaseDAL {
  constructor(model) {
    this.model = model
  }

  // Create a new document
  async create(data) {
    try {
      const document = new this.model(data)
      return await document.save()
    } catch (error) {
      throw error
    }
  }

  // Find document by ID
  async findById(id, select = null) {
    try {
      let query = this.model.findById(id)
      if (select) {
        query = query.select(select)
      }
      return await query
    } catch (error) {
      throw error
    }
  }

  // Find one document by criteria
  async findOne(criteria, select = null) {
    try {
      let query = this.model.findOne(criteria)
      if (select) {
        query = query.select(select)
      }
      return await query
    } catch (error) {
      throw error
    }
  }

  // Find all documents
  async findAll(criteria = {}, select = null, sort = null) {
    try {
      let query = this.model.find(criteria)
      if (select) {
        query = query.select(select)
      }
      if (sort) {
        query = query.sort(sort)
      }
      return await query
    } catch (error) {
      throw error
    }
  }

  // Update document by ID
  async updateById(id, updates) {
    try {
      return await this.model.findByIdAndUpdate(id, updates, { new: true })
    } catch (error) {
      throw error
    }
  }

  // Delete document by ID
  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id)
    } catch (error) {
      throw error
    }
  }

  // Count documents
  async count(criteria = {}) {
    try {
      return await this.model.countDocuments(criteria)
    } catch (error) {
      throw error
    }
  }

  // Check if document exists
  async exists(criteria) {
    try {
      return await this.model.exists(criteria)
    } catch (error) {
      throw error
    }
  }
} 