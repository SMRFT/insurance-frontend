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
  SearchWrapper,
  ScrollableTableContainer,
  StyledDatePicker,
  Container,
  ResponsiveTableWrapper,
  StatusBadge,
  InfoText,
} from "./SharedStyledComponents"

import apiRequest from "./ApiRequest"
import styled from 'styled-components'

const DatePickerWrapper = styled(FilterWrapper)`
  position: relative;
  z-index: 100;
  .react-datepicker-popper { z-index: 9999 !important; }
  .react-datepicker { z-index: 9999 !important; }
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

  useEffect(() => { fetchRecords() }, [fromDate, toDate])
  useEffect(() => { filterRecords() }, [records, searchTerm, selectedCompany])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const url = `${Insurancebaseurl}other_records/collected_finalapproved/`
      const response = await apiRequest(url, "GET", null, {}, {
        params: {
          from_date: fromDate.toLocaleDateString("en-CA"),
          to_date: toDate.toLocaleDateString("en-CA"),
        }
      })

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
          created_by_name: record.created_by_name || "",
          approved_by_name: record.approved_by_name || "",
          final_approved_by_name: record.final_approved_by_name || "",
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

  const handleFromDateChange = (date) => setFromDate(date)
  const handleToDateChange  = (date) => setToDate(date)
  const handleCompanyFilterChange = (e) => setSelectedCompany(e.target.value)

  const filterRecords = () => {
    let filtered = [...records]
    if (selectedCompany) filtered = filtered.filter(r => r.company_name === selectedCompany)
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patient_uhid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.mobile_number?.includes(searchTerm) ||
        r.treatment?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredRecords(filtered)
  }

  const handleIssueGatePass = async (record) => {
    try {
      const updatePayload = { id: record.original_id || record.id, status: "Gate Pass Issued" }
      const response = await apiRequest(`${Insurancebaseurl}other_records/`, "PUT", updatePayload)
      if (response.success || response.status === 200) {
        setIssuedRecords(prev => new Set([...prev, record.original_id || record.id]))
        setTimeout(() => fetchRecords(), 500)
      }
    } catch (error) {
      console.error("Error issuing gate pass:", error)
    }
  }

  const totalAmount = filteredRecords.reduce((sum, r) => sum + (Number.parseFloat(r.amount) || 0), 0)
  const totalRefund  = filteredRecords.reduce((sum, r) => sum + (Number.parseFloat(r.refund)  || 0), 0)

  return (
    <ReportContainer>
      <Container>
        <Title>Other Records - Issue Gate Pass</Title>

        <FilterContainer>
          <SearchWrapper>
            <Label>Search</Label>
            <SearchInput
              type="text"
              placeholder="Search by name, UHID, mobile, treatment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>

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
                modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
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
                modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
              }}
              popperClassName="date-picker-popper"
            />
          </DatePickerWrapper>
        </FilterContainer>

        <InfoText>
          Showing {filteredRecords.length} collected payment record(s) from {fromDate.toLocaleDateString("en-CA")} to {toDate.toLocaleDateString("en-CA")}
        </InfoText>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <ResponsiveTableWrapper>
            <ScrollableTableContainer>
              <Table className="frozen-columns-table">
                <thead>
                  <tr>
                    <TableHeader className="frozen-col frozen-col-1">Date</TableHeader>
                    <TableHeader className="frozen-col frozen-col-2">Patient Name</TableHeader>
                    <TableHeader className="frozen-col frozen-col-3">UHID</TableHeader>
                    <TableHeader>Mobile</TableHeader>
                    <TableHeader>Company</TableHeader>
                    <TableHeader>Treatment</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader>Payment Method</TableHeader>
                    <TableHeader>Refund</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Created By</TableHeader>
                    <TableHeader>Approved By</TableHeader>
                    <TableHeader>Final Approved By</TableHeader>
                    <TableHeader>Action</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record, index) => {
                      const isIssued = issuedRecords.has(record.original_id || record.id)
                      return (
                        <TableRow key={`${record.original_id}-${record.date}-${record.amount}-${index}`}>
                          <TableCell className="frozen-col frozen-col-1" style={{ whiteSpace: "nowrap" }}>{record.date}</TableCell>
                          <TableCell className="frozen-col frozen-col-2">{record.patient_name}</TableCell>
                          <TableCell className="frozen-col frozen-col-3">{record.patient_uhid}</TableCell>
                          <TableCell>{record.mobile_number}</TableCell>
                          <TableCell>{record.company_name}</TableCell>
                          <TableCell>{record.treatment}</TableCell>
                          <TableCell>₹{Number.parseFloat(record.amount || 0).toFixed(2)}</TableCell>
                          <TableCell>{record.payment_method}</TableCell>
                          <TableCell>₹{Number.parseFloat(record.refund || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <StatusBadge color="#4caf50">Final Approved</StatusBadge>
                          </TableCell>
                          <TableCell>{record.created_by_name || "-"}</TableCell>
                          <TableCell>{record.approved_by_name || "-"}</TableCell>
                          <TableCell style={{ fontWeight: "600", color: "#4caf50" }}>
                            {record.final_approved_by_name || "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleIssueGatePass(record)}
                              disabled={isIssued}
                              style={{
                                backgroundColor: isIssued ? "#ccc" : "#4caf50",
                                cursor: isIssued ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {isIssued ? "✓ Issued" : "Issue Gate Pass"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan="14" style={{ textAlign: "center", padding: "20px" }}>
                        No collected records found matching the current filters
                      </TableCell>
                    </TableRow>
                  )}
                </tbody>
                {filteredRecords.length > 0 && (
                  <tfoot>
                    <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                      <TableCell className="frozen-col frozen-col-1" colSpan="3" style={{ textAlign: "right" }}>
                        GRAND TOTAL:
                      </TableCell>
                      <TableCell colSpan="3"></TableCell>
                      <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>₹{totalRefund.toFixed(2)}</TableCell>
                      <TableCell colSpan="5"></TableCell>
                    </tr>
                  </tfoot>
                )}
              </Table>
            </ScrollableTableContainer>
          </ResponsiveTableWrapper>
        )}

        <style jsx global>{`
          .frozen-columns-table { position: relative; }

          .frozen-col {
            position: sticky !important;
            background-color: white;
            z-index: 10;
          }

          .frozen-col-1 { left: 0px;   min-width: 110px; }
          .frozen-col-2 { left: 110px; min-width: 150px; }
          .frozen-col-3 {
            left: 260px;
            min-width: 120px;
            border-right: 2px solid #ddd;
          }

          .frozen-col-3::after {
            content: '';
            position: absolute;
            top: 0; right: -10px; bottom: 0;
            width: 10px;
            background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
            pointer-events: none;
          }

          thead tr th {
            position: sticky !important;
            top: 0;
            z-index: 11;
          }

          thead .frozen-col {
            background-color: #6F8B83;
            position: sticky !important;
            top: 0;
            z-index: 20 !important;
          }

          tfoot .frozen-col { background-color: #f8f9fa; }

          tbody tr:hover .frozen-col { background-color: #f5f5f5; }

          .date-picker-popper        { z-index: 9999 !important; }
          .react-datepicker-popper   { z-index: 9999 !important; }
          .react-datepicker          { z-index: 9999 !important; }
        `}</style>
      </Container>
    </ReportContainer>
  )
}

export default OtherGatePass