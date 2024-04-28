import './App.css';
import XlsxViewer from './XlsxViewer';
import React, { useState } from 'react';
import { saveAs } from 'file-saver';

function App() {
  const [file, setFile] = useState(null);

  function handleFileChange(event) {
        const file = event.target.files[0];
        setFile(file)
  }

  function downloadFile() {
    const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'file.xlsx');
}

  return (
    <div className="App">
      <header className="App-header">
        <p>Parsing Panel</p>
      </header>
      <main>
        <div id="parsingPanel">
          <div id="leftPanel">
            <textarea id="parsingInfoTextArea" placeholder="Введите ключевые слова сюда для ( Авито и ЦИАН )" class="borderZero shadow"></textarea >
            <input type="file" onChange={handleFileChange} />
            <XlsxViewer file={file} />
          </div>
          <div id="rightPanel">
            <button  class="left button borderZero Text shadow active">Parsing</button>
            <button  class="left button borderZero Text shadow active">Save Settings</button>
            <button onClick={downloadFile} class="left button borderZero Text shadow active">Downlad xlsx</button>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;
