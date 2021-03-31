import React, { useEffect, useRef, useState } from "react";
import { useTable } from 'react-table'
import { VictoryBar, VictoryChart } from 'victory'

export default function CanRawPage() {
  const [rawData, setRawData] = useState([]);
  const [count, setCount] = useState(0);
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

  useEffect(() => {

    raw_socket.current = new WebSocket("ws://192.168.24.24:8000/ws/can_server/raw");

    // raw can websocket logic
    raw_socket.current.onopen = () => {
      console.log('Raw CAN WebSockets connection created.');
    };

    if (raw_socket.current.readyState == WebSocket.OPEN) {
      raw_socket.current.onopen();
    }

    raw_socket.current.onclose = () => {
      console.log("Raw WebSockets connection closed");
    }

    return () => {
      raw_socket.current.close();
    }

  }, []);

  useEffect(() => {
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
  });

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


  // var should_convert = true;

  // convert_socket.onopen = function open() {
  //   console.log('Converted CAN WebSockets connection created.');
  // };

  // // Converted can websocket logic 
  // if (convert_socket.readyState == WebSocket.OPEN) {
  //   convert_socket.onopen();
  // }

  // convert_socket.onmessage = function (e) {
  //   if (should_convert)
  //     document.getElementById("can_msg").textContent = e.data;

  //   var obj = JSON.parse(e.data);

  //   //console.log(e);
  //   //console.log(obj);
  //   //console.log(obj['name']);
  // }

  // // button logic
  // document.getElementById("converted_btn").onclick = function f() {
  //   should_convert = true;
  //   console.log("set to convert mode");
  // }

  // document.getElementById("raw_btn").onclick = function f() {
  //   should_convert = false;
  //   console.log("set to raw mode");
  // }

  return (
    <div className="max-w-full flex-row">
      <div className="flex-row">
        <button> Table view </button>
        <button onClick={() => setShowGraph(!showGraph)}> Graph view </button>
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