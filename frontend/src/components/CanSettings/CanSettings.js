import React, { useState, useEffect } from "react";
import ChangeSettings from './ChangeSettings';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { getSettings, changeSettings } from "../../utils/apiUtils";

const eventUri = "http://localhost:8000/get_can_settings";

function CanSettings(props) {
    const [settings, setSettings] = useState();
    const [intervalID, setIntervalID] = useState();
    const [openChangeSettings, setOpenChangeSettings] = useState(false);

    useEffect(() => {
        let delay_in_s = 5;
        setInterval(() => {
            fetch(eventUri).then(res => res.json()).then(data => {
                console.log(data)
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
            <Typography variant="body1">
                <h1> Can Settings </h1>
            </Typography>
            <table>
                {settings &&
                    (<>
                        <tr>
                            <th>Bustype</th>
                            <th>Channel</th>
                            <th>Bitrate</th>
                        </tr>
                        <tr>
                            <th>{settings["bustype"]}</th>
                            <th>{settings["channel"]}</th>
                            <th>{settings["bitrate"]}</th>
                        </tr>
                    </>)
                }
            </table>
            { settings ? (
                <>
                    <Button variant="contained" color="primary" onClick={changeSettings}>Change settings</Button>
                    { openChangeSettings ? (
                        <>
                            <ChangeSettings bustype={settings["Bustype"]} channel={settings["Channel"]} bitrate={settings["Bitrate"]} />
                        </>
                    ) : (
                            <>
                            </>
                        )}
                </>
            ) : (
                    <>
                        <p>Settings have not been fetched yet. Please wait a few seconds</p>
                    </>
                )}
        </>
    )
}

export default CanSettings;
