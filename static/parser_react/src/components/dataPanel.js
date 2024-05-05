import './dataPanel.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataPanel({ myUrl, XlsxViewer, textarea_, userInfo_, setUserInfo_, setTextarea_, file, postData, setUserInfo, downloadFile, parsingStatus }) {
  const [data_items, setData_items] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(myUrl + 'getParsingDataList'); 
      setData_items(response.data);
    })();
  }, []);

  const getRowColor = (rowIndex) => {
    return rowIndex % 2 === 0 ? '#333' : '#444';
};

  function itemXLSX({ url, index }) {
    return (
      <div className='itemXLSX' style={{ backgroundColor: getRowColor(index) }}> 
        <p>{url}</p>
        <button onClick={() => downloadFileFromUrl(myUrl+ 'parsingData/' +url)} className="left button borderZero Text active">Download xlsx</button>
      </div>
    );
  }
  
  return (
    <div key={Math.random()} id="parsingPanel">
      <div id="leftPanel">
        {
          (data_items?.files || []).map((url, index) => {
              return itemXLSX({url, index});
          }).reverse()
        }
      </div>
      <div id="rightPanel">
        {/* Your buttons or other components */}
        {/* <button onClick={postData} className={`left button borderZero Text shadow active ${'parsingStatus_'+parsingStatus}`}>Parsing</button>
        <button onClick={setUserInfo} className="left button borderZero Text shadow active">Save suka settings</button>
        <button onClick={downloadFile} className="left button borderZero Text shadow active">Download xlsx</button> */}
      </div>
    </div>
  );
}

export { DataPanel };

async function downloadFileFromUrl(url) {
  try {
    // Получаем имя файла из URL
    const filename = url.substring(url.lastIndexOf('/') + 1);

    const response = await axios.get(url, {
      responseType: 'blob', // Указываем, что ожидаем тип Blob в ответе
    });
    
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Создаем ссылку для скачивания файла
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}
