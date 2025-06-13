import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import styles from "../static/nav.module.css"; // เชื่อม CSS ที่ตกแต่งแล้ว

function NavS({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ลบข้อมูลจาก sessionStorage
    sessionStorage.removeItem("username"); 
    // เปลี่ยนสถานะการล็อกอิน
    setIsAuthenticated(false); 
    // นำทางไปยังหน้า Login
    navigate("/login");  
  };

  return (
    <Navbar expand="lg" className={styles.navbar}>
      <Container fluid>
        <Navbar.Brand  className={styles.navbarBrand}>JOIN G</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/" className={styles.navLink}>Home</Nav.Link>
            <Nav.Link href="/game" className={styles.navLink}>Game</Nav.Link>
            <Nav.Link href="/contact" className={styles.navLink}>Contact</Nav.Link>
          </Nav>

          {/* Check if the user is authenticated */}
          {isAuthenticated ? (
            <Button 
              variant="danger"
              onClick={handleLogout}
              className={styles.btnDanger}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={() => navigate("/login")}
                className={`${styles.btnPrimary} me-2`}
              >
                Sign In
              </Button>
              <Button
                variant="success"
                onClick={() => navigate("/register")}
                className={styles.btnSuccess}
              >
                Sign Up
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavS;
