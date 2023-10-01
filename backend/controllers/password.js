const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.sendTransactionalEmail = async (req, res) => {
    const sender = { email: 'nishant.sharma8507966@gmail.com' };

    const receivers = [req.body];
    try {
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Request for reset your password',
            textContent: `Learning SendinBlue functions and how they work`,
            htmlContent: `<a href="http://localhost:4000/resetpassword.html">Reset password</a>`,
        });
        console.log('Email sent successfully');
        res.status(201).send("Working fine by me");
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
