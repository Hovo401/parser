import * as XLSX from 'xlsx';

interface SheetData {
  [key: string]: any[][];
}

interface ColumnWidthList {
  [key: string]: number;
}

function createFile(obj: SheetData): ArrayBuffer {
  // Создание нового Workbook
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  const columnWidths: { [key: string]: XLSX.ColInfo[] } = {};

  const widthList: ColumnWidthList = {
    title: 200,
    URL: 80,
    price: 100,
    description: 300,
  };

  // Функция для вычисления ширины столбцов на основе данных
  function calculateColumnWidths(sheetData: any[][]): XLSX.ColInfo[] {
    const cols: XLSX.ColInfo[] = [];

    // Проходимся по первой строке данных для вычисления ширины столбцов
    const firstRow: any[] = sheetData[0];
    firstRow.forEach((cell: any, colIndex: number) => {
      const cellText: string = String(cell); // Преобразуем значение ячейки в строку
      const cellLength: number = cellText.length * 8; // Предположим, что каждый символ имеет ширину около 8 пикселей
      if (widthList[cell]) {
        cols[colIndex] = { wpx: widthList[cell] }; // Устанавливаем ширину столбца в пикселях
      } else {
        cols[colIndex] = { wpx: cellLength }; // Устанавливаем ширину столбца в пикселях
      }
    });

    return cols;
  }

  // Создание нового листа в Workbook
  for (const sheetName in obj) {
    const sheetData: any[][] = obj[sheetName];
    const sheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Вычисление ширины столбцов для текущего листа
    columnWidths[sheetName] = calculateColumnWidths(sheetData);

    // Установка максимальной ширины столбцов в 300 пикселей
    columnWidths[sheetName].forEach((col: XLSX.ColInfo) => {
      if (col.wpx !== undefined && col.wpx > 300) {
        col.wpx = 300;
      }
    });

    // Установка ширины столбцов для листа
    sheet['!cols'] = columnWidths[sheetName];

    // Добавление листа в Workbook
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  // Генерация бинарных данных XLSX файла
  const xlsxFile: ArrayBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return xlsxFile;
}

export { createFile };
