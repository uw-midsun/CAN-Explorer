import React, { useEffect, useState } from "react";

export default function CanDecodedPage() {
  const [decodedData, setDecodedData] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/can_server/decoded", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setDecodedData(res))
      .catch((err) => console.log(err));
  }, []);

  const canObjMap = (data) => {
    let pairs = [];
    let iterator = 0;
    for (let key in data) {
      pairs.push(
        <p key={iterator}>
          {"- " + key} : {data[key]}
        </p>
      );
      iterator++;
    }
    return pairs;
  };

  return (
    <div>
      {decodedData &&
        decodedData.map((msg) => {
          return (
            <div key={msg.id}>
              <p>{"Datetime: " + msg.Datetime}</p>
              <p>{"Name: " + msg.Name}</p>
              <p>{"Sender: " + msg.Sender}</p>
              <p>Data:</p>
              <div>{canObjMap(msg.Data)}</div>
            </div>
          );
        })}
    </div>
  );
}
