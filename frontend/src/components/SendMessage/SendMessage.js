import React, { useEffect, useState } from "react";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MuiAlert from "@material-ui/lab/Alert";
import {
  viewFiles,
  viewCanMessages,
  transmitCanMessage,
} from "../../utils/apiUtils";
import MessageStepper from "./MessageStepper";

function SendMessage() {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [signals, setSignals] = useState({});
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    viewFiles().then((data) => {
      setFileNames([...data]);
      if (data.length === 0) {
        setResponse("No DBC files detected");
        setError(true);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedFile.length > 0) {
      getCanMessages();
      setActiveStep(1);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (selectedMessage !== "") {
      setActiveStep(2);
    }
  }, [selectedMessage]);

  const getCanMessages = () => {
    viewCanMessages(selectedFile).then((data) => setMessages(data));
  };

  const sendCanMessage = async () => {
    for (const key of Object.keys(messages[selectedMessage].signals)) {
      console.log(key);
      console.log(messages[selectedMessage].signals[key]);
      console.log(Number(signals[key]));
      console.log(2**messages[selectedMessage].signals[key]);
      if (Number(signals[key]) >= (2**messages[selectedMessage].signals[key])) {
        setResponse("Field value out of bounds");
        setError(true);
        return;
      }
    }

    setActiveStep(3);
    let response = await transmitCanMessage(
      messages[selectedMessage].frameID,
      messages[selectedMessage].name,
      selectedFile,
      signals
    );
    const status = response.status;
    const responseJson = await response.json();

    if (status >= 400) {
      setError(true);
    } else {
      setSuccess(true);
    }
    setResponse(responseJson.response);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  const handleMessageChange = (event) => {
    setSelectedMessage(event.target.value);
    let new_signal = {...messages[event.target.value].signals};
    for (const key of Object.keys(new_signal)) {
      new_signal[key] = 0;
    }
    setSignals(new_signal);
  };

  const handleSignalChange = (key, event) => {
    if (/^\d+$/.test(event.target.value) || event.target.value === "") {
      setSignals({ ...signals, [key]: event.target.value });
    }
  };

  const handleSuccessClose = () => {
    setSuccess(false);
  };

  const handleErrorClose = () => {
    setError(false);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const canMessageCard = (index, id, name, signals) => {
    return (
      <Card key={id} value={index}>
        <CardContent>
          <Typography variant="body2">{"Frame ID: " + id}</Typography>
          <Typography variant="body2">{"Name: " + name}</Typography>
          <Typography variant="body2">
            {"Signals: " + JSON.stringify(signals)}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <NavigationMenu />
      <br />
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: 20, marginLeft: "10%" }}>
          <TextField
            select
            value={selectedFile}
            onChange={handleFileChange}
            variant="outlined"
            autoFocus={true}
            style={{ width: 250 }}
          >
            {fileNames.length > 0 &&
              fileNames.map((file) => (
                <MenuItem key={file} value={file}>
                  {file}
                </MenuItem>
              ))}
          </TextField>
        </div>
        {selectedFile && (
          <div style={{ marginTop: 20, marginLeft: "10%" }}>
            <TextField
              select
              value={selectedMessage}
              onChange={handleMessageChange}
              variant="outlined"
              style={{ width: 400 }}
            >
              {messages.length > 0 &&
                messages.map((msg, i) =>
                  canMessageCard(i, msg.frameID, msg.name, msg.signals)
                )}
            </TextField>
          </div>
        )}
        {selectedMessage !== "" && (
          <div style={{ marginTop: 20, marginLeft: "10%" }}>
            {Object.keys(signals).length > 0 &&
              Object.keys(signals).map((key, i) => (
                <Typography key={i}>
                  {key + ":"}
                  <TextField
                    key={i}
                    value={signals[key]}
                    onChange={(e) => handleSignalChange(key, e)}
                    error={Number(signals[key]) >= (2**messages[selectedMessage].signals[key])}
                    helperText={Number(signals[key]) >= (2**messages[selectedMessage].signals[key]) ? "Integer out of bounds" : null}
                    style={{ marginLeft: 5, marginTop: -3, width: 100 }}
                  />
                </Typography>
              ))}
          </div>
        )}
      </div>
      <MessageStepper activeStep={activeStep} />
      <Button
        disabled={!(typeof selectedMessage === "number")}
        color="primary"
        variant="contained"
        onClick={sendCanMessage}
        style={{ position: "fixed", top: "75%", margin: "auto", right: "5%" }}
      >
        Finish
      </Button>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleSuccessClose}
      >
        <MuiAlert
          elevation={5}
          variant="filled"
          onClose={handleSuccessClose}
          severity="success"
        >
          {response}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={3000} onClose={handleErrorClose}>
        <MuiAlert
          elevation={5}
          variant="filled"
          onClose={handleErrorClose}
          severity="error"
        >
          {response}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default SendMessage;
