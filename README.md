# Sports AI Betting Platform

A full-stack sports betting platform with AI-powered recommendations, built with Spring Boot and React.

## Features

- **User Authentication**: Secure registration, login, and email verification
- **Sports Betting**: Place bets on various sports with real-time odds
- **AI Recommendations**: Get AI-powered betting recommendations using Gemini API
- **Real-time Odds**: Integration with external odds API
- **User Profiles**: Track betting history, win rates, and wallet balance
- **Responsive UI**: Modern, mobile-friendly interface built with React and Tailwind CSS

## Tech Stack

### Backend
- **Spring Boot 3.5.3** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **PostgreSQL** - Database
- **JWT** - Token-based authentication
- **Spring Mail** - Email verification
- **WebFlux** - Reactive programming for external API calls

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations

## Prerequisites

- Java 24
- Node.js 18+
- PostgreSQL 12+
- Maven 3.6+

## Environment Variables

Create a `.env` file in the `sports-backend` directory with the following variables:

```env
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/sports_db
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here_make_it_long_and_secure

# Email Configuration
SUPPORT_EMAIL=your_email@gmail.com
APP_PASSWORD=your_gmail_app_password

# API Keys
ODDS_API_KEY=your_odds_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd sports-backend
   ```

2. Create the PostgreSQL database:
   ```sql
   CREATE DATABASE sports_db;
   ```

3. Set up environment variables (see above)

4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd sports-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/resend` - Resend verification code

### Bets
- `GET /api/bets` - Get all bets
- `GET /api/bets/user` - Get user's bets
- `GET /api/bets/active` - Get active bets
- `GET /api/bets/{id}` - Get bet by ID
- `POST /api/bets` - Place a new bet

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/` - Get all users

### Odds
- `GET /api/odds/{sport}` - Get odds for a sport

### Recommendations
- `GET /api/recommendation` - Get AI recommendations

## Project Structure

```
samarth-ai-sports/
├── sports-backend/          # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/sports/sportsbackend/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── model/       # Entity models
│   │       ├── dto/         # Data transfer objects
│   │       └── security/    # Authentication & security
│   └── src/main/resources/
│       └── application.properties
└── sports-frontend/         # React frontend
    ├── src/
    │   ├── components/      # React components
    │   ├── contexts/        # React contexts
    │   └── service/         # API service functions
    └── package.json
```

## Testing

### Backend Testing
```bash
cd sports-backend
./mvnw test
```

### Frontend Testing
```bash
cd sports-frontend
npm run lint
```

## Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   ./mvnw clean package
   ```

2. Run the JAR:
   ```bash
   java -jar target/sports-backend-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```

2. Serve the built files from a web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 