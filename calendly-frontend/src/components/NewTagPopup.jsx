import React, { useState, useContext, useEffect } from "react";
import "../css/newtagpopup.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";
import { Container, Row, Col, Button } from "react-bootstrap";
import TagColorPicker from "./TagColorPicker";
import useAPICallBody from "../hooks/useAPICallBody";
import useAPICall from "../hooks/useAPICall";
import { UserContext } from "./UserContext";
const NewTagPopup = (props) => {
  const pers = window.localStorage;
  const [tagcolor, setSelectedTagColor] = useState("#FF0000");
  const [toggleSelectColor, setToggleSelectColor] = useState(false);
  const [tagName, setTagName] = useState();
  const [tagError, setTagError] = useState(false);
  const { callAPI: callCreateTag } = useAPICallBody();
  const { res: tagCheck, callAPI: callTagCheck } = useAPICall();
  const { contextUsername } = useContext(UserContext);
  const [username, setUsername] = useState(
    contextUsername !== null ? contextUsername : pers.getItem("contextUsername")
  );

  useEffect(() => {
    if (contextUsername !== null) {
      pers.setItem("contextUsername", contextUsername);
    }
  }, [username]);
  function onSelectColor(color) {
    setSelectedTagColor(color.hex);
    setToggleSelectColor(false);
  }
  async function onCreateTag() {
    const body = { tagName, tagcolor, username };
    if (tagName === undefined) {
      //show error message
      return;
    }
    let result = await callCreateTag(
      `http://localhost:4000/api/createtag`,
      "POST",
      body
    );
    if (result[0]["checktag"] == 1) {
      setTagError(true);
    } else {
      props.handleClose();
    }
  }

  return (
    <div className="newtag-wrap">
      <div className="newtag-main">
        <Container className="position-relative" fluid>
          <Row>
            <Col>
              <FontAwesomeIcon
                icon={faXmark}
                className="float-end my-1 me-1"
                onClick={props.handleClose}
              ></FontAwesomeIcon>
            </Col>
          </Row>
          <Row className="my-3 justify-content-md-center">
            <Col lg="6">
              <Form>
                <Form.Control
                  type="text"
                  placeholder="Your Tag Name..."
                  onChange={(e) => setTagName(e.target.value)}
                ></Form.Control>
              </Form>
            </Col>
          </Row>
          <Row className="my-3">
            <Col lg="12">
              {tagError && (
                <p className="text-center" style={{ color: "red" }}>
                  Tag Name is Already Taken
                </p>
              )}
            </Col>
          </Row>
          <Row className="my-3 align-items-end">
            <Col lg={{ span: 2, offset: 2 }}>
              <SquareFill
                size={60}
                color={tagcolor}
                onClick={() => setToggleSelectColor(!toggleSelectColor)}
                cursor="pointer"
              ></SquareFill>
            </Col>
            <Col lg={{ span: 3, offset: 4 }}>
              <Button onClick={onCreateTag}>Create Tag</Button>
            </Col>
          </Row>
          {toggleSelectColor && (
            <Row>
              <Col lg={{ span: 3, offset: 2 }}>
                <TagColorPicker
                  handleSelectColor={onSelectColor}
                ></TagColorPicker>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};
export default NewTagPopup;
