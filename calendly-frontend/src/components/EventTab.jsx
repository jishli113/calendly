import React, { Component } from "react";
import Card from "react-bootstrap-v5";
import CardHeader from "react-bootstrap/esm/CardHeader";

const EventTab = (props) => {
  return (
    <Card className="daily-event-card">
      <CardHeader>
        <h1 className="daily-event-card-time"></h1>
      </CardHeader>
    </Card>
  );
};
