# Service Portal Coding Exercise

A full-stack web application using React + TypeScript + Material UI for the frontend, .NET 8 / C# for the backend, and PostgreSQL as the database. The project is fully Dockerized for easy local development and testing.

## Features

- Wastebin Management (CRUD) with Material UI DataGrid

- EF Core migrations and seeding for PostgreSQL

- Docker Compose setup for frontend, backend, and database

- Axios-based API calls from frontend, Swagger UI for backend API

## Tech Stack

- Frontend: React, TypeScript, Material UI, Axios

- Backend: .NET 9, C#, Entity Framework Core, PostgreSQL

- Database: PostgreSQL

- Containerization: Docker, Docker Compose

## Getting Started
### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ and npm/yarn (if running frontend locally)
- .NET 9 SDK (if running backend locally)

### Run with Docker Compose (Recommended)

1. Clone the repository:
 ```bash
 git clone <repo-url>
 cd <repo-folder>
 ```
2. Build and start containers:
  ```bash
  docker-compose up --build
  ```
3. Access the apps in your browser:
 - Frontend: `http://localhost:3000`
 - Backend API: `http://localhost:5041/api`
 > Backend waits for PostgreSQL to be healthy before starting.

### Run locally without Docker
__Backend:__
```bash
 cd backend
 dotnet run
 ```
Ensure appsettings.json or environment variable points to your local PostgreSQL database. Run EF Core migrations if needed:
```bash
 dotnet ef database update
 ```
__Frontend:__
```bash
 cd frontend
 npm install
 npm run dev
 ```
__Database__
- PostgreSQL database myappdb
- Default user: postgres / postgres
- EF Core Seeder automatically inserts initial user data on first run.

---

## Experience and Time Spent
I spent around 12 - 14 hours on this project. However a lot of that time was spent debugging random issues I would get while setting up and running the project locally. For example, I was having issues with using dotnet tools: I kept getting errors that the tools weren't installed despite the tools being listed for global use. I also had issues with my API controllers on multiple occassions causing me to wipe the project and start from scratch three hours in. I still don't know what went wrong...
Docker and axios were new to me, and while axios was pretty similar to fetch, Docker was something I spent some time fiddling with. 
I'm sure my frontend could use more tidying up.. 😰

#### Missing features
Simulated user context was the big one I did not include, with the only reason that I realised too late that it was required for the task. ): I also was not sure about what format 'EmptyingSchedule' was supposed to be like, so I left it as a string, which just acts like a note.

## External Help
- ChatGPT
  Biggest help here. Helped with project set up (commands and the general idea), Docker yaml files, lots and lots of debugging help for especially as another "pair of eyes".
- [Material UI Templates](https://mui.com/material-ui/getting-started/templates/)
  MUI's CRUD dashboard template did a lot of heavy lifting for the frontend
- [Microsoft Documentation](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-9.0&tabs=visual-studio-code)
  Web API references. And found `dotnet-aspnet-codegenerator` from these documentations. Made controllers so much easier.
- StackOverflow Forums
  What would I do without these people?
- [Bruno](https://www.usebruno.com/)
  REST API Client for testing.
