# Pizza Delivery API

## Project Overview
Welcome to the Pizza Delivery API! This project is designed to provide a backend service for a pizza delivery company. The API allows you to manage users, authentication, menu items, carts, and orders. It integrates with Stripe for payment processing and Mailgun for sending email receipts.

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your system:
- Node.js (v14.x or higher)
- Git

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Morg3an/pizza-delivery-api.git
   cd pizza-delivery-api
    ```

2.  **Install dependencies:** 
    Since we are not using npm or any package
    manager, make sure you have the necessary Node.js modules included
    in your project.

### Configuration

1.  **Create a `.env.local` file:** 
    In the root directory of your
    project, create a file named `.env.local` and add your configuration
    variables (e.g., Stripe secret key, Mailgun API key).

    ``` plaintext
    STRIPE_SECRET_KEY=your_stripe_secret_key
    MAILGUN_API_KEY=your_mailgun_api_key
    ```

2.  **Update the configuration file:**  Update `lib/config.js` to load
    these environment variables.

## Running the Server

1.  **Start the server:** Run the following command to start the server:

    ``` bash
    node index.js
    ```

2.  **Server Ports:** The server will listen on port `3000` and `3001`.

You can now proceed to interact with the API endpoints.

### API Endpoints
### User Endpoints

**Create User**
- **Method**: POST
- **URL**: `/users`
- **Headers**: `Content-Type: application/json`
- **Body**: Raw, JSON
```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "address": "123 Main St",
    "password": "strongpassword"
  }
```

**Get User**
- **Method**: GET
- **URL**: `/users?email=johndoe@example.com`
- **Headers**: 
  - `token`: `YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- **Query Parameters**:
  - `email`: `johndoe@example.com`

**Update User**
- **Method**: PUT
- **URL**: `/users`
- **Headers**: 
  - `token`: `YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- **Body**: Raw, JSON
```json
  {
    "name": "John Doe Updated",
    "address": "456 Elm St",
    "password": "newstrongpassword"
  }
```

**Delete User**
- **Method**: DELETE
- **URL**: `/users`
- **Headers**: 
  - `token`: `YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- **Body**: Raw, JSON
```json
  {
    "name": "John Doe Updated",
    "address": "456 Elm St",
    "password": "newstrongpassword"
  }
```

### Token Endpoints

**Create Token (Login)**
- **Method**: POST
- **URL**: `/tokens`
- **Headers**: `Content-Type: application/json`
- **Body**: Raw, JSON
```json
  {
    "email": "johndoe@example.com",
    "password": "strongpassword"
  }
```

**Get Token**
- **Method**: GET
- **URL**: `/tokens?id=randomTokenId`
- **Headers**: 
  - `token`: `YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- **Query Parameters**:
  - `id`: `randomTokenId`

**Delete Token (Logout)**
- **Method**: DELETE
- **URL**: `/tokens`
- **Headers**: `Content-Type: application/json`
- **Body**: Raw, JSON
```json
  {
    "id": "randomTokenId"
  }
```

### Menu Endpoints

**Get Menu**
- **Method**: GET
- **URL**: `/menu`
- **Headers**: 
  - `token`: `YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`

### Cart Endpoints

**Create Cart**
- **Method**: POST
- **URL**: /cart
- **Headers**: 
    - `token`: `YOUR_TOKEN_HERE`
    - `Content-Type: application/json`
- **Body**: Raw, JSON
```json
  {
    "itemId": 2,
    "quantity": 20
  }
```

**Get Cart**
- **Method**: GET
- **URL**: `/cart?cartId=randomCartId`
- **Headers**: 
  - `token`: `YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- **Query Parameters**:
  - `cartId`: `randomCartId`

**Update Cart**
- **Method**: PUT
- **URL**: /cart
- **Headers**: 
    - `Content-Type: application/json`
- **Body**: Raw, JSON
```json
  {
    "cartId": "randomCartId",
    "itemId": 2,
    "quantity": 20
  }
```

**Update Cart**
- **Method**: DELETE
- **URL**: /cart
- **Headers**: 
    - `Content-Type: application/json`
- **Body**: Raw, JSON
```json
  {
    "cartId": "randomCartId"
  }
```

### Order Endpoints

**Create Order**
- **Method**: GET
- **URL**: `/order`
- **Headers**: 
  - `token`: `YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- **Body**: Raw, JSON
```json
  {
    "itemId": 2,
    "amount": 20
  }
```

**Get Order**
- **Method**: GET
- **URL**: `/order?id=randomOrderId`
- **Headers**:
    - `token`: `YOUR_TOKEN_HERE`
    - `Content-Type`: `application/json`
- **Query Parameters**:
  - `id`: `randomOrderId`


### Example Requests with curl

## Create User
```bash
    curl -X POST http://localhost:3000/ users -H "Content-Type: application/json" -d '{
        "name": "John Doe",
        "email": "johndoe@example.com",
        "address": "123 Main St",
        "password": "strongpassword"
    }'
```

## Get Menu
```bash
    curl -X GET http://localhost:3000/menu -H "token: YOUR_TOKEN_HERE"
```

## Create Order 
```bash
    curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -H "token: YOUR_TOKEN_HERE" -d '{
        "itemId": "1",
        "amount": 20
    }'
```

### Error Handling
The API uses standard HTTP status codes to indicate the success or failure of an API request. Here are some common status codes and their meanings:

**200 OK**: The request was successful

**201 Created**: The request was successful and a new resource was created.

**400 Bad Request**: The server could not understand the request due to invalid syntax.

**401 Unauthorized**: The client must authenticate itself to get the requested response.

**403 Forbidden**: The client does not have access rights to the content.

**404 Not Found**: The server can not find the requested resource.

**500 Internal Server Error**: The server has encountered a situation it doesn't know how to handle.

Make sure to check the response body for additional details about the error.

### Security Considerations
To ensure the security of the API and its data, consider the following measures:

**Authentication and Authorization**: Use token-based authentication to ensure only authorized users can access the API.

**Data Validation**: Validate all incoming data to prevent malicious inputs and ensure data integrity.

**Encryption**: Use HTTPS to encrypt data in transit. Sensitive information, such as passwords, should be hashed before storing.

**Rate Limiting**: Implement rate limiting to prevent abuse and denial-of-service attacks.

**Error Handling**: Avoid exposing stack traces and internal server information in error messages.

**Security Headers**: Use security headers like ```Content-Security-Policy```, ```X-Content-Type-Options```, and ```X-Frame-Options``` to protect against common web vulnerabilities.

1. **Fork the Repository:**
    Click on the "Fork" button at the top right corner of the repository page.

2. **Clone the Forked Repository:**
    ```bash
        git clone https://github.com/Morg3an/pizza-delivery-api.git
        cd pizza-delivery-api
    ```

3. **Create a New Branch:**
    ```bash
        git checkout -b feature-or-bugfix-name
    ```

4. **Make Changes:**
    Make your changes and commit them with descriptive commit messages.
    ```bash
        git add .
        git commit -m "Description of your changes"
    ```

5. **Push Changes:**
    Push your changes to your forked repository.
    ```bash
        git push origin feature-or-bugfix-name
    ```

6. **Create a Pull Request:**
    Open a pull request from your forked repository to the original repository's main branch.

### License
This project is licensed under the MIT License. See the LICENSE file for details.

### Contact Information
For any questions or concerns, please contact me:

    - Email: mulweyemorgan12@gmail.com

    - GitHub Issues: GitHub Issues

We appreciate your feedback and contributions!
# api-pizza-delivery
