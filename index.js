const { prompt } = require('inquirer')
const { concat } = require('rxjs')
const db = require('./db')
require('console.table')

const {
  Department: {
    getDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    salaryCheck
  },
  Employee: {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    viewManagers,
    viewEmployeesByManagers
  },
  Role: {
    getRoles,
    addRole,
    updateRole,
    deleteRole
  }
} = require('./models')

// continue function
const contCheck = () => {
  prompt({
    type: 'confirm',
    name: 'choice',
    message: 'Would you like to continue?'
  })
    .then(({ choice }) => choice ? menuMain() : process.exit())
    .catch(err => console.log(err))
}

// main menu 
const menuMain = () => {
  prompt({
    type: 'list',
    name: 'option',
    message: 'What would you like to view?',
    choices: ['Departments', 'Roles', 'Employees', 'Exit']
  })
    .then(({ option }) => {
      switch (option) {
        case 'Departments':
          getDepartments()
            .then(departments => {
              console.table(departments)
              menuBasic('Employee Salaries in a Department', option)
            })
          break;
        case 'Roles':
          getRoles()
            .then(roles => {
              console.table(roles)
              menuBasic('none', option)
            })
          break;
        case 'Employees':
          getEmployees()
            .then(employees => {
              console.table(employees)
              menuBasic('Filter Employees by Manager', option)
            })
          break;
        default:
          process.exit()
          break;
      }
    })
    .catch(err => console.log(err))
}

// Basic Menu
const menuBasic = (additional, option) => {
  let menuBasicChoices = ['View', 'Add', 'Update', 'Delete', 'Go Back']
  if (additional !== 'none') {
    menuBasicChoices = ['View', 'Add', 'Update', 'Delete', additional, 'Go Back']
  }
  prompt({
    type: 'list',
    name: 'action',
    message: `What would you like to do in ${option}`,
    choices: menuBasicChoices
  })
    .then(({ action }) => {
      switch (option) {
        case 'Departments':
          menuDepartments(action)
          break;
        case 'Roles':
          menuRoles(action)
          break;
        case 'Employees':
          menuEmployees(action)
          break;
        default:
          menuMain()
          break;
      }
    })
    .catch(err => console.log(err))
}

// Department choice menu
const menuDepartments = (action) => {
  switch (action) {
    case 'View':
      getDepartments()
        .then(departments => {
          console.table(departments)
          contCheck()
        })
      break;
    case 'Add':
      newDepartment()
      break;
    case 'Update':
      patchDepartment()
      break;
    case 'Delete':
      getDepartments()
        .then(departments => {
          console.table(departments)
          prompt({
            type: 'list',
            name: 'erase',
            message: 'Which Department would you like to delete?',
            choices: departments.map(department => ({
              name: department.name,
              value: department.id
            }))
          })
            .then(({ erase }) => {
              deleteDepartment(erase)
                .then(() => {
                  console.log('The Department has been deleted!')
                  contCheck()
                })
            })
        })
        .catch(err => console.log(err))
      break;
    case 'Employee Salaries in a Department':
      getDepartments()
        .then(departments => {
          console.table(departments)
          prompt({
            type: 'list',
            name: 'departmentid',
            message: 'Which Department\'s Salary would you like to check?',
            choices: departments.map(department => ({
              name: department.name,
              value: department.id
            }))
          })
            .then(({ departmentid }) => {
              salaryCheck(departmentid)
                .then(amount => {
                  console.log(`These employees total to $${amount}`)
                  contCheck()
                })
            })
        })
        .catch(err => console.log(err))
      break;
    default:
      menuMain()
      break;
  }
}

// Role choice menu
const menuRoles = (action) => {
  switch (action) {
    case 'View':
      getRoles()
        .then(roles => {
          console.table(roles)
          contCheck()
        })
      break;
    case 'Add':
      newRole()
      break;
    case 'Update':
      patchRole()
      break;
    case 'Delete':
      getRoles()
        .then(roles => {
          console.table(roles)
          prompt({
            type: 'list',
            name: 'erase',
            message: 'Which Role would you like to delete?',
            choices: roles.map(role => ({
              name: role.title,
              value: role.id
            }))
          })
            .then(({ erase }) => {
              deleteRole(erase)
                .then(() => {
                  console.log('The Role has been deleted!')
                  contCheck()
                })
            })
        })
        .catch(err => console.log(err))
      break;
    default:
      menuMain()
      break;
  }
}

// Employee choice menu
const menuEmployees = (action) => {
  switch (action) {
    case 'View':
      getEmployees()
        .then(employees => {
          console.table(employees)
          contCheck()
        })
      break;
    case 'Add':
      newEmployee()
      break;
    case 'Update':
      patchEmployees()
      break;
    case 'Delete':
      getEmployees()
        .then(employees => {
          console.table(employees)
          prompt({
            type: 'list',
            name: 'erase',
            message: 'Which Employee would you like to delete?',
            choices: employees.map(employee => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id
            }))
          })
            .then(({ erase }) => {
              deleteEmployee(erase)
                .then(() => {
                  console.log('The Employee has been deleted!')
                  contCheck()
                })
            })
        })
        .catch(err => console.log(err))
      break;
    case 'Filter Employees by Manager':
      viewManagers()
        .then(managers => {
          console.table(managers)
          prompt({
            type: 'list',
            name: 'managerid',
            message: 'Which Manager do you want to filter by?',
            choices: managers.map(manager => ({
              name: `${manager.first_name} ${manager.last_name}`,
              value: manager.id
            }))
          })
            .then(({ managerid }) => {
              viewEmployeesByManagers(managerid)
                .then(employeeManager => {
                  console.table(employeeManager)
                  contCheck()
                })
            })
        })
        .catch(err => console.log(err))
      break;
    default:
      menuMain()
      break;
  }
}

// make a new Department
const newDepartment = () => {
  prompt(
    {
      type: 'input',
      name: 'name',
      message: 'What is the department\'s name?'
    }
  )
    .then(department => {
      addDepartment(department)
        .then(() => {
          console.log(`Department: ${department.name} Added!`)
          contCheck()
        })
    })
    .catch(err => console.log(err))
}

// make a new Role
const newRole = () => {
  getDepartments()
    .then(departments => {
      prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is your role\'s title?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is your role\'s salary? (please enter a number)'
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'What department does your role belong to?',
          choices: departments.map(department => ({
            name: department.name,
            value: department.id
          }))
        }
      ])
        .then(role => {
          addRole(role)
            .then(() => {
              console.log(`Role: ${role.title} Added!`)
              contCheck()
            })
        })
    })
    .catch(err => console.log(err))
}

// make a new Employee
const newEmployee = () => {
  getRoles()
    .then(roles => {
      viewManagers()
        .then(managers => {
          let options = (managers.map(manager => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id
          })))
          options = options.concat([{ name: 'none', value: null }])
          console.log(options)
          prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'What is the employee\'s First Name?'
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'What is the employee\'s Last Name?'
            },
            {
              type: 'list',
              name: 'role_id',
              message: 'What is the employee\'s Role?',
              choices: roles.map(role => ({
                name: role.title,
                value: role.id
              }))
            },
            {
              type: 'list',
              name: 'manager_id',
              message: 'Who is the employee\'s manager? (Choose none if the employee has no manager)',
              choices: options
            }
          ])
            .then(employee => {
              addEmployee(employee)
                .then(() => {
                  console.log(`Employee: ${employee.first_name} ${employee.last_name} Added!`)
                  contCheck()
                })
            })
        })
    })
}

// update function
const patchDepartment = () => {
  getDepartments()
    .then(departments => {
      prompt([
        {
          type: 'list',
          name: 'id',
          message: 'What Department name would you like to update?',
          choices: departments.map(department => ({
            name: department.name,
            value: department.id
          }))
        },
        {
          type: 'input',
          name: 'name',
          message: 'What would you like to update the Department name to?'
        }
      ])
        .then(department => {
          updateDepartment(department.id, { name: department.name })
            .then(() => {
              contCheck()
            })
        })
    })
}

// update function
const patchRole = () => {
  getRoles()
    .then(roles => {
      prompt([
        {
          type: 'list',
          name: 'id',
          message: 'What role would you like to update?',
          choices: roles.map(role => ({
            name: role.title,
            value: role.id
          }))
        },
        {
          type: 'list',
          name: 'type',
          message: 'What about the role would you like to update?',
          choices: ['Title', 'Salary', 'Department']
        }
      ])
        .then(role => {
          switch (role.type) {
            case 'Title':
              prompt({
                type: 'input',
                name: 'value',
                message: 'What would you like to update the role\'s title to?'
              })
                .then(rolev => {
                  updateRole(role.id, { title: rolev.value })
                    .then(() => {
                      console.log('Role has been updated!')
                      contCheck()
                    })
                })
              break;
            case 'Salary':
              prompt({
                type: 'input',
                name: 'value',
                message: 'What would you like to update the role\'s salary to?'
              })
                .then(rolev => {
                  updateRole(role.id, { salary: rolev.value })
                    .then(() => {
                      console.log('Role has been updated!')
                      contCheck()
                    })
                })
              break;
            case 'Department':
              getDepartments()
                .then(departments => {
                  prompt({
                    type: 'list',
                    name: 'value',
                    message: 'What would you like to update the role\'s department to?',
                    choices: departments.map(department => ({
                      name: department.name,
                      value: department.id
                    }))
                  })
                    .then(rolev => {
                      updateRole(role.id, { department_id: rolev.value })
                        .then(() => {
                          console.log('Role has been updated!')
                          contCheck()
                        })
                    })
                })
              break;
          }
        })
    })
    .catch(err => console.log(err))
}

// update function
const patchEmployees = () => {
  getEmployees()
    .then(employees => {
      prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Which Employee would you like to update?',
          choices: employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          }))
        },
        {
          type: 'list',
          name: 'type',
          message: 'What about the employee would you like to update?',
          choices: ['First Name', 'Last Name', 'Role', 'Manager']
        }
      ])
        .then(employee => {
          switch (employee.type) {
            case 'First Name':
              prompt({
                type: 'input',
                name: 'value',
                message: 'What is the new name?'
              })
                .then(({ value }) => {
                  updateEmployee(employee.id, { first_name: value })
                    .then(() => {
                      console.log('Employee has been updated')
                      contCheck()
                    })
                })
              break;
            case 'Last Name':
              prompt({
                type: 'input',
                name: 'value',
                message: 'What is the new name?'
              })
                .then(({ value }) => {
                  updateEmployee(employee.id, { last_name: value })
                    .then(() => {
                      console.log('Employee has been updated')
                      contCheck()
                    })
                })
              break;
            case 'Role':
              getRoles()
                .then(roles => {
                  prompt({
                    type: 'list',
                    name: 'value',
                    message: 'What is the Employee\'s new Role?',
                    choices: roles.map(role => ({
                      name: role.name,
                      value: role.id
                    }))
                  })
                    .then(({ value }) => {
                      updateEmployee(employee.id, { role_id: value })
                        .then(() => {
                          console.log('Employee has been updated')
                          contCheck()
                        })
                    })
                })
              break;
            case 'Manager':
              viewManagers()
                .then(managers => {
                  let options = (managers.map(manager => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id
                  })))
                  prompt({
                    type: 'list',
                    name: 'value',
                    message: 'Who is the Employee\'s new manager? (choose none if no manager/is a manager)',
                    choices: options
                  })
                    .then(({ value }) => {
                      updateEmployee(employee.id, { manager_id: value })
                        .then(() => {
                          console.log('Employee has been updated')
                          contCheck()
                        })
                    })
                })
              break;
          }
        })
    })
    .catch(err => console.log(err))
}

menuMain()
