import React from 'react';
import styles from "../static/home.module.css"; // เชื่อม CSS ที่ตกแต่งแล้ว
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to JOIN G</h1>
      <p className={styles.subtitle}>Ready to challenge yourself in fun games? Join in and play now!</p>
      <Link to="/game">
      <button class ={styles.btn} to ="/game">Start!</button>
      </Link>
    </div>
  );
}

export default Home;
