// Game.js
import React, { useState } from "react";
import axios from "axios";
import styles from '../static/game2.module.css'; // Import the new CSS

function Game() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");

  const playGame = async (choice) => {
    setUserChoice(choice);
    try {
      const response = await axios.post("http://localhost:5000/play", { userChoice: choice });
      setComputerChoice(response.data.computerChoice);
      setWinner(response.data.winner);
    } catch (error) {
      setMessage("Error: " + error.response?.data?.message || "Something went wrong");
    }
  };

  const renderMessage = () => {
    if (!userChoice) return <p>Select rock, paper, or scissors to start the game</p>;
    if (!computerChoice) return <p>Waiting for computer's move...</p>;
    if (winner === 'draw') return <p className={styles.draw}>It's a draw! Both chose {userChoice}</p>;
    if (winner === 'user') return <p className={styles.win}>Congratulations! You win! You chose {userChoice} and the computer chose {computerChoice}</p>;
    return <p className={styles.lose}>Sorry, you lose. You chose {userChoice} and the computer chose {computerChoice}</p>;
  };

  return (
    <div className={styles.gameContainer}>
      <h1>Rock Paper Scissors Game</h1>
      <div className={styles.buttonContainer}>
        <button onClick={() => playGame("rock")}>Rock</button>
        <button onClick={() => playGame("paper")}>Paper</button>
        <button onClick={() => playGame("scissors")}>Scissors</button>
      </div>
      <div>
        {renderMessage()}
      </div>
    </div>
  );
}

export default Game;
