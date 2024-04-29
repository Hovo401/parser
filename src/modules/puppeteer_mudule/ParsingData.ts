import { getDomainName } from "../../utils/functions.js";
type ParsingData_ = {
  'avito': Array<object>,
  // 'Фотографии': Array<object>
}


type ParsingData = {
    'avito': {
      'title': string,
      'URL': string,
      'price': string,
      'description': string,
    }[],
    // 'Фотографии': {
    //   'Название препарата': string,
    //   'URL': string,
    //   'URL сайта': string,
    //   'URLs фото': string[],
    // }[]
  };
  

  function pushParsingData(data: {
    title?: string,
    url?: string,
    price?: string,
    description?: string,
    photoUrls?: string[]
  }, obj: ParsingData_): void {
    obj['avito']?.push({
      'title': data?.title || 'null',
      'URL': data?.url || 'null',
      'price': data?.price || 'null',
      'description': data?.description || 'null'
    });

    // obj['Фотографии'].push({
    //   'Название препарата': data?.title || 'null',
    //     'URL': data?.url || 'null',
    //     'URL сайта': getDomainName(data?.url || '') || 'null',
    //     'URLs фото': data?.photoUrls || [],
    // });
  }

  function createParsingData(): ParsingData_ {
    return {
      'avito': [],
      // 'Фотографии': []
    }
  }

  
  function transformData(data: { [key: string]: { [key: string]: string | string[] }[] }): { [key: string]: string[][] } {
    const result: { [key: string]: string[][] } = {};
  
    for (const key in data) {
      const section = data[key];
      const sectionArray: string[][] = [];
  
      // Create an array to hold the property names
      let propertyNames: string[] = [];
  
      section.forEach((item, index) => {
        const itemArray: string[] = [];
  
        // Push the property names into the array only for the first row
        if (index === 0) {
          propertyNames = Object.keys(item);
          // Push property names as the first row of the sectionArray
          sectionArray.push(propertyNames);
        }
  
        // Push values into the itemArray
        propertyNames.forEach((prop) => {
          const value = item[prop];
          if (Array.isArray(value)) {
            value.forEach((val) => itemArray.push(val));
          } else {
            itemArray.push(value as string);
          }
        });
  
        sectionArray.push(itemArray);
      });
  
      result[key] = sectionArray;
    }
  
    return result;
  }
  
  export { createParsingData, pushParsingData, ParsingData, ParsingData_, transformData };
  