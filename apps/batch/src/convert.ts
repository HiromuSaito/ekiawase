import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const xlsx = require("xlsx");

const workbook = xlsx.readFile(path.resolve(__dirname, "../stations.xlsx"));

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const jsonData = XLSX.utils.sheet_to_json(worksheet);

const outputPath = path.join(__dirname, '../output/stations.json');
fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');

console.log(`✅ JSON出力完了: ${outputPath}`);
