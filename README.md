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

![WeightWithGraph](/PawsTracker/assets/weightwithgraph.png)

![MapScreen](/PawsTracker/assets/map.png)

![ProfileWithCamera](/PawsTracker/assets/profilewithcamera.png)

## Team Contributions for iteration 2

### Member 1: Mingxi Li

- Completed the setup for profile and potty components.
- Configured context and firebase helper files.
- Designed the UI for the header component.
- Contributed to UI/UX design decisions.
- Provided assistance with debugging and testing throughout the development process.

### Member 2: Xinyue Zheng

- Add Weight Chart(WeightChart.js) and rearrange the UI for Weight Screen(Weight.js).
  - make the flatlist smoothly combined with chart component
- Add interactive map component(LocationManager.js) on map screen(Map.js) and location modification for Profile Scfreen.
  - Map could show the user current location and the surrounding "dogs parks"
  -
- Add camera function(ImageManager.js) and adjust the UI design of Profile Screen. (Profile.js)
  - User could take photos and upload it to user profile as well as their dogs' profile.

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

- **Create:** Add a new dog profile under a user.
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

- Automated reminder notifications for upcoming care tasks.
