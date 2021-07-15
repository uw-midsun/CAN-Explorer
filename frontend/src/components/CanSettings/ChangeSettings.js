import React, {useState, useEffect, useMemo} from 'react';
import { changeSettings } from '../../utils/apiUtils';

const delay_in_s = 2

function ChangeSettings(props) {
    const [bustype, setBustype] = useState(props.bustype);
    const [channel, setChannel] = useState(props.channel);
    const [bitrate, setBitrate] = useState(props.bitrate);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
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

    useEffect(() => {
    }, [])

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Bustype: <input type="text" value={bustype} onChange={e => setBustype(e.target.value)} />
                </label>
                <label>
                    Channel <input type="text" value={channel} onChange={e => setChannel(e.target.value)} />
                </label>
                <label>
                    Bitrate <input type="text" value={bitrate} onChange={e => setBitrate(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            { submitted && (
                <>
                <p>Submitted! </p>
                </>
            )}
        </div>
    )
}

export default ChangeSettings;
