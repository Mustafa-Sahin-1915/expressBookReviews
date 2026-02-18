const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Setup session for customer
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if session exists
    if (!req.session || !req.session.username) {
        return res.status(401).json({ message: "User not logged in or session expired" });
    }

    // Attach username to request object so routes can use it
    req.username = req.session.username;
    next(); // proceed to the actual route
});

const PORT = 5000;

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
