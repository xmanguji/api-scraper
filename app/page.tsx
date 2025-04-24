"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Download, ExternalLink, Loader2, Database, Code } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchDataFromUrl, exportToExcel } from "@/lib/data-utils"
import { AnimatedBackground } from "@/components/animated-background"
import { WebScraperAnimation } from "@/components/web-scraper-animation"
import { ApiExamples } from "@/components/api-examples"
import { Logo } from "@/components/logo"

type DataItem = Record<string, any>

export default function WebScraperUI() {
  const [url, setUrl] = useState("")
  const [data, setData] = useState<DataItem[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("table")

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  const handleFetchData = async () => {
    if (!url) {
      setError("Please enter a valid URL")
      return
    }

    setIsFetching(true)
    setError(null)

    try {
      const result = await fetchDataFromUrl(url)
      setData(Array.isArray(result) ? result : [result])
      if (Array.isArray(result) && result.length > 0) {
        setActiveTab("table")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      setData([])
    } finally {
      setIsFetching(false)
    }
  }

  const handleExport = async () => {
    if (data.length === 0) {
      setError("No data to export")
      return
    }

    try {
      setIsExporting(true)
      // Get the Excel file as base64 string from the server action
      const result = await exportToExcel(data)

      if (!result.success) {
        throw new Error(result.error || "Export failed")
      }

      const excelBase64 = result.data

      // Convert base64 to Blob
      const byteCharacters = atob(excelBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

      // Create download link and trigger download
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "scraped_data.xlsx"
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  // Get keys for table headers and chart data
  const keys =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => typeof data[0][key] !== "object" && data[0][key] !== null)
      : []

  // Prepare chart data - use numeric values for the chart
  const chartData = data.map((item, index) => {
    const chartItem: Record<string, any> = { name: `Item ${index + 1}` }

    // Add numeric properties for the chart
    Object.entries(item).forEach(([key, value]) => {
      if (typeof value === "number") {
        chartItem[key] = value
      }
    })

    return chartItem
  })

  // Get numeric keys for the chart
  const numericKeys = data.length > 0 ? Object.keys(data[0]).filter((key) => typeof data[0][key] === "number") : []

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto py-10 space-y-8 px-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center space-y-2"
        >
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Web Data Scraper
          </h2>
          <p className="text-gray-400">Enter a URL to fetch, visualize, and export data</p>
        </motion.div>

        {/* Web Scraper Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <WebScraperAnimation />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-0 bg-gray-900/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                Data Source
              </CardTitle>
              <CardDescription>Enter the API or website URL to fetch data from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      placeholder="https://api.example.com/data"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                    <Button
                      onClick={handleFetchData}
                      disabled={isFetching}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Fetching
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Fetch Data
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* API Examples with horizontal scroll */}
                <ApiExamples onSelectUrl={setUrl} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 bg-gray-900/70 backdrop-blur-sm shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-purple-500" />
                      Data Visualization
                    </CardTitle>
                    <CardDescription>View and analyze the fetched data</CardDescription>
                  </div>
                  <Button
                    onClick={handleExport}
                    className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export to Excel
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-800">
                      <TabsTrigger
                        value="table"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        Table View
                      </TabsTrigger>
                      <TabsTrigger
                        value="chart"
                        disabled={numericKeys.length === 0}
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        Chart View
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="table" className="mt-4">
                      <div className="rounded-md border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader className="bg-gray-800">
                              <TableRow>
                                {keys.map((key) => (
                                  <TableHead key={key} className="text-gray-300">
                                    {key}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.map((item, rowIndex) => (
                                <TableRow key={rowIndex} className="border-gray-700 hover:bg-gray-800/50">
                                  {keys.map((key) => (
                                    <TableCell key={`${rowIndex}-${key}`} className="text-gray-300">
                                      {typeof item[key] === "object" ? JSON.stringify(item[key]) : String(item[key])}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="chart" className="mt-4">
                      {numericKeys.length > 0 ? (
                        <div className="h-[400px] w-full bg-gray-800/50 p-4 rounded-lg">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                              <XAxis dataKey="name" stroke="#aaa" />
                              <YAxis stroke="#aaa" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1f2937",
                                  borderColor: "#374151",
                                  color: "#f9fafb",
                                }}
                              />
                              {numericKeys.slice(0, 5).map((key, index) => {
                                const colors = [
                                  "#8b5cf6", // purple
                                  "#06b6d4", // cyan
                                  "#ec4899", // pink
                                  "#10b981", // emerald
                                  "#f59e0b", // amber
                                ]
                                return (
                                  <Bar
                                    key={key}
                                    dataKey={key}
                                    fill={colors[index % colors.length]}
                                    radius={[4, 4, 0, 0]}
                                  />
                                )
                              })}
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400 bg-gray-800/30 rounded-lg">
                          No numeric data available for chart visualization
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-400">
                    Showing {data.length} records.{" "}
                    {numericKeys.length > 0
                      ? `${numericKeys.length} numeric fields available for charting.`
                      : "No numeric fields available for charting."}
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
