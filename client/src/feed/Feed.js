import "./Feed.css"
import { Button, Space, TimePicker, Row, ConfigProvider, Input, Table, Dropdown } from "antd";
import { DownOutlined } from '@ant-design/icons';
import React, { useState } from "react";
//import { InputNumber } from 'antd';
import dayjs from "dayjs";
import { config } from '../Constants';

const { TextArea } = Input;
const serverBaseURL = config.url.API_BASE_URL;

var FeedOnLoadFunction;

const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    Table.EXPAND_COLUMN,
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  const items = [
    {
      label: '1',
      key: '1',
    },
    {
      label: '2',
      key: '2',
    },
    {
      label: '3',
      key: '3',
    },
    {
      label: '4',
      key: '4',
    },
  ];



export function Feed (){
    const dateTime = dayjs(dayjs()).format("M-D-YYYY h:mm A").toString();
    const [time, setTime] = useState(dateTime);
    const [message, setMessage] = useState(null);
    const [quantity, setQuantity ] = useState("4 oz");
    const [statusText, setStatusText] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
        current: 1,
        pageSize: 4,
        },
    });
  

    FeedOnLoadFunction = async () => {
        const requestOptions = {
            method: "GET",
        };
    
          
        // invoke the /current endpoint to get current Status from DB
        const response = await fetch(
            serverBaseURL + "/currentevent",
            requestOptions
        );
    
        const text = await response.text();
        
          
        // Set current Status based on DB
        var initialTextFromDB = text ;
        setStatusText(initialTextFromDB);

        setLoading(true);
    
        
        const latestEntriesResponse = await fetch(
        serverBaseURL + "/eventlatestentries",
        requestOptions
        );
        const responseJson = await latestEntriesResponse.json();
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
    }

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
          pagination,
          filters,
          ...sorter,
        });
    
        
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
          setStatusText([]);
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

    //   const onQuantityChange = (value) => {
    //     console.log('changed', value);
    //     setQuantity(value+" oz");
    //   };

      const handleButtonClick = async (event) => {
        try {
          
          let activityTime = time;
    
          setMessage(message);

          //setQuantity(quantity+" oz");
          
    
          
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

          setLoading(true);

       
          const requestOptionsLatestEntries = {
            method: "GET",
        };
            const latestEntriesResponse = await fetch(
            serverBaseURL + "/eventlatestentries",
            requestOptionsLatestEntries
            );
            const responseJson = await latestEntriesResponse.json();
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
    
          
        } catch (error) {
          console.error(error);
        }
      };

      
      const handleMenuClick = (value) => {
        console.log('click', value.key);
        setQuantity(value.key +" oz");
      };

      const menuProps = {
        items,
        onClick: handleMenuClick,
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
            

            <Dropdown menu={menuProps}>
                <Button>
                    <Space>
                        {quantity}
                        <DownOutlined />
                     </Space>
                 </Button>
            </Dropdown>

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

export {FeedOnLoadFunction}