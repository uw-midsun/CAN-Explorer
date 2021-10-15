import React, { useState } from 'react';
import { changeSettings } from '../../utils/apiUtils';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dropdown from '../Shared/Dropdown';
import Grid from '@material-ui/core/Grid';

const bustypeOptions = [
    'socketcan'
];

const channelOptions = [
    'vcan0',
    'can0'
]

const bitrateOptions = [
    '125000',
    '250000',
]

function ChangeSettings(props) {
    const [bustype, setBustype] = useState(props.bustype);
    const [channel, setChannel] = useState(props.channel);
    const [bitrate, setBitrate] = useState(props.bitrate);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        const delay_in_s = 2
        e.preventDefault();
        let settings = {
            "bustype": bustype,
            "channel": channel,
            "bitrate": bitrate,
        }
        changeSettings(settings);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), delay_in_s * 1000);
    }

    return (
        <div>
            <Grid container spacing={10}>
                <Grid item>
                    <Dropdown
                        buttonText={"Bustype"}
                        options={bustypeOptions}
                        selectedItem={bustype}
                        setSelectedItem={setBustype}
                    />
                </Grid>
                <Grid item>
                    <Dropdown
                        buttonText={"Channel"}
                        options={channelOptions}
                        selectedItem={channel}
                        setSelectedItem={setChannel}
                    />
                </Grid>
                <Grid item>
                    <Dropdown
                        buttonText={"Channel"}
                        options={bitrateOptions}
                        selectedItem={bitrate}
                        setSelectedItem={setBitrate}
                    />
                </Grid>
            </Grid >
            <Button variant="contained" size="medium" color="primary" value="Submit" onClick={handleSubmit} >
                Submit
            </Button>
            {
                submitted && (
                    <Typography variant="body1" >
                        Submitted!
                    </Typography>
                )
            }
        </div >
    )
}

export default ChangeSettings;
