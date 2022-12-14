const tbody = document.getElementById('table')
const searchName = document.getElementById('nameSearch')
const addStudentBtn = document.getElementById('addBtn')
const updateStudentBtn = document.getElementById('updateBtn')

function displayStudent() {
    let html = ''
    axios.get('/api/student')
        .then(res => {
            res.data.map(item => {
                html += `           
                <tr id="${item.Name}">
                    <th scope="row">${item._id}</th>
                    <td>${item.Name}</td>
                    <td>${item.Gender}</td>
                    <td>${item.Class}</td>
                    <td>${item.Section}</td>
                    <th>
                        <button type="button" class="btn btn-danger" onclick="deleteStudent('${item.Name}')">Delete</button>
                        <button type="button" class="btn btn-warning" onclick="updateStudent('${item.Name}','${item.Class}','${item.Section}','${item.Gender}')" data-bs-toggle="modal" data-bs-target="#UpdateModal">Update</button>
                    </th>
                </tr>
            `
            })
            tbody.innerHTML = html
        })
        .catch(error => {
            if (error.response.status === 404) {
                alert(error.response.data.message)
            } else {
                alert(error.message)
            }
        })
}
displayStudent()

searchName.addEventListener('change', (e) => {
    let html = ''
    axios.get(`/api/student/${e.target.value}`)
        .then(res => {
            if (res.status === 200) {
                res.data.map(item => {
                    html += `           
                    <tr>
                        <th scope="row">${item._id}</th>
                        <td>${item.Name}</td>
                        <td>${item.Gender}</td>
                        <td>${item.Class}</td>
                        <td>${item.Section}</td>
                        <th>
                        <button type="button" class="btn btn-danger" onclick="deleteStudent('${item.Name}')">Delete</button>
                        <button type="button" class="btn btn-warning" onclick="updateStudent('${item.Name}','${item.Class}','${item.Section}','${item.Gender}')" data-bs-toggle="modal" data-bs-target="#UpdateModal">Update</button>
                        </th>
                    </tr>
                `
                })
                tbody.innerHTML = html
            }
        })
        .catch(error => {
            if (error.response.status === 404) {
                alert(error.response.data.message)
            } else {
                alert(error.message)
            }
        })
})

addStudentBtn.addEventListener('click', () => {
    const Name = document.getElementById('Name').value
    const Class = document.getElementById('Class').value
    const Section = document.getElementById('Section').value
    const genders = document.getElementsByName('Gender')
    let Gender = ''
    for (var i = 0; i < genders.length; i++) {
        if (genders[i].checked) {
            Gender = genders[i].value;
        }
    }

    axios.post('/api/student', { Name, Class, Section, Gender })
        .then(res => {
            if (res.status === 200) {
                location.reload()
            }
        })
        .catch(error => {
            if (error.response.status === 403 || error.response.status === 400) {
                alert(error.response.data.message)
            } else {
                alert(error.message)
            }
        })
})

function deleteStudent(Name) {
    axios.delete(`api/student/${Name}`)
        .then(res => {
            if (res.status === 200) {
                alert(res.data.message)
                location.reload()
            }
        })
        .catch(error => {
            if (error.response.status === 404) {
                alert(error.response.data.message)
            } else {
                alert(error.message)
            }
        })
}

function updateStudent(Name, Class, Section, Gender) {
    const inputName = document.getElementById('inputName')
    const inputClass = document.getElementById('inputClass')
    const inputSection = document.getElementById('inputSection')
    const genders = document.getElementsByName('inputGender')

    updateStudentBtn.addEventListener('click', () => {
        let inputGender
        for (var i = 0; i < genders.length; i++) {
            if (genders[i].checked) {
                inputGender = genders[i].value
            }
        }

        let bodyObj = {
            Name: (function () {
                if (inputName.value === '') return Name
                else return inputName.value
            })(),
            Section: (function () {
                if (inputSection.value === '') return Section
                else return inputSection.value
            })(),
            Class: (function () {
                if (inputClass.value === '') return Class
                else return inputClass.value
            })(),
            Gender: (function () {
                if (inputGender === undefined) return Gender
                else return inputGender
            })()
        }

        axios.patch(`/api/student/${Name}`, bodyObj)
            .then(res => {
                if (res.status === 200) {
                    alert('Student updated.')
                    location.reload()
                }
            })
            .catch(error => {
                if (error.response.status === 404) {
                    alert(error.response.data.message)
                } else {
                    alert(error.message)
                }
            })
    })
}