
type ParsingData_ = {
  'Общий отчет': Array<object>,
  'Фотографии': Array<object>
}


type ParsingData = {
    'Общий отчет': {
      'Название препарата': string,
      'URL': string,
      'Цена обычная': string,
      'Цена акционная': string,
      'Форма выпуска': string,
      'Рецептурный или безрецептурный': string,
      'МНН/Действующее вещество': string,
      'Общее описание': string,
      'Показания': string,
      'Противопоказания': string,
      'Способы применения и дозы': string,
      'Производитель': string,
      'В наличии': string,
    }[],
    'Фотографии': {
      'Название препарата': string,
      'URL': string,
      'URL сайта': string,
      'URLs фото': string[],
    }[]
  };
  

  function pushParsingData(data: {
    title?: string,
    url?: string,
    regularPrice?: string,
    promotionalPrice?: string,
    form?: string,
    prescription?: string,
    activeIngredient?: string,
    description?: string,
    indications?: string,
    contraindications?: string,
    usageAndDosage?: string,
    manufacturer?: string,
    available?: string,
    photoTitle?: string,
    photoUrl?: string,
    siteUrl?: string,
    photoUrls?: string[],
  }, obj: ParsingData_): void {
    obj['Общий отчет'].push({
      'Название препарата': data.title || 'null',
      'URL': data.url || 'null',
      'Цена обычная': data.regularPrice || 'null',
      'Цена акционная': data.promotionalPrice || 'null',
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
      'Название препарата': data.photoTitle || 'null',
        'URL': data.photoUrl || 'null',
        'URL сайта': data.siteUrl || 'null',
        'URLs фото': data.photoUrls || [],
    });
  }

  function createParsingData(): ParsingData_ {
    return {
      'Общий отчет': [],
      'Фотографии': []
    }
  }

  export {createParsingData, pushParsingData, ParsingData, ParsingData_}