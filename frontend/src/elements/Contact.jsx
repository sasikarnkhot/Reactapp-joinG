import React, { useState } from "react";
import axios from "axios";
import styles from "../static/contact.module.css";

function Contact() {
    const [values, setValues] = useState({ contactname: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/contact", values, {
                withCredentials: true,
            });

            if (res.data.success) {
                setMessage("Message sent successfully!");
                setValues({ contactname: "" });
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send message.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.form_area}>
                <p className={styles.title}>Contact Us</p>

                {message && <p className={styles.success}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.form_group}>
                        <label className={styles.sub_title} htmlFor="contactname">
                            Your Message
                        </label>
                        <textarea
                            placeholder="Enter your message"
                            className={styles.form_style}
                            rows="5"
                            required
                            value={values.contactname}
                            onChange={(e) => setValues({ ...values, contactname: e.target.value })}
                        />
                    </div>

                    <div>
                        <button type="submit" className={styles.btn}>
                            Send Message
                        </button>
                    </div>
                </form>

               
            </div>
        </div>
    );
}

export default Contact;
