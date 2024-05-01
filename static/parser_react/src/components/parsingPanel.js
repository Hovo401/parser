
function ParsingPanel ({XlsxViewer, textarea_, userInfo_, setUserInfo_, setTextarea_, file, postData, setUserInfo, downloadFile, parsingStatus}){
    return (
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
    )
}

export {ParsingPanel}