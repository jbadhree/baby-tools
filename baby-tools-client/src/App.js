import logo from './logo.svg';
import './App.css';
import { Button, Space, TimePicker, Divider, Row } from 'antd';
import dayjs from 'dayjs';

const format = 'HH:mm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Row>
            <TimePicker defaultValue={dayjs('12:08', format)} format={format} />
          </Row>
          <Row><p></p></Row>
          
          <Row>

            <Space>
              <Button type="primary">Start</Button> 
              <Button type="primary">Stop</Button>
            </Space>
          
          </Row>
      </header>
    </div>
  );
}

export default App;
