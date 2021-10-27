const db = require('../db')

const orm = {
  async find(table) {
    const response = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${table};`, (err, data) => {
        if (err) { reject(err) }
        resolve(data)
      })
    })
    return response
  },
  async add(table, data) {
    const response = await new Promise((resolve, reject) => {
      db.query(`INSERT INTO ${table} SET ?`, data, (err, fields) => {
        if (err) { reject(err) }
        db.query(`SELECT * FROM ${table} WHERE ?`, { id: fields.insertId }, (err, newData) => {
          if (err) { reject(err) }
          resolve(newData[0])
        })
      })
    })
    return response
  },
  async findAndUpdate (table, id, updates) {
    const response = await new Promise((resolve, reject) => {
      db.query(`UPDATE ${table} SET ? WHERE ?`, [updates, { id }], err => {
        if (err) { reject(err) }
        resolve()
      })
    })
    return response
  },
  async delete (table, id) {
    const response = await new Promise((resolve, reject) => {
      db.query(`DELETE FROM ${table} WHERE ?`, { id }, err => {
        if (err) { reject(err) }
        resolve()
      })
    })
    return response
  },
  async findWhere(table, where) {
    const response = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${table} WHERE ${where}`, (err, data) => {
        if (err) { reject(err) }
        resolve(data)
      })
    })
    return response
  },
  async departmentSalaryTable(id) {
    const response = await new Promise((resolve, reject) => {
      db.query(`SELECT department.id, department.name, role.id, role.title, role.salary, employee.first_name
        FROM ((department
        INNER JOIN role ON department.id = role.department_id AND department.id = ${id})
        INNER JOIN employee ON role.id = employee.role_id);`, (err, data) => {
        if (err) { reject(err) }
        resolve(data)
      })
    })
    return response
  },
}

module.exports = orm