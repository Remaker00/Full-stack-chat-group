const resetpassword = document.getElementById('resetform');

resetpassword.addEventListener('submit', handlepassword);

async function handlepassword(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('retype-password').value;

    const data = { email, password };
    try {
        const response = await fetch('/resetpassword/pass_reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Pasword Reset Successful.");
            window.location.href= "login.html";
        } else {
            alert("Password reset Failed");
            console.log('Invaid credentials.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
};
