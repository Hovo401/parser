import './parsingPanel.css';
import { FilterListClassic } from './filterListClassic.js'; 


function ParsingPanel ({XlsxViewer, textarea_, userInfo_, setUserInfo_, setTextarea_, file, postData, setUserInfo, downloadFile, parsingStatus}){
    return (
        <div id="parsingPanel">
          <div id="leftPanel">
            <h5>Задача настроена на выполнение каждый день 23:00</h5>
            <h3>для Avito</h3>
            <textarea value={textarea_} onChange={(event) => {
              const data_u = userInfo_;
              data_u.searchInfo.avito.textarea = event.target.value;
              setUserInfo_(data_u);
              setTextarea_(event.target.value)
              }} id="parsingInfoTextArea" placeholder="Введите ключевые слова сюда для Авито" className="borderZero shadow"></textarea >
            {/* { <input type="file" onChange={handleFileChange} /> } */}
              <hr/>
              <br/>
              <h3>для Cian</h3>


              <FilterListClassic key={Math.random()} setUserInfo_={setUserInfo_}  userInfo_={userInfo_} webName={'Cian'} />
              <h3>для Yandex</h3>
              <FilterListClassic key={Math.random()} setUserInfo_={setUserInfo_}  userInfo_={userInfo_} webName={'Yandex'} />
            <XlsxViewer file={file} />
          </div>
          <div id="rightPanel">
            <button onClick={postData} className={`eft button borderZero Text shadow active ${'parsingStatus_'+parsingStatus}`}>Parsing</button>
            <button onClick={downloadFile} className="left button borderZero Text shadow active">Downlad xlsx</button>
            <button onClick={setUserInfo} className="left button borderZero Text shadow active">Save settings</button>
          </div>
        
        </div>
    );
}

export {ParsingPanel}

