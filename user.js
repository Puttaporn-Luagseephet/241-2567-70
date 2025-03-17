const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('User page loaded');

    try {
        const response = await axios.get(`${BASE_URL}/users`);
        console.log(response.data);

        const userDOM = document.getElementById('user');

        let htmlData = `
            <table>
                <tr>
                    <th>ลำดับ</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>อายุ</th>
                    <th>จัดการ</th>
                </tr>`;

        response.data.forEach(user => {
            htmlData += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.age}</td>
                    <td>
                        <a href="index1.html?id=${user.id}">
                            <button class="edit">Edit</button>
                        </a>
                        <button class="delete" data-id="${user.id}">Delete</button>
                    </td>
                </tr>`;
        });

        htmlData += '</table>';
        userDOM.innerHTML = htmlData;

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ User ID ${id} ?`)) {
                    try {
                        await axios.delete(`${BASE_URL}/users/${id}`);
                        loadData();
                    } catch (error) {
                        console.error('เกิดข้อผิดพลาด:', error);
                    }
                }
            });
        });

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
    }
};