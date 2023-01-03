import "./App.css";
import { Button, Space, TimePicker, Divider, Row } from "antd";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(null);
  //const [currentStatusText,setCurrentStatusText] = useState(null);

  // Load initial data from DB
  useEffect(() => {
    const onPageLoad = async () => {

      const requestOptions = {
        method: "GET",
      };


      // for local
      //const response = await fetch('http://localhost:8080/current', requestOptions);

      // for remote
      const response = await fetch(
        "http://192.168.8.205:8080/current",
        requestOptions
      );

      const text = await response.text();

      var initialTextFromDB = text ;
      setData(initialTextFromDB);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);


  const handleTimeChange = (time, timeString) => {
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

      // for local
      // const response = await fetch('http://localhost:8080/test', requestOptions);

      // for remote
      const response = await fetch(
        "http://192.168.8.205:8080/test",
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
      <header className="App-header">
        <Row>
          <TimePicker
            use12Hours
            format="h:mm:ss A"
            defaultValue={dayjs("00:00 AM", "HH:mm A")}
            onChange={handleTimeChange}
          />
        </Row>
        <Row>
          <p></p>
        </Row>

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
        <Row>{data && <p>{data}</p>}</Row>
        
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
