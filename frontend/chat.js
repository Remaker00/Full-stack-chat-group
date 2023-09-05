let currentPage = 1;

const userForm = document.getElementById('user-form');
const userList = document.getElementById('user-list');

userForm.addEventListener('submit', handleUserForm);

async function handleUserForm(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;

    const userData = { message };

    const token = localStorage.getItem('token');

    if(token) {
        try {
            const response = await fetch(`/exp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
    
            if (response.ok) {
                console.log(`Message created successfully!${token}`);
                userForm.reset();
    
                fetchUsers();
            } else {
                console.log('Error creating message.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log("Token not found!");
    }
};    

function fetchUsers() {
    fetch(`/message`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
        .then(users => {
            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.message}    `;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteUser(user.id);
                });
                li.appendChild(deleteButton);
                userList.appendChild(li);
                
            });
        })
        .catch(error => console.error('Error:', error));
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`/message/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            fetchUsers();
        } else {
            console.error('Error deleting user.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchUsers();



