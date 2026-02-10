"use client"

import { useEffect, useState } from "react"
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
  FormControl,
  SearchInput,
  ScrollableTableContainer,
  StyledDatePicker,
  Container,
  ResponsiveTableWrapper,
} from "./SharedStyledComponents"

import apiRequest from "./ApiRequest"
import styled from 'styled-components'

// Override wrapper to ensure proper z-index for datepickers
const DatePickerWrapper = styled.div`
  position: relative;
  z-index: 100;
  
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
  
  .react-datepicker {
    z-index: 9999 !important;
  }
`

const OtherGatePass = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [issuedRecords, setIssuedRecords] = useState(new Set())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL
  const navigate = useNavigate()

  // Fetch data when filters change
  useEffect(() => {
    fetchRecords()
  }, [ fromDate, toDate, ])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, selectedCompany])

  const fetchRecords = async () => {
    setLoading(true)
    try {

      const url = `${Insurancebaseurl}other_records/collected_finalapproved/` 

      const response = await apiRequest(url, "GET", null, {}, { params: { from_date: fromDate.toLocaleDateString("en-CA"), to_date: toDate.toLocaleDateString("en-CA") } })

      if (response.success && Array.isArray(response.data)) {
        const processedRecords = response.data.map((record) => ({
          id: record.id,
          original_id: record.id,
          date: record.date,
          patient_name: record.patient_name,
          patient_uhid: record.patient_uhid,
          mobile_number: record.mobile_number,
          company_name: record.company_name,
          treatment: record.treatment,
          amount: record.amount,
          payment_method: record.payment_method,
          refund: record.refund || 0,
          status: record.status || "Final Approved",
          originalRecord: record,
        }))

        setRecords(processedRecords)
      } else {
        setRecords([])
      }
    } catch (error) {
      setRecords([])
      console.error("Error fetching records:", error)
    } finally {
      setLoading(false)
    }
  }


    const handleFromDateChange = (date) => {
    setFromDate(date)
  }

  const handleToDateChange = (date) => {
    setToDate(date)
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

  const handleIssueGatePass = async (record) => {
    try {
      const updatePayload = {
        id: record.original_id || record.id,
        status: "Gate Pass Issued",
      }

      const response = await apiRequest(`${Insurancebaseurl}other_records/`, "PUT", updatePayload)

      if (response.success || response.status === 200) {
        setIssuedRecords((prev) => new Set([...prev, record.original_id || record.id]))
        setTimeout(() => fetchRecords(), 500)
      }
    } catch (error) {
      console.error("Error issuing gate pass:", error)
    }
  }

  return (
    <ReportContainer>
      <Container>
        <Title>Other Records - Issue Gate Pass</Title>
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
          <DatePickerWrapper>
            <Label>From Date:</Label>
            <StyledDatePicker 
              selected={fromDate}
              onChange={handleFromDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select from date"
              popperProps={{
                strategy: "fixed",
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10],
                    },
                  },
                ],
              }}
              popperClassName="date-picker-popper"
            />
          </DatePickerWrapper>
          <DatePickerWrapper>
            <Label>To Date:</Label>
            <StyledDatePicker 
              selected={toDate}
              onChange={handleToDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select to date"
              minDate={fromDate}
              popperProps={{
                strategy: "fixed",
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10],
                    },
                  },
                ],
              }}
              popperClassName="date-picker-popper"
            />
          </DatePickerWrapper>
        </FilterContainer>

        <div style={{ textAlign: "center", margin: "10px 0", fontWeight: "500" }}>
          Showing {filteredRecords.length} collected payment record(s)
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <ResponsiveTableWrapper>
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
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Action</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => {
                    const isIssued = issuedRecords.has(record.original_id || record.id)
                    return (
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
                        <TableCell style={{ fontWeight: "600", color: "#4e814f" }}>Final Approved</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleIssueGatePass(record)}
                            disabled={isIssued}
                            style={{
                              backgroundColor: isIssued ? "#ccc" : "#4caf50",
                              cursor: isIssued ? "not-allowed" : "pointer",
                            }}
                          >
                            {isIssued ? "✓ Gate Pass Issued" : "Issue Gate Pass"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                      No collected records found matching the current filters
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
                      ₹
                      {filteredRecords
                        .reduce((sum, record) => sum + (Number.parseFloat(record.amount) || 0), 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </tr>
                </tfoot>
              )}
            </Table>
          </ScrollableTableContainer>
          </ResponsiveTableWrapper>
        )}
      </Container>
    </ReportContainer>
  )
}

export default OtherGatePass