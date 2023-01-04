import "./App.css";
import { Button, Space, TimePicker, Row, Table } from "antd";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { config } from './Constants'


const serverBaseURL = config.url.API_BASE_URL;


const columns = [
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'name',
  },
  Table.EXPAND_COLUMN,
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: 'End Time',
    dataIndex: 'endTime',
    key: 'endTime',
  },
];
const staticTableData = [
  {
    key: 1,
    duration: '1 hour',
    startTime: '1-3-2023 1:00 PM',
    endTime: '1-3-2023 2:00 PM',
    description: 'None',
  },
  {
    key: 2,
    duration: '1 hour',
    startTime: '1-3-2023 1:00 PM',
    endTime: '1-3-2023 2:00 PM',
    description: 'hghghgh',
  },
  {
    key: 3,
    duration: '1 hour',
    startTime: '1-3-2023 1:00 PM',
    endTime: '1-3-2023 2:00 PM',
    description: 'None',
  },
  {
    key: 4,
    duration: '1 hour',
    startTime: '1-3-2023 1:00 PM',
    endTime: '1-3-2023 2:00 PM',
    description: 'None',
  },
  {
    key: 5,
    duration: '2 hour',
    startTime: '1-3-2023 1:00 PM',
    endTime: '1-3-20232:00 PM',
    description: 'None',
  },
  {
    key: 6,
    duration: '2 hour',
    startTime: '1-3-2023 1:00 PM',
    endTime: '1-3-2023 2:00 PM',
    description: 'sasasas',
  },
  {
    key: 7,
    duration: '2 hour',
    startTime: '1-3-2023 1:00 PM',
    endTime: '1-3-2023 2:00 PM',
    description: 'None',
  },
  {
    key: 8,
    duration: '2 hour',
    startTime: '1-3-2023 1:00 PM',
    endTime: '1-3-2023 2:00 PM',
    description: 'qwqwqw',
  },
];

function App() {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(null);
  const [tableData, setTableData] = useState();
  //const [currentStatusText,setCurrentStatusText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 4,
    },
  });
  const fetchData = async () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      serverBaseURL + "/latestentries",
      requestOptions
    );
    const responseJson = await response.json();
    
    setTableData(responseJson);
    setLoading(false);
    setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: responseJson.length,
          },
    });
      
  };

  // Load initial data from DB
  useEffect(() => {
    const onPageLoad = async () => {
      await fetchData();
      
      const requestOptions = {
        method: "GET",
      };

      
      // invoke the /current endpoint 
      const response = await fetch(
        serverBaseURL + "/current",
        requestOptions
      );

      const text = await response.text();

      var initialTextFromDB = text ;
      setData(initialTextFromDB);
      const dateTime = dayjs(dayjs()).format("M-D-YYYY h:mm:ss A").toString()
      setTime(dateTime);


      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: 8,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });

    };

    

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, [])

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleTimeChange = (time, timeString) => {
    console.log(timeString)
    setTime(timeString);
  };

  const handleButtonClick = async (event) => {
    try {
      let activityName = event.target.innerText;
      let activityTime = time;

      
      let reqBody = { activityName: activityName, activityTime: activityTime };
      console.log(JSON.stringify(reqBody));

      const requestOptions = {
        method: "POST",
        body: JSON.stringify(reqBody),
      };

      // invoke the /insert end point 
      const response = await fetch(
        serverBaseURL + "/insert",
        requestOptions
      );
      const text = await response.text();

      setData(text);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      
        <Row>
        <TimePicker
            use12Hours
            format="M-D-YYYY h:mm:ss A"
            defaultValue={dayjs()}
            onChange={handleTimeChange}
          />
        </Row>
        <Row><p></p></Row>
        <Row>
        <Space>
            <Button type="primary" onClick={handleButtonClick}>
              Start
            </Button>
            <Button type="primary" onClick={handleButtonClick}>
              Stop
            </Button>
          </Space>
        </Row> 
                   
        
       {data && <p>{data}</p>}
        
        <Table
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <p
                style={{
                  margin: 0,
                }}
              >
                {record.description}
              </p>
            ),
            
          }}
          dataSource={tableData}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        />  
        
        {
          // dirty way of pushing other contents up
        }
         
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>

     
    </div>
  );
}

export default App;
