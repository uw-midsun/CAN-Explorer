import { flattenCanMessageObject } from "./arrayUtils";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("data", file);

  let response;
  const uploadUri = "http://localhost:8000/upload/dbc";
  await fetch(uploadUri, {
    method: "POST",
    body: formData,
  }).then((res) => (response = res));
  return response;
};

export const getPreview = async (file) => {
  const formData = new FormData();
  formData.append("data", file);

  let response;
  const previewUri = "http://localhost:8000/read/dbc";
  await fetch(previewUri, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.status < 400 ?  res.json() : null)
    .then((res) => res ? flattenCanMessageObject(res.response) : "")
    .then((res) => (response = res));
  return response;
};

export const viewFiles = async () => {
  const filesUri = "http://localhost:8000/view/dbc";
  let files;
  await fetch(filesUri)
    .then((res) => res.json())
    .then((res) => (files = res))
    .then((err) => console.log(err));
  return files.response;
};

export const viewCanMessages = async (filename) => {
  const messageUri = "http://localhost:8000/view/can/" + filename;
  let canMessages;
  await fetch(messageUri)
    .then((res) => res.json())
    .then((res) => (canMessages = flattenCanMessageObject(res.response)))
    .then((err) => console.log(err));
  return canMessages;
};

export const transmitCanMessage = async (id, name, file, signals) => {
  const transmitUri = "http://localhost:8000/transmit";
  let data;
  console.log(id, name, file, signals);
  await fetch(transmitUri, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      frame_id: id,
      name: name,
      file: file,
      signals: signals,
    }),
  })
    .then((res) => (data = res))
    .then((err) => console.log(err));
  return data;
};

export const changeSettings = (settings) => {
  const eventUri = "http://localhost:8000/change_can_settings";
  fetch(eventUri, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  }).then(
    (res) => {
      console.log(res.json());
    },
    (err) => {
      console.log(err);
    }
  );
};
