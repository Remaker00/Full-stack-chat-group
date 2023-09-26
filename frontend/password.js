const userpassword = document.getElementById('passwordform');

userpassword.addEventListener('submit', handlepassword);

async function handlepassword(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    const data = { email };
    try {
        const response = await fetch('/password/send_mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Email Sent Success");
        } else {
            alert("message not sent Failed");
            console.log('mail sending  failed.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
};
