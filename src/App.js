/* globals dcp, progress */

import './App.css';
import { useState, useCallback, useEffect } from 'react';

function App() {
  const [inputValue, updateInputValueFn] = useState('');
  const [jobHandle, setJobHandle] = useState(null);
  const [leftTAContent, setLeftTAContent] = useState('');
  const [rightTAContent, setRightTAContent] = useState('');
  
  const onDeployJob = useCallback(function() {
    const compute = dcp.compute;
    let inputSet = Array.from(inputValue);
    let workFn = function (letter) {
      progress();
      return letter.toUpperCase();
    };

    setJobHandle(compute.for(inputSet, workFn));
  }, [inputValue]);

  useEffect(function() {
    if (jobHandle !== null) {
      jobHandle.on('readystatechange', (ev) => setLeftTAContent((currentValue) => currentValue + '\nReady State:' + ev));
      jobHandle.on('status', (ev) => setLeftTAContent((currentValue) => currentValue + '\nStatus: ' + Object.entries(ev).join(' ').replace(/,/g,': ')));
      jobHandle.on('result', (ev) => setRightTAContent((currentValue) => currentValue + '\n' + Object.entries(ev).join(' ').replace(/,/g,': ')));
      jobHandle.on('complete', (ev) => alert(Array.from(ev).join('')));
    }
  }, [jobHandle]);
            
  useEffect(function() {
    if (jobHandle !== null      /* not initial state */
        && !jobHandle.id) {     /* not yet deployed */ 
      jobHandle.exec();
    }
  }, [jobHandle]);
  
  return (
    <div className="App">
      <header className="App-header">
      Enter a string to change to uppercase via the Distributed Computer:
      <input type="text" value={inputValue} onChange={(ev)=>{console.log(ev.target.value); updateInputValueFn(ev.target.value)}}/>
      <input type="submit" onClick={onDeployJob} value='Distribute'/>
      <div style={{display: 'flex', width: '1000px', marginTop: 15 }}>
        <div style={{flexGrow: 1, marginRight: 15}}><div>Status Events</div>
          <textarea rows={20} style={{width: '100%', marginRight: 5}} value={leftTAContent} readOnly/>
        </div>
         <div style={{flexGrow: 1 }}><div>Individual Results</div>
          <textarea rows={20} style={{width: '100%'}} value={rightTAContent} readOnly/>
        </div>
      </div>
      </header>
    </div>
  );
}

export default App;
