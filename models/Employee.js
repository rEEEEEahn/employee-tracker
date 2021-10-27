const orm = require('./orm.js')
const Department = require('./Department')

const Employee = {
  async getEmployees() {
    const employees = await orm.find('employee')
    return employees
  },
  async addEmployee(employee) {
    const newEmployee = await orm.add('employee', employee)
    return newEmployee
  },
  async updateEmployee(id, updates) {
    const updated = await orm.findAndUpdate('employee', id, updates)
    return updated
  },
  async deleteEmployee(id) {
    const deleted = await orm.delete('employee', id)
    return deleted
  },
  async viewManagers () {
    const managers = await orm.findWhere('employee', 'manager_id IS NULL')
    return managers
  },
  async viewEmployeesByManagers(id) {
    const employees = await orm.findWhere('employee', `manager_id = ${id}`)
    return employees
  },
}

module.exports = Employee