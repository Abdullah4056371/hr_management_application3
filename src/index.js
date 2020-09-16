const express = require('express')
const app = express()
const port = process.env.PORT ||5000
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    next();
  });
  
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const { employee, salary, expertise, project, leave, leave_details } = require('../models/employeeDb_model');

//employee-data-saving
app.post('/employee', async (req, res) => {
    try {
        const newEmployee = await new employee(req.body)
        const newSalary = await new salary(req.body)
        const newProject = await new project(req.body)
        const newExpertise = await new expertise(req.body)
        const newLeave = await new leave(req.body)
        const newLeave_details = await new leave_details(req.body)
      
        await newEmployee.save();
        newSalary.emp_id = newEmployee.emp_id;
        await newSalary.save();
        newProject.emp_id = newEmployee.emp_id;
        await newProject.save();
        newExpertise.emp_id = newEmployee.emp_id;
        await newExpertise.save();
        newLeave.emp_id = newEmployee.emp_id;
        await newLeave.save();
        newLeave_details.leave_id = newLeave.leave_id;
        await newLeave_details.save();
        
        let employee_data = JSON.parse(JSON.stringify(newEmployee));
        let salary_data = JSON.parse(JSON.stringify(newSalary));
        let project_data = JSON.parse(JSON.stringify(newProject));
        let expertise_data = JSON.parse(JSON.stringify(newExpertise));
        let leave_data = JSON.parse(JSON.stringify(newLeave));
        let leave_details_data = JSON.parse(JSON.stringify(newLeave_details));
        let EMPLOYEE1 = { ...employee_data, ...salary_data, ...project_data, ...expertise_data , ...leave_data ,...leave_details_data} 
        res.status(200).send(EMPLOYEE1);
    } catch(error) {
        res.status(400).send(error);
    }
})

////////////////// Get of Employee by id  /////////////////////////////////
app.get('/employee/:emp_id',async (req, res)=>{
    try{ 
    let employee1 = await employee.findOne({
        where:{
            emp_id:req.params.emp_id
        },
         include:[
             {
                 as:'employee_salary_relation',
                 model:salary,
             },
             {
                 as:'employee_project_relation',
                 model:project,
             },
             {
                 as:'employee_expertise_relation',
                 model:expertise,
             }
             ,
             {
                 as:'employee_leave_relation',
                 model:leave,
                 include:[{
                    as:'leave_leave_details_relation',
                    model:leave_details
                    
                 } 
                 ],
             }
             
         ]
     }
     )
    employee1 = JSON.parse(JSON.stringify(employee1));
    let employee_data = {
                name: employee1.name,
                age: employee1.age,
                gender: employee1.gender,
                salary: employee1.salary,
                dob: employee1.dob,
                doj: employee1.doj,
                dol: employee1.dol,
                resume: employee1.resume,
                bonus: employee1.bonus
                    }
    const salary_data = employee1.employee_salary_relation;
    const project_data = employee1.employee_project_relation;
    const expertise_data = employee1.employee_expertise_relation;
    const leave_data = employee1.employee_leave_relation;
    const leave_data1 = {
        med_leaves_avail:leave_data.med_leaves_avail,
        annual_leaves_avail:leave_data.annual_leaves_avail,
        med_leave_availed:leave_data.annual_leave_availed,
        annual_leave_availed:leave_data.annual_leave_availed

    } 
    const leave_details_data = leave_data.leave_leave_details_relation;
    let EMPLOYEE1 = { ...employee_data, ...salary_data, ...project_data, ...expertise_data , ...leave_data1 ,...leave_details_data} 
   
    res.json({EMPLOYEE:EMPLOYEE1})
    }catch(error){
        res.json({Error:"Error"})
    }
 })
 
 /////////////////////////////Update data of an employee////////////////////////
app.patch('/employee/:emp_id', async(req, res)=>{
    console.log("update Query");
    const emp_Id = req.params.emp_id;
    const changedValues = req.body;
    try{
        const result1 = await employee.update(
            changedValues
        ,{
                where:{
                    emp_id:emp_Id
                }
            }
        )
        const result2 = await salary.update(
            changedValues
        ,{
                where:{
                    emp_id:emp_Id
                }
            }
        )
        const result3 = await expertise.update(
            changedValues
        ,{
                where:{
                    emp_id:emp_Id
                }
            }
        )
        const result4 = await project.update(
            changedValues
        ,{
                where:{
                    emp_id:emp_Id
                }
            }
        )
        const result5 = await leave.update(
            changedValues
        ,{
                where:{
                    emp_id:emp_Id
                }
            }
        )
        let leave1 = await leave.findAll({
            where: {
            emp_id: emp_Id
            }
            }
            )
        leave1 = JSON.parse(JSON.stringify(leave1));
        const leave_Id = leave1[0].leave_id
        const result6 = await leave_details.update(
            changedValues
        ,{
                where:{
                    leave_id:leave_Id
                }
            }
        )
        if(result1[0] || result2[0] || result3[0] || result4[0] || result5[0] || result6[0]){
            return res.status(200).send(changedValues);
         }
         res.status(400).send("ID not exist");
         
    }
    catch(error){
        res.status(400).send(error);
    }

})


//////////////////////////////////////////Get Monthly Salary/////////////////////////////////
app.get('/employee/salary/:emp_id',async(req, res)=>{
    const emp_Id = req.params.emp_id;
    try{
        const employee1 = await employee.findAll({
            where:{
                emp_id:emp_Id
            }
        })
        if(!employee1[0]){
            return res.json({Error:"ID does'nt Exist"});
            }
        const salary1 = await salary.findAll({
            where:{
                emp_id:emp_Id
            }
        })
        
        let salary_data = JSON.parse(JSON.stringify(salary1));
        let employee_data = JSON.parse(JSON.stringify(employee1));
        employee_data = employee_data[0];
        salary_data = salary_data[0];
        let monthly_hours_worked = 24*8;
        let hourly_rate = employee_data.salary/monthly_hours_worked;
        let over_time_salary = salary_data.overtime*hourly_rate;
        let total_salary = employee_data.salary + salary_data.medical_reimbursement + salary_data.other_reimbursement + over_time_salary ;
        res.json({Total_salary:total_salary}); 
        }
        catch(error)
        {
            console.log(error);
        }
    })


///////////////////////////////////////////////////////////////////////////////////

////////////////// Data Pagination  /////////////////////////////////
app.get('/employee',async (req, res)=>{
    let limit1 = req.query.limit; 
    //| 25;
    let offset1 = req.query.offset; 
    //| 0;
    try{
    let employee1 =  await employee.findAll({ 
    offset:offset1,
    limit:limit1,
    order:[
        ["emp_id","ASC"]
    ]    
    })
    employee1 = JSON.parse(JSON.stringify(employee1))
    let arr = [];
    for(let i = 0 ; i <employee1.length ; i++)
    {
        let {emp_id} = employee1[i];
        arr[i] = emp_id;
    }
    let salary1 =  await salary.findAll({ 
        where:{
            emp_id:arr
        }
        ,
        order:[
            ["emp_id","ASC"]
        ],

        })
    //console.log(arr)
    salary1 = JSON.parse(JSON.stringify(salary1));
    let expertise1 =  await expertise.findAll({ 
        where:{
            emp_id:arr
        }
        ,
        order:[
            ["emp_id","ASC"]
        ],

        })
    expertise1 = JSON.parse(JSON.stringify(expertise1));    
    let project1 =  await project.findAll({ 
        where:{
            emp_id:arr
        }
        ,
        order:[
            ["emp_id","ASC"]
        ],

        })
    project1 = JSON.parse(JSON.stringify(project1));
    let leave1 =  await leave.findAll({ 
        where:{
            emp_id:arr
        }
        ,
        order:[
            ["emp_id","ASC"]
        ],

        })
    leave1 = JSON.parse(JSON.stringify(leave1));
    let leave_details1 =  await leave_details.findAll({ 
        where:{
            leave_id:arr
        }
        ,
        order:[
            ["leave_id","ASC"]
        ],
        })
    leave_details1 = JSON.parse(JSON.stringify(leave_details1));
    let arr1 = [];
    for(let i = 0 ;i <arr.length ;i++)
    {
        let { emp_id, name , age, gender, salary, dob, doj, dol, resume, bonus } = employee1[i];
        let { overtime, medical_reimbursement, other_reimbursement } = salary1[i]
        let { expertise_name, expertise_detail } =  expertise1[i]
        let { project_name, project_details } = project1[i]
        let { med_leaves_avail, annual_leaves_avail, med_leave_availed, annual_leave_availed } = leave1[i]
        let { med_leave_availed_on , annual_leave_availed_on } = leave_details1[i];
        
        arr1[i] = { emp_id, name , age, gender, salary, dob, doj, dol, resume, bonus, 
                    overtime, medical_reimbursement, other_reimbursement, expertise_name, expertise_detail, 
                    project_name, project_details, 
                    med_leaves_avail, annual_leaves_avail, med_leave_availed, annual_leave_availed,
                    med_leave_availed_on , annual_leave_availed_on } 
    }
    res.send(arr1);
    }
    catch(error)
    {
    res.send(error);
    } 
})

//////// Deleting  employee data by id   /////////
app.delete('/employee/:emp_id',async (req, res)=>{
    try{
        const emp_Id = req.params.emp_id;
        let deleted1 =  await employee.destroy({
        where: {
                emp_id:emp_Id
            }    
})
if(deleted1)
{
   return res.json({Result:"data Is deleted Successfully"})
}
res.json({Error:"ID doestnt exists"});    
}
    catch(error)
    {
        res.json({Error:"Something Wrong Happend"});    

    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))