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
    }, (err) => {
        console.log(err);
    });
}