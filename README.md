# CS5520-Final-Project

# Paw Tracker

## Introduction

Welcome to our Paw Tracker App, a comprehensive solution for managing your pets' health and well-being. This application allows users to create profiles for their pets, track weight changes over time, set reminders for potty time, and more.

## Current State of the Application

Our application is currently capable of the following:

- User authentication and profile management.
- Creation and management of pet profiles, including details like name and age.
- Tracking of weight history for each pet.
- Setting reminders for potty time.

![Weight](/PawsTracker/assets/Weight.png)

![PooPal](/PawsTracker/assets/Poopal.png)


## Team Contributions

### Member 1: Mingxi Li


- Completed the setup for profile and potty components.
- Configured context and firebase helper files.
- Designed the UI for the header component.
- Contributed to UI/UX design decisions.
- Provided assistance with debugging and testing throughout the development process.

### Member 2: Xinyue Zheng
 - Added basic navigation for bottom tab, header, signup, and login screens.
 - Implemented CRUD operations for weight entries tied to a fixed dog ID, with basic UI for Weight Screen and AddWeight.
 - Set basic Authentication for user signup/login.

# Data Model and Collections

Our data model is structured in a hierarchical fashion to represent relationships within the application:

### Users Collection

This is the top-level collection that stores user profiles including first name, last name and email. Each user document contains personal information and serves as an entry point to access the dogs they own.

**CRUD Operations:**
- **Create:** Register a new user profile.
- **Read:** Retrieve user details and list all associated dogs.


### Dogs Collection

Nested within each user document, the dogs collection holds data including dog's name and dog's age about individual dogs owned by the user.

**CRUD Operations:**
- **Create:** Add a new dog profile  under a user.
- **Read:** View details about a specific dog.

### Weights Collection

This collection is a subset of each dog's document, containing records and the date of records of the dog's weight over time.

**CRUD Operations:**
- **Create:** Log a new weight entry for a dog.
- **Read:** Access a dog's weight history.
- **Update:** Amend a weight entry.
- **Delete:** Remove a weight entry.

### Reminders Collection

Also a subset of each dog's document, this collection stores reminders for the potty time schedules.

**CRUD Operations:**
- **Create:** Set a new reminder.
- **Read:** Review upcoming reminders.

## Upcoming Features

In the next iteration, we plan to implement the following features leveraging the nested collection architecture:

- Advanced filter for analyzing weight trends.
- Automated reminder notifications for upcoming care tasks.


