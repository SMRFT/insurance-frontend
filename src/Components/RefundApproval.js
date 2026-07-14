import { useEffect, useState, useMemo } from "react"
import {
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
  ResponsiveFilterContainer,
  ScrollableTableContainer,
  ActionCell,
  InfoText,
  ResponsiveButton,
  ButtonGroup,
  FilterWrapper,
  FilterContainer,
  SearchWrapper,
  SearchInput,
  StyledDatePicker,
  Spinner,
  LoadingSpinnerContainer,
} from "./SharedStyledComponents"

import apiRequest from "./ApiRequest"
import toast from 'react-hot-toast'
import styled from 'styled-components'

// Override FilterWrapper to ensure proper z-index for datepickers
const DatePickerWrapper = styled(FilterWrapper)`
  position: relative;
  z-index: 100;
  
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
  
  .react-datepicker {
    z-index: 9999 !important;
  }
`

const RefundApproval = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [approving, setApproving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecords, setSelectedRecords] = useState(new Set())
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // Fetch data when filters change
  useEffect(() => {
    fetchRecords()
  }, [fromDate, toDate])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const url = `${Insurancebaseurl}other_records/refund_approval/`
      const response = await apiRequest(url, "GET", null, {}, { params: { from_date: fromDate.toLocaleDateString("en-CA"), to_date: toDate.toLocaleDateString("en-CA") } })

      if (response.success && Array.isArray(response.data)) {
        setRecords(response.data)
        setSelectedRecords(new Set())
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

  const groupedRecords = useMemo(() => {
    const grouped = {}

    records.forEach((record) => {
      const recordDate = record.date || "Unknown"

      // Apply search filter
      const matchesSearch = !searchTerm ||
        record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patient_uhid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.mobile_number?.includes(searchTerm) ||
        record.treatment?.toLowerCase().includes(searchTerm.toLowerCase())

      if (matchesSearch) {
        if (!grouped[recordDate]) {
          grouped[recordDate] = []
        }
        grouped[recordDate].push(record)
      }
    })

    // Sort dates in descending order
    const sortedGrouped = {}
    Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        sortedGrouped[date] = grouped[date]
      })

    return sortedGrouped
  }, [records, searchTerm])

  const handleSelectRecord = (recordId) => {
    const newSelected = new Set(selectedRecords)
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId)
    } else {
      newSelected.add(recordId)
    }
    setSelectedRecords(newSelected)
  }

  const handleSelectAllForDate = (dateRecords) => {
    const dateIds = dateRecords.map(r => r.id || r._id).map(id => typeof id === 'object' ? id.$oid : id)
    const newSelected = new Set(selectedRecords)

    const allSelected = dateIds.every(id => newSelected.has(id))

    if (allSelected) {
      dateIds.forEach(id => newSelected.delete(id))
    } else {
      dateIds.forEach(id => newSelected.add(id))
    }

    setSelectedRecords(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedRecords.size === records.length) {
      setSelectedRecords(new Set())
    } else {
      const allIds = new Set(records.map(r => r.id || r._id).map(id => typeof id === 'object' ? id.$oid : id))
      setSelectedRecords(allIds)
    }
  }

  const handleApproveRefunds = async () => {
    if (selectedRecords.size === 0) {
      toast.error("Please select at least one refund to approve")
      return
    }

    setApproving(true)
    try {
      const recordIds = Array.from(selectedRecords)
      const payload = {
        record_ids: recordIds
      }

      const response = await apiRequest(
        `${Insurancebaseurl}other_records/refund_approval_update/`,
        "PUT",
        payload
      )

      if (response.success || response.status === 200) {
        toast.success(`${selectedRecords.size} refund(s) approved successfully`)

        // Refresh records
        setSelectedRecords(new Set())
        fetchRecords()
      } else {
        toast.error(response.error || "Failed to approve refunds")
      }
    } catch (error) {
      console.error("Error approving refunds:", error)
      toast.error("Failed to approve refunds. Please try again.")
    } finally {
      setApproving(false)
    }
  }

      const handleFromDateChange = (date) => {
    setFromDate(date)
  }

  const handleToDateChange = (date) => {
    setToDate(date)
  }


  const calculateTotals = () => {
    let totalAmount = 0
    let totalRefund = 0

    Object.values(groupedRecords).forEach((dateRecords) => {
      dateRecords.forEach((record) => {
        totalAmount += Number.parseFloat(record.amount || 0)
        totalRefund += Number.parseFloat(record.refund || 0)
      })
    })

    return { totalAmount, totalRefund }
  }

  const { totalAmount, totalRefund } = calculateTotals()

  return (
    <ReportContainer>
      <Container>
        <Title>Refund Amount Approval</Title>

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

          <FilterWrapper>
            <Label style={{ visibility: 'hidden' }}>Action</Label>
            <Button
              onClick={handleApproveRefunds}
              disabled={selectedRecords.size === 0 || approving}
              style={{
                backgroundColor: selectedRecords.size === 0 ? '#ccc' : '#ff9800',
                cursor: selectedRecords.size === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {approving ? 'Approving...' : `Approve Refunds (${selectedRecords.size})`}
            </Button>
          </FilterWrapper>
        </FilterContainer>

        <InfoText>
          Showing {records.length} refund record(s)
        </InfoText>

        {loading ? (
          <LoadingSpinnerContainer>
            <Spinner />
            <span>Loading refund approvals...</span>
          </LoadingSpinnerContainer>
        ) : Object.keys(groupedRecords).length > 0 ? (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px', maxHeight: 'calc(100vh - 260px)' }}>
            {Object.entries(groupedRecords).map(([date, dateRecords]) => {
              const dateTotal = dateRecords.reduce((sum, r) => sum + Number.parseFloat(r.amount || 0), 0)
              const dateRefund = dateRecords.reduce((sum, r) => sum + Number.parseFloat(r.refund || 0), 0)

              const allDateRecordsSelected = dateRecords.every(r =>
                selectedRecords.has(r.id || r._id?.toString?.() || r._id)
              )

              return (
                <div key={date} style={{ marginBottom: '30px' }}>
                  <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '15px',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold' }}>Date: {date}</h3>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>Records: {dateRecords.length} | Amount: ₹{dateTotal.toFixed(2)} | Refund: ₹{dateRefund.toFixed(2)}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allDateRecordsSelected && dateRecords.length > 0}
                      onChange={() => handleSelectAllForDate(dateRecords)}
                      style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                      title="Select all records for this date"
                    />
                  </div>

                  <ScrollableTableContainer style={{ flex: 1, minHeight: 0 }}>
                    <Table className="frozen-columns-table">
                      <thead>
                        <tr>
                          <TableHeader style={{ width: '40px' }} className="frozen-col frozen-col-0">
                            <input
                              type="checkbox"
                              checked={allDateRecordsSelected && dateRecords.length > 0}
                              onChange={() => handleSelectAllForDate(dateRecords)}
                              style={{ cursor: 'pointer' }}
                            />
                          </TableHeader>
                          <TableHeader className="frozen-col frozen-col-1">Patient Name</TableHeader>
                          <TableHeader className="frozen-col frozen-col-2">UHID</TableHeader>
                          <TableHeader>Mobile</TableHeader>
                          <TableHeader>Company</TableHeader>
                          <TableHeader>Treatment</TableHeader>
                          <TableHeader>Amount</TableHeader>
                          <TableHeader>Payment Method</TableHeader>
                          <TableHeader>Refund Amount</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Refund Approved By</TableHeader>
                          <TableHeader>Refund Approved Date</TableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {dateRecords.map((record, index) => {
                          const recordId = record.id || record._id?.toString?.() || record._id

                          return (
                            <TableRow key={`${recordId}-${index}`}>
                              <TableCell style={{ textAlign: 'center' }} className="frozen-col frozen-col-0">
                                <input
                                  type="checkbox"
                                  checked={selectedRecords.has(recordId)}
                                  onChange={() => handleSelectRecord(recordId)}
                                  style={{ cursor: 'pointer' }}
                                />
                              </TableCell>
                              <TableCell className="frozen-col frozen-col-1">{record.patient_name}</TableCell>
                              <TableCell className="frozen-col frozen-col-2">{record.patient_uhid}</TableCell>
                              <TableCell>{record.mobile_number}</TableCell>
                              <TableCell>{record.company_name}</TableCell>
                              <TableCell>{record.treatment}</TableCell>
                              <TableCell>₹{Number.parseFloat(record.amount || 0).toFixed(2)}</TableCell>
                              <TableCell>{record.payment_method || '-'}</TableCell>
                              <TableCell style={{ fontWeight: '600', color: '#ff9800' }}>
                                ₹{Number.parseFloat(record.refund || 0).toFixed(2)}
                              </TableCell>
                              <TableCell>{record.status}</TableCell>
                              <TableCell style={{
                                fontWeight: record.refund_approved_by_name ? 'bold' : 'normal',
                                color: record.refund_approved_by_name ? '#4caf50' : '#999'
                              }}>
                                {record.refund_approved_by_name || 'Pending'}
                              </TableCell>
                              <TableCell>
                                {record.refund_approved_date ? new Date(record.refund_approved_date).toLocaleDateString() : '-'}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </tbody>
                    </Table>
                  </ScrollableTableContainer>
                </div>
              )
            })}

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '5px',
              marginTop: '20px'
            }}>
              <h3 style={{ marginTop: 0 }}>Summary Totals</h3>
              <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>
              <p><strong>Total Refund:</strong> ₹{totalRefund.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            No refund records pending approval for the selected date range
          </div>
        )}
      </Container>
      <style>{`
        .frozen-columns-table { border-collapse: separate !important; border-spacing: 0 !important; }
        .frozen-col { position: sticky !important; z-index: 10; background-color: #ffffff; outline: 1px solid #b0c4be; }
        .frozen-col-0 { left: 0px; min-width: 40px; text-align: center; }
        .frozen-col-1 { left: 40px; min-width: 150px; }
        .frozen-col-2 { left: 190px; min-width: 100px; box-shadow: 4px 0 6px -2px rgba(0,0,0,0.15); }
        thead tr th { position: sticky !important; top: 0; z-index: 11; background-color: #6F8B83; }
        thead .frozen-col { background-color: #6F8B83 !important; color: #fff; position: sticky !important; top: 0; z-index: 20 !important; outline: 1px solid #9aaea9; }
        tbody tr:nth-child(even) .frozen-col { background-color: #f9f9f9; }
        tbody tr:nth-child(odd) .frozen-col { background-color: #ffffff; }
        tbody tr:hover .frozen-col { background-color: #e8f0ee !important; }
      `}</style>
    </ReportContainer>
  )
}

export default RefundApproval