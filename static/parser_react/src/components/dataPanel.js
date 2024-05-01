import './dataPanel.css';

function dataPanel ({XlsxViewer, textarea_, userInfo_, setUserInfo_, setTextarea_, file, postData, setUserInfo, downloadFile, parsingStatus}){
    return (
        <div id="parsingPanel">
          <div id="leftPanel">
            {itemXLSX()}
          </div>
          <div id="rightPanel">
            {/* <button onClick={postData} className={`eft button borderZero Text shadow active ${'parsingStatus_'+parsingStatus}`}>Parsing</button>
            <button onClick={setUserInfo} className="left button borderZero Text shadow active">Save suka settings</button>
            <button onClick={downloadFile} className="left button borderZero Text shadow active">Downlad xlsx</button> */}
          </div>
        </div>
    )
}

export {dataPanel}

function itemXLSX(){
  return(
    <div className='itemXLSX'> 
      <h4>file name random text add .xlsx</h4>
      <button  className="left button borderZero Text active">Downlad xlsx</button>
    </div>
  )
}