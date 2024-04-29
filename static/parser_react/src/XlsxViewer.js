import './XlsxViewer.css';
import React, { useState,useEffect } from 'react';
import * as XLSX from 'xlsx';


function XlsxViewer({file}) {
  const [xlsxData, setXlsxData] = useState(null);
  const [currentSheet, setCurrentSheet] = useState(0);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);

  useEffect(() => {
      if (file) {
          handleFileChange(file);
      }
  }, [file]);

  const handleFileChange = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const names = wb.SheetNames;

          setWorkbook(wb);
          setSheetNames(names);
          setCurrentSheet(0);

          const sheet = wb.Sheets[names[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const html = renderExcelData(jsonData);

          setXlsxData(html);
      };

      reader.readAsArrayBuffer(file);
  }; 
  
    const renderExcelData = (data) => {
        return (
            <table className="excel-table">
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ backgroundColor: getRowColor(rowIndex) }}>
                            {row.map((cell, cellIndex) => 
                                <td key={cellIndex}>
                                  <div className='maxHeight'>
                                    {findLinksAndWrapInAnchorTags(cell)}
                                  </div>
                              </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const getRowColor = (rowIndex) => {
        return rowIndex % 2 === 0 ? '#333' : '#555';
    };

    const handleSheetChange = (index) => {
        setCurrentSheet(index);

        const sheet = workbook.Sheets[sheetNames[index]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const html = renderExcelData(jsonData);

        setXlsxData(html);
    };

    return (
        <div className="XlsxViewer">
            <h1>XLSX Viewer</h1>
            {/* <input type="file" onChange={handleFileChange} /> */}
            <SheetSwitcher
                sheetNames={sheetNames}
                currentSheet={currentSheet}
                onSheetChange={handleSheetChange}
            />
            <div id='xlsxWiewer_data'>
                {xlsxData}
            </div>
        </div>
    );
}

function SheetSwitcher({ sheetNames, currentSheet, onSheetChange }) {
    return (
        <div className="sheet-switcher">
            {sheetNames.map((name, index) => (
                <button
                    key={index}
                    onClick={() => onSheetChange(index)}
                    className={index === currentSheet ? 'open_page xlsx_button' : 'close_page xlsx_button'}
                >
                    {name}
                </button>
            ))}
        </div>
    );
}

export default XlsxViewer;




function findLinksAndWrapInAnchorTags(text) {
    // Регулярное выражение для поиска ссылок
    var regex = /(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*\b/g;
    // Заменяем найденные ссылки на ссылки, обернутые в теги <a>

    var replacedText = text.replace(regex, function(match) {
        return `<a href="#" onclick="window.open('${match}')" className="a">${match}</a>`;
    });
    // Возвращаем текст с обернутыми в теги <a> ссылками
    return <TextToHtml text={replacedText} />;
}

function TextToHtml({ text }) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
}