import React, { useState, useEffect } from "react";
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { getSettings, changeSettings } from "../../utils/apiUtils";

const eventUri = "http://localhost:8000/get_can_settings";

function CanSettings(props) {
    const [settings, setSettings] = useState();

    useEffect(() => {
        let timer1 = setTimeout(() => {
            fetch(eventUri).then(res => res.json()).then(data => {
                console.log(data)
                setSettings(data)
            });
        }, delay * 5000);

        // this will clear Timeout
        // when component unmount like in willComponentUnmount
        // and show will not change to true
        return () => {
          clearTimeout(timer1);
        };
    }, []);

    const submitSettings = () => {

    }

    return (
        <>
            <Typography variant="body1">
                <h1> Can Settings </h1>
            </Typography>
            <ul>
                { settings && 
                (<>
                <li>{settings["Bustype"]}</li>
                </>)
                }
            </ul>
            <Button variant="contained" color="primary" onClick={submitSettings}>Change settings</Button>
        </>
    )
}

export default CanSettings;
