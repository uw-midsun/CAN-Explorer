import React from "react";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import NavigationMenu from "../components/NavigationMenu/NavigationMenu";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import MidnightSun from "../images/midnight-sun.png";
import UploadIcon from "../images/upload.png";
import SettingsIcon from "../images/can-settings.png";
import TransmitIcon from "../images/transmit.png";
import DashboardIcon from "../images/dashboard.png";
import "./Home.css";

function Home() {
  const history = useHistory();

  return (
    <>
      <NavigationMenu />
      <br />
      <img className="team-logo" src={MidnightSun} alt="midnight-sun-logo" />
      <div className="page-container">
        <Card className="file-upload-page">
          <CardHeader
            title="Upload DBC File"
            subheader="Upload DBC files defining CAN message formats and preview message
              structure"
          />
          <img className="upload-icon" alt="upload" src={UploadIcon} />
          <IconButton className="send-icon">
            <SendIcon onClick={() => history.push("/file_upload")} />
          </IconButton>
        </Card>
        <Card className="send-message-page">
          <CardHeader
            title="Transmit CAN Message"
            subheader="Set the fields of messages and transmit over the CAN network"
          />
          <img className="transmit-icon" src={TransmitIcon} alt="transmit" />
          <IconButton className="send-icon">
            <SendIcon onClick={() => history.push("/transmit")} />
          </IconButton>
        </Card>
        <Card className="can-settings-page">
          <CardHeader
            title="CAN Settings"
            subheader="Modify the bitrate of CAN messages"
          />
          <img className="settings-icon" src={SettingsIcon} alt="settings" />
          <IconButton className="send-icon">
            <SendIcon onClick={() => history.push("/can_settings")} />
          </IconButton>
        </Card>
        <Card className="visualization-page">
          <CardHeader
            title="Visualization"
            subheader="Create dashboards to visualize CAN data"
          />
          <img className="dashboard-icon" src={DashboardIcon} alt="dashboard" />
          <IconButton className="send-icon">
            <SendIcon onClick={() => window.open("http://localhost:8086")} />
          </IconButton>
        </Card>
      </div>
    </>
  );
}

export default Home;
