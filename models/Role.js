const orm = require('./orm.js')

const Role = {
  async getRoles() {
    const roles = await orm.find('role')
    return roles
  },
  async addRole(role) {
    const newRole = await orm.add('role', role)
    return newRole
  },
  async updateRole(id, updates) {
    const updated = await orm.findAndUpdate('role', id, updates)
    return updated
  },
  async deleteRole(id) {
    const deleted = await orm.delete('role', id)
    return deleted
  }
}

module.exports = Role