import "./App.css";
import React, {useEffect, useState} from "react";
import { Feed } from "./feed/Feed";
import { Nap, NapOnLoadFunction } from "./nap/Nap";

import {Row } from "antd";

const Tabs = (props) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = props.children[activeTabIndex];
  return (
    <div>
      <div className="tabs">
        {props.children.map((tab, i) => (
          <button
            className="tab-btn"
            onClick={() => {
              setActiveTabIndex(i);
            }}
            key={i}
          >
            {tab.props.title}
          </button>
        ))}
      </div>
      <div className="tab-indicator-container">
        <div
          className="tab-indicator"
          style={{
            width: 100 / props.children.length + "%",
            transform: `translateX(${activeTabIndex * 100}%)`,
          }}
        />
      </div>
      <div className="tab-content">{activeTab.props.children}</div>
    </div>
  );
};

function App() {

  

  useEffect(() => {
    const onPageLoad = async () => { 
      await NapOnLoadFunction();
     
    }

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }

  });


  return (
  
    <div className="App">
      <Row>
        <p></p>
      </Row>
      <Row>
      <Tabs>
      <div title="Nap">
      <Nap />
    </div>
    <div title="Feed">
        <Feed />
      </div>
      </Tabs>
      </Row>
      
      
    </div>
    

    
  );
}

export default App;
