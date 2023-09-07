const peopleList = document.getElementById("people-list");
const groupform = document.getElementById("groupform");

groupform.addEventListener('submit', handlegroup)

async function handlegroup(event) {
    event.preventDefault();

    const selectedUser = document.querySelectorAll('input[name="selectedUsers"]:checked');
    const selectedUserIds = Array.from(selectedUser).map(checkbox => checkbox.value);
    const name = document.getElementById('name').value;

    const data = { selectedUserIds, name };
    try {
        await fetch('/group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        groupform.reset();
        alert(`${name} Group Successfully Created`); 
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchUsers() {
    await fetch(`/user/peoples`, {
        method: 'GET',
        headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
    })
    .then(response => response.json())
        .then(users => {
            peopleList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.name;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'selectedUsers';
                checkbox.value = user.id;
                li.appendChild(checkbox)
                peopleList.appendChild(li);
                
            });
        })
    .catch(error => console.error('Error:', error));
}

fetchUsers();