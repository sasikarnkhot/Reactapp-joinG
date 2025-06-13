import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../static/create.module.css';

function Login() {
  const [values, setValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // เริ่มโหลด

    try {
      // ส่งข้อมูลไปที่เซิร์ฟเวอร์
      const response = await axios.post("/signin", values); 

      // ถ้าผู้ใช้เข้าสู่ระบบสำเร็จ
      sessionStorage.setItem("username", JSON.stringify(response.data.user));
      
      // นำทางไปยังหน้า Home
      navigate("/");

    } catch (err) {
      // จัดการข้อผิดพลาด
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);  // หยุดการโหลด
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form_area}>
        <p className={styles.title}>SIGN IN</p>
        
        {/*แสดงข้อผิดพลาดหากมี */}
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="username">Username</label>
            <input
              placeholder="Enter your username"
              className={styles.form_style}
              type="text"
              required
              onChange={(e) => setValues({ ...values, username: e.target.value })}
            />
          </div>

          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="password">Password</label>
            <input
              placeholder="Enter your password"
              id="password"
              className={styles.form_style}
              type="password"
              required
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
          </div>

          <div>
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Signing In...' : 'SIGN IN'}
            </button>
            <p>Don't have an account? 
              <Link className={styles.link} to="/register"> Create Here!</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
