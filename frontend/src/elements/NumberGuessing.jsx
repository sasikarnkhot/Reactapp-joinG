import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ใช้สำหรับ redirect
import styles from "../static/game.module.css";

function Game() {
  const [guess, setGuess] = useState(""); // ค่าที่ผู้ใช้กรอก
  const [message, setMessage] = useState(""); // ข้อความที่แสดงในเกม
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber()); // ตัวเลขสุ่ม
  const [attempts, setAttempts] = useState(0); // จำนวนครั้งที่ทาย
  const [isGameOver, setIsGameOver] = useState(false); // เช็คว่าเกมจบแล้วหรือยัง
  const navigate = useNavigate(); // Hook สำหรับเปลี่ยนหน้า

  // สร้างตัวเลขสุ่มระหว่าง 1 ถึง 100
  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  // ฟังก์ชันตรวจสอบการทาย
  const handleGuess = () => {
    if (!guess || isNaN(guess) || guess < 1 || guess > 100) {
      setMessage("⚠️ Please enter a valid number between 1 and 100");
      return;
    }

    const guessedNumber = parseInt(guess, 10);
    setAttempts(attempts + 1);

    if (guessedNumber === randomNumber) {
      setMessage(`🎉 Congratulations! You guessed the right number in ${attempts + 1} attempts!`);
      setIsGameOver(true);
    } else if (guessedNumber < randomNumber) {
      setMessage("❌ Too low! Try again.");
    } else {
      setMessage("❌ Too high! Try again.");
    }

    setGuess(""); // เคลียร์ช่อง input หลังจากเดา
  };

  // ฟังก์ชันเริ่มเกมใหม่
  const resetGame = () => {
    setIsGameOver(false);
    setGuess("");
    setAttempts(0);
    setRandomNumber(generateRandomNumber());
    setMessage("");
  };

  return (
    <div className={styles.gameContainer}>
      <h1>🎯 Number Guessing Game</h1>
      <p>Guess the number between 1 and 100</p>

      <input
        type="number"
        className={styles.input}
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={isGameOver} // ถ้าเกมจบแล้วจะไม่สามารถทายได้
      />
      <button className={styles.button} onClick={handleGuess} disabled={isGameOver}>
        Guess
      </button>

      <p>{message}</p>

      {/* แสดงปุ่มเริ่มใหม่เมื่อเกมจบ */}
      {isGameOver && (
        <div>
          <p>🎊 You guessed in {attempts} attempts!</p>
          <button className={styles.button} onClick={resetGame}>🔄 Play Again</button>
        </div>
      )}
    </div>
  );
}

export default Game;
