import React from "react";
import Typography from '@material-ui/core/Typography';

function FileDetails(props) {
    const {file} = props;
    return (
        <>
            <Typography variant="body1">
                <br />
                {`File Name: ${file.name}`}
                <br />
                {`File Type: ${file.type}`}
                <br />
                {`File Size: ${file.size}`}
                <br />
            </Typography>
        </>
    )
}

export default FileDetails;