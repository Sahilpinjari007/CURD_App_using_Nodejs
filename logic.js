const userAddBtn = document.querySelector('#user-add-btn');
const userAddPopup = document.querySelector('#user-add-popup');
const userAddOverlay = document.querySelector('#user-add-overlay');
const formSubmitBtn = document.querySelector('#form-submit-btn');
const userName = document.querySelector('#user-name');
const userEmail = document.querySelector('#user-email');
const maleGender = document.querySelector('#male-gender');
const femaleGender = document.querySelector('#female-gender');
const activeStatus = document.querySelector('#active-status');
const inActiveStatus = document.querySelector('#inactive-status');
const listAddOnSection = document.querySelector('#list-add-on-section');
const popupHeading = document.querySelector('#popup-heading');
let id = 1;
var updatingKey = 0;


const popupBtns = [userAddBtn, userAddOverlay];
popupBtns.forEach((elem) => {

    elem.addEventListener('click', () => {
        popupHeading.innerText = 'New Contact';
        formSubmitBtn.innerText = 'Submit';
        userAddPopup.classList.toggle('user-add-popup-Active');
        userAddOverlay.classList.toggle('user-add-overlay-Active');

        userName.value = '';
        userEmail.value = '';
        maleGender.checked = false;
        femaleGender.checked = false;
        activeStatus.checked = false;
        inActiveStatus.checked = false;
    })
});

function getUpdateDeleteBtns() {
    let updateContBtn = Array.from(document.getElementsByClassName('update-btn'));
    let deleteContBtn = Array.from(document.getElementsByClassName('delete-btn'));
    let names = Array.from(document.getElementsByClassName('contact-name'))

    updateContBtn.forEach((elem, index) => {

        elem.addEventListener('click', () => {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "name": names[index + 1].innerText
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/single", requestOptions)
                .then(response => response.json())
                .then(result => {

                    result = result[0];

                    updatingKey = result._id;
                    userName.value = result.name;
                    userEmail.value = result.email;

                    result.gender == 'Male' ? maleGender.checked = true : femaleGender.checked = true;
                    result.status == 'Active' ? activeStatus.checked = true : inActiveStatus.checked = true;
                    formSubmitBtn.innerText = 'Update';
                    popupHeading.innerText = 'Update Contact';

                    userAddPopup.classList.toggle('user-add-popup-Active');
                    userAddOverlay.classList.toggle('user-add-overlay-Active');
                })
                .catch(error => console.log('error', error));
        })
    })


    deleteContBtn.forEach((elem, index) => {

        elem.addEventListener('click', () => {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "name": names[index + 1].innerText
            });

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/delete", requestOptions)
                .then(response => response.text())
                .then(result => { console.log(result); loadData(); id = 1 })
                .catch(error => console.log('error', error));
        })
    })
}

function loadData() {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:5000/getData", requestOptions)
        .then(response => response.json())
        .then(result => {

            listAddOnSection.innerHTML = '';

            result.forEach((elem) => {

                const div = document.createElement('div');
                div.classList.add('item');

                div.innerHTML = `
                
                <span class="contact-id">${id}</span>
                        <span class="contact-name">${elem.name}</span>
                        <span class="contact-email">${elem.email}</span>
                        <span class="contact-gender">${elem.gender}</span>
                        <span class="contact-status">${elem.status}</span>
                        <div class="contact-action">
                            <div class="action-btn update-btn"><i class="fa-solid fa-pen"></i></div>
                            <div class="action-btn delete-btn"><i class="fa-solid fa-xmark" style="font-size: 20px;"></i></div>
                        </div>
                `

                listAddOnSection.appendChild(div);
                id = id + 1;
            })
            getUpdateDeleteBtns();
        })
        .catch(error => console.log('error', error));
}

window.addEventListener('load', () => { loadData() })


formSubmitBtn.addEventListener('click', () => {


    let name = '';
    let email = ''
    let gender = '';
    let status = '';

    if (userName.value != '') {
        name = userName.value;

        if (userEmail.value != '') {
            email = userEmail.value;

            if (maleGender.checked) {
                gender = 'Male';
                status = statusCheck();
            }
            else {

                if (femaleGender.checked) {
                    gender = 'Female'
                    status = statusCheck();
                }
                else {
                    alert('please Select Gender');
                    return;
                }
            }
        }
        else {
            alert('please Enter Email');
            return;
        }
    }
    else {
        alert('please Enter Name');
        return;
    }


    if (formSubmitBtn.innerText == 'Submit') {

        if (status != 'null') {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "name": name,
                "email": email,
                "gender": gender,
                "status": status
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/insert", requestOptions)
                .then(response => response.text())
                .then(result => {

                    userAddPopup.classList.toggle('user-add-popup-Active');
                    userAddOverlay.classList.toggle('user-add-overlay-Active');
                    id = 1;
                    loadData();
                })
                .catch(error => console.log('error', error));
        }
    }
    else {


        if (status != 'null') {

            console.log(updatingKey);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "key": updatingKey,
                "name": name,
                "email": email,
                "gender": gender,
                "status": status
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/update", requestOptions)
                .then(response => response.text())
                .then(result =>{

                    console.log(result);
                    userAddPopup.classList.toggle('user-add-popup-Active');
                    userAddOverlay.classList.toggle('user-add-overlay-Active');
                    id = 1;
                    loadData();
                })
                .catch(error => console.log('error', error));
        }
    }
})


function statusCheck() {
    if (activeStatus.checked) {
        return 'Active';
    }
    else {

        if (inActiveStatus.checked) {
            return 'inActive'
        }
        else {
            alert('please Select Status');
            return 'null';
        }
    }
}

