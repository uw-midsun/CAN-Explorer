import React, { useEffect, useRef, useState } from "react";
import { useTable } from 'react-table'
import { VictoryBar, VictoryChart } from 'victory'
import useWebSocket, { ReadyState } from 'react-use-websocket';

const URL = 'ws://192.168.24.24:8000/ws/can_server/raw';

export default function CanRawPage() {
  const [rawData, setRawData] = useState([]);
  const [count, setCount] = useState(0);
  const raw_socket = useRef(null);
  //var client = useRef(null);
  //client = reconnectingSocket(URL, raw_socket);
  const [socketUrl, setSocketUrl] = useState(URL);
  const [isConnected, setIsConnected] = useState(false);
  const [waitingToReconnect, setWaitingToReconnect] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (e) => {
      console.log(e)
      //       console.log(rawData);
      //       console.log(JSON.parse(e.data));
      let obj = JSON.parse(e.data);

      let new_data = {
        "channel": obj.channel,
        "data": obj.data,
        "dlc": obj.dlc,
        "timestamp": obj.timestamp,
      }
      setRawData([...rawData, new_data]);
    }
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

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
      <span>The WebSocket is currently {connectionStatus}</span>
      {/* <h1>Websocket {isConnected ? 'Connected' : 'Disconnected'}</h1> */}
      <div className="flex-row p-5">
        <button onClick={() => setShowGraph(false)}> Table view </button>
        <button onClick={() => setShowGraph(true)}> Graph view </button>
        {/* <button onClick={() => raw_socket.current.onopen()}> Reopen Websocket </button> */}
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