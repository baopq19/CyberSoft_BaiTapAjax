const apiURL = 'http://svcy.myclass.vn/api/QuanLyNhanVienApi'

// Get elements
const inpId = document.querySelector('#inpId');
const inpIdError = document.querySelector('#inpIdError');
const inpName = document.querySelector('#inpName');
const inpNameError = document.querySelector('#inpNameError');
const selPosition = document.querySelector('#selPosition');
const inpSalary = document.querySelector('#inpSalary');
const inpSalaryError = document.querySelector('#inpSalaryError');
const inpHours = document.querySelector('#inpHours');
const inpHoursError = document.querySelector('#inpHoursError');
const btnAdd = document.querySelector('#btnAdd');
const btnUpdate = document.querySelector('#btnUpdate');
const tbManage = document.querySelector('#tbManage');

btnUpdate.disabled = true;

var employees = new Array;

window.onload = (event) => {
    getEmployees();
};

btnAdd.addEventListener('click', event => {
    event.preventDefault();
    let employee = getFormData();
    let valid = validation(employee);
    if(valid) {
        addEmployee(employee);
    }
});

btnUpdate.addEventListener('click', event => {
    event.preventDefault();
    let employee = getFormData();
    let valid = validation(employee);
    if(valid) {
        updateEmployee(employee);
        btnUpdate.disabled = true;
        btnAdd.disabled = false;
        inpId.disabled = false;

        inpId.value = '';
        inpName.value = '';
        selPosition.selectedIndex = '1';
        inpSalary.value = '';
        inpHours.value = '';    
    }
})

const updateEmployee = (employee) => {
    let nhanVien = parseNhanVien(employee);
    let promise = axios({
        method: 'put',
        url: `${apiURL}/CapNhatThongTinNhanVien?maNhanVien=${nhanVien.maNhanVien}`,
        data: nhanVien
    });

    promise.then((response) => {
        console.log(response);
        getEmployees();
    })

    promise.catch((error) => {
        console.log(error);
    })
}

const deleteEmployee = function(id) {
    let promise = axios({
        method: 'delete',
        url: `${apiURL}/XoaNhanVien?maSinhVien=${id}`,
    });

    promise.then(function(response) {
        getEmployees();
    })

    promise.catch(function(error) {
        console.log(error);
    }) 

};

const getFormData = function() {
    const employee = new Employee(
        inpId.value,
        inpName.value,
        selPosition.value,
        inpSalary.value,
        inpHours.value
    )
    return employee;
};

const validation = function(employee) {
    let valid = true;

    if(employee.id != "") {
        if(employee.id < 1 || employee.id > 999999) {
            inpIdError.innerHTML = '(M?? s??? nh??n vi??n ph???i l???n h??n 0 v?? nh??? h??n 999999)'
            valid = false;
        } else {
            inpIdError.innerHTML = '';
        }
    } else {
        valid = false;
        inpIdError.innerHTML = '(M?? s??? nh??n vi??n kh??ng ???????c tr???ng)'
    }

    if(employee.name != "") {
        let regex = new RegExp('^[a-zA-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????\s\W|_ ]+$');
        if(!regex.test(employee.name)) {
            inpNameError.innerHTML = '(T??n nh??n vi??n kh??ng ???????c ch???a s??? ho???c k?? t??? ?????c bi???t)'
            valid = false;
        } else {
            inpNameError.innerHTML = '';
        }
    } else {
        valid = false;
        inpNameError.innerHTML = '(T??n nh??n vi??n kh??ng ???????c tr???ng)'
    }

    if(employee.salary != "") {
        if(employee.salary < 1000000 || employee.salary > 20000000) {
            inpSalaryError.innerHTML = '(L????ng c?? b???n n???m trong m???c 1 000 000 - 20 000 000)'
            valid = false;
        } else {
            inpSalaryError.innerHTML = '';
        }
    } else {
        valid = false;
        inpSalaryError.innerHTML = '(L????ng c?? b???n kh??ng ???????c tr???ng)'
    }

    if(employee.hours != "") {
        if(employee.hours < 50 || employee.hours > 150) {
            inpHoursError.innerHTML = '(S??? gi??? l??m n???m trong m???c 50 - 150)'
            valid = false;
        } else {
            inpHoursError.innerHTML = '';
        }
    } else {
        valid = false;
        inpHoursError.innerHTML = '(S??? gi??? l??m kh??ng ???????c tr???ng)'
    }
    
    return valid;
};

const getEmployees = function() {
    employees = new Array;
    axios.get(`${apiURL}/LayDanhSachNhanVien`)
        .then(function(response) {
            response.data.forEach(e => {
                let employee = new Employee(
                    e.maNhanVien,
                    e.tenNhanVien,
                    e.chucVu,
                    e.luongCoBan,
                    e.soGioLamTrongThang
                );
                employees.push(employee);
            })
            loadTable(employees);
        })
        .catch(function(error) {
            console.log(error)
        })
};

const loadTable = function(employees) {
    let bodyValue = '';
    employees.forEach(employee => {
        bodyValue += `
        <tr>
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.salary}</td>
            <td>${employee.calculateTotalSalary()}</td>
            <td>${employee.hours}</td>
            <td>${employee.ranking()}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteEmployee('${employee.id}')">Xo??</button>
                <button class="btn btn-outline-primary" onclick="editEmployee('${employee.id}')">Ch???nh s???a</button>
            </td>
        </tr>`;
    });
    tbManage.innerHTML = bodyValue;
};

const addEmployee = function(employee) {
    let nhanVien = parseNhanVien(employee);
    let promise = axios({
        method: 'post',
        url: `${apiURL}/ThemNhanVien`,
        data: nhanVien
    })

    promise.then(function(response) {
        getEmployees();
    })

    promise.catch(function(error) {
        console.log(error)
    })
};

const parseNhanVien = function(employee) {
    let hscv = 1;
    if(employee.position === 'Qu???n l??') {
        hscv = 2;
    } else if(hscv === 'Gi??m ?????c'){
        hscv = 3;
    }
    let nhanVien = {
        "maNhanVien": employee.id,
        "tenNhanVien": employee.name,
        "chucVu": employee.position,
        "heSoChucVu": hscv,
        "luongCoBan": employee.salary,
        "soGioLamTrongThang": employee.hours
    }

    return nhanVien;
}

const editEmployee = async function(id) {
    var promise = axios({
        method: 'get',
        url: `${apiURL}/LayThongTinNhanVien?maNhanVien=${id}`
    });

    promise.then(function(response) {
        nhanVien = response.data;
        if(nhanVien) {
            inpId.value = nhanVien.maNhanVien;
            inpName.value = nhanVien.tenNhanVien;
            inpSalary.value = nhanVien.luongCoBan;
            inpHours.value = nhanVien.soGioLamTrongThang;
            selPosition.value = nhanVien.chucVu;

            btnUpdate.disabled = false;
            btnAdd.disabled = true;
            inpId.disabled = true;
        }
    })

    promise.catch(function(error) {
        console.log(error);
    })
    
}

