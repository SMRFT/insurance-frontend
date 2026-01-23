"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
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
  Container,
  FormContainer,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

// Responsive Styled Components
const ResponsiveFilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`

const ResponsiveTableWrapper = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    max-height: 400px;
    border-radius: 4px;
  }
`

const MobileCard = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`

const MobileCardLabel = styled.span`
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
`

const MobileCardValue = styled.span`
  color: #333;
  font-size: 0.9rem;
  text-align: right;
  max-width: 60%;

  white-space: nowrap;   /* keep in one line */
  flex-shrink: 0;        /* 🔥 IMPORTANT */
`


const DesktopTable = styled.div`
  display: block;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const MobileCardContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  background-color: ${props => props.color};
  color: white;
  white-space: nowrap; 
`

const InfoText = styled.div`
  text-align: center;
  margin: 10px 0;
  font-weight: 500;
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0 10px;
  }
`

const ResponsiveButton = styled(Button)`
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
    font-size: 0.95rem;
  }
`

const OtherReport = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0])
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0])

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => {
    if (fromDate && toDate) {
      fetchRecords()
    }
  }, [fromDate, toDate])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, selectedCompany])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const url = `${Insurancebaseurl}other_records/report/`
      const response = await apiRequest(url, "GET", null, {}, { params: { from_date: fromDate, to_date: toDate } })

      if (response.success) {
        const uniqueRecords = response.data.filter(
          (record, index, self) =>
            index ===
            self.findIndex(
              (r) =>
                r.id === record.id &&
                r.date === record.date &&
                r.amount === record.amount &&
                r.payment_method === record.payment_method,
            ),
        )
        setRecords(uniqueRecords)
      } else {
        setRecords([])
        console.error("Error fetching records:", response.error || response.data)
      }
    } catch (error) {
      setRecords([])
      console.error("Error fetching records:", error)
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
          record.treatment?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const calculateTotals = () => {
    const totalAmount = filteredRecords.reduce((sum, record) => sum + (Number.parseFloat(record.amount) || 0), 0)

    const uniquePatients = new Map()
    filteredRecords.forEach((record) => {
      if (record.patient_uhid && !uniquePatients.has(record.patient_uhid)) {
        uniquePatients.set(record.patient_uhid, Number.parseFloat(record.refund) || 0)
      }
    })

    const totalRefund = Array.from(uniquePatients.values()).reduce((sum, refund) => sum + refund, 0)

    return { totalAmount, totalRefund }
  }

  const exportToCSV = () => {
    const headers = [
      "Date",
      "IP/OP Type",
      "Patient Name",
      "Mobile Number",
      "Doctor Name",
      "Company Name",
      "Treatment",
      "Amount",
      "Payment Method",
      "Refund",
      "Status",
    ]

    const { totalAmount, totalRefund } = calculateTotals()

    const dataRows = filteredRecords.map((record) =>
      [
        record.date,
        record.ip_op_type,
        record.patient_uhid,
        record.patient_name,
        record.mobile_number,
        record.doctor_name,
        record.company_name,
        record.treatment,
        record.amount,
        record.payment_method,
        record.refund,
        record.status,
      ].join(","),
    )

    const grandTotalRow = ["", "", "", "", "", "GRAND TOTAL", totalAmount.toFixed(2), "", totalRefund.toFixed(2), ""].join(",")

    const csvContent = [headers.join(","), ...dataRows, "", grandTotalRow].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `other_records_report_${fromDate}_to_${toDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending": return "#f44336"
      case "Approved": return "#2196f3"
      case "Collected": return "#ff9800"
      case "Gate Pass Issued": return "#4caf50"
      default: return "#666"
    }
  }

  const { totalAmount, totalRefund } = calculateTotals()

  return (
    <ReportContainer>
      <Container>
        <Title>Other Records Report - All Status</Title>
        
        <ResponsiveFilterContainer>
          <div>
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search by name, UHID, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="companyName">Filter by Company</Label>
            <Select id="companyName" value={selectedCompany} onChange={handleCompanyFilterChange}>
              <option value="">All Companies</option>
              <option value="General Insurance">General Insurance</option>
              <option value="ECHS">ECHS</option>
              <option value="ESI">ESI</option>
              <option value="ESIC">ESIC</option>
              <option value="Railway CTSE">Railway CTSE</option>
              <option value="TKT">TKT</option>
              <option value="FCI">FCI</option>
              <option value="Airport">Airport</option>
            </Select>
          </div>
          
          <div>
            <Label>From Date</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          
          <div>
            <Label>To Date</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          
          <div>
            <Label style={{ visibility: 'hidden' }}>Export</Label>
            <ResponsiveButton onClick={exportToCSV} disabled={filteredRecords.length === 0}>
              Export CSV
            </ResponsiveButton>
          </div>
        </ResponsiveFilterContainer>

        <InfoText>
          Showing {filteredRecords.length} payment record(s) from {fromDate} to {toDate}
        </InfoText>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <DesktopTable>
              <ResponsiveTableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>Date</TableHeader>
                      <TableHeader>IP/OP Type</TableHeader>
                      <TableHeader>IP/OP Number</TableHeader>
                      <TableHeader>Patient Name</TableHeader>
                      <TableHeader>Mobile</TableHeader>
                      <TableHeader>Doctor Name</TableHeader>
                      <TableHeader>Company</TableHeader>
                      <TableHeader>Treatment</TableHeader>
                      <TableHeader>Amount</TableHeader>
                      <TableHeader>Payment Method</TableHeader>
                      <TableHeader>Refundable</TableHeader>
                      <TableHeader>Refund</TableHeader>
                      <TableHeader>Status</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record, index) => (
                        <TableRow key={`${record.id}-${record.date}-${record.amount}-${index}`}>
                          <TableCell style={{ whiteSpace: "nowrap" }}>{record.date}</TableCell>
                          <TableCell>{record.ip_op_type}</TableCell>
                          <TableCell>{record.patient_uhid}</TableCell>
                          <TableCell>{record.patient_name}</TableCell>
                          <TableCell>{record.mobile_number}</TableCell>
                          <TableCell>{record.doctor_name}</TableCell>
                          <TableCell>{record.company_name}</TableCell>
                          <TableCell>{record.treatment}</TableCell>
                          <TableCell>₹{Number.parseFloat(record.amount || 0).toFixed(2)}</TableCell>
                          <TableCell>{record.payment_method}</TableCell>
                          <TableCell>
                            <StatusBadge color={record.has_refund ? "green" : "red"}>
                              {record.has_refund ? "Yes" : "No"}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>₹{Number.parseFloat(record.refund || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <StatusBadge color={getStatusColor(record.status)}>
                              {record.status}
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
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
                        <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>₹{totalRefund.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </tr>
                    </tfoot>
                  )}
                </Table>
              </ResponsiveTableWrapper>
            </DesktopTable>

            {/* Mobile Card View */}
            <MobileCardContainer>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <MobileCard key={`${record.id}-${record.date}-${record.amount}-${index}`}>
                    <MobileCardRow>
                      <MobileCardLabel>Date:</MobileCardLabel>
                      <MobileCardValue>{record.date}</MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>Patient:</MobileCardLabel>
                      <MobileCardValue>{record.patient_name}</MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>UHID:</MobileCardLabel>
                      <MobileCardValue>{record.patient_uhid}</MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>Mobile:</MobileCardLabel>
                      <MobileCardValue>{record.mobile_number}</MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>Company:</MobileCardLabel>
                      <MobileCardValue>{record.company_name}</MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>Treatment:</MobileCardLabel>
                      <MobileCardValue>{record.treatment}</MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>Amount:</MobileCardLabel>
                      <MobileCardValue style={{ fontWeight: '600', color: '#2196f3' }}>
                        ₹{Number.parseFloat(record.amount || 0).toFixed(2)}
                      </MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>Payment:</MobileCardLabel>
                      <MobileCardValue>{record.payment_method}</MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>Refund:</MobileCardLabel>
                      <MobileCardValue style={{ fontWeight: '600', color: '#ff9800' }}>
                        ₹{Number.parseFloat(record.refund || 0).toFixed(2)}
                      </MobileCardValue>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>Status:</MobileCardLabel>
                      <MobileCardValue>
                        <StatusBadge color={getStatusColor(record.status)}>
                          {record.status}
                        </StatusBadge>
                      </MobileCardValue>
                    </MobileCardRow>
                  </MobileCard>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                  No payment records found for the selected date range
                </div>
              )}
            </MobileCardContainer>
          </>
        )}
      </Container>
    </ReportContainer>
  )
}

export default OtherReport