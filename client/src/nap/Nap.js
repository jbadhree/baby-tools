import "./Nap.css"
import { Button, Space, TimePicker, Row, Table, ConfigProvider, Input } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { config } from '../Constants';

const { TextArea } = Input;

const serverBaseURL = config.url.API_BASE_URL;

var NapOnLoadFunction;


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

export function Nap(){
    const dateTime = dayjs(dayjs()).format("M-D-YYYY h:mm A").toString();
    const [data, setData] = useState(null);
  const [time, setTime] = useState(dateTime);
  const [message, setMessage] = useState(null);
  //const [notes, setNotes] = useState(message);
  const [startStop, setStartStop] = useState(false); // state variable to enable or disable start/stop buttons
  const [tableData, setTableData] = useState();
  //const [currentStatusText,setCurrentStatusText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 4,
    },
  });



  

  NapOnLoadFunction = async () =>{

        // Get latest Table data 
      await fetchData();
      
      const requestOptions = {
        method: "GET",
      };

      
      // invoke the /current endpoint to get current Status from DB
      const response = await fetch(
        serverBaseURL + "/current",
        requestOptions
      );

      const text = await response.text();
      // If last nap - stop must be disbled 
      // if startStop === true in render, start = disabled={!(startStop)}
      // and stop = disabled={startStop}
      if(text.includes("Last Nap")){
        setStartStop(true)
      }
      
      // Set current Status based on DB
      var initialTextFromDB = text ;
      setData(initialTextFromDB);
      

      // Set current datetime
      //const dateTime = dayjs(dayjs()).format("M-D-YYYY h:mm A").toString()
      // setTime(dateTimeInput);

      // Set table data to values from DB
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: tableData.length,
        },
      });

    }


    
  
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
    var length = 0;
    try{
      if(responseJson!=null){
        length=responseJson.length;
      }
    }catch (e){
      console.log(e)
    }
    setTableData(responseJson);
    setLoading(false);
    setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: length,
          },
    });
      
  };

 

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleTimeChange = (time, timeString) => {
    console.log(timeString)
    setTime(timeString);
  };

  const handleMessageChange = event => {
    setMessage(event.target.value);
    //console.log(message)
  };

  const handleButtonClick = async (event) => {
    try {
      let activityName = event.target.innerText;
      let activityTime = time;

      setMessage(message);
      

      
      let reqBody = { activityName: activityName, activityTime: activityTime , message:message};
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
      //console.log(message);

      setData(text);
      await fetchData();

      if(activityName==="Start"){
        setStartStop(false);
      }
      else{
        setStartStop(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Nap">
      
        
        <Row>
          <Space>
          
        <Row><p>Time</p></Row>
        <TimePicker
            use12Hours
            format="M-D-YYYY h:mm A"
            defaultValue={dayjs()}
            onChange={handleTimeChange}
          />
          </Space>
        </Row>
        <Row>
          <Space>
          <Row><p>Notes</p></Row>
          <Row>
        <TextArea showCount maxLength={50} type="text" id="message" name="message" onChange={handleMessageChange} value={message}/>
        </Row>
          </Space>
        </Row>
        
        <Row><p></p></Row>
        
        <Row>
        <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#000000',
                colorSecondary: '#FF0000',
              },
            }}
        >
          <Space>
          <Button type="primary" onClick={handleButtonClick}  disabled={!(startStop)}>
              Start
            </Button>
            <Button type="primary" onClick={handleButtonClick}  disabled={startStop}>
              Stop
            </Button>
            </Space>
        </ConfigProvider>
        </Row> 

        <Row>
        {data && <p>{data}</p>}
        </Row>
       
       
        
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
        
     
    </div>
  );

}

export {NapOnLoadFunction}