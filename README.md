<h1 align="center">URL Shortener</h1>

The URL Shortener project is a web application that allows users to shorten long URLs into shorter, more manageable links. The application provides features such as user authentication, link management, and analytics. Users can create an account, log in, and manage their shortened URLs. The project is built using Next.js, a React framework, and leverages various libraries and tools for authentication, styling, and database management.

## Features

-   User authentication with GitHub and Google
-   URL shortening
-   Link management (view, edit, delete)
-   Analytics for shortened URLs
-   Responsive design

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kooked-ch/url-shortener.git
cd url-shortener
```

2. Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```bash
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
MONGO_USER_USERNAME=your_mongo_username
MONGO_USER_PASSWORD=your_mongo_password
MONGO_HOST=your_mongo_host
MONGO_PORT=your_mongo_port
MONGO_DATABASE=your_mongo_database
```

3. Start the server:

```bash
docker compose up -d
```

4. Open the application in your browser:

Navigate to `http://localhost:3000` to view the application.

## Contributing

We welcome contributions to the project! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.
