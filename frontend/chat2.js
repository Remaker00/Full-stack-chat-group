const userForm = document.getElementById('user-form');
const userList = document.getElementById('user-list');
const userList2 = document.getElementById('user-list2');
const groupList = document.getElementById('group-list');
document.getElementById('admin').style.display = 'none';

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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Group-ID': groupId
        }
    })
    .then(response => response.json())
        .then(users => {
            userList.innerHTML = '';
            if (users.isAdmin === true) {
                document.getElementById('admin').style.display = 'block';
            }else {
                document.getElementById('admin').style.display = 'none';
            }
            users.messages.forEach(user => {
                const li = document.createElement('li');
                li.className = 'chat-message'; 

                if (user.sender_name === users.userName) {
                    li.classList.add('your-message'); 
                }

                const upper = document.createElement('div');
                upper.className = 'sender-name';
                upper.textContent = `${user.sender_name} | ${user.createdAt} `;

                const messageText = document.createElement('div');
                messageText.className = 'message-text';
                messageText.textContent = user.message;

                li.appendChild(upper);
                li.appendChild(messageText);
                userList.appendChild(li);
  
            });
        })
    .catch(error => console.error('Error:', error));
}

async function fetchgroups() {
    const token = localStorage.getItem('token');
    await fetch(`/group/message`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token','token_group_id')}`
        }
    })
    .then(response => response.json())
        .then(users => {
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


function openMessageTab(user) {
    localStorage.setItem('token_group_id', user.id);
    const messageTab = document.getElementById('message-tab');
    messageTab.innerHTML = '';
    
    const messageTabContent = document.createElement('div');
    messageTabContent.textContent = `Group: ${user.name}`;
    
    messageTab.appendChild(messageTabContent);
    fetchmessage();

};    


fetchgroups();

const admin = document.getElementById('admin');

admin.addEventListener('click', (event) => {
    event.preventDefault();

    window.location.href = "admin.html";
})






