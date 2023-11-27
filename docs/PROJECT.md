# Project

## Description

The goal of our project is to create an app similar to the Blackboard app we use for our studies.
It should contain course information and notifications about deadlines for assignments, as well as announcements from lecturers.
One of the main goals is to create a simple and intuitive user interface, which is easy to navigate and understand.
A feature we want to focus on is the ability to send messages to lecturers and fellow students both within courses and separately.

## Features

- Home screen
  - Overview of recent announcements
  - Overview of recent/upcoming assignments
- Courses
  - Get an overview of courses (announcement, assignments, text channels, lecturers)
  - Get information about courses
  - View assignments & feedback on assignments
  - View & create announcements
  - View, create & edit course text channels
  - View course members
  - Manage course membership (sign-up, leave)
- Deadlines for assignments
  - Global overview
  - Per course
- Schedule
  - Global overview
- Messaging
  - Communicating with others
  - Direct messages
  - Course text channels
- Push notifications
- In-app notifications for direct messages
- Storing data
  - Remotely in backend
  - Forms with validation logic
- Authentication
  - Login
- Role based access control
  - Course roles & user roles
- Settings
  - Profile
  - Notifications
  - Language

## Architecture

Our architecture is a simple model where we utilize a backend as a service, which the app communicates with through an SDK.
The app is built with React Native, with the goal of being able to cross-compile the application to both iOS and Android platforms.
