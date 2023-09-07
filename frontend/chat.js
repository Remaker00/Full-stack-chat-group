const userForm = document.getElementById('user-form');
const userList = document.getElementById('user-list');
const groupList = document.getElementById('group-list');

userForm.addEventListener('submit', handleUserForm);

async function handleUserForm(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;

    const userData = { message };

    const token = localStorage.getItem('token');
    const groupId = localStorage.getItem('token_group_id');

    if(token) {
        try {
            const response = await fetch(`/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Group-ID': groupId
                },
                body: JSON.stringify(userData)
            });
    
            if (response.ok) {
                console.log(`Message created successfully!${token}`);
                userForm.reset();
    
                fetchmessage();
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

async function fetchmessage() {
    const groupId = localStorage.getItem('token_group_id');
    await fetch(`/message`, {
        method: 'GET',
        headers: {
            'Group-ID': groupId
        }
    })
    .then(response => response.json())
        .then(users => {
            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.message}    `;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '';
                deleteButton.addEventListener('click', () => {
                    deleteUser(user.id);
                });
                li.appendChild(deleteButton);
                userList.appendChild(li);
                
            });
        })
    .catch(error => console.error('Error:', error));
}

async function fetchgroups() {
    await fetch(`/group/message`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token','token_group_id')}`
        }
    })
    .then(response => response.json())
        .then(users => {
            console.log("USERS", users);
            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name}  -  ${user.member_names}  `;

                li.addEventListener('click', () => openMessageTab(user));
                groupList.appendChild(li);
                
            });
        })
    .catch(error => console.error('Error:', error));
};
/*
async function deleteUser(userId) {
    try {
        const response = await fetch(`/message/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            fetchmessage();
        } else {
            console.error('Error deleting user.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
*/
function openMessageTab(user) {
    console.log("><><", user.id);
    localStorage.setItem('token_group_id', user.id);
    const messageTab = document.getElementById('message-tab');
    messageTab.innerHTML = '';
    
    const messageTabContent = document.createElement('div');
    messageTabContent.textContent = `Group: ${user.name}`;

    const memberList = document.createElement('ul');

    const memberItem = document.createElement('li');
    memberItem.textContent = `Members: ${user.member_names}`;
    memberList.appendChild(memberItem);

    messageTabContent.appendChild(memberList);
    messageTab.appendChild(messageTabContent);
    fetchmessage();

};    


fetchgroups();






