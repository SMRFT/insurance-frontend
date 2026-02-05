import { useState, useEffect } from "react"
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
  ResponsiveFilterContainer,
  ResponsiveTableWrapper,
  InfoText,
  ResponsiveButton,
  StatusBadge,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

const OtherReport = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
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
  }, [records, searchTerm, selectedCompany, selectedPaymentMethod])

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

    if (selectedPaymentMethod) {
      filtered = filtered.filter((record) => record.payment_method === selectedPaymentMethod)
    }

    setFilteredRecords(filtered)
  }

  const handleCompanyFilterChange = (event) => {
    setSelectedCompany(event.target.value)
  }

  const handlePaymentMethodFilterChange = (event) => {
    setSelectedPaymentMethod(event.target.value)
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
      "IP/OP Number",
      "Patient Name",
      "Mobile Number",
      "Doctor Name",
      "Company Name",
      "Treatment",
      "Amount",
      "Payment Method",
      "Has Refund",
      "Refund Amount",
      "Status",
      "Approved By",
      "Final Approved By",
      "Refund Approved By"
    ]

    const { totalAmount, totalRefund } = calculateTotals()

    const dataRows = filteredRecords.map((record) =>
      [
        record.date || "",
        record.ip_op_type || "",
        record.patient_uhid || "",
        record.patient_name || "",
        record.mobile_number || "",
        record.doctor_name || "",
        record.company_name || "",
        record.treatment || "",
        Number.parseFloat(record.amount || 0).toFixed(2),
        record.payment_method || "",
        record.has_refund ? "Yes" : "No",
        Number.parseFloat(record.refund || 0).toFixed(2),
        record.status || "",
        record.approved_by_name || "",
        record.final_approved_by_name || "",
        record.refund_approved_by_name || ""
      ].map(field => `"${field}"`).join(",")
    )

    const grandTotalRow = [
      "", "", "", "", "", "", "GRAND TOTAL", "",
      `"${totalAmount.toFixed(2)}"`,
      "", "",
      `"${totalRefund.toFixed(2)}"`,
      "", "", "", ""
    ].join(",")

    const csvContent = [headers.join(","), ...dataRows, "", grandTotalRow].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
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
            <Label htmlFor="paymentMethod">Filter by Payment</Label>
            <Select id="paymentMethod" value={selectedPaymentMethod} onChange={handlePaymentMethodFilterChange}>
              <option value="">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
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
          <ResponsiveTableWrapper>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>IP/OP Type</TableHeader>
                  <TableHeader>IP/OP Number</TableHeader>
                  <TableHeader>Patient Name</TableHeader>
                  <TableHeader>Mobile</TableHeader>
                  <TableHeader style={{ minWidth: '150px' }}>Doctor Name</TableHeader>
                  <TableHeader>Company</TableHeader>
                  <TableHeader>Treatment</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Payment Method</TableHeader>
                  <TableHeader>Has Refund</TableHeader>
                  <TableHeader>Refund</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Approved By</TableHeader>
                  <TableHeader>Final Approved By</TableHeader>
                  <TableHeader>Refund Approved By</TableHeader>
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
                      <TableCell style={{ 
                        wordWrap: 'break-word', 
                        whiteSpace: 'normal',
                        maxWidth: '200px',
                        minWidth: '150px'
                      }}>
                        {record.doctor_name}
                      </TableCell>
                      <TableCell>{record.company_name}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
                      <TableCell>₹{Number.parseFloat(record.amount || 0).toFixed(2)}</TableCell>
                      <TableCell>{record.payment_method}</TableCell>
                      <TableCell>
                        <StatusBadge color={record.has_refund ? "#4caf50" : "#f44336"}>
                          {record.has_refund ? "Yes" : "No"}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>₹{Number.parseFloat(record.refund || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusBadge color={getStatusColor(record.status)}>
                          {record.status || "Pending"}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{record.approved_by_name || "-"}</TableCell>
                      <TableCell>{record.final_approved_by_name || "-"}</TableCell>
                      <TableCell>{record.refund_approved_by_name || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="16" style={{ textAlign: "center", padding: "20px" }}>
                      No payment records found for the selected filters
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
              {filteredRecords.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                    <TableCell colSpan="8" style={{ textAlign: "right" }}>
                      GRAND TOTAL:
                    </TableCell>
                    <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>₹{totalRefund.toFixed(2)}</TableCell>
                    <TableCell colSpan="4"></TableCell>
                  </tr>
                </tfoot>
              )}
            </Table>
          </ResponsiveTableWrapper>
        )}
      </Container>
    </ReportContainer>
  )
}

export default OtherReport