let ids_array = [];
let id_of_button_to_edit;

////////////////////////////////////////////////////////////////////////////////////////

let form ;
let name_inp ;
let age_inp ;
let gender_inp ;
let salary_inp ;
let dob_inp ;
let doj_inp ;
let dol_inp ;
let resume_inp ;
let bonus_inp ;
let exp_name_inp ;
let exp_detail_inp ;
let med_leave_available_inp ;
let annual_leave_available_inp ;
let med_leave_availed_inp ;
let annual_leave_availed_inp ;
let med_leave_availed_on_inp ;
let annual_leave_availed_on_inp ;
let project_name_inp ;
let project_detail_inp ;
let overtime_inp ;
let medical_reimbursement_inp ;
let other_reimbursement_inp ;

let body1;

async function employee_function()
{
  name_inp =  document.getElementById("name_inp").value;
  age_inp =  document.getElementById("age_inp").value;
  gender_inp =  document.getElementById("gender_inp").value;
  salary_inp =  document.getElementById("salary_inp").value;
  dob_inp =  document.getElementById("dob_inp").value;
  doj_inp =  document.getElementById("doj_inp").value;
  dol_inp =  document.getElementById("dol_inp").value;
  resume_inp =  document.getElementById("resume_inp").value;
  bonus_inp =  document.getElementById("bonus_inp").value;
  exp_name_inp =  document.getElementById("exp_name_inp").value;
  exp_detail_inp =  document.getElementById("exp_detail_inp").value;
  med_leave_available_inp =  document.getElementById("med_leave_available_inp").value;
  annual_leave_available_inp =  document.getElementById("annual_leave_available_inp").value;
  med_leave_availed_inp =  document.getElementById("med_leave_availed_inp").value;
  annual_leave_availed_inp =  document.getElementById("annual_leave_availed_inp").value;
  med_leave_availed_on_inp =  document.getElementById("med_leave_availed_on_inp").value;
  annual_leave_availed_on_inp =  document.getElementById("annual_leave_availed_on_inp").value;
  project_name_inp =  document.getElementById("project_name_inp").value;
  project_detail_inp =  document.getElementById("project_detail_inp").value;
  overtime_inp =  document.getElementById("overtime_inp").value;
  medical_reimbursement_inp =  document.getElementById("medical_reimbursement_inp").value;
  other_reimbursement_inp =  document.getElementById("other_reimbursement_inp").value;
//   console.log(name_inp);

   body1 = {
    "name":name_inp,
    "age":age_inp,
    "gender":gender_inp,
    "dob":dob_inp,
    "doj":doj_inp,
    "dol":dol_inp,
    "resume":resume_inp,
    "bonus":bonus_inp,
    "salary":salary_inp,
    "overtime":overtime_inp,
    "medical_reimbursement":medical_reimbursement_inp,
    "other_reimbursement":other_reimbursement_inp,
    "expertise_name":exp_name_inp,
    "expertise_detail":exp_detail_inp,
    "project_name":project_name_inp,
    "project_detail":project_detail_inp,
    "med_leaves_avail":med_leave_available_inp,
    "annual_leaves_avail":annual_leave_available_inp,
    "med_leave_availed":med_leave_availed_inp,
    "annual_leave_availed":annual_leave_availed_inp,
    "med_leave_availed_on":med_leave_availed_on_inp,
    "annual_leave_availed_on":annual_leave_availed_on_inp

}
 let body2 = JSON.stringify(body1);
 var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//var raw = body2;

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: body2,
  redirect: 'follow'
};

fetch("http://localhost:5000/employee", requestOptions)
  .then(result => {
      if(result.status===400)
      {
          throw new Error;
      }
      if(result.status===200){
        alert("DATA SAVED");
        return location.reload();
      }

})
  .catch(error => {
   console.log(error);
    alert("Wrong Type Entered");
  return location.reload();
}); 
}

//////////////////////////////////////////////////////////
//Table to show the Data of table
async function show_table_data1(limit=25, offset=0)
{
    let data1;
 var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
const result = await fetch("http://localhost:5000/employee?limit="+limit+"&offset="+offset , requestOptions)
    .then(response => response.json())
    .then(result => {data1 = result;
        show_table_data(data1);
    })
    
    .catch(error => console.log('error', error));
}

async function show_table_data(data1)
{
let rn = data1.length + 1; 
let cn = 22;
let keys = Object.keys(data1[0]);
 
for(var r=0;r<parseInt(rn,10);r++)
  {
    let values;
    var edit_button = document.createElement('button');
    edit_button.className = "btn btn-default";
    edit_button.innerText = "Edit Button";
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = "value";
    if(r!==0){
        values = Object.values(data1[r-1]);
        checkbox.id = data1[r-1].emp_id;
        edit_button.id = data1[r-1].emp_id + 'b';
        ids_array[r-1] = data1[r-1].emp_id;
    }   
    var x= document.getElementById('myTable').insertRow(r);
    if(r!==0){
    x.appendChild(edit_button)
    x.appendChild(checkbox)
    x.id = data1[r-1].emp_id +"r";    
}
   for(var c=0;c<=parseInt(cn,10);c++)  
    {
        if(r!==0)
        {
            if(c===22)
            {
                continue
            }
        }
       if(r===0)
       {
        if(c===0)
        {
            var y=  x.insertCell(c);
            y.innerHTML= "CheckBox";
            continue;   
        }
         var y=  x.insertCell(c);
         y.innerHTML= keys[c-1];
         continue 
       }
        var y=  x.insertCell(c);
        y.innerHTML= values[c]; 
    }
   }
   addClickListnersToEditButton();
}

////////////////////////////////////////////////////////////
//// Delete Records of selected
async function delete_records()
{
    for(let i=0; i <ids_array.length ; i++){
        let ch_box = document.getElementById(ids_array[i]);
        // console.log(ch_box);
        // console.log(ch_box.id)
        if(ch_box.checked){
            console.log("checkbox checkd")
            await delete_one_data(ids_array[i])        
        }
        }
        location.reload();

  
}
////Delete 
async function delete_one_data(id)
{
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
      
     await fetch("http://localhost:5000/employee/"+id, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}


///////////////////////////////////////////////////////

///////////////////////Edit employee data
async function edit_data()
{
    name_inp =  document.getElementById("name_inp1").value;
    age_inp =  document.getElementById("age_inp1").value;
    gender_inp =  document.getElementById("gender_inp1").value;
    salary_inp =  document.getElementById("salary_inp1").value;
    dob_inp =  document.getElementById("dob_inp1").value;
    doj_inp =  document.getElementById("doj_inp1").value;
    dol_inp =  document.getElementById("dol_inp1").value;
    resume_inp =  document.getElementById("resume_inp1").value;
    bonus_inp =  document.getElementById("bonus_inp1").value;
    exp_name_inp =  document.getElementById("exp_name_inp1").value;
    exp_detail_inp =  document.getElementById("exp_detail_inp1").value;
    med_leave_available_inp =  document.getElementById("med_leave_available_inp1").value;
    annual_leave_available_inp =  document.getElementById("annual_leave_available_inp1").value;
    med_leave_availed_inp =  document.getElementById("med_leave_availed_inp1").value;
    annual_leave_availed_inp =  document.getElementById("annual_leave_availed_inp1").value;
    med_leave_availed_on_inp =  document.getElementById("med_leave_availed_on_inp1").value;
    annual_leave_availed_on_inp =  document.getElementById("annual_leave_availed_on_inp1").value;
    project_name_inp =  document.getElementById("project_name_inp1").value;
    project_detail_inp =  document.getElementById("project_detail_inp1").value;
    overtime_inp =  document.getElementById("overtime_inp1").value;
    medical_reimbursement_inp =  document.getElementById("medical_reimbursement_inp1").value;
    other_reimbursement_inp =  document.getElementById("other_reimbursement_inp1").value;

    body3 = {
        "name":name_inp,
        "age":age_inp,
        "gender":gender_inp,
        "dob":dob_inp,
        "doj":doj_inp,
        "dol":dol_inp,
        "resume":resume_inp,
        "bonus":bonus_inp,
        "salary":salary_inp,
        "overtime":overtime_inp,
        "medical_reimbursement":medical_reimbursement_inp,
        "other_reimbursement":other_reimbursement_inp,
        "expertise_name":exp_name_inp,
        "expertise_detail":exp_detail_inp,
        "project_name":project_name_inp,
        "project_detail":project_detail_inp,
        "med_leaves_avail":med_leave_available_inp,
        "annual_leaves_avail":annual_leave_available_inp,
        "med_leave_availed":med_leave_availed_inp,
        "annual_leave_availed":annual_leave_availed_inp,
        "med_leave_availed_on":med_leave_availed_on_inp,
        "annual_leave_availed_on":annual_leave_availed_on_inp
    
    }
    //body3 = JSON.stringify(body3);

    for (let propName in body3) { 
        if (body3[propName] === null || body3[propName] === undefined || body3[propName]=== "") {
          delete body3[propName];
        }
      }
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify(body3),
        redirect: 'follow'
      };
      fetch("http://localhost:5000/employee/" + id_of_button_to_edit , requestOptions)
        .then(result => {
            if(result.status===400)
            {
                throw new Error;
            }
            if(result.status===200){
              alert("DATA UPDATED");
              return location.reload();
            }
      
      })
        .catch(error => {
         console.log(error);
          alert("Error Occured");
        return location.reload();
      }); 
      }



function addClickListnersToEditButton()
{
    for(let i = 0; i< ids_array.length ; i++)
    {
        let button = document.getElementById(ids_array[i] + 'b');
        button.addEventListener('click', function(){
         this.setAttribute('data-toggle', 'modal');
         this.setAttribute("data-target" , "#myEditModal");
         id_of_button_to_edit = ids_array[i];
        })
 
    }
}

/////////////////////////////
////////////////////Pagination
function pagination(Obj)
{
if(Obj.id==='p1')
{
    var Table = document.getElementById("myTable");
    Table.innerHTML = "";
    return show_table_data1(25,0)
}
else if(Obj.id==='p2')
{
    var Table = document.getElementById("myTable");
    Table.innerHTML = "";
    return show_table_data1(25,25)
}
else if(Obj.id==='p3')
{
    var Table = document.getElementById("myTable");
    Table.innerHTML = "";
    return show_table_data1(25,50)
}
else if(Obj.id==='p4')
{
    var Table = document.getElementById("myTable");
    Table.innerHTML = "";
    return show_table_data1(25,75)
}
else if(Obj.id==='p5')
{
    var Table = document.getElementById("myTable");
    Table.innerHTML = "";
    return show_table_data1(25,100)
}
}

////////////////////////////////////////////
//show_table_data1()
pagination()


