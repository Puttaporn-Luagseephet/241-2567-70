const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // default mode
let selectedId = '';

window.onload = async () => {   
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('id', id);
    if (id) {
        mode = 'EDIT';
        selectedId = id;

        // ดึงข้อมูลของ user ที่ต้องการแก้ไข
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            const user = response.data;

            // นำข้อมูลที่ดึงมาใส่ใน form
            let firstNameDOM = document.querySelector('input[name=firstname]');
            let lastNameDOM = document.querySelector('input[name=lastname]');
            let ageDOM = document.querySelector('input[name=age]');
            let descriptionDOM = document.querySelector('textarea[name=description]');

            firstNameDOM.value = user.firstname;
            lastNameDOM.value = user.lastname;
            ageDOM.value = user.age;
            descriptionDOM.value = user.description;

            let genderDOMs = document.querySelectorAll('input[name=gender]');
            let interestDOMs = document.querySelectorAll('input[name=interest]');

            // เช็คค่าเพศ
            genderDOMs.forEach(gender => {
                if (gender.value === user.gender) {
                    gender.checked = true;
                }
            });

            // เช็คค่าความสนใจ
            interestDOMs.forEach(interest => {
                if (user.interests.includes(interest.value)) {
                    interest.checked = true;
                }
            });

        } catch (error) {   
            console.log('error', error);
        }
    }
};

const validateData = (userData) => {
    let errors = [];

    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ');
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ');
    }
    if (!userData.interests || userData.interests.length === 0) {
        errors.push('กรุณาเลือกความสนใจ');
    }
    if (!userData.description) {
        errors.push('กรุณากรอกคำอธิบาย');
    }

    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let descriptionDOM = document.querySelector('textarea[name=description]');
    let genderDOMs = document.querySelectorAll('input[name=gender]');
    let interestDOMs = document.querySelectorAll('input[name=interest]');

    let messageDOM = document.getElementById('message');

    try {
        // หาค่า gender ที่ถูกเลือก
        let selectedGender = '';
        genderDOMs.forEach(gender => {
            if (gender.checked) {
                selectedGender = gender.value;
            }
        });

        // เก็บค่าความสนใจที่ถูกเลือก
        let interests = [];
        interestDOMs.forEach(interest => {
            if (interest.checked) {
                interests.push(interest.value);
            }
        });

        let userData = {
            firstName: firstNameDOM.value,
            lastName: lastNameDOM.value,
            age: ageDOM.value,
            gender: selectedGender,
            description: descriptionDOM.value,
            interests: interests
        };

        console.log('submitData', userData);

        let message = 'บันทึกข้อมูลเรียบร้อย';
        if (mode === 'CREATE') {
            const response = await axios.post(`${BASE_URL}/users`, userData);
            console.log('response', response.data);
        } else {
            const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
            console.log('response', response.data);
        }

        messageDOM.innerText = message;
        messageDOM.className = 'message success';
    } catch (error) {
        console.log('error message', error.message);
        console.log('error', error.errors);

        if (error.response) {
            console.log(error.response, error.response.data.message);
            error.message = error.response.data.message;
            error.errors = error.response.data.errors;
        }

        let htmlData = '<div>';
        htmlData += `<div>${error.message}</div>`;
        htmlData += '<ul>';
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`;
        }
        htmlData += '</ul>';
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
};
