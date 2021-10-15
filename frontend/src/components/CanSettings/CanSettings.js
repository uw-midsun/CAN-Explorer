import React, { useState, useEffect } from "react";
import ChangeSettings from './ChangeSettings';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { sizing } from '@material-ui/system';
import Box from '@material-ui/core/Box';

const delay_in_s = 5;

function CanSettings() {
    const [settings, setSettings] = useState();
    const [openChangeSettings, setOpenChangeSettings] = useState(false);

    useEffect(() => {
        const eventUri = "http://localhost:8000/get_can_settings";
        setInterval(() => {
            fetch(eventUri).then(res => res.json()).then(data => {
                setSettings(data)
            });
        }, delay_in_s * 1000)
        return () => {
        };
    }, [openChangeSettings]);

    const changeSettings = () => {
        setOpenChangeSettings(!openChangeSettings);
    }

    return (
        <>
            <NavigationMenu />
            <Box m="1rem">
                {settings ?
                    <>
                        <TableContainer sx={{ width: 0.5 }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Bustype</TableCell>
                                        <TableCell align="right">Channel</TableCell>
                                        <TableCell align="right">Bitrate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="right">{settings["bustype"]}</TableCell>
                                        <TableCell align="right">{settings["channel"]}</TableCell>
                                        <TableCell align="right">{settings["bitrate"]}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant="contained" color="primary" onClick={changeSettings}>Change settings</Button>
                        {openChangeSettings && (
                            <Box m="1rem">
                                <ChangeSettings bustype={settings["bustype"]} channel={settings["channel"]} bitrate={settings["bitrate"]} />
                            </Box>
                        )}
                    </> : (
                        <>
                            <Typography variant="body1" component="div">
                                Settings have not been fetched yet. Please wait a few seconds
                            </Typography>
                        </>
                    )}
            </Box>
        </>
    )
}

export default CanSettings;
