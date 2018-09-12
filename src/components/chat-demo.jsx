import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  ListGroup,
  ListGroupItem,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

class ChatDemo extends Component {
  state = {
    connected: false,
    socket: socketIOClient("http://localhost:3000", {
      reconnectionAttempts: 4,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 5000
    }),
    severendpoint: "http://localhost:3000",
    chatmessage: [],
    sentmessage: [],
    username: undefined || "Guest",
    modal: false
  };
  componentDidMount() {
    this.setState({ connected: true });
    this.state.socket.on("rec-message", msg => {
      let messages = this.state.chatmessage;
      messages.push(msg);
      this.setState({ chatmessage: messages });
    });
  }
  connect = endpoint => {
    const socket = socketIOClient(endpoint);
    this.setState({ socket });
    this.setState({ connected: true });
  };
  disconnect = () => {
    this.state.socket.disconnect();
    this.setState({ connected: false });
  };

  send = () => {
    let inputMessage = document.getElementById("chtID").value;
    this.state.socket.emit("new-message", {
      message: inputMessage,
      username: this.state.username
    });

    let sentMessage = this.state.sentmessage;
    sentMessage.push(inputMessage);
    this.setState({ sentmessage: sentMessage });
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  getUsername = evt => {
    let uname = document.getElementById("chtUser").value;
    this.setState({ username: uname });
    console.log(uname);
  };
  handleChange = evt => {
    this.setState({ username: evt.target.value });
  };
  render() {
    let RecMessages = this.state.chatmessage.map(msg => (
      <Row>
        <Col>
          <ListGroup
            key={msg}
            style={{ float: "right" }}
            className="col col-4 align-self-start m-3"
          >
            <ListGroupItem color="success" key={msg}>
              <b>{msg.username}</b> : <Badge>{msg.message}</Badge>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    ));
    let SenMessages = this.state.sentmessage.map(msg => (
      <Row>
        <Col>
          <ListGroup key={msg} className="col col-4 align-self-end m-3">
            <ListGroupItem color="primary" key={msg}>
              <b>{this.state.username}</b> : <Badge>{msg}</Badge>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    ));
    return (
      <Container>
        <Card className="card mt-5" style={{ textAlign: "center" }}>
          <Row>
            <Col>
              <Button
                disabled={this.state.connected}
                onClick={() => this.connect(this.state.severendpoint)}
                color="success"
                className="btn btn-sm m-2"
              >
                Join
              </Button>
            </Col>

            <Col>
              <Button
                className="btn btn-sm m-2"
                color="secondary"
                onClick={this.toggle}
              >
                {this.state.username}
              </Button>
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggle}>Your Username</ModalHeader>
                <ModalBody>
                  <Input
                    className="m-auto"
                    type="text"
                    name="UserName"
                    id="chtUser"
                    placeholder="Type your username"
                    value={this.state.username}
                    onChange={this.handleChange}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={evt => {
                      this.getUsername(evt);
                      this.toggle();
                    }}
                  >
                    Submit
                  </Button>
                  <Button color="secondary" onClick={this.toggle}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </Col>
            <Col>
              <Button
                disabled={!this.state.connected}
                onClick={() => this.disconnect()}
                color="danger"
                className="btn btn-sm m-2"
              >
                Leave
              </Button>
            </Col>
          </Row>
          <Container>
            <Row>
              <Col>
                <Card className="m-2">
                  <CardBody style={{ height: 400, overflowY: "auto" }}>
                    <div>{SenMessages}</div>
                    <div>{RecMessages}</div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Input
                  className="m-auto"
                  placeholder="Type your message here..."
                  type="text"
                  name="message"
                  id="chtID"
                />
              </Col>
            </Row>
          </Container>

          <Button
            color="primary"
            disabled={!this.state.socket || !this.state.connected}
            className="btn btn-sm m-2"
            onClick={() => this.send()}
          >
            Send Message
          </Button>

          {/* <Button
            color="secondary"
            id="blue"
            className="btn btn-sm m-2"
            onClick={() => this.setColor("blue")}
          >
            Blue
          </Button>
          <Button
            color="secondary"
            id="red"
            className="btn btn-secondary btn-sm m-2"
            onClick={() => this.setColor("red")}
          >
            Red
          </Button> */}
        </Card>
      </Container>
    );
  }
}

export default ChatDemo;
