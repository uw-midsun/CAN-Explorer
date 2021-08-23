export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('data', file);

    const uploadUri = "http://localhost:8000/upload/dbc";
    fetch(uploadUri, {
        method: "POST",
        body: formData
    })
    .then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err);
    });
}

export const viewFiles = () => {
    const filesUri = "http://localhost:8000/view/dbc";
    let files = [];
    fetch(filesUri)
        .then((res) => files = res)
        .then((err) => console.log(err));
    return files;
}

export const changeSettings = (settings) => {
    const eventUri = "http://localhost:8000/change_can_settings";
    fetch(eventUri, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    })
    .then((res) => {
        console.log(res.json());
    }, (err) => {
        console.log(err);
    })
}
