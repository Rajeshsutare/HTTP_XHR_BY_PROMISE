
const cl = console.log;


const postContainer = document.getElementById('postContainer')
const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const contentControl = document.getElementById('content')
const updateBtn = document.getElementById('updateBtn')
const submitbtn = document.getElementById('submitbtn')
const resetBtn = document.getElementById('resetBtn')

let baseUrl = `http://localhost:3000`


    const onEditBtn = (eve) =>{
        let editId = eve.closest('.card').id;
        localStorage.setItem('editId',editId)
        let editUrl = `${baseUrl}/posts/${editId}`;

        makeApiCall('GET',editUrl)
            .then(res=>{
                cl(res)
                let data = JSON.parse(res)
                titleControl.value = data.title;
                contentControl.value = data.body;
                updateBtn.classList.remove('d-none')
                submitbtn.classList.add('d-none')
                resetBtn.classList.add('d-none')
            })
    }

    const onUpdateBtn = (e) =>{
        let updateId = localStorage.getItem('editId')
        let updateUrl = `${baseUrl}/posts/${updateId}`
        let obj = {
            title : titleControl.value,
            body : contentControl.value
        }
        cl(obj)
                updateBtn.classList.add('d-none')
                submitbtn.classList.remove('d-none')
                resetBtn.classList.remove('d-none')
        makeApiCall('PATCH',updateUrl,JSON.stringify(obj))
            .then(res=>{
                let data = JSON.parse(res)
                let card = [...document.getElementById(updateId).children]
                card[0].innerHTML = ` <h3>${data.title}</h3>`
                card[1].innerHTML = `<p>${data.body}</p>`
            })
            .catch(cl)
    }

const onDeleteBtn = (e) =>{
    let deleteId = e.closest('.card').id;
    let deletUrl = `${baseUrl}/posts/${deleteId}`;

makeApiCall("DELETE",deletUrl)
    .then(res=>{
        cl(res)
        let card = document.getElementById('deleteId').remove();
        
    })
    .catch(cl)
    .finally(()=>{
        e.target.reset
    })
 
}

const templating=(arr)=>{
    let result = '';
    arr.forEach(post => {
        result+=`
                    <div class="card   col-md-6 offset-md-3 p-0 mb-4 text-center" id="${post.id}">
                    <div class="card-header text-uppercase ">
                        <h3>${post.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${post.body}</p>
                    </div>
                    <div class="card-footer ">
                        <div class="form-group d-flex justify-content-between">
                            <button class="btn btn-warning" onClick='onEditBtn(this)'>Edit</button>
                            <button class="btn btn-danger"  onClick='onDeleteBtn(this)'>Delete</button>
                        </div>
                    </div>
                </div>
        `;
    });
    postContainer.innerHTML=result;
}

const makeApiCall = (method,apiUrl,body) =>{
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method,apiUrl);
        xhr.setRequestHeader("Auth","Bearer Token form Localstorages")
        xhr.setRequestHeader("Content-Type","application/json")
        xhr.onload = function(){
            if(xhr.status === 200 || xhr.status === 201){
                resolve(xhr.response)
            }else{
                reject('something went wrong')
            }
        }
        xhr.send(body)
    })
}
makeApiCall('GET',`${baseUrl}/posts`)
        .then(res=>{
            cl(res)
            templating(JSON.parse(res))
        })
        .catch(err=>{
            cl(err)
        })
        
    
        const onSubmitBtn = (eve) =>{
            eve.preventDefault();
            let obj ={
                title : titleControl.value.trim(),
                body : contentControl.value.trim(),
                UserId : Math.ceil(Math.random() *10)
            }
            // postArray.push(obj)
            makeApiCall("POST",`${baseUrl}/posts`, JSON.stringify(obj))
            .then(res=>{
                cl(res)
            })
            .catch(err=>{
                cl(err)
            }) 
            .finally(()=>{
                eve.target.reset();
            })
        }


        postForm.addEventListener('submit',onSubmitBtn);
        updateBtn.addEventListener('click',onUpdateBtn);