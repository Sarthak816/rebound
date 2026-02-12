require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

console.log("Testing MongoDB connection...");
console.log("Reading URI from .env...");

if (!uri || uri.includes("<db_password>")) {
    console.error("\n❌ Error: Please open 'backend/.env' and replace '<db_password>' with your actual password.");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log("\n✅ Success! Connected to MongoDB.");
        console.log("You can now copy the 'MONGO_URI' value from .env to Render.");
        process.exit(0);
    })
    .catch(err => {
        console.error("\n❌ Connection Failed:", err.message);
        if (err.message.includes('Authentication failed')) {
            console.log("👉 Tip: Check if your password is correct or if it contains special characters that need 'URL encoding'.");
        }
        process.exit(1);
    });
