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
    fetch(filesUri).then((res) => files = res);
    return files;
}
