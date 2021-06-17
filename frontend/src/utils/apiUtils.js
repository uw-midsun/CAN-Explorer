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

export const getSettings = () => {

    // const eventUri = "http://localhost:8000/get_can_settings";
    // let settings_data = await fetch(eventUri).then(res => res.json()).then(data => console.log(data));
    // return settings_data;
}

export const changeSettings = (settings) => {
    const eventUri = "http://localhost:8000/change_can_settings";
    fetch(eventUri, {
        method: "POST",
        body: settings
    })
    .then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err);
    })
}
