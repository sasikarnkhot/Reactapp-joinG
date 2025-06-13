import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "../static/create.module.css";

function Register() {
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/register", values, {
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form_area}>
        <p className={styles.title}>SIGN UP</p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="username">
              Username
            </label>
            <input
              placeholder="Enter your username"
              className={styles.form_style}
              type="text"
              required
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
            />
          </div>

          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="password">
              Password
            </label>
            <input
              placeholder="Enter your password"
              className={styles.form_style}
              type="password"
              required
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>

          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="email">
              Email
            </label>
            <input
              placeholder="Enter your email"
              className={styles.form_style}
              type="email"
              required
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
            />
          </div>

          <div>
            <button type="submit" className={styles.btn}>
              SIGN UP
            </button>
            <p>
              Already have an account?
              <Link className={styles.link} to="/login">
                {" "}
                Login Here!
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
