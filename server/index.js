const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8000;
app.use(bodyParser.json());

let users = []
let counter = 1;

/*
GET /users สำหรับ get users ทั้งหมดที่บันท฿กไว้
POST /user สำหรับสร้าง users ใหม่บันทึกไว้
GET /user/:id สำหรับถึง users รายคนออกมา
PUT /user/:id สำหรับแก้ไข users รายคน(ตาม id ที่บันทึกเข้าไว้)
DELETE /user/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไว้) 
*/

// path:GET /users ใช้สำหรับแสดงข้อมูล users ทั้งหมดที่บันทึกไว้
app.get('/users', (req, res) => {    
    res.json(users);
});
// path:POST  /user ใช้สำหรับสร้างข้อมูล user ใหม่บันทึกไว้
app.post('/user', (req, res) => {  
    let user = req.body;
    user.id = counter;
    counter += 1;
    users.push(user);
    res.json({
        message: 'Create new user successfully' ,
        user: user
    });
});

//path : PUT /user/:id ใช้สำหรับแก้ไขข้อมูล user โดยใช้ id เป็นตัวระบุ
app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    // ค้นหา user ที่ต้องการแก้ไข
    let selectedIndex = users.findIndex(user => user.id == id)
    res.send(selectedIndex + '');
    // แก้ไขข้อมูล users 
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname;
    }   
    if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname;
    }

    res.json({
        message: 'Update user successfully',    
        data: {
            user: updateUser ,
            indexUpdate: selectedIndex
        }
    })
});

//path : DELETE /user/:id ใช้สำหรับลบข้อมูล user โดยใช้ id เป็นตัวระบุ
app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    //หา index ของ user ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id)

    // ลบ
    users.splice(selectedIndex, 1);
    res.json({
        message: 'Delete user successfully',
        indexDelete: selectedIndex
    })  
})

app.listen(port, (req, res) => {
  console.log('Http Server is running on port ' + port); 
});
