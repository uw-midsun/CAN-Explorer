import React, { useEffect, useState } from 'react';

export default function CanDecodedPage() {
  const [decodedData, setDecodedData] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/can_server/decoded', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => setDecodedData(res))
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {decodedData &&
        decodedData.map((msg) => (
          <div key={msg.id}>
            <p>{`Datetime: ${msg.Datetime}`}</p>
            <p>{`Name: ${msg.name}`}</p>
            <p>{`Sender: ${msg.Sender}`}</p>
          </div>
        ))}
    </div>
  );
}
