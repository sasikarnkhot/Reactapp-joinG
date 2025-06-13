import React, { useState, useEffect } from 'react';
import { Navbar, Form, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../static/search.module.css";

function Game() {
  const navigate = useNavigate();
  
  // ตัวเลือกเกม
  const options = [
    { label: "🎯 Number Guessing", link: "/NumberGuessing" },
    { label: "✌ Rock Paper Scissors", link: "/RockPaperScissors" },
  ];

  // สถานะสำหรับการค้นหา
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  // ตรวจสอบสถานะการล็อกอิน
  const isAuthenticated = sessionStorage.getItem("username") !== null;

  useEffect(() => {
    // ถ้ายังไม่ล็อกอิน, รีไดเรกไปที่หน้า Login
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // ฟังก์ชันในการค้นหาจากคำที่พิมพ์
  const handleSearchChange = (event) => {
    const search = event.target.value;
    setSearchTerm(search);
    // ฟิลเตอร์ตัวเลือกที่มีคำค้นหาตรง
    setFilteredOptions(
      options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))
    );
  };

  // ฟังก์ชันในการเลือกตัวเลือก
  const handleSelect = (link) => {
    navigate(link);
  };

  return (
    <Navbar className="bg-body-tertiary justify-content-between">
      <Form inline>
        <Row>
          <Col xs="auto">
            <Form.Control
              type="search"
              placeholder="Search for a game..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Col>
        </Row>
      </Form>

      <Form inline>
        <Row>
          <Col xs="auto">
            <ListGroup className="mt-2">
              {filteredOptions.map((option, index) => (
                <ListGroup.Item key={index} action onClick={() => handleSelect(option.link)}>
                  {option.label}
                </ListGroup.Item>
              ))}
              {filteredOptions.length === 0 && (
                <ListGroup.Item disabled>No results found</ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Form>
    </Navbar>
  );
}

export default Game;
