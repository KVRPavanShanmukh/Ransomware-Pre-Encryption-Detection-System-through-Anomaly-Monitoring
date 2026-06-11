const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Read command line arguments
const to = process.argv[2];
const subject = process.argv[3];
const body = process.argv[4];
const attachmentPath = process.argv[5];

if (!to || !subject || !body) {
    console.error("Usage: node send_mail.js <to> <subject> <body> [attachmentPath]");
    process.exit(1);
}

let userEmail = process.env.MAIL_USER;
if (!userEmail || userEmail === 'example@gmail.com') {
    userEmail = 'kakarlapavanshanmukh@gmail.com';
}

let userPass = process.env.MAIL_PASS;
if (!userPass || userPass === 'your_key') {
    userPass = 'apev evyg hkho nvvb';
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: userEmail,
        pass: userPass
    }
});

// Customized design HTML content
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SentinelStream Alert</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }
        .header { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 25px; text-align: center; border-bottom: 3px solid #10b981; }
        .header h1 { color: #10b981; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase; font-weight: 800; }
        .content { padding: 35px; line-height: 1.8; }
        .alert-box { background-color: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 25px 0; color: #fca5a5; font-size: 15px; }
        .normal-box { background-color: rgba(16, 185, 129, 0.1); border: 1px dashed #10b981; border-radius: 8px; padding: 20px; margin: 25px 0; color: #a7f3d0; font-size: 15px; }
        .footer { background-color: #0b0f19; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1f2937; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #0b0f19 !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .details-list { margin: 10px 0; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ SentinelStream Security</h1>
        </div>
        <div class="content">
            <h2>Security Notification</h2>
            <div class="${subject.toLowerCase().includes('alert') ? 'alert-box' : 'normal-box'}">
                ${body.replace(/\n/g, '<br>')}
            </div>
            <p>Please log in to your dashboard to review full analysis and metrics.</p>
            <div style="text-align: center;">
                <a href="http://localhost:5173" class="btn">Open Dashboard</a>
            </div>
        </div>
        <div class="footer">
            SentinelStream Protection Engine &copy; 2026. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

const mailOptions = {
    from: `"SentinelStream Security" <${userEmail}>`,
    to: to,
    subject: subject,
    text: body,
    html: htmlContent
};

if (attachmentPath && fs.existsSync(attachmentPath)) {
    mailOptions.attachments = [
        {
            filename: path.basename(attachmentPath),
            path: attachmentPath
        }
    ];
}

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Nodemailer Error:", error.message);
        process.exit(1);
    } else {
        console.log("Email sent successfully via Nodemailer:", info.response);
        process.exit(0);
    }
});
