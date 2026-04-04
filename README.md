````md
# WSK Cats API

## Overview

This project is a REST API built with Node.js, Express, and MySQL.
It provides functionality for managing users and their cats.
The API supports authentication using JSON Web Tokens (JWT), file uploads for cat images, and role-based access control (admin/user).

The project follows an MVC structure with separate folders for controllers, models, routes, middleware, and utilities.

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

```

```
````
