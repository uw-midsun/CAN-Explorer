import React from "react";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import MidnightSun from "../images/midnight-sun.png";
import NavigationMenu from "../components/NavigationMenu/NavigationMenu";
import "./Home.css"

function Home() {
  return (
    <>
      <NavigationMenu />
      <br />
      <img className="team-logo" src={MidnightSun} alt="midnight-sun-logo" />
      <div className="page-container">
        <Card className="file-upload-page">
            <CardHeader title="Upload DBC File"/>
            <CardContent>
                <Typography variant="body2">
                    Cool
                </Typography>
            </CardContent>
        </Card>
        <Card className="send-message-page">
            <CardHeader title="Transmit CAN Message"/>
            <CardContent>
                <Typography variant="body2">
                    Cool
                </Typography>
            </CardContent>
        </Card>
        <Card className="can-settings-page">
            <CardHeader title="CAN Settings"/>
            <CardContent>
                <Typography variant="body2">
                    Cool
                </Typography>
            </CardContent>
        </Card>
        <Card className="visualization-page">
            <CardHeader title="Visualization"/>
            <CardContent>
                <Typography variant="body2">
                    Cool
                </Typography>
            </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Home;
