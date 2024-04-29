import { getDomainName } from '../../utils/functions.js';

type ParsingData_ = {
  'Общий отчет': Array<object>;
  Фотографии: Array<object>;
};

type ParsingData = {
  'Общий отчет': {
    'Название препарата': string;
    'URL': string;
    'Цена обычная': string;
    // 'Цена акционная': string;
    'Форма выпуска': string;
    'Рецептурный или безрецептурный': string;
    'МНН/Действующее вещество': string;
    'Общее описание': string;
    'Показания': string;
    'Противопоказания': string;
    'Способы применения и дозы': string;
    'Производитель': string;
    'В наличии': string;
  }[];
  'Фотографии': {
    'Название препарата': string;
    'URL': string;
    'URL сайта': string;
    'URLs фото': string[];
  }[];
};

function pushParsingData(
  data: {
    title?: string;
    url?: string;
    regularPrice?: string;
    // promotionalPrice?: string;
    form?: string;
    prescription?: string;
    activeIngredient?: string;
    description?: string;
    indications?: string;
    contraindications?: string;
    usageAndDosage?: string;
    manufacturer?: string;
    available?: string;
    photoTitle?: string;
    photoUrl?: string;
    siteUrl?: string;
    photoUrls?: string[];
  },
  obj: ParsingData_,
): void {
  obj['Общий отчет'].push({
    'Название препарата': data.title || 'null',
    'URL': data.url || 'null',
    'Цена обычная': data.regularPrice || 'null',
    // 'Цена акционная': data.promotionalPrice || 'null',
    'Форма выпуска': data.form || 'null',
    'Рецептурный или безрецептурный': data.prescription || 'null',
    'МНН/Действующее вещество': data.activeIngredient || 'null',
    'Общее описание': data.description || 'null',
    'Показания': data.indications || 'null',
    'Противопоказания': data.contraindications || 'null',
    'Способы применения и дозы': data.usageAndDosage || 'null',
    'Производитель': data.manufacturer || 'null',
    'В наличии': data.available || 'null',
  });

  obj['Фотографии'].push({
    'Название препарата': data.title || 'null',
    'URL': getDomainName(data.url || '') || 'null',
    'URL сайта': data.url || 'null',
    'URLs фото': data.photoUrls || [],
  });
}

function createParsingData(): ParsingData_ {
  return {
    'Общий отчет': [],
    Фотографии: [],
  };
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
