import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import RouterIcon from '@material-ui/icons/Router';
import DataUsageIcon from '@material-ui/icons/DataUsage';

function NavigationMenu() {
  const [openMenu, setOpenMenu] = useState(false);

  const history = useHistory();

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const handleMenuToggle = () => {
    setOpenMenu(!openMenu);
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
            onClick={() => history.push("/transmit")}
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
    <React.Fragment>
      <Button
        onClick={handleMenuToggle}
        startIcon={<MenuIcon />}
        size="large"
        style={{
          position: "relative",
          borderRadius: 50,
          marginLeft: 20,
          marginTop: 20,
        }}
      />
      <Drawer anchor="left" open={openMenu} onClose={handleMenuClose}>
        {menuItemList()}
      </Drawer>
    </React.Fragment>
  );
}

export default NavigationMenu;