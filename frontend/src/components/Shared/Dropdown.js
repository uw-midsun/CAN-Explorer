import React, { useState, useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function Dropdown({
    options,
    selectedItem,
    setSelectedItem,
    buttonText
}) {

    const [idx, setSelectedIdx] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setSelectedItem(options[idx]);
    }, [idx]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIdx(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Typography
                variant="h5"
            >
                {buttonText}
                </Typography> 
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                {selectedItem}
            </Button>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === idx}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option}
                    </MenuItem>
                ))}</Menu>
        </div>
    )
}