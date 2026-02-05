import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FormWrapper,
  ReportContainer,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Label,
  Button,
  Container,
  Input,
  Select,
  ResponsiveFilterContainer,
  ResponsiveTableWrapper,
  StatusSelect,
  ActionCell,
  InfoText,
  ResponsiveButton,
  ButtonGroup,
  EditButton,
} from "./SharedStyledComponents"

import apiRequest from "./ApiRequest"
import toast, { Toaster } from 'react-hot-toast'

const OtherUpdate = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0])
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0])

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL
  const navigate = useNavigate()

  const STATUS_OPTIONS = ["Pending", "Approved", "Collected", "Gate Pass Issued"]

  useEffect(() => {
    if (fromDate && toDate) {
      fetchRecords()
    }
  }, [fromDate, toDate])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, selectedCompany, selectedStatus])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const params = {
        from_date: fromDate,
        to_date: toDate
      }

      const url = `${Insurancebaseurl}other_records/`
      const response = await apiRequest(url, "GET", null, {}, { params })

      if (response.success && Array.isArray(response.data)) {
        const processedRecords = []
        response.data.forEach((record) => {
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
                status: record.status || "Pending",
                is_approved: record.is_approved || false,
                approved_by_name: record.approved_by_name || '',
                originalRecord: record,
              })
            })
          }
        })

        const uniqueRecords = processedRecords.filter(
          (record, index, self) =>
            index ===
            self.findIndex(
              (r) =>
                r.original_id === record.original_id &&
                r.date === record.date &&
                r.amount === record.amount &&
                r.payment_method === record.payment_method,
            ),
        )

        setRecords(uniqueRecords)
      } else {
        setRecords([])
        if (response.error) {
          console.error("Fetch error:", response.error)
        }
      }
    } catch (error) {
      setRecords([])
      console.error("Error fetching records:", error)
      toast.error("Failed to fetch records")
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = [...records]

    if (selectedCompany) {
      filtered = filtered.filter((record) => record.company_name === selectedCompany)
    }

    if (selectedStatus) {
      filtered = filtered.filter((record) => record.status === selectedStatus)
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

  const handleStatusFilterChange = (event) => {
    setSelectedStatus(event.target.value)
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
      status: record.status,
    }

    navigate("/OtherForm", {
      state: originalRecord,
    })
  }

  const getStatusMessage = (previousStatus, newStatus) => {
    if (newStatus === "Approved") {
      return "Record Approved successfully!"
    } else if (newStatus === "Collected") {
      return "Payment Collected successfully!"
    } else if (newStatus === "Gate Pass Issued") {
      return "Gate Pass Issued successfully!"
    }
    return `Status updated to ${newStatus}`
  }

  const handleStatusChange = async (record, newStatus) => {
    try {
      const updatePayload = {
        id: record.original_id || record.id,
        status: newStatus,
      }

      const response = await apiRequest(`${Insurancebaseurl}other_records/`, "PUT", updatePayload)

      if (response.success || response.status === 200) {
        // Update local state
        setRecords((prevRecords) =>
          prevRecords.map((r) =>
            (r.original_id || r.id) === (record.original_id || record.id) ? { ...r, status: newStatus } : r,
          ),
        )

        // Show toast notification with appropriate message
        const statusMessage = getStatusMessage(record.status, newStatus)
        toast.success(statusMessage)
        
        // Refresh records to get updated data
        fetchRecords()
      } else if (response.error) {
        // Handle error from backend (like previous day not approved)
        toast.error(response.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      
      // Check if error response has a specific message
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error("Failed to update status. Please try again.")
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f44336"
      case "Approved":
        return "#2196f3"
      case "Collected":
        return "#ff9800"
      case "Gate Pass Issued":
        return "#4caf50"
      default:
        return "#666"
    }
  }

  const calculateTotals = () => {
    const totalAmount = filteredRecords.reduce((sum, record) => sum + (Number.parseFloat(record.amount) || 0), 0)
    const totalRefund = filteredRecords.reduce((sum, record) => sum + (Number.parseFloat(record.refund) || 0), 0)
    return { totalAmount, totalRefund }
  }

  const { totalAmount, totalRefund } = calculateTotals()

  return (
    <ReportContainer>
      <Toaster position="top-right" />
      <Container>
        <Title>Other Records - All Statuses</Title>

        <ResponsiveFilterContainer>
          <div>
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search by name, UHID, mobile..."
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
            <Label htmlFor="statusFilter">Filter by Status</Label>
            <Select id="statusFilter" value={selectedStatus} onChange={handleStatusFilterChange}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <Label>To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate}
            />
          </div>

          <div>
            <Label style={{ visibility: 'hidden' }}>Add</Label>
            <ResponsiveButton onClick={() => navigate("/OtherForm")}>
              Add New Record
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
                    const isGatePassIssued = record.status === "Gate Pass Issued"
                    const isApproved = record.status === "Approved"
                    const isCollected = record.status === "Collected"
                    const isPending = record.status === "Pending"

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
                        <TableCell
                          style={{
                            color: getStatusColor(record.status),
                            fontWeight: "700",
                            fontSize: "14px",
                          }}
                        >
                          {record.status}
                        </TableCell>
                        <ActionCell>
                          <ButtonGroup>
                            <StatusSelect
                              value={record.status}
                              onChange={(e) => handleStatusChange(record, e.target.value)}
                              disabled={isGatePassIssued}
                              statusColor={getStatusColor(record.status)}
                            >
                              {STATUS_OPTIONS.map((status) => {
                                // Disable options based on current status
                                let isDisabled = false

                                if (isPending) {
                                  // From Pending, can only go to Approved
                                  isDisabled = status === "Collected" || status === "Gate Pass Issued"
                                } else if (isApproved) {
                                  // From Approved, can only go to Collected or stay Approved
                                  isDisabled = status === "Pending" || status === "Gate Pass Issued"
                                } else if (isCollected) {
                                  // From Collected, can only go to Gate Pass Issued or stay Collected
                                  isDisabled = status === "Pending" || status === "Approved"
                                } else if (isGatePassIssued) {
                                  // Gate Pass Issued is final - all disabled
                                  isDisabled = status !== "Gate Pass Issued"
                                }

                                return (
                                  <option key={status} value={status} disabled={isDisabled}>
                                    {status}
                                  </option>
                                )
                              })}
                            </StatusSelect>
                            <EditButton onClick={() => handleEdit(record)}>
                              Edit
                            </EditButton>
                          </ButtonGroup>
                        </ActionCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
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
                    <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>₹{totalRefund.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
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

export default OtherUpdate
