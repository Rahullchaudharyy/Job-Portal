/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin
const admin = require('firebase-admin');
admin.initializeApp();

// Set SendGrid API key
sgMail.setApiKey('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');  // Replace with your SendGrid API Key

// Cloud Function to send a welcome email when a user signs up
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;  // User's email
  const displayName = user.displayName || "User";

  const msg = {
    to: email,  // The recipient's email
    from: 'geekyyrahul@gmail.com',  // Your verified sender email in SendGrid
    subject: 'Welcome to Our App Job Portal!',
    text: `Hi ${displayName}, welcome to our application!`,
    html: `<p>Hi ${displayName},</p><p>Welcome to our app! We're excited to have you to test our app.</p>`,
  };

  // Send email
  return sgMail.send(msg)
    .then(() => console.log('Welcome email sent to:', email))
    .catch((error) => console.error('Error sending email:', error));
});

