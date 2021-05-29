import React, {useState} from "react";
import { Button } from '@material-ui/core';
import FileDetails from "./FileDetails";
import { uploadFile } from "../../utils/apiUtils";

function FileUpload() {
    const [file, setFile] = useState();
    const [isFileSelected, setIsFileSelected] = useState(false);

    const handleNewFile = (e) => {
        const file = e.target.files[0];
        console.log(file);
        setFile(file);
        setIsFileSelected(true);
    }

    const handleUpload = () => {
        uploadFile(file);
    }

    return (
        <>
            <input type="file" name="file" onChange={handleNewFile} />
            {isFileSelected ? (
                <FileDetails file={file}/>
            ) : null}
            <br />
            <br />
            <Button variant="contained" color="primary" onClick={handleUpload}>Upload File</Button>
        </>
    );
}

export default FileUpload;
