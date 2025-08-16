# 📈 Personal Habit & Streak Tracker

A **full-stack web application** that helps users build and maintain consistent daily habits through streak tracking and progress monitoring.

---

## 🌐 Links

- **Live Application**: [View Demo](https://personal-habit-streak-tracker.onrender.com)  
- **Source Code**: [GitHub Repository](https://github.com/deepak04iiitn/Personal-Habit-Streak-Tracker)  
- **Complete Documentation**: Visit **docs** folder for detailed and complete setup guide , API documentation , AI documentation , commit history and architecture documentation.
- **Video Link**: [View Video](https://youtu.be/WqoWS_tSDxQ) 

---

## Login Details (for testing purpose)
- **Email**: test@example.com
- **Password**: password123

---

## 🎯 What is this Application?

The **Personal Habit & Streak Tracker** is a productivity tool designed to help users **develop positive habits** and maintain **consistency over time**.  
Users can create personalized habits, track daily completions, and watch their **streaks grow** as they build lasting routines.

It **gamifies habit formation** through:
- Streak counters  
- Progress tracking  
- Organized categorization of life areas  

---

## ✨ Key Features

### 🔐 User Management
- **Secure Authentication**: Register & login with JWT-based security
- **Personal Dashboard**: Private habit collection for each user
- **Session Management**: Stay logged in across sessions

### 📋 Habit Management
- **Create Custom Habits**: Add personalized names & categories
- **Flexible Scheduling**: Daily or weekly frequencies
- **Organized Categorization**: Health, Learning, Productivity, Lifestyle
- **Quick Actions**: One-click completion marking

### 📊 Progress Tracking
- **Streak Calculation**: Automatic counting based on consecutive completions
- **Completion History**: Total number of completions per habit
- **Visual Progress**: See consistency patterns
- **Smart Reset**: Streak resets intelligently when missed

### 🔍 Advanced Navigation
- **Search**: Find habits quickly by name
- **Category Filtering**: Focus on specific life areas
- **Sorting**: By streak length, creation date, or completion count
- **Pagination**: Handle large habit collections with ease

### 🎨 User Experience
- **Intuitive UI**: Clean and easy-to-use
- **Real-time Updates**: Instant habit completion feedback
- **Responsive Design**: Works on desktop & mobile
- **Progress Visualization**: Clear status indicators

---

## 🏗️ Application Architecture

- **Frontend**: Modern interactive UI  
- **Backend**: RESTful API with secure authentication  
- **Database**: MongoDB for user & habit data  
- **Security**: JWT auth + encrypted password storage  

---

## 🎮 How It Works

1. **Sign Up/Login** – Create your personal account  
2. **Add Habits** – Define the habits you want to build  
3. **Daily Tracking** – Mark completions each day  
4. **Monitor Progress** – Track streaks & consistency  
5. **Stay Motivated** – Filter, search & focus on goals  

---

## 📱 Use Cases

- **Health & Fitness**: Exercise, water intake, meditation  
- **Learning**: Reading, language practice, skills  
- **Productivity**: Work routines, time management  
- **Lifestyle**: Daily routines, self-care  

---

## Local Setup Guide

Follow these steps to set up the project locally:

### 1️. Clone the Repository
```bash
git clone <repository_url>
```

### 2. Move into the Root Directory
```bash
cd Personal-Habit-Streak-Tracker
```

### 3. Install Backend Dependencies
```bash
npm i
```

### 4. Move into the Frontend Directory
```bash
cd frontend
```

### 5. Install Frontend Dependencies
```bash
npm i
```

### 6. Go Back to the Root Directory
```bash
cd..
```

--- 

## Environment Variables Setup

### 1. Create .env file in the root directory:
```bash
MONGODB_URI = <your_mongodb_connection_string>
PORT = <your_port>
JWT_SECRET = <your_jwt_secret_key>
```


### 2. Create .env.test file in the root directory (for testing) and copy these values:
```bash
JWT_SECRET = test-secret-key-for-testing
NODE_ENV = test
MONGODB_TEST_URI = mongodb://localhost:27017/habit-tracker-test
```

--- 

## Starting the Application

### 1. Start the backend (from the root directory):
```bash
npm start
```

### 2. Start the frontend (in a separate terminal):
```bash
cd frontend
npm run dev
```

---

## Running Tests

From the root directory, you can run all of these:

### 1. Run all tests
```bash
npm test
```

### 2. Run only unit tests
```bash
npm run test:unit
```

### 3. Run only integration tests
```bash
npm run test:integration
```

### 4. Run end-to-end (E2E) tests
```bash
npm run test:e2e
```

---

## 🖼️ Screenshots

> <img width="1893" height="823" alt="image" src="https://github.com/user-attachments/assets/08d42ddb-eb60-4d31-b763-fa3b1568bc78" />
> <img width="1892" height="816" alt="image" src="https://github.com/user-attachments/assets/155b4caf-1b17-47f6-a79f-fe3513779626" />
> <img width="1894" height="814" alt="image" src="https://github.com/user-attachments/assets/c0b04307-ae80-4266-8f48-d310a360836b" />
> <img width="1897" height="814" alt="image" src="https://github.com/user-attachments/assets/3f5ace0d-0f08-409a-82e6-73fcf4ef8c37" />
> <img width="1896" height="820" alt="image" src="https://github.com/user-attachments/assets/1012ba63-65e1-47d1-acf5-ee501e824e35" />
> <img width="1893" height="822" alt="image" src="https://github.com/user-attachments/assets/c0ca9fe7-d2eb-4635-bfe9-bd4081e82e60" />
> <img width="1891" height="819" alt="image" src="https://github.com/user-attachments/assets/05313adc-ae55-4bec-a1fd-db82641ca5e7" />

---

