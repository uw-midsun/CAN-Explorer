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

export const changeSettings = (settings) => {
    console.log(settings);
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
