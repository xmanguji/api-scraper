"use server"

import * as XLSX from "xlsx"

export async function fetchDataFromUrl(url: string) {
  try {
    // Validate URL
    new URL(url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // Don't cache the response
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
    }

    // Try to parse as JSON
    try {
      return await response.json()
    } catch (e) {
      // If not JSON, return text
      const text = await response.text()
      throw new Error("The URL did not return valid JSON data")
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Invalid URL")) {
        throw new Error("Please enter a valid URL")
      }
      throw error
    }
    throw new Error("An unknown error occurred")
  }
}

export async function exportToExcel(data: any[]) {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

    // Generate Excel file as base64 string
    const excelBuffer = XLSX.write(workbook, { type: "base64", bookType: "xlsx" })

    // Return the base64 string for client-side download
    return { success: true, data: excelBuffer }
  } catch (error) {
    console.error("Error exporting to Excel:", error)
    return { success: false, error: "Failed to export data to Excel" }
  }
}
