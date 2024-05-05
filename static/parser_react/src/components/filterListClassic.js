import React from 'react';
import './filterListClassic.css';

function FilterListClassic({  setUserInfo_, userInfo_, webName }) {
  const searchCategoryList = userInfo_?.searchInfo[webName]?.searchCategoryList;
  return (
    <div  className='searchCategoryList'>
      {searchCategoryList.map((category, index) => {
      if (getInitclose({fun:()=>{}, userInfo_, category, index, webName})) return <></>
        
        return (
        <React.Fragment key={index}>
          <hr />
          <div className='minibar'>
            {category.list.map((button, buttonIndex) => (
              <button
                key={buttonIndex}
                onClick={() => {
                  // Создаем новый массив, в котором устанавливаем status в false для всех кнопок
                  const button_s = category.list.map((button_, buttonIndex_) => {
                    return { ...button_, status: false };
                  });
                  
                  // Устанавливаем status в true только для выбранной кнопки
                  button_s[buttonIndex].status = true;
                  
                  // Копируем объект userInfo_, чтобы избежать мутации состояния
                  const out = structuredClone(userInfo_) ;

                  out.searchInfo[webName].searchCategoryList[index].list = button_s;
                  
                  const searchKeywords_ = getSearchKeywords({userInfo_:out,webName})
                  // Обновляем значение в объекте userInfo_
                  out.searchInfo[webName].searchKeywords = searchKeywords_;

                  clean({fun:(i)=>{
                    out.searchInfo[webName].searchKeywords[i] = 'null'
                  }, userInfo_:out, searchCategoryList, webName});
                  setUserInfo_(out);
                  // Вызываем функцию setUserInfo_ для обновления состояния
                  
                }}
                className={`button2 marginRight borderZero Text buttonStatus_${button.status}`}>
                {button.name}
              </button>
            ))}
          </div>
        </React.Fragment>
      )})}
    </div>
  );
}

export { FilterListClassic };


function getSearchKeywords({userInfo_, webName}){
  const out = [];

  userInfo_?.searchInfo[webName]?.searchCategoryList?.map((category, categoryIndex) => {
    category?.list?.map((button, buttonIndex)=>{
      if(button?.status === true && button?.name){
        out.push(button?.name);
      }
    })
  });

  return out;
}

function clean({fun, searchCategoryList, userInfo_, webName}){
  searchCategoryList.map((category, index) => {
    getInitclose({fun, userInfo_, category, index, webName});
  })
}

function getInitclose({fun, userInfo_, category, index, webName}){

  if(index > 0 && index - category?.addiction[0]?.categoryIndexToTop >= 0 && 
    category?.addiction[0]?.ActivityButtonName !== userInfo_?.searchInfo[webName]?.searchKeywords[index - category?.addiction[0]?.categoryIndexToTop] 
    && category?.addiction[0]?.ActivityButtonName
    && category?.addiction[0]?.categoryIndexToTop > 0
  ){
    fun(index)
    return true;
  }
  return false
}