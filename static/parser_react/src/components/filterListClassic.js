import React from 'react';
import './filterListClassic.css';

function FilterListClassic({ searchCategoryList, setUserInfo_, userInfo_ }) {
  return (
    <div className='searchCategoryList'>
      {searchCategoryList.map((category, index) => (
        <React.Fragment key={index}>
          <hr />
          <div className='minibar'>
            {category.list.map((button, buttonIndex) => (
              <button
                key={buttonIndex}
                onClick={() => {
                  console.log(buttonIndex);
                console.log(userInfo_)
                  // Создаем новый массив, в котором устанавливаем status в false для всех кнопок
                  const button_s = category.list.map((button_, buttonIndex_) => {
                    return { ...button_, status: false };
                  });

                  // Устанавливаем status в true только для выбранной кнопки
                  button_s[buttonIndex].status = true;

                  // Копируем объект userInfo_, чтобы избежать мутации состояния
                  const out = { ...userInfo_ };

                  // Обновляем значение в объекте userInfo_
                  out.searchInfo.Cian.searchCategoryList[index].list = button_s;

                  // Вызываем функцию setUserInfo_ для обновления состояния
                  setUserInfo_(out);
                }}
                className={`button2 marginRight borderZero Text buttonStatus_${button.status}`}>
                {button.name}
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export { FilterListClassic };
