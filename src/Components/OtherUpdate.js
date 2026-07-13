import { useEffect, useState, useMemo, useCallback } from "react"
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
  FilterContainer,
  FilterWrapper,
  FormControl,
  SearchWrapper,
  SearchInput,
  StyledDatePicker,
  ScrollableTableContainer,
  StatusBadge,
} from "./SharedStyledComponents"

import apiRequest from "./ApiRequest"
import toast, { Toaster } from 'react-hot-toast'

const OtherUpdate = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL
  const navigate = useNavigate()

  const STATUS_OPTIONS = ["Pending", "Approved", "Collected"]

  // Fetch data when filters change
  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const url = `${Insurancebaseurl}other_records/`
      const response = await apiRequest(url, "GET", null, {}, {
        params: {
          from_date: fromDate.toLocaleDateString("en-CA"),
          to_date: toDate.toLocaleDateString("en-CA")
        }
      })

      if (response.success && Array.isArray(response.data)) {
        const processedRecords = []
        response.data.forEach((record) => {
          if (record.payment_details && Array.isArray(record.payment_details) && record.payment_details.length > 0) {
            record.payment_details.forEach((payment) => {
              processedRecords.push({
                id: record.id || record._id,
                original_id: record.id || record._id,
                date: payment.date
                  ? new Date(payment.date).toLocaleDateString("en-CA")
                  : record.date
                    ? new Date(record.date).toLocaleDateString("en-CA")
                    : "",
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
                approved_by_name: record.approved_by_name || "",
                created_by_name: record.created_by_name || "",
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
  }, [fromDate, toDate, Insurancebaseurl])

  // Fetch data when filters change
  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const filteredRecords = useMemo(() => {
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
    return filtered
  }, [records, searchTerm, selectedCompany, selectedStatus])


  const handleFromDateChange = (date) => {
    setFromDate(date)
  }

  const handleToDateChange = (date) => {
    setToDate(date)
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
        return "#f44336"       // red
      case "Approved":
        return "#2196f3"       // blue
      case "Collected":
        return "#ff9800"       // orange
      case "Final Approved":
        return "#f9ee5dfa"     // yellow
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

        <FilterContainer>
          <SearchWrapper>
            <Label>Search</Label>
            <SearchInput
              type="text"
              placeholder="Search by name, UHID, mobile..."
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
              <option value="TNCM">TNCM</option>
              <option value="TKT">TKT</option>
              <option value="FCA">FCA</option>
              <option value="Airport">Airport</option>
            </FormControl>
          </FilterWrapper>

          <FilterWrapper>
            <Label htmlFor="statusFilter">Filter by Status</Label>
            <FormControl id="statusFilter" value={selectedStatus} onChange={handleStatusFilterChange}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </FormControl>
          </FilterWrapper>

          <FilterWrapper>
            <Label>From Date</Label>
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
          </FilterWrapper>

          <FilterWrapper>
            <Label>To Date</Label>
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
          </FilterWrapper>

          <FilterWrapper>
            <Button onClick={() => navigate("/OtherForm")}>
              Add New Record
            </Button>
          </FilterWrapper>
        </FilterContainer>

        <InfoText>
          Showing {filteredRecords.length} payment record(s) from {fromDate.toLocaleDateString("en-CA")} to {toDate.toLocaleDateString("en-CA")}
        </InfoText>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <ScrollableTableContainer style={{ flex: 1, minHeight: 0 }}>
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
                  <TableHeader>Action</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => {
                    const isDropdownDisabled =
                      record.status === "Gate Pass Issued" ||
                      record.status === "Final Approved" ||
                      record.status === "Collected"

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
                          <StatusBadge color={getStatusColor(record.status)}>
                            {record.status || "Pending"}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>{record.created_by_name || "-"}</TableCell>
                        <ActionCell>
                          <ButtonGroup>

                            <StatusSelect
                              value={record.status}
                              disabled={isDropdownDisabled}
                              onChange={(e) => handleStatusChange(record, e.target.value)}
                              statusColor={getStatusColor(record.status)}
                            >
                              {STATUS_OPTIONS.map((status) => {
                                let isDisabled = false

                                if (record.status === "Pending") {
                                  // From Pending → only Approved
                                  isDisabled = status === "Collected"
                                } else if (record.status === "Approved") {
                                  // From Approved → Collected or stay Approved
                                  isDisabled = status === "Pending"
                                } else if (record.status === "Collected") {
                                  // Collected is final
                                  isDisabled = status !== "Collected"
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
                    <TableCell colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                      No records found matching the current filters
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
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </tr>
                </tfoot>
              )}
            </Table>
          </ScrollableTableContainer>
        )}

        <style>{`
        /* border-collapse:separate is REQUIRED for position:sticky to paint solid backgrounds */
        .frozen-columns-table { border-collapse: separate !important; border-spacing: 0 !important; }

        .frozen-col {
          position: sticky !important;
          z-index: 10;
          background-color: #ffffff;
          outline: 1px solid #b0c4be;
        }

        .frozen-col-1 { left: 0px;   min-width: 110px; }
        .frozen-col-2 { left: 110px; min-width: 150px; }
        .frozen-col-3 { left: 260px; min-width: 120px; box-shadow: 4px 0 6px -2px rgba(0,0,0,0.15); }

        thead tr th { position: sticky !important; top: 0; z-index: 11; background-color: #6F8B83; }
        thead .frozen-col { background-color: #6F8B83 !important; color: #fff; position: sticky !important; top: 0; z-index: 20 !important; outline: 1px solid #9aaea9; }
        tfoot .frozen-col { background-color: #f8f9fa !important; }
        tbody tr:nth-child(even) .frozen-col { background-color: #f9f9f9; }
        tbody tr:nth-child(odd)  .frozen-col { background-color: #ffffff; }
        tbody tr:hover .frozen-col { background-color: #e8f0ee !important; }

        .date-picker-popper      { z-index: 9999 !important; }
        .react-datepicker-popper { z-index: 9999 !important; }
        .react-datepicker        { z-index: 9999 !important; }
      `}</style>
      </Container>
    </ReportContainer>
  )
}

export default OtherUpdate