import React, { useState, useEffect } from "react";
import { Route, useNavigate, useHistory } from "react-router-dom";
import {
  Form,
  Container,
  Row,
  Col,
  Stack,
  Button,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import "../css/Register.css";
import { useRef } from "react";
import useAPICallBody from "../hooks/useAPICallBody";
import defaultPfp from "../images/default-pfp.png";
import useLocalToFile from "../hooks/useLocalToFile";
import useAPIMultiPart from "../hooks/useAPIMultiPart";
import useAPICall from "../hooks/useAPICall";
const Register = () => {
  const [failedRegister, setFailedRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { callAPI: registerCall } = useAPIMultiPart();
  const { callAPI: test } = useAPICallBody();
  const [selectedImage, setSelectedImage] = useState(false);
  const imageInputRef = useRef();
  const { srcToFile } = useLocalToFile();
  const [image, setImage] = useState();
  const [formValue, setFormValue] = useState(new FormData());

  let navigate = useNavigate();

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    if (!formValue.has(name)) {
      formValue.append(name, value);
    }
    formValue.set(name, value);
  };

  const onRegister = async (e) => {
    e.preventDefault();
    if (formValue.get("password") === formValue.get("password2")) {
      try {
        let registerReq = null;
        formValue.append("pfpimg", selectedImage && image);
        if (formValue.get("pfpimg") === "false") {
          console.log("dfalt")
          registerReq = await registerCall(
            `http://localhost:4000/api/register/default`,
            "POST",
            formValue
          );
        } else {
          registerReq = await registerCall(
            `http://localhost:4000/api/register/
          }}}`,
            "POST",
            formValue
          );
        }
        if (registerReq.status === "failed") {
          setFailedRegister(true);
          setErrorMessage(registerReq.message);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error(error.message);
      }
    }
   
  };

  const handleInputClick = () => {
    if (imageInputRef === undefined) {
      return;
    }
    imageInputRef.current.click();
  };
  const handleImageInputChange = (event) => {
    setSelectedImage(true);
    const file = event.target.files[0];
    setImage(file);
  };

  return (
    <Stack gap={2}>
      <Row>
        <Col>
          <Button
            variant="white"
            className="back-to-login-button"
            onClick={function () {
              navigate("/login");
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon> Back to Login
          </Button>
        </Col>
      </Row>
      <Row className="my-5">
        <h1 style={{ textAlign: "center" }}>Register a Calendly Account</h1>
      </Row>
      <Row className="my-2">
        <Form>
          <Container fluid>
            <Col lg={{ span: 6, offset: 3 }}>
              <Form.Group>
                <Stack gap={3}>
                  <Image
                    src={
                      selectedImage ? URL.createObjectURL(image) : defaultPfp
                    }
                    className="uploaded-image"
                  ></Image>
                  <Button className="add-pfp-button" onClick={handleInputClick}>
                    Upload an Image
                    <FontAwesomeIcon icon={faCloudArrowUp}></FontAwesomeIcon>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={(e) => handleImageInputChange(e)}
                      accept="image/*"
                      name="pfpimg"
                    ></input>
                  </Button>
                </Stack>
              </Form.Group>
              <Form.Group>
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  name="username"
                  onChange={(e) => handleFormInput(e)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  name="firstname"
                  onChange={(e) => handleFormInput(e)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  name="lastname"
                  onChange={(e) => handleFormInput(e)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email Address:</Form.Label>
                <Form.Control
                  name="email"
                  onChange={(e) => handleFormInput(e)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  onChange={(e) => handleFormInput(e)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Retype Password:</Form.Label>
                <Form.Control
                  name="password2"
                  type="password"
                  onChange={(e) => handleFormInput(e)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Container>
        </Form>
      </Row>
      <Row>
        <Col lg={{ span: 12, offset: 5 }}>
          <Button
            className="register-account-button"
            onClick={(e) => onRegister(e)}
          >
            Register
          </Button>
        </Col>
      </Row>
      {failedRegister && <h1>{errorMessage}</h1>}
    </Stack>
  );
};

export default Register;
