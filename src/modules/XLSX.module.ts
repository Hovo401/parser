import * as XLSX from 'xlsx';

function creatFile(){
        // Создание нового Workbook
        const workbook = XLSX.utils.book_new();

        // Создание нового листа в Workbook
        const sheet = XLSX.utils.aoa_to_sheet([
          ['Name', 'Age'],
          ['John', 30],
          ['Doe', 25],
          ['Jane', 28],
        ]);
    
        // Добавление листа в Workbook
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    
        // Генерация бинарных данных XLSX файла
        const xlsxFile = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        return xlsxFile;
}

export {creatFile}