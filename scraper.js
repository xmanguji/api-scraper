import { writeFile } from 'fs/promises';
import * as XLSX from 'xlsx';

// Configuration - customize these values
const API_URL = 'https://jsonplaceholder.typicode.com/users'; // Example API
const OUTPUT_FILENAME = 'data_export.xlsx';

async function fetchDataFromAPI(url) {
  console.log(`Fetching data from: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

function processData(data) {
  console.log(`Processing ${data.length} records...`);
  
  // You can transform or filter the data here if needed
  // This example just returns the original data
  return data;
}

async function exportToExcel(data, filename) {
  try {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Write the file
    await writeFile(filename, excelBuffer);
    
    console.log(`✅ Data successfully exported to ${filename}`);
    console.log(`Total records exported: ${data.length}`);
    
    // Display sample of the data (first 3 records)
    console.log('\nSample of exported data:');
    console.table(data.slice(0, 3));
  } catch (error) {
    console.error('Error exporting to Excel:', error.message);
    throw error;
  }
}

async function main() {
  console.log('Starting data scraping process...');
  
  try {
    // Step 1: Fetch data from API
    const rawData = await fetchDataFromAPI(API_URL);
    
    // Step 2: Process the data
    const processedData = processData(rawData);
    
    // Step 3: Export to Excel
    await exportToExcel(processedData, OUTPUT_FILENAME);
    
    console.log('\nData scraping and export completed successfully!');
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Execute the main function
main();
