const userSignup = document.getElementById('signupform');

userSignup.addEventListener('submit', handleSignup);

async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('number').value;
    const password = document.getElementById('password').value;

    const data = { name, email, number, password};
    try {
        await fetch('/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        userSignup.reset();
        alert("Account Successfully Created"); 
        window.location.href="login.html";
    } catch (error) {
        console.error('Error:', error);
    }

};


