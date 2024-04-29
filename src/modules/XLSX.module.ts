import * as XLSX from 'xlsx';

function creatFile(obj: { [key: string]: string[][] }) {
  // Создание нового Workbook
  const workbook = XLSX.utils.book_new();

  // Создание нового листа в Workbook
  for (const sheetName in obj) {
    const sheet = XLSX.utils.aoa_to_sheet(obj[sheetName]);

    // Добавление листа в Workbook
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  // Генерация бинарных данных XLSX файла
  const xlsxFile = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return xlsxFile;
}

export { creatFile };
