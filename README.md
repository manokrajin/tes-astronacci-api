# User Management API

A RESTful API for managing users with image upload functionality, built with Node.js, Express, and Prisma.

## 🚀 Features

- **User Management**: Create, read, update, and delete users
- **Image Upload**: Upload and manage user profile images (stored as base64 strings)
- **Pagination**: Paginated user listings
- **File Validation**: Image file type and size validation
- **Database**: PostgreSQL with Prisma ORM
- **RESTful API**: Clean REST endpoints

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **File Upload**: Multer
- **Template Engine**: Jade/Pug

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd tes-astronacci-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

4. **Database Setup:**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database with sample data
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

### Alternative Start Commands
```bash
# With debug logging
set DEBUG=myapp:* & npm start

# Direct node execution
node ./bin/www
```

## 📚 API Endpoints

### Users

#### GET /users
Get paginated list of users
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "imageBase64": "base64-encoded-image-string"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

#### GET /users/:id
Get a specific user by ID

#### POST /users
Create a new user with optional image upload

**Content-Type:** `multipart/form-data`

**Form Data:**
- `name` (required): User's name
- `image` (optional): Image file (max 10MB, images only)

**Example using curl:**
```bash
curl -X POST http://localhost:3000/users \
  -F "name=John Doe" \
  -F "image=@profile.jpg"
```

#### PUT /users/:id
Update an existing user

**Content-Type:** `multipart/form-data`

**Form Data:**
- `name` (optional): Updated name
- `image` (optional): New image file

#### PUT /users/:id/image
Update only the user's image

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image` (required): Image file

#### GET /users/:id/image
Get user's image as binary data

#### DELETE /users/:id
Delete a user

## 🗄️ Database Schema

```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  image String? // Base64 encoded image
}
```

## 📱 Flutter Integration

### Using Dio for API Calls

```dart
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';

class UserApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://localhost:3000',
  ));

  Future<Map<String, dynamic>> createUser({
    required String name,
    XFile? imageFile,
  }) async {
    FormData formData = FormData.fromMap({
      'name': name,
    });

    if (imageFile != null) {
      formData.files.add(MapEntry(
        'image',
        await MultipartFile.fromFile(imageFile.path, filename: imageFile.name),
      ));
    }

    final response = await _dio.post('/users', data: formData);
    return response.data;
  }
}
```

## 🧪 Testing the API

### Using cURL

**Create User:**
```bash
curl -X POST http://localhost:3000/users \
  -F "name=John Doe"
```

**Get Users:**
```bash
curl http://localhost:3000/users
```

**Get Paginated Users:**
```bash
curl "http://localhost:3000/users?page=1&limit=5"
```

### Using Postman

1. Set method to `POST`
2. URL: `http://localhost:3000/users`
3. Body: `form-data`
4. Add fields:
   - Key: `name`, Value: `John Doe`
   - Key: `image`, Type: `File`, Select image file

## 📁 Project Structure

```
├── bin/
│   └── www                 # Server startup script
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.js            # Database seeding script
│   └── migrations/        # Database migrations
├── public/                # Static files
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
├── routes/
│   ├── index.js           # Home route
│   └── users.js           # User management routes
├── views/                 # Jade/Pug templates
├── app.js                 # Express app configuration
├── package.json
└── README.md
```

## 🔧 Configuration

### File Upload Settings
- **Max file size**: 10MB
- **Allowed file types**: Images only (jpeg, png, gif, etc.)
- **Storage**: Memory storage (files converted to base64 strings)

### Database
- **Provider**: PostgreSQL
- **ORM**: Prisma
- **Connection**: Via `DATABASE_URL` environment variable

## 🚨 Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## 📝 Development Notes

- Images are stored as base64 strings in the database
- The API supports pagination for large user lists
- File uploads are validated for type and size
- CORS is not configured (add if needed for frontend integration)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.