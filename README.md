# aitee_server

This is the server part of the aitee project. It is a RESTful API server that serves the aitee client.

## Installation

1. Clone the repository

```bash
git clone https://github.com/tungluongthanh03/aitee_server.git
cd aitee_server
```

2. Install dependencies

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=3000
JWT_SECRET_KEY=your_jwt_secret_key
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_key
ADMIN_ID=your_admin_id
ADMIN_EMAIL=admin@admin.com
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Running the Server

```bash
npm start
```

## API Documentation

API documentation is available at `http://localhost:3000/api-docs`.

## Project Structure

```
.env
.gitignore
.prettierrc
package.json
README.md
src/
    config/
        index.js
        swagger.config.js
    controllers/
        post/
        user/
    data-source.js
    index.js
    loader/
        express-loader.js
        index.js
    middlewares/
        auth/
        image-upload.js
        index.js
        media-upload.js
        rate-limiter.js
    models/
        entities/
        index.js
    routes/
        index.js
        post.js
        user.js
    services/
        auth/
        cloudinary/
        user/
    validators/
        post.validator.js
        user.validator.js
```
