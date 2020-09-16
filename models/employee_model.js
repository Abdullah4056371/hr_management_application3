const Sequelize = require('sequelize')
const {sequelize} = require('../db/employeeDB_connection');


const employee = sequelize.define('employee', {
    emp_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
    },
    name: {
    type: Sequelize.STRING,
    validate:{
        is: ["^[a-z]+$",'i']
    }
    
    },
    age: {
    type: Sequelize.INTEGER,
    validate:{isNumeric: true}
    },
    gender: {
    type: Sequelize.STRING,
    validate:{
    is: ["^[a-z]+$",'i']
    }    
},
    salary: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
        isNumeric: true,
        }    
    },
    dob: {
    type: Sequelize.DATE,
    validate:{
    isAfter: "1970-01-01",
    }    
},
    doj: {
    type: Sequelize.DATE,
    validate:{
    isAfter: "2011-11-05",
    }   
},
    dol: {
    type: Sequelize.DATE,
    validate:{
    isAfter: "2011-11-05",
    }   
},
    resume: {
    type: Sequelize.BLOB
    },
    bonus: {
    type: Sequelize.INTEGER,
    validate:{
        isNumeric:true
    }
    }
    }, {
        tableName: 'employee',
        timestamps: false
    });

    const salary = sequelize.define('salary_table', {
        sal_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
             
        },
        overtime: {
        type: Sequelize.INTEGER,
        validate:{ isNumeric: true,
        
        }
    },
        medical_reimbursement: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
        isNumeric: true,
        }    
    },
        other_reimbursement: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
        isNumeric: true,
        }    
    },
        emp_id: {
            type: Sequelize. INTEGER,
         

            }
        }, {
            tableName: 'salary_table',
            timestamps: false
        });

        const expertise = sequelize.define('expertise', {
            exp_id: {
                type: Sequelize. INTEGER,
                primaryKey: true,
                autoIncrement:true,
                    },
            expertise_name: {
            type: Sequelize.STRING,
            validate:{
            notEmpty: true,
            
            }
        },
            expertise_detail: {
            type: Sequelize.STRING
            },
            emp_id: {
                type: Sequelize. INTEGER,
            
        }
            }, {
                tableName: 'expertise',
                timestamps: false
            });

            const project = sequelize.define('project', {
                project_id: {
                    type: Sequelize. INTEGER,
                    primaryKey: true,
                    autoIncrement:true,
                     
                    },
                project_name: {
                type: Sequelize.STRING,
                validate:{
                notEmpty: true,
                }    
            },
                project_detail: {
                type: Sequelize.STRING
                },
                emp_id: {
                    type: Sequelize. INTEGER,
                     
                }
                }, {
                    tableName: 'project',
                    timestamps: false
                });


                const leave = sequelize.define('leave', {
                    leave_id: {
                        type: Sequelize. INTEGER,
                        primaryKey: true,
                        autoIncrement:true
                    },
                    med_leaves_avail: {
                    type: Sequelize.INTEGER,
                    validate:{
                    isNumeric: true,
                    }
                },
                    annual_leaves_avail: {
                    type: Sequelize.INTEGER,
                    validate:{
                    isNumeric: true,
                    }    
                },
                    med_leave_availed: {
                    type: Sequelize.INTEGER,
                    validate:{
                    isNumeric: true,
                    }
                },
                    annual_leave_availed: {
                    type: Sequelize.INTEGER,
                    validate:{
                    isNumeric: true,
                    }   
                },
                    emp_id: {
                        type: Sequelize. INTEGER,
                       
                    }
                    }, {
                        tableName: 'leave',
                        timestamps: false
                    });
     

const leave_details = sequelize.define('leave_details', {

    leave_details_id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true,
    
},
leave_id:{
    type: Sequelize. INTEGER,
    
},
med_leave_availed_on: {
    type: Sequelize.DATE,
    validate:{
        isAfter: "2000-01-01",
    }
},
    annual_leave_availed_on: {
    type: Sequelize.DATE,
    validate:{
        isAfter: "2000-01-01",
    }   
},

},
{
    tableName: 'leave_details',
    timestamps: false
});
                        

 
salary.belongsTo(employee, {
    foreignKey: 'emp_id',
    constraints: true,
    as: 'employee_salary',
    onDelete:'cascade'
  });
  project.belongsTo(employee, {
    foreignKey: 'emp_id',
    constraints: true,
    as: 'employee_project',
    onDelete:'cascade'
  });
  expertise.belongsTo(employee, {
    foreignKey: 'emp_id',
    constraints: true,
    as: 'employee_expertise',
    onDelete:'cascade'
  });
  leave.belongsTo(employee, {
    foreignKey: 'emp_id',
    constraints: true,
    as: 'employee_leave',
    onDelete:'cascade'
  });
  leave_details.belongsTo(leave, {
    foreignKey: 'leave_id',
    constraints: true,
    as: 'leave_leave_details',
    onDelete:'cascade'
  });

sequelize.sync();

module.exports = {
    employee,
    salary,
    expertise,
    project,
    leave,
    leave_details
}    