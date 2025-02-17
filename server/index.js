const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

const port = 8000;

app.use(bodyParser.json());

let users = []
let conn = null;
const initMysql = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8830
    })
}/*
app.get('/testdbnew',async (req, res) => {

    try {
        const results = await conn.query('SELECT * FROM users')
        res.json(results[0]);
    } catch (error) {
        console.log('error: ', error.message);
        res.status(500).json({error: 'Error fetching users'})
    }
});
*/
// path:GET /users ใช้สำหรับแสดงข้อมูล users ทั้งหมดที่บันทึกไว้
app.get('/users', async(req, res) => {    
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0]);
});

// path:POST  /user ใช้สำหรับสร้างข้อมูล user ใหม่บันทึกไว้
app.post('/users', async (req, res) => {  
    let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?', user)
    res.json({
        message: 'Create user successfully',
        data: results[0]
    })
});

// path:GET /users id สำหรับดึง user รายคนออกมา
app.get('/users/:id', (req, res) => {    
    let id = req.params.id;
    //ค้นหา user หรือ indexที่ต้องการดึงข้อมูล
    let selectedIndex = users.findIndex(user => user.id == id)

    res.json(selectedIndex);

});

//PUT /user/:id สำหรับแก้ไข users รายคน(ตาม id ที่บันทึกเข้าไว้)
app.put('/users/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    let selectedIndex = users.findIndex(user => user.id == id)
      
        users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname;
        users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname;
        users[selectedIndex].age = updateUser.age || users[selectedIndex].age;
        users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender;
    
    res.json({
        message: 'Update user successfully',    
        data: {
            user: updateUser ,
            indexUpdate: selectedIndex
        }
    })
});

//DELETE /user/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไว้)
app.delete('/users/:id', (req, res) => {
    let id = req.params.id;
    //หา index ของ user ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id)

    // ลบ
    users.splice(selectedIndex, 1);
    res.json({
        message: 'Delete user successfully',
        indexDelete: selectedIndex
    })  
});

app.listen(port, async (req, res) => {
  await initMysql()
  console.log('Http Server is running on port ' + port); 
});
