"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  FormWrapper,
  FilterWrapper,
  ReportContainer,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  FilterContainer,
  Label,
  Input,
  Select,
  Button,
} from "./SharedStyledComponents"

const OtherReport = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0])
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0])

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // Fetch data when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      fetchRecords()
    }
  }, [fromDate, toDate])

  // Filter data when search parameters change
  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, selectedCompany])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Insurancebaseurl}other_records/report/`, {
        params: { 
          from_date: fromDate, 
          to_date: toDate 
        },
      })
      
      // Remove any potential duplicates based on unique combination
      const uniqueRecords = response.data.filter((record, index, self) => 
        index === self.findIndex(r => 
          r.id === record.id && 
          r.date === record.date && 
          r.amount === record.amount &&
          r.payment_method === record.payment_method
        )
      )
      
      setRecords(uniqueRecords)
    } catch (error) {
      console.error("Error fetching records:", error)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = [...records]
    
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.patient_uhid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.mobile_number?.includes(searchTerm) ||
          record.treatment?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCompany) {
      filtered = filtered.filter((record) => record.company_name === selectedCompany)
    }
    
    setFilteredRecords(filtered)
  }

  const handleCompanyFilterChange = (event) => {
    setSelectedCompany(event.target.value)
  }

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Patient Name",
      "Patient UHID",
      "Mobile Number",
      "Company Name",
      "Treatment",
      "Amount",
      "Payment Method",
      "Refund",
    ]

    const totalAmount = filteredRecords.reduce((sum, record) => sum + (Number.parseFloat(record.amount) || 0), 0)
    const totalRefund = filteredRecords.reduce((sum, record) => sum + (Number.parseFloat(record.refund) || 0), 0)

    const dataRows = filteredRecords.map((record) =>
      [
        record.date,
        record.patient_name,
        record.patient_uhid,
        record.mobile_number,
        record.company_name,
        record.treatment,
        record.amount,
        record.payment_method,
        record.refund,
      ].join(","),
    )

    const grandTotalRow = [
      "", "", "", "", "",
      "GRAND TOTAL",
      totalAmount.toFixed(2),
      "",
      totalRefund.toFixed(2),
    ].join(",")

    const csvContent = [
      headers.join(","),
      ...dataRows,
      "",
      grandTotalRow,
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `other_records_report_${fromDate}_to_${toDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <FormWrapper>
      <ReportContainer>
        <Title>Other Records Report</Title>
        <FilterContainer
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search by name, UHID, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterWrapper>
            <Label htmlFor="companyName">Filter by Company:</Label>
            <Select id="companyName" value={selectedCompany} onChange={handleCompanyFilterChange}>
              <option value="">Select Company</option>
              <option value="General Insurance">General Insurance</option>
              <option value="ECHS">ECHS</option>
              <option value="ESI">ESI</option>
              <option value="ESIC">ESIC</option>
              <option value="Railway CTSE">Railway CTSE</option>
              <option value="TKT">TKT</option>
              <option value="FCI">FCI</option>
              <option value="Airport">Airport</option>
            </Select>
          </FilterWrapper>
          <div>
            <Label>From Date</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <Label>To Date</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <Button onClick={exportToCSV} disabled={filteredRecords.length === 0}>
              Export CSV
            </Button>
          </div>
        </FilterContainer>

        <div style={{ textAlign: "center", margin: "10px 0", fontWeight: "500" }}>
          Showing {filteredRecords.length} payment record(s) from {fromDate} to {toDate}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <div style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px" }}>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Patient Name</TableHeader>
                  <TableHeader>UHID</TableHeader>
                  <TableHeader>Mobile</TableHeader>
                  <TableHeader>Company</TableHeader>
                  <TableHeader>Treatment</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Payment Method</TableHeader>
                  <TableHeader>Refund</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
                    <TableRow key={`${record.id}-${record.date}-${record.amount}-${index}`}>
                      <TableCell style={{ whiteSpace: "nowrap" }}>{record.date}</TableCell>
                      <TableCell>{record.patient_name}</TableCell>
                      <TableCell>{record.patient_uhid}</TableCell>
                      <TableCell>{record.mobile_number}</TableCell>
                      <TableCell>{record.company_name}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
                      <TableCell>₹{Number.parseFloat(record.amount || 0).toFixed(2)}</TableCell>
                      <TableCell>{record.payment_method}</TableCell>
                      <TableCell>₹{Number.parseFloat(record.refund || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                      No payment records found for the selected date range
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
              {filteredRecords.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                    <TableCell colSpan="6" style={{ textAlign: "right" }}>
                      GRAND TOTAL:
                    </TableCell>
                    <TableCell>
                      ₹{filteredRecords.reduce((sum, record) => sum + (Number.parseFloat(record.amount) || 0), 0).toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      ₹{filteredRecords.reduce((sum, record) => sum + (Number.parseFloat(record.refund) || 0), 0).toFixed(2)}
                    </TableCell>
                  </tr>
                </tfoot>
              )}
            </Table>
          </div>
        )}
      </ReportContainer>
    </FormWrapper>
  )
}

export default OtherReport