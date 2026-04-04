````md
# WSK Cats API

## Overview

This project is a REST API built with Node.js, Express, and MySQL.
It provides functionality for managing users and their cats.
The API supports authentication using JSON Web Tokens (JWT), file uploads for cat images, and role-based access control (admin/user).

The project follows an MVC structure with separate folders for controllers, models, routes, middleware, and utilities.

---

## Features

- User registration, login, and profile retrieval
- Role‑based access control (admin and regular user)
- CRUD operations for users and cats
- JWT authentication
- File upload with Multer (images and videos)
- Thumbnail generation with Sharp
- Server‑side validation using express‑validator
- Centralized error handling middleware
- MySQL database integration

---

## Authentication

### Login

**POST /api/v1/auth/login**

Request body:

```json
{
  "username": "example",
  "password": "password123"
}
```

Response:

- Returns a JWT token valid for 24 hours
- Includes user information (without password)

### Get Authenticated User

**GET /api/v1/auth/me**

Requires header:

```
Authorization: Bearer <token>
```

Returns the decoded user stored in `res.locals.user`.

---

## Access Rules

This API uses role-based access control. All protected routes require a valid JSON Web Token (JWT) provided in the `Authorization: Bearer <token>` header. After successful validation, the authenticated user is stored in `res.locals.user` and used for permission checks.

### User Access Rules

- A regular user can update only their own user account.
- A regular user cannot update or delete other users.
- A regular user can delete only their own account.
- A regular user can modify or delete only their own cats.
- A valid JWT token is required for all operations except registration and login.

### Admin Access Rules

- An admin can update or delete any user.
- An admin can view all users.
- An admin can update or delete any cat.
- An admin has full access to all protected routes, provided a valid JWT token is included.

### Cat Access Rules

When modifying or deleting a cat, the following checks are applied:

1. If the authenticated user is an admin, the operation is allowed.
2. If the authenticated user is the owner of the cat, the operation is allowed.
3. Otherwise, the server returns `403 Forbidden`.

These rules apply to updating and deleting cat records.

### Authentication Rules

- All protected routes require a valid JWT token.
- If the token is missing, expired, or invalid, the server returns `401 Unauthorized`.
- After token verification, the decoded user data is attached to `res.locals.user` and used for permission checks.
- Passwords are stored hashed using bcrypt and are never returned in API responses.

### File Upload Rules

- Cat creation supports image upload using multipart/form-data.
- Uploaded files are stored in the `/uploads` directory.
- The filename is saved in the database as part of the cat record.
- Only authenticated users may upload files.

---

## Error Handling

This API uses centralized error handling middleware.

### Not Found Handler

Triggered when no route matches the request.

### Error Handler

Returns JSON errors in the format:

```json
{
  "error": {
    "message": "Error message",
    "status": 400
  }
}
```

### Validation Errors

If express‑validator detects invalid input, the middleware returns:

```json
{
  "error": {
    "message": "field: error message",
    "status": 400
  }
}
```

---

## Input Validation

Validation is performed using **express‑validator**.

### User Validation Rules

- `email`: required, valid email
- `username`: required, alphanumeric, 3–20 characters
- `password`: required, minimum 8 characters

### Cat Validation Rules

- `cat_name`: required, 3–50 characters
- `weight`: required, numeric
- `owner`: required, integer
- `birthdate`: required, valid date
- `file`: required, validated by Multer

---

## File Upload

- Uploads handled by Multer
- Allowed types: images and videos
- Max file size: 10 MB
- Uploaded files stored in `/uploads`
- Thumbnails generated using Sharp (160×160)

Example field name:

```
cat
```

---

## Users API

### Get All Users

**GET /api/v1/users**

### Get User by ID

**GET /api/v1/users/:id**

### Create User

**POST /api/v1/users**

Includes validation middleware.

### Update User

**PUT /api/v1/users/:id**

Requires authentication.  
Regular users can update only their own account.

### Delete User

**DELETE /api/v1/users/:id**

Requires authentication.  
Regular users can delete only their own account.

---

## Cats API

### Get All Cats

**GET /api/v1/cats**

### Get Cat by ID

**GET /api/v1/cats/:id**

### Get Cats by User

**GET /api/v1/cats/user/:id**

### Create Cat

**POST /api/v1/cats**

Requires:

- Authentication
- File upload
- Validation

### Update Cat

**PUT /api/v1/cats/:id**

Requires authentication and ownership/admin rights.

### Delete Cat

**DELETE /api/v1/cats/:id**

Requires authentication and ownership/admin rights.

---

## Error Response Examples

### Missing Token

```json
{
  "error": {
    "message": "Token missing",
    "status": 401
  }
}
```

### Invalid Token

```json
{
  "error": {
    "message": "Invalid token",
    "status": 403
  }
}
```

### Validation Error

```json
{
  "error": {
    "message": "email: Invalid email format",
    "status": 400
  }
}
```

---

## Project Structure

```
src/
  api/
    controllers/
    models/
    routes/
  middlewares/
    authentication.js
    upload.js
    error_handlers.js
  utils/
    database.js
```

---

## Running the Project

1. Install dependencies:

```
npm install
```

2. Create `.env` file:

```
JWT_SECRET=your_secret_key
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
```

3. Start the server:

```
npm start
```

---

## Final Notes

- All errors are handled through centralized middleware.
- All input is validated and sanitized.
- Authentication is required for all protected routes.
- Admins have full access; regular users have restricted access.
````
