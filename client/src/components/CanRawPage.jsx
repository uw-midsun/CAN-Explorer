import React, { useEffect, useState } from 'react';

export default function CanRawPage() {
  const [rawData, setRawData] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/can_server/raw', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => setRawData(res))
      .catch((err) => console.log(err));
  }, []);

  const canObjMap = (data) => {
    let const pairs = [];
    let iterator = 0;
    for (let key in data) {
      pairs.push(
        <p key={iterator}>
          {'- ' + key} : {data[key]}
        </p>
      );
      iterator++;
    }
    return pairs;
  };

  return (
    <div>
      {rawData &&
        rawData.map((msg) => {
          return (
            <div key={msg.id}>
              <p>{'Timestamp: ' + msg.Timestamp}</p>
              <p>{'Arbitration ID: ' + msg.ArbitrationID}</p>
              <p>{'DLC: ' + msg.DLC}</p>
              <p>Data:</p>
              <div>{canObjMap(msg.Data)}</div>
            </div>
          );
        })}
    </div>
  );
}
