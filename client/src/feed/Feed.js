import "./Feed.css"
import { Button, Space, TimePicker, Row, ConfigProvider, Input } from "antd";
import React, { useState } from "react";
import { InputNumber } from 'antd';
import dayjs from "dayjs";
import { config } from '../Constants';

const { TextArea } = Input;
const serverBaseURL = config.url.API_BASE_URL;



export function Feed (){
    const dateTime = dayjs(dayjs()).format("M-D-YYYY h:mm A").toString();
    const [time, setTime] = useState(dateTime);
  const [message, setMessage] = useState(null);
  const [quantity, setQuantity ] = useState("3oz");
  const [statusText, setStatusText] = useState(null);

  

    const handleTimeChange = (time, timeString) => {
        console.log(timeString)
        setTime(timeString);
      };
    
      const handleMessageChange = event => {
        setMessage(event.target.value);
        //console.log(message)
      };

      const onQuantityChange = (value) => {
        console.log('changed', value);
        setQuantity(value+"oz");
      };

      const handleButtonClick = async (event) => {
        try {
          
          let activityTime = time;
    
          setMessage(message);

          setQuantity(quantity+"oz");
          
    
          
          let reqBody = { feedTime: activityTime , feedQuantity: quantity, feedMessage:message};
          console.log(JSON.stringify(reqBody));
    
          const requestOptions = {
            method: "POST",
            body: JSON.stringify(reqBody),
          };
    
          // invoke the /insert end point 
          const response = await fetch(
            serverBaseURL + "/insertevent",
            requestOptions
          );
          const text = await response.text();
          //console.log(message);
    
          setStatusText(text);
          //await fetchData();
    
          
        } catch (error) {
          console.error(error);
        }
      };

    return(
        <div className="Feed">
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
        <Space>
        <Row><p>Quantity</p></Row>
            <Row>
            <InputNumber min={1} max={10} defaultValue={3} onChange={onQuantityChange} />
            </Row>
        </Space>
       
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
          <Button type="primary" onClick={handleButtonClick} >
              Save
              </Button>
            </Space>
        </ConfigProvider>
        </Row> 

        <Row>
        {statusText && <p>{statusText}</p>}
        </Row>

        </div>
    );

}

