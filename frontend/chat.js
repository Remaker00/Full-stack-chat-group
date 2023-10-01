const socket = io();

const userForm = document.getElementById('user-form');
const userList = document.getElementById('user-list');
const userList2 = document.getElementById('user-list2');
const groupList = document.getElementById('group-list');
document.getElementById('admin').style.display = 'none';

userForm.addEventListener('submit', handleUserForm);


socket.on('message', (message) => {
    addMessage(message);
});

socket.on('senderName', (senderName) => {
    addSenderName(senderName);
});


function addMessage(message) {
    const li = document.createElement('li');
    li.textContent = message;
    li.classList.add('chat-message');
    userList.appendChild(li);
}

function addSenderName(senderName) {
    const messageLi = userList.lastChild;
    const senderNameDiv = document.createElement('div');
    senderNameDiv.textContent = `Sender: ${senderName}`;
    messageLi.appendChild(senderNameDiv);
}

async function handleUserForm(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;

    const userData = { message };

    const token = localStorage.getItem('token');
    const groupId = localStorage.getItem('token_group_id');
    console.log("><><><", groupId);

    if (token) {
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

                socket.emit('message', message);
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
    userForm.reset();
    addMessage();
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
            } else {
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
                upper.textContent = `${user.sender_name}`;

                const messageText = document.createElement('div');
                messageText.className = 'message-text';
                messageText.textContent = user.message;

                li.appendChild(upper);
                li.appendChild(messageText);
                userList.appendChild(li);

                socket.emit('senderName', user.sender_name);

            });
        })
        .catch(error => console.error('Error:', error));
}

async function fetchgroups() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`/group/message`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const groups = await response.json();

        groupList.innerHTML = '';

        groups.forEach(group => {
            const li = document.createElement('li');
            li.textContent = `${group.name}  -  ${group.member_names}  `;

            li.addEventListener('click', () => openMessageTab(group));
            groupList.appendChild(li);

        });
    }
    catch (error) {
        console.error('Error:', error);
    }
};


function openMessageTab(group) {
    localStorage.setItem('token_group_id', group._id);
    const messageTab = document.getElementById('message-tab');
    messageTab.innerHTML = '';

    const messageTabContent = document.createElement('div');
    messageTabContent.textContent = `Group: ${group.name}`;

    messageTab.appendChild(messageTabContent);
    fetchmessage();

};


fetchgroups();

const admin = document.getElementById('admin');

admin.addEventListener('click', (event) => {
    event.preventDefault();

    window.location.href = "admin.html";
})






