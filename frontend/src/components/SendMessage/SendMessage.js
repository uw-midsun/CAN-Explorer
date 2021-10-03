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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Slider from "@material-ui/core/Slider";
import LinearProgress from "@material-ui/core/LinearProgress";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Checkbox from "@material-ui/core/Checkbox";
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
  const [randomMessage, setRandomMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [signals, setSignals] = useState({});
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  const [random, setRandom] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const [initiateTest, setInitiateTest] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState({});

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

  useEffect(() => {
    const interval = setInterval(() => {
      selectRandomMessage();
    }, (1 / frequency) * 1000);
    return () => clearInterval(interval);
  }, [frequency, messages, initiateTest, randomMessage, filteredMessages]);

  const getCanMessages = () => {
    viewCanMessages(selectedFile).then((data) => setMessages(data));
  };

  const sendCanMessage = async () => {
    if (random) {
      setInitiateTest(!initiateTest);
      return;
    }
    for (const key of Object.keys(messages[selectedMessage].signals)) {
      if (Number(signals[key]) >= 2 ** messages[selectedMessage].signals[key]) {
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

  const selectRandomMessage = async () => {
    if (Object.keys(filteredMessages).length > 0) {
      let index = Math.floor(
        Math.random() * Object.keys(filteredMessages).length
      );
      setRandomMessage(Object.values(filteredMessages)[index]);
      if (initiateTest) {
        await sendRandomMessage();
      }
    } else {
      let index = Math.floor(Math.random() * messages.length);
      setRandomMessage(messages[index]);
      if (initiateTest) {
        await sendRandomMessage();
      }
    }
  };

  const createRandomSignal = (msg_signals) => {
    let new_signals = {};
    Object.entries(msg_signals).forEach(([k, v]) => {
      let max_value = 1;
      let i = 0;
      while (i < v) {
        max_value *= 2;
        i++;
      }
      let new_val = Math.floor(Math.random() * max_value);
      new_signals[k] = new_val;
    });
    return new_signals;
  };

  const sendRandomMessage = async () => {
    if (!selectedFile) {
      setError(true);
      setResponse("No DBC file selected");
      return;
    }

    if (randomMessage) {
      const randomSignals = createRandomSignal(randomMessage.signals);
      await transmitCanMessage(
        randomMessage.frameID,
        randomMessage.name,
        selectedFile,
        randomSignals
      );
    }
  };

  const searchMessageById = (id) => {
    const msg = Object.values(messages).filter((val) => val.frameID === id);
    return msg[0];
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  const handleMessageChange = (event) => {
    setSelectedMessage(event.target.value);
    let new_signal = { ...messages[event.target.value].signals };
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

  const handleRandom = () => {
    if (random) {
      setInitiateTest(false);
    }
    setRandom(!random);
  };

  const handleFrequency = (_, newValue) => {
    setFrequency(newValue);
  };

  const handleCheck = (id) => {
    const new_msg = searchMessageById(id);
    if (id in filteredMessages) {
      delete filteredMessages[id];
      setFilteredMessages({ ...filteredMessages });
    } else {
      setFilteredMessages({ ...filteredMessages, [id]: new_msg });
    }
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
          {random ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={id in filteredMessages}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  onChange={() => handleCheck(id)}
                />
              }
              style={{ float: "right" }}
            />
          ) : null}
        </CardContent>
      </Card>
    );
  };

  const randomSwitch = () => {
    return (
      <div style={{ float: "right", marginRight: 25 }}>
        <FormControlLabel
          control={
            <Switch checked={random} onChange={handleRandom} color="primary" />
          }
          label="Test"
        />
      </div>
    );
  };

  const frequencySlider = () => {
    return (
      <>
        <Typography>Frequency (Hz)</Typography>
        <Slider
          value={frequency}
          onChange={handleFrequency}
          min={0.1}
          max={10}
          valueLabelDisplay="auto"
        />
      </>
    );
  };

  return (
    <>
      <NavigationMenu />
      <br />
      {randomSwitch()}
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: 50, marginLeft: "10%" }}>
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
          <div style={{ marginTop: 50, marginLeft: "10%" }}>
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
        {selectedMessage !== "" && !random && (
          <div style={{ marginTop: 50, marginLeft: "10%" }}>
            {Object.keys(signals).length > 0 &&
              Object.keys(signals).map((key, i) => (
                <Typography key={i} style={{ wordBreak: "break-word" }}>
                  {key + ":"}
                  <TextField
                    key={i}
                    value={signals[key]}
                    onChange={(e) => handleSignalChange(key, e)}
                    error={
                      Number(signals[key]) >=
                      2 ** messages[selectedMessage].signals[key]
                    }
                    helperText={
                      Number(signals[key]) >=
                      2 ** messages[selectedMessage].signals[key]
                        ? "Integer out of bounds"
                        : null
                    }
                    style={{ marginLeft: 5, marginTop: -3, width: 100 }}
                  />
                </Typography>
              ))}
          </div>
        )}
      </div>
      <MessageStepper activeStep={activeStep} />
      <div style={{ position: "fixed", top: "75%", margin: "auto", right: 50 }}>
        {random ? frequencySlider() : null}
        <br />
        <Button
          disabled={!(typeof selectedMessage === "number" || random)}
          color="primary"
          variant="contained"
          onClick={sendCanMessage}
        >
          {random ? (initiateTest ? "Stop" : "Test") : "Finish"}
        </Button>
      </div>
      {random && initiateTest ? (
        <div style={{ marginTop: window.innerHeight - 250 }}>
          <LinearProgress />
        </div>
      ) : null}
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
