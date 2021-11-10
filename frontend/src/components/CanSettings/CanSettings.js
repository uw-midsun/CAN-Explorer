import React, { useState, useEffect } from "react";
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
import Box from '@material-ui/core/Box';
import Dropdown from '../Shared/Dropdown';
import Grid from '@material-ui/core/Grid';
import { asyncChangeSettings, asyncGetSettings } from '../../utils/apiUtils';
import { bustypeOptions, channelOptions, bitrateOptions } from '../../utils/canConstants.js';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    updateBtn: {
        margin: "1rem",
    }
})

function CanSettings() {
    const [settings, setSettings] = useState();
    const [bustype, setBustype] = useState();
    const [channel, setChannel] = useState();
    const [bitrate, setBitrate] = useState();
    const [submitted, setSubmitted] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        const retrieveSettings = async () => {
            let data = await asyncGetSettings();
            setSettings(data);
            setBustype(data?.bustype);
            setChannel(data?.channel);
            setBitrate(data?.bitrate);
        }

        retrieveSettings();
    }, []);


    const handleSettings = async () => {
        let newSettings = {
            "bustype": bustype,
            "channel": channel,
            "bitrate": bitrate,
        }
        setSubmitted(true);
        await asyncChangeSettings(newSettings);
        setSubmitted(false);
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
                                        <TableCell align="center" style={{ fontWeight: 'bold', }}>Bustype</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold', }}>Channel</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold', }}>Bitrate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Dropdown
                                                options={bustypeOptions}
                                                selectedItem={bustype}
                                                setSelectedItem={setBustype}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Dropdown
                                                options={channelOptions}
                                                selectedItem={channel}
                                                setSelectedItem={setChannel}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Dropdown
                                                options={bitrateOptions}
                                                selectedItem={bitrate}
                                                setSelectedItem={setBitrate}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button className={classes.updateBtn} variant="contained" color="primary" onClick={handleSettings}>Update</Button>
                        <Grid item>
                            {
                                submitted && (
                                    <Typography variant="body1" >
                                        Submitted!
                                    </Typography>
                                )
                            }
                        </Grid>
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
