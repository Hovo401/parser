import './App.css';
import XlsxViewer from './XlsxViewer';
import React, { useState,useEffect } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import * as XLSX from 'xlsx';

function App() {
  const [file, setFile] = useState(null);

  const [textarea_, setTextarea_] = useState('');
  const [parsingStatus, setParsingStatus] = useState('free');
  const [userInfo_, setUserInfo_] = useState({

    "searchInfo": {
        "textarea": "дом local"
    }
});

  // const myUrl = 'http://localhost:3000/'; // dev
  const myUrl = window.location.href; // prod

  useEffect(() => {
    (async ()=>{
      const response = await axios.get(myUrl + 'getUserInfo'); 
      const userInfo = response.data;
      if( Math.floor( Number(response.status)/ 100)  != 5){
        setUserInfo_(userInfo || '')
        setTextarea_(userInfo?.searchInfo?.textarea || '')
      }
      
    })()
  }, []);

  async function setUserInfo(){
    try {
      const response = await axios.post(myUrl + 'setUserInfo', userInfo_); 
      alert('данные сохранены')
    } catch (error) {
      console.log(error)
    }

  }
  

  async function postData() {
    try {
      if(parsingStatus !== 'free'){
        return;
      }

      // setTextarea_(textarea_.replace(/ /g,'').replace(/\n/g,'').replace(/,/g,',\n'))

      const data = {
        keywords: textarea_
      };
      setParsingStatus('parsing')
      setFile(null)
      const response = await axios.post(myUrl + 'nedvizhimost' , data); 
      setParsingStatus('building')
      const blob = new Blob([creatFile(response.data)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      setFile(blob)
      setParsingStatus('free')
    } catch (error) {
      console.error('Error while making POST request:', error);
      setParsingStatus('free')
      // throw error;
    }
  }



  // function handleFileChange(event) {
  //       const file = event.target.files[0];
  //       setFile(file)
  // }

  function downloadFile() {
    if (!file) return;
    const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `parsing_${new Date(Date.now()).toISOString().slice(0, 10)}_${new Date(Date.now()).toLocaleTimeString().replace(/:/g,'-')}.xlsx`);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Parsing Panel</p>
      </header>
      <main>
        <div id="parsingPanel">
          <div id="leftPanel">
            <textarea value={textarea_} onChange={(event) => {
              const data_u = userInfo_;
              data_u.searchInfo.textarea = event.target.value;
              setUserInfo_(data_u);
              setTextarea_(event.target.value)
              }} id="parsingInfoTextArea" placeholder="Введите ключевые слова сюда для Авито" className="borderZero shadow"></textarea >
            {/* { <input type="file" onChange={handleFileChange} /> } */}
            <XlsxViewer file={file} />
          </div>
          <div id="rightPanel">
            <button onClick={postData} className={`eft button borderZero Text shadow active ${'parsingStatus_'+parsingStatus}`}>Parsing</button>
            <button onClick={setUserInfo} className="left button borderZero Text shadow active">Save settings</button>
            <button onClick={downloadFile} className="left button borderZero Text shadow active">Downlad xlsx</button>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;


function creatFile(obj) {
  // Создание нового Workbook
  var workbook = XLSX.utils.book_new();
  var columnWidths = {};

  const widthList = {
    'title': 200,
    'URL': 80,
    'price': 100,
    'description': 300,
  }
  

  // Функция для вычисления ширины столбцов на основе данных
  function calculateColumnWidths(sheetData) {
    var cols = [];
  
    // Проходимся по первой строке данных для вычисления ширины столбцов
    var firstRow = sheetData[0];
    firstRow.forEach(function(cell, colIndex) {
      var cellText = String(cell); // Преобразуем значение ячейки в строку
      var cellLength = cellText.length * 8; // Предположим, что каждый символ имеет ширину около 8 пикселей
      if(widthList[cell]){
        console.log(cell)
        cols[colIndex] = { wpx: widthList[cell]}; // Устанавливаем ширину столбца в пикселях
      }else{
        cols[colIndex] = { wpx: cellLength }; // Устанавливаем ширину столбца в пикселях
      }

    });
  
    return cols;
  }

  // Создание нового листа в Workbook
  for (var sheetName in obj) {
    var sheetData = obj[sheetName];
    var sheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Вычисление ширины столбцов для текущего листа
    columnWidths[sheetName] = calculateColumnWidths(sheetData);

    // Установка максимальной ширины столбцов в 300 пикселей
    columnWidths[sheetName].forEach(function(col) {
      if (col.wpx > 300) {
        col.wpx = 300;
      }
    });

    // Установка ширины столбцов для листа
    sheet['!cols'] = columnWidths[sheetName];

    // Добавление листа в Workbook
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  // Генерация бинарных данных XLSX файла
  var xlsxFile = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return xlsxFile;
}



