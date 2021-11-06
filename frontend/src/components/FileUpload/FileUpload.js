import React, { useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Snackbar from "@material-ui/core/Snackbar";
import AddIcon from "@material-ui/icons/Add";
import PublishIcon from "@material-ui/icons/Publish";
import MuiAlert from "@material-ui/lab/Alert";
import FileDetails from "./FileDetails";
import { uploadFile } from "../../utils/apiUtils";
import NavigationMenu from "../NavigationMenu/NavigationMenu";

function FileUpload() {
  const [file, setFile] = useState();
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

  const fileInput = useRef();

  const handleNewFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setIsFileSelected(true);
  };

  const handleUpload = async () => {
    let response = await uploadFile(file);
    const status = response.status;
    const responseJson = await response.json();

    if (status >= 400) {
      setError(true);
    } else {
      setSuccess(true);
    }
    setResponse(responseJson.response);
  };

  const handleSuccessClose = () => {
    setSuccess(false);
  };

  const handleErrorClose = () => {
    setError(false);
  };

  return (
    <>
      <NavigationMenu />
      <br />
      <div style={{ marginTop: 50, marginLeft: 50 }}>
        <input
          id="button-file"
          type="file"
          ref={fileInput}
          onChange={handleNewFile}
          style={{ display: "none" }}
        />
        <Fab color="primary" onClick={() => fileInput.current.click()}>
          <AddIcon />
        </Fab>
        {isFileSelected ? <FileDetails file={file} /> : null}
        <br />
        <br />
        {isFileSelected ? (
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Upload
            <PublishIcon style={{ marginLeft: 10 }} />
          </Button>
        ) : null}
      </div>
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

export default FileUpload;
