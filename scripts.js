
//AGREGAR UN USER NUEVO Y POSTEARLO EN LA API
function apiInteraction(HTTPMethod, url, body) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open(HTTPMethod, url);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status == 200 || request.status == 201) {
                resolve(request.response);
            } else {
                reject(`IT WAS A PROBLEM WITH THE API: ${request.status}`);
            }
        }
        if (HTTPMethod == 'POST') {
            console.log('holis')
            request.setRequestHeader("Content-Type", "application/json");//application/json;charset=UTF-8
            request.send(body);
        } else {
            request.send();
        }
    })
}

listAllEmployeesAndCompanies();

function listAllEmployeesAndCompanies() {
    const companyDataPromise = apiInteraction('GET', 'https://utn-lubnan-api-2.herokuapp.com/api/Company', null);
    const employeeDataPromise = apiInteraction('GET', 'https://utn-lubnan-api-2.herokuapp.com/api/Employee', null);

    Promise.all([companyDataPromise, employeeDataPromise])
        .then(([companyData, employeeData]) => {
            //Muxo
            //employeeData.sort((a, b) => a.employeeId - b.employeeId);
            console.log(employeeData)

            employeeData.sort((a, b) => a.lastName.localeCompare(b.lastName));
            console.log(employeeData)
            const validEmployees = employeeData.filter(employee => {
                return employee.companyId !== null && companyData.find(company => company.name === 'Muxo' && company.companyId === employee.companyId/* && career.active*/);
            });

            console.log('Los empleados que quedan:', validEmployees);
            console.log('Las companias:', companyData);

            companyData.forEach((company) => {
                createCompanyTable(company, employeeData)
            })

            validEmployees.forEach((employee) => {
                createStudentTable(employee, companyData);
            })

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function createCompanyTable(company, employeeData) {
    let i = 0;
    employeeData.forEach((employee) => {
        if (employee.companyId == company.companyId)
            i++
    })
    const rowHTML = `
    <tr>
        <td>${company.companyId}</td>
        <td>${company.name}</td>
        <td>${i}</td>
    </tr>
    `;
    const companyTable = document.getElementById("company_table");
    companyTable.insertAdjacentHTML('beforebegin', rowHTML);
}



function createStudentTable(employee, companyData) {
    const rowHTML = `
    <tr id='${employee.employeeId}'>
      <td>${employee.employeeId}</td>   
      <td>${employee.lastName}</td>
      <td>${employee.firstName}</td>
      <td>${employee.email}</td>
      <td>${companyData[employee.companyId - 1].name}</td>
      <td>
        <button onclick="deleteAStudent(${employee.employeeId})" type="button" class="btn btn-danger btn-sm">Delete</button>
      </td>
    </tr>
    `;



    const studentTable = document.getElementById('employee_table');
    //const tbody = studentTable.querySelector('tbody');

    //tbody.insertAdjacentHTML('beforeend', rowHTML);
    studentTable.insertAdjacentHTML('beforeend', rowHTML);

    // const row = document.createElement('tr');
    // row.innerHTML = rowHTML;
    // tbody.appendChild(row);
}


function deleteAStudent(employeeId) {
    console.log('id del empleado:', employeeId)
    apiInteraction('DELETE', `https://utn-lubnan-api-2.herokuapp.com/api/Employee/${employeeId}`, null)
        .then((response) => {
            console.log('El estudiante ha sido eliminado');
            // console.log(response.status);
            // Eliminar la fila de la tabla en la interfaz de usuario
            //const rowToDelete = document.getElementById(employeeId);
            //  rowToDelete.remove();
            deleteFromTable(employeeId)

        })
        .catch((reason) => {
            console.error('Error:', reason);
        });
}


function deleteFromTable(userId) {
    let row = document.getElementById(userId);
    row.remove();
}


//<td>${careers.find(career => career.id === employee.careerId).name}</td>
//<th scope="col">Career</th>

function postAEmployee() {
    const employee = {
        "employeeId": 0,
        "companyId": 1,
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    console.log(employee)
    apiInteraction('POST', `https://utn-lubnan-api-2.herokuapp.com/api/Employee`, employee)
        .then((response) => {
            console.log(response.status);
        }).catch((reason) => {
            console.error('Error', reason);
        })

}
