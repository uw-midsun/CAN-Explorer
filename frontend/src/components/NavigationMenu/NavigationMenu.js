import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import RouterIcon from "@material-ui/icons/Router";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import SettingsIcon from "@material-ui/icons/Settings";
import PublishIcon from "@material-ui/icons/Publish";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function NavigationMenu() {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState(false);
  const history = useHistory();

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const handleMenuToggle = () => {
    setOpenMenu(!openMenu);
  };

  const getTitle = () => {
    if (window.location.href.includes("file_upload")) {
      return "Upload DBC File";
    } else if (window.location.href.includes("transmit")) {
      return "Send Message"
    } else if (window.location.href.includes("can_settings")) {
      return "CAN Settings"
    } else {
      return "Home";
    }
  }

  const rerouteToInflux = () => {
    window.open("http://localhost:8086");
  };

  const menuItemList = () => {
    return (
      <div onClick={handleMenuClose} style={{ width: 300 }}>
        <List>
          <ListItem
            button
            onClick={() => history.push("/")}
            style={{ marginTop: "12%" }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => history.push("/file_upload")}
            style={{ marginTop: "10%" }}
          >
            <ListItemIcon>
              <PublishIcon />
            </ListItemIcon>
            <ListItemText primary="Upload DBC File" />
          </ListItem>
          <ListItem
            button
            onClick={() => history.push("/transmit")}
            style={{ marginTop: "10%" }}
          >
            <ListItemIcon>
              <RouterIcon />
            </ListItemIcon>
            <ListItemText primary="Send Message" />
          </ListItem>
          <ListItem
            button
            onClick={() => history.push("/can_settings")}
            style={{ marginTop: "10%" }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="CAN Settings" />
          </ListItem>
          <ListItem
            button
            onClick={() => rerouteToInflux()}
            style={{ marginTop: "10%" }}
          >
            <ListItemIcon>
              <DataUsageIcon />
            </ListItemIcon>
            <ListItemText primary="Visualization" />
          </ListItem>
        </List>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleMenuToggle}
            className={classes.menuButton}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {getTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={openMenu} onClose={handleMenuClose}>
        {menuItemList()}
      </Drawer>
    </div>
  );
}

export default NavigationMenu;
