# News Aggregator API

A RESTful API for aggregating and personalizing news content based on user preferences. Built with Node.js, Express, and MongoDB.

## 📋 Project Overview

This News Aggregator API allows users to:
- Register and authenticate with JWT tokens
- Set and manage news preferences (topics, categories)
- Fetch personalized news based on preferences from GNews API
- Mark articles as read or favorite
- Cache news results for better performance

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT and bcrypt password hashing
- **Personalized News Feed**: Fetch news based on user-defined preferences
- **Article Management**: Mark articles as read or favorite
- **Caching**: In-memory caching for faster news retrieval
- **Input Validation**: Comprehensive validation for user inputs
- **RESTful Design**: Clean and intuitive API endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **HTTP Client**: Axios
- **External API**: GNews API

## 📦 Installation

### Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account or local MongoDB instance
- GNews API key ([Get one here](https://gnews.io/))

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd news-aggregator-api-mohit-ydv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GNEWS_API_KEY=your_gnews_api_key
   ```

4. **Start the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📚 API Documentation

Base URL: `http://localhost:3000`

### Authentication Endpoints

#### 1. User Signup
**POST** `/users/signup`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "preferences": ["technology", "sports"]
}
```

**Response (200 OK):**
```json
{
  "message": "User registered successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": ["technology", "sports"],
    "_id": "507f1f77bcf86cd799439011"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**
- `name`: Required, minimum 4 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `preferences`: Optional, array of strings

---

#### 2. User Login
**POST** `/users/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### User Preferences Endpoints

> **Note:** All preference endpoints require authentication via Bearer token in the `Authorization` header.

#### 3. Get User Preferences
**GET** `/users/preferences`

Retrieve the logged-in user's news preferences.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "User preferences fetched successfully",
  "preferences": ["technology", "sports", "business"]
}
```

---

#### 4. Update User Preferences
**PUT** `/users/preferences`

Update the user's news preferences.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "preferences": ["technology", "entertainment", "science"]
}
```

**Response (200 OK):**
```json
{
  "message": "User preferences updated successfully",
  "preferences": ["technology", "entertainment", "science"]
}
```

---

### News Endpoints

> **Note:** All news endpoints require authentication via Bearer token.

#### 5. Get Personalized News
**GET** `/news`

Fetch news articles based on user preferences.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "news": [
    {
      "title": "Article Title",
      "description": "Article description...",
      "content": "Full article content...",
      "url": "https://example.com/article",
      "image": "https://example.com/image.jpg",
      "publishedAt": "2024-12-06T12:00:00Z",
      "source": {
        "name": "Source Name",
        "url": "https://source.com"
      }
    }
  ]
}
```

**Features:**
- Returns up to 10 articles
- Searches based on user preferences using OR logic
- Results are cached for better performance
- If no preferences set, defaults to "general" news

---

#### 6. Mark Article as Read
**POST** `/news/:id/read`

Mark a specific article as read.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**
- `id`: Article identifier

**Response (200 OK):**
```json
{
  "message": "Article marked as read."
}
```

---

#### 7. Mark Article as Favorite
**POST** `/news/:id/favorite`

Mark a specific article as favorite.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**
- `id`: Article identifier

**Response (200 OK):**
```json
{
  "message": "Article marked as favorite."
}
```

---

#### 8. Get Read Articles
**GET** `/news/read`

Retrieve all articles marked as read by the user.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "readArticles": ["article-id-1", "article-id-2", "article-id-3"]
}
```

---

#### 9. Get Favorite Articles
**GET** `/news/favorites`

Retrieve all articles marked as favorite by the user.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "readArticles": ["article-id-1", "article-id-2"]
}
```

---

## 🔒 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

### How to Use

1. **Signup or Login** to receive a JWT token
2. **Include the token** in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Tokens expire after **1 hour**

### Protected Routes
All routes except `/users/signup` and `/users/login` require authentication.

---

## 📁 Project Structure

```
news-aggregator-api-mohit-ydv/
├── src/
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   └── user.js           # User schema and model
│   └── routes/
│       ├── user.js           # User authentication and preferences routes
│       └── news.js           # News fetching and management routes
├── test/
│   └── server.test.js        # API tests
├── app.js                    # Express app configuration
├── package.json              # Project dependencies
├── .env                      # Environment variables (not committed)
└── README.md                 # This file
```

---

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The test suite includes:
- User signup and login tests
- Authentication validation tests
- Preferences management tests
- News fetching tests

---

## ⚠️ Error Handling

The API returns appropriate HTTP status codes and error messages:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (validation errors) |
| 401 | Unauthorized (invalid/missing token) |
| 404 | Not Found (user/resource not found) |
| 500 | Internal Server Error |

**Error Response Format:**
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🌟 Usage Examples

### Complete User Flow

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "securepass123",
    "preferences": ["technology", "science"]
  }'

# Response includes token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Get personalized news
curl -X GET http://localhost:3000/news \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Update preferences
curl -X PUT http://localhost:3000/users/preferences \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": ["technology", "sports", "business"]
  }'

# 4. Mark article as favorite
curl -X POST http://localhost:3000/news/article-123/favorite \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
- **JWT Tokens**: Secure, stateless authentication
- **Input Validation**: Comprehensive validation on all user inputs
- **Email Uniqueness**: Prevents duplicate user registrations
- **Environment Variables**: Sensitive data stored in `.env` file

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `DB_URL` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `GNEWS_API_KEY` | GNews API key | `your_api_key` |

---

## 🤝 Contributing

This is an assignment project for Airtribe Backend Engineering Launchpad.

---

## 📄 License

ISC

---

## 👨‍💻 Author

**Airtribe** - Backend Engineering Launchpad Assignment 2

---

## 🙏 Acknowledgments

- [GNews API](https://gnews.io/) for news data
- [Express.js](https://expressjs.com/) framework
- [MongoDB](https://www.mongodb.com/) database
- [JWT](https://jwt.io/) for authentication
