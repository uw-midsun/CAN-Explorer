export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('data', file);

    const eventUri = "http://localhost:8000/upload/dbc";
    fetch(eventUri, {
        method: "POST",
        body: formData
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => console.log(err));
}

export const viewFiles = async () => {
    const eventUri = "http://localhost:8000/view/dbc";
    let fileNames = null
    await fetch(eventUri).then((res) => {
        fileNames = res.json();
    })
    .catch((err) => console.log(err));

    return fileNames;
}

export const viewMessages = async (fileName) => {
    const eventUri = `http://localhost:8000/view/dbc/${fileName}`;
    let canMessages = null
    await fetch(eventUri).then((res) => {
        canMessages = res.json();
    })
    .catch((err) => console.log(err));

    return canMessages;
}
