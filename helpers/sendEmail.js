const sendgrid = require('@sendgrid/mail');

const { SENDGRID_API_KAY, SENDGRID_FROM } = process.env

sendgrid.setApiKey(SENDGRID_API_KAY);

const sendEmail = async (data, from = SENDGRID_FROM) => {
    try {
        const email = { ...data, from }
    
        await sendgrid.send(email);

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = sendEmail;