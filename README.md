# Jeopardy Game - React Frontend

This project is the frontend for a Jeopardy game built using React.  It interacts with a backend API (assumed to be running at `http://localhost:8000`) to fetch and manage game data.

## Project Structure

The project uses a component-based architecture. Key components include:

* **`src/App.js`**: The main application component.  This component manages the overall game state, including:
    * `roundData`: Stores the data for the current round, fetched from the backend API.  This data includes categories and clues.
    * `currentRound`: Tracks the current round (1 or 2).
    * `loading`: A boolean indicating whether data is currently being fetched.
    * `error`: Stores any error messages encountered during API calls.
    * `selectedClue`: Stores the currently selected clue.
    * `userAnswer`: Stores the user's answer to the selected clue.
    * `showAnswer`: A boolean indicating whether the correct answer should be displayed.
    * `answerResponse`: Stores the response from the backend API after submitting an answer, including correctness and distance from the correct answer.

    The `App` component fetches round data using `fetchNewRound`, handles clue selection with `handleClueSelect`, and submits answers with `submitAnswer`.  It renders the `GameBoard`, `GameControls`, and `ClueDisplay` components.

* **`src/components/GameBoard.js`**: Displays the game board, showing categories and clue values.  It receives `roundData` and `getBaseValues` from `App.js` and handles clue selection using the `onClueSelect` callback.  It also receives `selectedClue` and `showAnswer` props to update its display based on the current game state.  The `getBaseValues` function determines the point values for clues based on the current round.

* **`src/components/GameControls.js`**: Provides controls for the game, including round selection and a "New Round" button.  It receives `currentRound`, `onRoundChange`, `onNewRound`, `loading`, and `error` props from `App.js`.

* **`src/components/Clue.js`**: (Assumed to be a child component of `GameBoard.js`)  This component likely renders a single clue on the game board.

* **`src/components/ClueDisplay.js`**: Displays the selected clue, the user's answer input, and the answer submission button.  It receives `selectedClue`, `userAnswer`, `onAnswerChange`, `onSubmit`, `showAnswer`, `answerResponse`, `onClose`, and `loading` props from `App.js`.  It handles updating the user's answer and submitting it to the backend API.  It also displays the answer response (correctness, etc.) and provides a mechanism to close the clue display.


## API Interaction

The frontend interacts with a backend API (presumably using Node.js and Express) at `http://localhost:8000`.  Endpoints include:

* `/round/{roundNumber}`: Fetches data for a specific round.
* `/answer`: Submits a user's answer for a given clue.


## Technologies Used

* React
* Axios (for API calls)
* CSS (for styling)


## Running the App

1. Make sure you have Node.js and npm installed.
2. Clone the repository.
3. Navigate to the project directory.
4. Run `npm install` to install dependencies.
5. Ensure the backend API is running.
6. Run `npm start` to start the development server.


This README provides a high-level overview. For detailed information, refer to the code itself.
