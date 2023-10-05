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
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            request.send(body);
        } else {
            request.send();
        }
    })
}

function deleteAStudent() {
    let studentId = document.getElementById('idStudent').value;

    apiInteraction('DELETE', `https://utn-lubnan-api-2.herokuapp.com/api/Student/${studentId}`, null)
        .then((response) => {
            console.log(response);
            console.log('the students has been terminated');
            const rowToDelete = document.getElementById('idStudent').parentElement;
            rowToDelete.remove();
        })
        .catch((reason) => {
            console.log(Error(reason));
        })

}

function listAllStudentsAndCareers() {
    const careerData = apiInteraction('GET', 'https://utn-lubnan-api-2.herokuapp.com/api/Career', null);
    const studentData = apiInteraction('GET', 'https://utn-lubnan-api-2.herokuapp.com/api/Student', null);

    Promise.all([careerData, studentData])
        .then(([careerData, studentData]) => {

            studentData.sort((a, b) => a.lastName.localeCompare(b.lastName));
            const validStudents = studentData.filter(student => {
                return student.careerId !== null && careerData.find(career => career.id === student.careerId && career.active);
            });


            console.log('Los estudiantes que quedan:', validStudents);
            console.log('Las carreras:', careerData);


            validStudents.forEach((student) => {
                createStudentTable(student, careerData);
            })


        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function createStudentTable(student, carrer) {
    const rowHTML = `
      <td id='${student.studentId}'>${student.studentId}</td>
      <td>${careerData.find(career => career.id === student.careerId).name}</td>
      <td>${student.lastName}</td>
      <td>${student.firstName}</td>
      <td>${student.email}</td>
    `;

    const row = document.createElement('tr');
    row.innerHTML = rowHTML;

    const studentTable = document.getElementById('student_table');
    const tbody = studentTable.querySelector('tbody');

    tbody.appendChild(row);
}