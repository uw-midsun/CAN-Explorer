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
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }, [rawData]);

  return (
    <div>
      {rawData &&
        rawData.map((msg) => (
          <div key={msg.id}>
            <p>{`Timestamp: ${msg.Timestamp}`}</p>
            <p>{`Arbitration ID: ${msg.ArbitrationID}`}</p>
            <p>{`DLC: $${msg.DLC}`}</p>
          </div>
        ))}
    </div>
  );
}
