import sendMail from "../helper/sendMail";

export const sendEmailToAdmin = (email, name) => {
    const emailTemplate = {
        emailTo: email,
        subject: "Welcome to Hover Ai - Exciting Times Ahead!",
        message: `
            <h1>Dear Admin, ${name}</h1>
            <p>Thank you for joining us at Hover Ai! We're eager to embark on this journey together, bringing you the latest and greatest. Stay tuned for more updates and opportunities to come.</p>
            <img src="https://res.cloudinary.com/da12yf0am/image/upload/v1711865295/onmu1yiyolr2xb6krevq.jpg" alt="Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto;"/>
            <p style="text-align: center;"><a href="https://example.com" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit our site</a></p>
            <p>Warm regards,<br/>The Hover Ai Team</p>
        `,
    };

    sendMail(emailTemplate);
};
