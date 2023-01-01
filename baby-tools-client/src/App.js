import './App.css';
import { Button, Space, TimePicker, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';



function App() {

  const [data, setData] = useState(null);
  const [time, setTime] = useState(null);

  const handleTimeChange = (time, timeString) => {
    setTime(timeString);
  };

  const handleButtonClick = async event => {
    try {
      
      let activityName = event.target.innerText;
      let activityTime = time 
      let reqBody = {"activityName": activityName, "activityTime": activityTime};
      console.log(JSON.stringify(reqBody));
      
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify(reqBody)
    };

      //const response = await fetch('http://localhost:4001/status', requestOptions);
      const response = await fetch('http://localhost:8080/test', requestOptions);
      const text = await response.text();

      
      setData(text);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
          <Row>
            
            <TimePicker use12Hours format='h:mm:ss A' defaultValue={dayjs('00:00 AM', 'HH:mm A')} onChange={handleTimeChange}  />
          </Row>
          <Row><p></p></Row>
          
          <Row>

            <Space>
              <Button type="primary" onClick={handleButtonClick}>Start</Button> 
              <Button type="primary" onClick={handleButtonClick}>Stop</Button>
              
            </Space>
        
          </Row>
          <Row>

          {data && <p>Data: {data}</p>}
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
          <Row>
            <p></p>
          </Row>
          
      </header>
    </div>
  );
}

export default App;
