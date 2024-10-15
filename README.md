# Mobile Application Development Project

# Paw Tracker

## Introduction

Welcome to our Paw Tracker App, a comprehensive solution for managing your pets' health and well-being. This application allows users to create profiles for their pets, track weight changes over time, set reminders for potty time, and more.
## Demo Video
Watch our project demonstration by clicking the link below:
[![Watch the video](https://img.youtube.com/vi/5rkgBbiXBQA/1.jpg)](https://youtu.be/5rkgBbiXBQA)

## Current State of the Application

Our application is currently capable of the following:

- User authentication and profile management.
- Creation and management of pet profiles, including details like name and age.
  ![ProfileWithCamera](/PawsTracker/assets/newprofile.png)

- Tracking of weight history for each pet.
  ![WeightWithGraph](/PawsTracker/assets/weightChart.png)

![editWeight](/PawsTracker/assets/editWeight.png)

- Setting and receiving timely potty time reminders and local weather-based notifications, including suggestions on whether to carry an umbrella.

![reminder](/PawsTracker/assets/reminder.png)
![addReminder](/PawsTracker/assets/addReminder.png)

- Discover nearby dog parks based on user's location
  ![MapScreen](/PawsTracker/assets/map.PNG)
- Track dog's dietary details

![NutriInfo](/PawsTracker/assets/nutri.png)
![addNutriInfo](/PawsTracker/assets/addNutri.png)
![addNutriInfoDetail](/PawsTracker/assets/addNutriDetail.png)

## Setting Up API Keys

To use the features of this project that require external API calls, you'll need to obtain an API key from the respective service provider. Follow these steps to setup your API key:

### Configure the API Key in Your Project:

- Copy the API key from the service provider.
- Create a file named `.env` in the root directory of your project.
- Add the API key to your `.env` file with the appropriate variable name, like so:
  WEATHER_API_KEY="7679506db4a163d5b0b49cdb62987b7c"

## Team Contributions for iteration 1

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

## Team Contributions for iteration 2

### Member 1: Mingxi Li

- Implemented the functionality of Nutris screen.
  - Users can navigate through different dates using the calendar on the Nutri screen to add or review their nutritional records.
- Created a new introductory screen that welcomes users and provides a quick overview of the app’s features.

### Member 2: Xinyue Zheng

- Add Weight Chart(WeightChart.js) and rearrange the UI for Weight Screen(Weight.js).
  - make the flatlist smoothly combined with chart component
- Add interactive map component(LocationManager.js) on map screen(Map.js) and location modification for Profile Scfreen.
  - Map could show the user current location and the surrounding "dogs parks"
- Add camera function(ImageManager.js) and adjust the UI design of Profile Screen. (Profile.js)
  - User could take photos and upload it to user profile as well as their dogs' profile.

## Team Contributions for iteration 3

### Member 1: Mingxi Li

- Integrated a third-party API to provide real-time weather data for enhanced reminders and weather-based notifications.
- Led comprehensive testing on Android and iPad platforms to ensure seamless integration and functionality.
- Improved the UI layout and design, focusing on a cohesive look that aligns with our unified style guide for buttons and color schemes.
- Unify font config.

### Member 2: Xinyue Zheng

- Modify Weight Chart(WeightChart.js) to Average month record
- Add filter(filterByMonth.js) to filter the weight record by month.
- Rearrange UI for add weight screen and Profile Screen.
- Add responsive UI design for weight chart Profile Dogs section.
- Unify buttons and colors config.

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

### Nutris Collection

Also a subset of each dog's document, this collection stores reminders for the nutrition log.

**CRUD Operations:**

- **Create:** Create a new nutrition log.
- **Read:** Read a new nutrition log of selected date.

## Future improvement

- Add update opeartion for Nutri and Poopal and Add dogs sections.
- Implement a seamless, intuitive slide action for deleting entries for Nutri and Poopal and Add dogs sections.

