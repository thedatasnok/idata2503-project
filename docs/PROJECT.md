# Project

## Description

The goal of our project is to create an app similar to the Blackboard app we use for our studies.
It should contain course information and notifications about deadlines for assignments, as well as announcements from lecturers.

## Features

- Courses
  - Get an overview of courses
  - Get information about courses
  - Find announcements related to a course
  - Manage course membership
- Deadlines for assignments
  - Global overview
  - Per course
- Schedule
  - Global overview
- Messaging
  - Communicating with lecturers about courses
- Push notifications
- Storing data
  - Remotely in Firebase
  - Forms with validation logic
- Authentication
  - Login
  - Register
  - Forgot password
- Settings
  - Profile
  - Notifications
  - Language

## Architecture

Our architecture is a simple model where we utilize Firebase as a backend, which the app communicates with through the Firebase SDK.
The app is built with React Native, with the goal of being able to cross-compile the application to both iOS and Android platforms.
