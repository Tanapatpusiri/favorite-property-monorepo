# Favorite Property

A full-stack application for browsing properties and managing favorites, built with a modern monorepo structure.

## 🚀 Technologies

- **Monorepo**: NPM Workspaces
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Axios
- **Backend**: Express.js, Prisma ORM
- **Database**: MongoDB (Atlas)
- **Testing**: Jest (Integration Tests)

## 🛠️ Prerequisites

- Node.js (v18+)
- NPM
- MongoDB Connection String

## 📥 Installation

1.  **Clone and Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    - **API**: Ensure `apps/api/.env` exists with your MongoDB connection string.
      ```env
      DATABASE_URL="mongodb+srv://..."
      PORT=4000
      ```
    - **Web**: Create `apps/web/.env.local` to point to the API.
      ```env
      # Must match the PORT defined in apps/api/.env
      NEXT_PUBLIC_API_URL=http://localhost:4000
      ```

3.  **Database Setup**
    Generate the Prisma client:
    ```bash
    npm run prisma:generate
    ```

## 🏃‍♂️ Running the App

Start both the frontend and backend in development mode:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

## 📂 Project Structure

```
├── apps
│   ├── api                 # Express.js Backend
│   │   ├── src
│   │   │   ├── property    # Property module (Controller, Routes)
│   │   │   ├── favorite    # Favorite module (Controller, Routes)
│   │   │   ├── user        # User module (Controller, Routes)
│   │   │   └── server.js   # Entry point
│   │   └── prisma          # Database Schema
│   │
│   └── web                 # Next.js Frontend
│       ├── src/app         # App Router Pages
│       ├── src/apis        # API Client (Axios)
│       │   ├── property/   # propertyApi
│       │   ├── user/       # userApi
│       │   ├── favorite/   # favoriteApi
│       │   └── types/      # Shared types
│       └── src/context     # React Context (Toast)
```

## 🌐 Frontend API Layer

The frontend uses a modular API structure with Axios:

```typescript
import { propertyApi, userApi, favoriteApi } from "../apis";

// Properties
const properties = await propertyApi.getAll();
const property = await propertyApi.getById("p1");

// Users
const users = await userApi.getAll();
const newUser = await userApi.create("alice");

// Favorites
const favorites = await favoriteApi.getAll(userId);
await favoriteApi.add(userId, propertyId);
await favoriteApi.remove(userId, propertyId);
```

## ✨ Features

- **Property Listing**: Browse available properties with images and details.
- **Property Details**: View in-depth information about a specific property.
- **User System**: Switch between users to manage separate favorite lists.
- **Favorites**: Add or remove properties from your favorites list.
- **Toast Notifications**: Feedback for user actions (add/remove favorites, errors).
- **Robust UX**: Skeleton loading states, error handling, responsive design.

## 🔌 API Endpoints

### Properties
- `GET /properties` - List all properties
- `GET /properties/:id` - Get details of a single property

### Favorites
- `GET /favorites/:userId` - Get favorites for a user
- `POST /favorites` - Add a property to favorites
  - Body: `{ "userId": "alice", "propertyId": "p1" }`
- `DELETE /favorites` - Remove a property from favorites
  - Body: `{ "userId": "alice", "propertyId": "p1" }`

### Users
- `GET /users` - List all users
- `POST /users` - Create a new user
  - Body: `{ "username": "new_user" }`

## 🧪 Testing

The API includes integration tests for all modules.

```bash
cd apps/api && npm test
```
