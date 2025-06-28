"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
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
  Button,
} from "./SharedStyledComponents"

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    border-color: #6F8B83;
    outline: none;
    box-shadow: 0 0 0 2px #6F8B8330;
  }
`

const FormControl = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    border-color: #6F8B83;
    outline: none;
    box-shadow: 0 0 0 2px #6F8B8330;
  }
`

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    border-color: #6F8B83;
    outline: none;
    box-shadow: 0 0 0 2px #6F8B8330;
  }
`

const ScrollableTableContainer = styled.div`
  max-height: 440px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #9aaea9;
  border-radius: 10px;
  background-color: #fff;
`

const OtherUpdate = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL
  const navigate = useNavigate()

  // Fetch data when filters change
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
      const params = new URLSearchParams()

      if (fromDate) {
        params.append("from_date", fromDate.toLocaleDateString("en-CA"))
      }

      if (toDate) {
        params.append("to_date", toDate.toLocaleDateString("en-CA"))
      }

      const url = `${Insurancebaseurl}other_records/?${params.toString()}`
      const response = await fetch(url)
      const data = await response.json()

      // Process the data to flatten payment details for date-wise display
      const processedRecords = []

      data.forEach((record) => {
        if (record.payment_details && Array.isArray(record.payment_details) && record.payment_details.length > 0) {
          record.payment_details.forEach((payment) => {
            processedRecords.push({
              id: record.id || record._id,
              original_id: record.id || record._id,
              date: payment.date || record.date,
              patient_name: record.patient_name,
              patient_uhid: record.patient_uhid,
              mobile_number: record.mobile_number,
              company_name: record.company_name,
              treatment: record.treatment,
              amount: payment.amount,
              payment_method: payment.payment_method,
              refund: record.refund || 0,
              originalRecord: record,
            })
          })
        }
      })

      // Remove duplicates based on unique combination
      const uniqueRecords = processedRecords.filter((record, index, self) => 
        index === self.findIndex(r => 
          r.original_id === record.original_id && 
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

    if (selectedCompany) {
      filtered = filtered.filter((record) => record.company_name === selectedCompany)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.patient_uhid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.mobile_number?.includes(searchTerm) ||
          record.treatment?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredRecords(filtered)
  }

  const handleCompanyFilterChange = (event) => {
    setSelectedCompany(event.target.value)
  }

  const handleFromDateChange = (date) => {
    setFromDate(date)
  }

  const handleToDateChange = (date) => {
    setToDate(date)
  }

  const handleEdit = (record) => {
    const originalRecord = record.originalRecord || {
      id: record.original_id || record.id,
      _id: record.original_id || record.id,
      date: record.date,
      patient_name: record.patient_name,
      patient_uhid: record.patient_uhid,
      mobile_number: record.mobile_number,
      company_name: record.company_name,
      treatment: record.treatment,
      refund: record.refund,
    }

    navigate("/OtherForm", {
      state: originalRecord,
    })
  }

  return (
    <FormWrapper>
      <ReportContainer>
        <Title>Other Records Update</Title>
        <FilterContainer
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <Label>Search</Label>
            <SearchInput
              type="text"
              placeholder="Search by name, UHID, mobile, treatment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterWrapper>
            <Label htmlFor="companyName">Filter by Company:</Label>
            <FormControl id="companyName" value={selectedCompany} onChange={handleCompanyFilterChange}>
              <option value="">Select Company</option>
              <option value="General Insurance">General Insurance</option>
              <option value="ECHS">ECHS</option>
              <option value="ESI">ESI</option>
              <option value="ESIC">ESIC</option>
              <option value="Railway CTSE">Railway CTSE</option>
              <option value="TKT">TKT</option>
              <option value="FCI">FCI</option>
              <option value="Airport">Airport</option>
            </FormControl>
          </FilterWrapper>
          <div>
            <Label>From Date</Label>
            <StyledDatePicker
              selected={fromDate}
              onChange={handleFromDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select from date"
              isClearable
            />
          </div>
          <div>
            <Label>To Date</Label>
            <StyledDatePicker
              selected={toDate}
              onChange={handleToDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select to date"
              isClearable
              minDate={fromDate}
            />
          </div>
          <div>
            <Button onClick={() => navigate("/OtherForm")}>Add New Record</Button>
          </div>
        </FilterContainer>

        <div style={{ textAlign: "center", margin: "10px 0", fontWeight: "500" }}>
          Showing {filteredRecords.length} payment record(s)
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <ScrollableTableContainer>
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
                  <TableHeader>Action</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
                    <TableRow key={`${record.original_id}-${record.date}-${record.amount}-${index}`}>
                      <TableCell style={{ whiteSpace: "nowrap" }}>{record.date}</TableCell>
                      <TableCell>{record.patient_name}</TableCell>
                      <TableCell>{record.patient_uhid}</TableCell>
                      <TableCell>{record.mobile_number}</TableCell>
                      <TableCell>{record.company_name}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
                      <TableCell>₹{Number.parseFloat(record.amount || 0).toFixed(2)}</TableCell>
                      <TableCell>{record.payment_method}</TableCell>
                      <TableCell>₹{Number.parseFloat(record.refund || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(record)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                      No records found matching the current filters
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
                    <TableCell></TableCell>
                  </tr>
                </tfoot>
              )}
            </Table>
          </ScrollableTableContainer>
        )}
      </ReportContainer>
    </FormWrapper>
  )
}

export default OtherUpdate