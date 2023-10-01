const peopleList1 = document.getElementById("people-list1");
const peopleList = document.getElementById("people-list");
const groupform = document.getElementById("groupform");

groupform.addEventListener("submit", handlegroup);

async function handlegroup(event) {
    event.preventDefault();

    const selectedUser = document.querySelectorAll('input[name="selectedUsers"]:checked');
    const selectedUserIds = Array.from(selectedUser).map((checkbox) => checkbox.value);
    const name = document.getElementById("name").value;
    
    try {
        await changegroupname(name);

        
        await removeOldPeople(selectedUserIds);
    
        await addNewPeople(selectedUserIds);

        groupform.reset();
        //window.location.href = "chat.html"
    } catch (error) {
        console.error("Error:", error);
    }
}

async function changegroupname(name) {
  try {
    const groupId = localStorage.getItem("token_group_id");
    const response = await fetch("/admin/change_name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Group-ID": groupId,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Changed group name ${response.status}`);
    }
  } catch (error) {
    console.error("Error while changing group name:", error);
  }
};

async function removeOldPeople(selectedUserIds) {
  try {
    const groupId = localStorage.getItem("token_group_id");
    const response = await fetch("/admin/remove_oldpeople", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Group-ID": groupId,
      },
      body: JSON.stringify({ selectedUserIds }),
    });

    if (!response.ok) {
      throw new Error(`Remove oldpeople failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error removing oldpeople:", error);
  }
};

async function addNewPeople(selectedUserIds) {
  try {
    const groupId = localStorage.getItem("token_group_id");
    const response = await fetch("/admin/add_newpeople", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Group-ID": groupId,
      },
      body: JSON.stringify({ selectedUserIds }),
    });

    if (!response.ok) {
      throw new Error(`Add newpeople failed with status ${response.status}`);
    }

  } catch (error) {
    console.error("Error adding newpeople:", error);
  }
}


async function fetchAndDisplayUsers() {
  try {
    const groupId = localStorage.getItem("token_group_id");
    const response = await fetch(`/admin/add_peoples`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Group-ID": groupId,
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const users = await response.json();

    // Clear the lists
    peopleList.innerHTML = "";
    peopleList1.innerHTML = "";

    // Display newpeople
    users.newpeople.forEach((user) => {
      const li = createListItem(user.name, user.id);
      peopleList.appendChild(li);
    });

    // Display oldpeople
    users.oldpeople.forEach((user) => {
      const li = createListItem(user, user);
      peopleList1.appendChild(li);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function createListItem(text, value) {
  const li = document.createElement("li");
  li.textContent = text;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "selectedUsers";
  checkbox.value = value;

  li.appendChild(checkbox);
  return li;
}

fetchAndDisplayUsers();

