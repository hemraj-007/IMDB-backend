# **IMDB Backend**

This is the backend for managing movies, producers, and actors. It provides CRUD operations, Signin and Signup and integrates with a PostgreSQL database.

---

## **Technologies Used**
- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **Prisma**: ORM for PostgreSQL.
- **PostgreSQL**: Database.
- **JWT**: Authentication.
- **Zod**: Validation.

---

## **Setup Instructions**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hemraj-007/IMDB-backend.git
   cd IMDB-backend

2. **Set up the database**:
   -Create a PostgreSQL database.
   -Add the connection string to a .env file:
   ```bash
   DATABASE_URL="postgresql://hemrajbhatia38:XOBdFosDA93i@ep-orange-feather-a5ll62xs.us-east-2.aws.neon.tech/movieDb?sslmode=require"

3. **Run database migrations**:
   ```bash
   npx prisma migrate dev

4. **Start the server**:
   ```bash
   node server.js

