import React, { useEffect, useRef, useState } from "react";
import { useTable } from 'react-table'
import { VictoryBar, VictoryChart } from 'victory'

function connect() {
  
}

export default function CanRawPage() {
  const [rawData, setRawData] = useState([]);
  const [count, setCount] = useState(0);
  const [wsOpen, setwsOpen] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const data = React.useMemo(
    () => rawData,
    [rawData]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Channel",
        accessor: "channel"
      },
      {
        Header: "Data",
        accessor: "data"
      },
      {
        Header: "DLC",
        accessor: "dlc"
      },
      {
        Header: "Time Stamp",
        accessor: "timestamp"
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  //var convert_socket = new WebSocket("wss://localhost:8000/ws/can_server/converted");
  var raw_socket = useRef(null);

  var timeout = 250;

  useEffect(() => {

    raw_socket.current = new WebSocket("ws://192.168.24.24:8000/ws/can_server/raw");
    var connectInterval;

    // raw can websocket logic
    raw_socket.current.onopen = () => {
      setwsOpen(true);
      //timeout = 250;
      //clearTimeout(connectInterval);
      console.log('Raw CAN WebSockets connection created.');
    };

    if (raw_socket.current.readyState === WebSocket.OPEN) {
      raw_socket.current.onopen();
    }

    raw_socket.current.onclose = () => {
      setwsOpen(false);
      //connectInterval = setTimeout()
      console.log("Raw WebSockets connection closed");
    }

    // TODO add onerror function as well



    if (!raw_socket.current) return;

    raw_socket.current.onmessage = function (e) {
      //console.log(e)
      console.log(rawData);
      console.log(JSON.parse(e.data));
      let obj = JSON.parse(e.data);

      let new_data = {
        "channel": obj.channel,
        "data": obj.data,
        "dlc": obj.dlc,
        "timestamp": obj.timestamp,
      }

      //let new_list = rawData;
      //new_list.push(new_data)
      //new_data = rawData.concat({ new_data });
      setRawData([...rawData, new_data]);
      //data.push(new_data)
      //console.log("yeet");
    }

    return () => {
      raw_socket.current.close();
    }

  }, [rawData]);

  // fetch("http://localhost:8000/api/can_server/raw", {
  //   method: "GET",
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  //   .then((res) => res.json())
  //   .then((res) => setRawData(res))
  //   .catch((err) => console.log(err));

  const canObjMap = (data) => {
    let pairs = []
    let iterator = 0
    for (let key in data) {
      pairs.push(<p key={iterator}>{"- " + key} : {data[key]}</p>)
      iterator++;
    }
    return pairs
  }

  return (
    <div className="max-w-full flex-row">
      <h1>Websocket connection status : </h1>
      <div className="flex-row p-5">
        <button onClick={() => setShowGraph(false)}> Table view </button>
        <button onClick={() => setShowGraph(true)}> Graph view </button>
        <button onClick={() => raw_socket.current.onopen()}> Reopen Websocket </button>
      </div>

      <div className="flex">
        {/* Table view */}
        {/* <table className="border-black border-solid border-2 w-full">
          <tr>
            <th>Channel</th>
            <th>Data</th>
            <th>DLC</th>
            <th>Timestamp</th>
          </tr>
          {rawData.map((msg, index) => {
            return (
              <tr className="border-black border-solid border-2">
                <td className="border-black border-solid border-2">{msg.channel}</td>
                <td className="border-black border-solid border-2">{msg.data}</td>
                <td className="border-black border-solid border-2">{msg.dlc}</td>
                <td className="border-black border-solid border-2">{msg.timestamp}</td>
              </tr>
            );
          })}
        </table> */}

        {showGraph ?
        // chart
          <VictoryChart
          domainPadding={20}
          >
            <VictoryBar
              data={data}
              // TODO temp axis variables 
              x="data"
              y="dlc"
            />
          </VictoryChart>

          :
          // Table
          <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        borderBottom: 'solid 3px red',
                        background: 'aliceblue',
                        color: 'black',
                        fontWeight: 'bold',
                        padding: 5
                      }}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: '10px',
                            border: 'solid 1px gray',
                            background: 'papayawhip',
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        }


        {/* Graph view */}
      </div>


    </div>
  );
}