# Expensify

## Overview

This project is a web application developed with React and Chakra UI for the frontend, featuring user authentication using JWT (JSON Web Tokens). The backend is powered by Node.js and Express.js, with a MySQL database managed by Sequelize ORM. It includes protected routes for the frontend and protected API routes for the backend. Additionally, the project integrates the Razorpay payment gateway to allow users to purchase a premium subscription for the application (in test mode).

## Features

- User Authentication: Users can sign up, log in, and log out securely using JWT-based authentication.
- Razorpay Integration: Users can purchase a premium subscription using the Razorpay payment gateway in test mode.
- Forgot Password: A "forgot password" feature is implemented, allowing users to reset their password via email.
- Sequelize ORM: The project uses Sequelize ORM to interact with the MySQL database.
- Protected Routes: Certain routes on the frontend are protected, ensuring only authenticated users can access them.
- Protected API Routes: API routes on the backend are also protected, requiring valid JWT tokens for access.
