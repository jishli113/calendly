import React, { Component, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import "../css/friendtab.css";
import { Link, useNavigate } from "react-router-dom";
import Social from "./Social";
import { Route } from "react-router-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import useAPICall from "../hooks/useAPICall";
import useAPICallBody from "../hooks/useAPICallBody";
import { Image } from "react-bootstrap";

const FriendTab = (props) => {
  const navigate = useNavigate();
  const pers = localStorage;
  const { callAPI: getFollowingData } = useAPICallBody();
  const [followingData, setFollowingData] = useState();
  const { callAPI: callFollow } = useAPICallBody();
  const [isFollowing, setIsFollowing] = useState(false);
  const { callAPI: callUnfollow } = useAPICallBody();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getFolStatus();
  }, []);
  const getFolStatus = async () => {
    let data = await getFollowingData(
      `http://localhost:4000/api/users/isfollowing/`,
      "POST",
      {
        forusername: props.username,
        followingusername: pers.getItem("contextUsername"),
      }
    );
    setFollowingData(data);
    if (data === undefined) {
      setIsFollowing(false);
    } else {
      setIsFollowing(true);
    }
    setIsLoading(false);
  };
  const onExit = () => {
    navigate(`/social/${props.username}`);
  };
  const handleFol = async () => {
    ("fol");
    if (isFollowing === false) {
      await callFollow(`http://localhost:4000/api/users/follow/`, "POST", {
        followed: props.username,
        follower: pers.getItem("contextUsername"),
      });
    } else {
      await callUnfollow(`http://localhost:4000/api/users/unfollow/`, "DELETE", {
        unfollower: pers.getItem("contextUsername"),
        beingunfollowed: props.username,
      });
    }
  };
  return (
    <>
      {!isLoading && (
        <Card
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "20px",
            borderColor: "#96613d",
            borderWidth: "3px",
            backgroundColor: "white",
          }}
          key={window.location.pathname}
          onClick={onExit}
        >
          <Card.Body className="friendtab-card-body">
            <h1 className="friendtab-username">{props.username}</h1>
            <Image
              roundedCircle
              className="friendtab-pfp"
              src={props.pfpimg}
            ></Image>
            {isFollowing ? (
              <Button className="fol-button" onClick={handleFol}>
                Following
              </Button>
            ) : (
              <Button className="fol-button">Follow</Button>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
};
export default FriendTab;
