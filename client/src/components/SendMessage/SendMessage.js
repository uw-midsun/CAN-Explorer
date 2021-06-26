import React, {useEffect, useState} from "react"
import { viewFiles } from "../../utils/apiUtils";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

function SendMessage() {
    const [fileNames, setFileNames] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");

    useEffect(() => {
        setFileNames(viewFiles().then((res) => res.response));
    }, [])

    const handleFileChange = (event) => {
        setSelectedFile(event.target.value);
    }

    return (
        <>
            <NavigationMenu />
            <br />
            <TextField
                value={selectedFile}
                onChange={handleFileChange}
                helperText="Please select a DBC file"
            >
                {fileNames.length > 0 && fileNames.map((file) => (
                    <MenuItem key={file} value={file}>
                        {file}
                    </MenuItem>
                ))}
            </TextField>
        </>
    )
}

export default SendMessage;
