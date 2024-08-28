# Asteride Real Estate

This React Native application allows real estate companies to remotely unlock homes for potential buyers to view. It demonstrates handling state management, API integration, and the use of native device features.

## Features

- User Authentication
- Home Listing
- Home Details View
- Proximity-based Home Unlocking
- Location Services Integration

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- Expo CLI
- iOS Simulator or Android Emulator (for local testing)
- Expo Go app (for testing on physical devices)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yoginderkumar/RealEstateAsteride.git
   cd RealEstateAsteride
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the Expo development server:

```
expo start
```

This will open the Expo DevTools in your browser. From here, you can run the app on an iOS Simulator, Android Emulator, or scan the QR code with the Expo Go app on your physical device.

## Usage

1. Launch the app and log in using the following credentials:
   - Username: test
   - Password: password

2. Browse the list of available homes.

3. Tap on a home to view its details.

4. If you're within 30 meters of the home (simulated in this version), an "Unlock" button will appear.

5. Tap the "Unlock" button to simulate unlocking the home.

## Project Structure

- `app`: Contains the all of the application's source code.
    - `components`: Should contain all of the UI elements.
        - `Button.tsx`: Reusable button component.
    - `navigation`: Contains app navigator for the application.
        - `AppNavigator.tsx`: This file contains all of the screens placed based on their screen names (eg, HomeDetails, HomeListScreen & LoginScreen).
    - `screens`: Contains all of the screens to be used in the application.
        - `Login.tsx`: This screen contains demo login logic.
        - `HomeList.tsx`: This screen displays all of the available properties using fakr to mock the data.
        - `HomeDetails.tsx`: This screen is used to display all data after you click on one of the properties in listing screen.
    - `services`: Contains reusable services for the application.
        - `api.ts`: Here we are just mocking api response by creating fake data and adding additional details to demonstrate the REST API integration.
    - `styles`: It should contain all style related reusable stuff.
        - `colors.ts`: This file have a constant object with all of the colors required in the project.
    - `types`: For all types to be used in the application.
    - `utils`: For all the small and reusable methods.
- `App.tsx`: It is the root file of the application.


## Dependencies

The project utilizes the following dependencies:

- `@faker-js/faker`: Library for mocking data to bring realism.
- `@react-navigation/native`: Provides all routing related utilities.
- `@react-navigation/stack`: Used for stack navigation.
- `expo-location`: Used expo location for supporting location related features


## Technical Notes

- This project uses Expo for easier setup and testing.
- Location services are simulated for demonstration purposes.
- The app uses a mock API (in `api.ts`) to simulate backend interactions.

## Future Enhancements

- Add push notifications for admin alerts and successful unlocks
- Enhance UI/UX design
- Implement proper error handling and loading states
