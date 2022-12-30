import logo from './logo.svg';
import './App.css';
import { Button, Space } from 'antd';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Space wrap>
          <Button type="primary">Start</Button>
          <Button type="primary">Stop</Button>
        </Space>
      </header>
    </div>
  );
}

export default App;


