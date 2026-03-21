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
  FormControl,
  Select,
  Button,
  Container,
  FormContainer,
  ResponsiveFilterContainer,
  ResponsiveTableWrapper,
  SearchInput,
  SearchWrapper,
  StatusBadge,
  ButtonWrapper,
  ScrollableTableContainer,
  ResultsInfo,
  StyledDatePicker,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

const primaryColor = "#6F8B83"
const accentColor = "#9aaea9"

const OtherReport = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // Fetch data when filters change
  useEffect(() => {
    fetchRecords()
  }, [selectedCompany, fromDate, toDate, ])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, selectedCompany, selectedPaymentMethod])


  const fetchRecords = async () => {
    
    setLoading(true)
    try {
      const url = `${Insurancebaseurl}other_records/report/`
      const response = await apiRequest(url, "GET", null, {}, { params: { from_date: fromDate.toLocaleDateString("en-CA"), to_date: toDate.toLocaleDateString("en-CA") } })

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

  const handleFromDateChange = (date) => {
    setFromDate(date)
  }

  const handleToDateChange = (date) => {
    setToDate(date)
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
      "S.No",
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

    const dataRows = filteredRecords.map((record, index) =>
      [
        index + 1,
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
      "", "", "", "", "", "", "", "GRAND TOTAL", "",
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

  const handlePrintReport = () => {
    const { totalAmount, totalRefund } = calculateTotals()
    const fromDateStr = fromDate.toLocaleDateString("en-CA")
    const toDateStr = toDate.toLocaleDateString("en-CA")

    const printWindow = window.open('', '_blank')
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Insurance Records Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid ${primaryColor};
            padding-bottom: 15px;
          }
          
          .report-header h1 {
            color: ${primaryColor};
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          
          .report-header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: ${primaryColor};
            color: white;
            font-weight: bold;
            position: sticky;
            top: 0;
          }
          
          tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          
          tbody tr:hover {
            background-color: #f5f5f5;
          }
          
          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            display: inline-block;
            color: white;
          }
          
          .refund-yes {
            background-color: #4caf50;
          }
          
          .refund-no {
            background-color: #f44336;
          }
          
          .status-pending {
            background-color: #f44336;
          }
          
          .status-approved {
            background-color: #2196f3;
          }
          
          .status-collected {
            background-color: #ff9800;
          }
          
          .status-final-approved {
            background-color: #f9ee5dfa;
            color: #333;
          }
          
          .status-gate-pass {
            background-color: #4caf50;
          }
          
          tfoot {
            background-color: #f8f9fa;
            font-weight: bold;
            font-size: 12px;
          }
          
          tfoot td {
            border-top: 2px solid ${primaryColor};
          }
          
          .print-buttons {
            text-align: center;
            margin: 20px 0;
          }
          
          .print-button {
            background-color: ${primaryColor};
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            margin: 0 10px;
          }
          
          .print-button:hover {
            background-color: ${accentColor};
          }
          
          @media print {
            .print-buttons {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Insurance Records Report</h1>
          <p><strong>Period:</strong> ${fromDateStr} to ${toDateStr}</p>
          <p><strong>Total Records:</strong> ${filteredRecords.length}</p>
          ${selectedCompany ? `<p><strong>Company:</strong> ${selectedCompany}</p>` : ''}
          ${selectedPaymentMethod ? `<p><strong>Payment Method:</strong> ${selectedPaymentMethod}</p>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>IP/OP Type</th>
              <th>IP/OP Number</th>
              <th>Patient Name</th>
              <th>Mobile</th>
              <th>Doctor Name</th>
              <th>Company</th>
              <th>Treatment</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Refund</th>
              <th>Status</th>
              <th>Approved By</th>
              <th>Final Approved By</th>
              <th>Refund Approved By</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map((record, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${record.date || ''}</td>
                <td>${record.ip_op_type || ''}</td>
                <td>${record.patient_uhid || ''}</td>
                <td>${record.patient_name || ''}</td>
                <td>${record.mobile_number || ''}</td>
                <td>${record.doctor_name || ''}</td>
                <td>${record.company_name || ''}</td>
                <td>${record.treatment || ''}</td>
                <td>₹${Number.parseFloat(record.amount || 0).toFixed(2)}</td>
                <td>${record.payment_method || ''}</td>
                <td>₹${Number.parseFloat(record.refund || 0).toFixed(2)}</td>
                <td>
                  <span class="status-badge ${
                    record.status === 'Pending' ? 'status-pending' :
                    record.status === 'Approved' ? 'status-approved' :
                    record.status === 'Collected' ? 'status-collected' :
                    record.status === 'Final Approved' ? 'status-final-approved' :
                    record.status === 'Gate Pass Issued' ? 'status-gate-pass' : ''
                  }">
                    ${record.status || 'Pending'}
                  </span>
                </td>
                <td>${record.approved_by_name || '-'}</td>
                <td>${record.final_approved_by_name || '-'}</td>
                <td>${record.refund_approved_by_name || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="9" style="text-align: right;"><strong>GRAND TOTAL:</strong></td>
              <td><strong>₹${totalAmount.toFixed(2)}</strong></td>
              <td></td>
              <td><strong>₹${totalRefund.toFixed(2)}</strong></td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
  }

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#f44336"
    case "Approved":
      return "#2196f3"
    case "Collected":
      return "#ff9800"
    case "Final Approved":
      return "#f9ee5dfa"
    case "Gate Pass Issued": 
      return "#4caf50"
    default: 
      return "#666"
    }
  }

  const { totalAmount, totalRefund } = calculateTotals()

  return (
    <ReportContainer>
      <Container>
        <Title>Other Records Report - All Status</Title>
        
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
              <option value="TKT">TKT</option>
              <option value="FCI">FCI</option>
              <option value="Airport">Airport</option>
            </FormControl>
          </FilterWrapper>

          <FilterWrapper>
            <Label htmlFor="paymentMethod">Filter by Payment:</Label>
            <FormControl id="paymentMethod" value={selectedPaymentMethod} onChange={handlePaymentMethodFilterChange}>
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </FormControl>
          </FilterWrapper>

          <FilterWrapper>
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
          </FilterWrapper>
          
          <FilterWrapper>
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
          </FilterWrapper>


          <FilterWrapper>
              <Button onClick={exportToCSV} disabled={filteredRecords.length === 0}>Export CSV</Button>
          </FilterWrapper>

          <FilterWrapper>
              <Button onClick={handlePrintReport} disabled={filteredRecords.length === 0}>Print Report</Button>
          </FilterWrapper>

        </FilterContainer>

      <ResultsInfo>Showing {filteredRecords.length} result(s)</ResultsInfo>

          <ResponsiveTableWrapper>
            <ScrollableTableContainer>
              <Table className="frozen-columns-table">
              <thead>
                <tr>
                  <TableHeader className="frozen-col frozen-col-0">S.No</TableHeader>
                  <TableHeader className="frozen-col frozen-col-1">Date</TableHeader>
                  <TableHeader className="frozen-col frozen-col-2">IP/OP Type</TableHeader>
                  <TableHeader className="frozen-col frozen-col-3">IP/OP Number</TableHeader>
                  <TableHeader className="frozen-col frozen-col-4">Patient Name</TableHeader>
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
                      <TableCell className="frozen-col frozen-col-0" style={{ textAlign: "center" }}>{index + 1}</TableCell>
                      <TableCell className="frozen-col frozen-col-1" style={{ whiteSpace: "nowrap" }}>{record.date}</TableCell>
                      <TableCell className="frozen-col frozen-col-2">{record.ip_op_type}</TableCell>
                      <TableCell className="frozen-col frozen-col-3">{record.patient_uhid}</TableCell>
                      <TableCell className="frozen-col frozen-col-4">{record.patient_name}</TableCell>
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
                  <TableCell colSpan="17" style={{ textAlign: "center", padding: "20px" }}>
                    No records found matching the current filters
                  </TableCell>
                </TableRow>
              )}
              </tbody>
              {filteredRecords.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                    <TableCell className="frozen-col frozen-col-0"></TableCell>
                    <TableCell className="frozen-col frozen-col-1" colSpan="4" style={{ textAlign: "right" }}>
                      GRAND TOTAL:
                    </TableCell>
                    <TableCell colSpan="4"></TableCell>
                    <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>₹{totalRefund.toFixed(2)}</TableCell>
                    <TableCell colSpan="4"></TableCell>
                  </tr>
                </tfoot>
              )}
              </Table>
            </ScrollableTableContainer>
          </ResponsiveTableWrapper>

      <style jsx global>{`
        /* Frozen columns styling */
        .frozen-columns-table {
          position: relative;
        }

      .frozen-col {
        position: sticky !important;
        background-color: white;
        z-index: 10;
      }

      .frozen-col-0 {
        left: 0px;
        min-width: 60px;
        text-align: center;
      }

      .frozen-col-1 {
        left: 60px;
        min-width: 110px;
      }

      .frozen-col-2 {
        left: 170px;
        min-width: 150px;
      }

      .frozen-col-3 {
        left: 320px;
        min-width: 120px;
      }

      .frozen-col-4 {
        left: 440px;
        min-width: 130px;
        border-right: 2px solid #ddd;
      }

      /* Shadow on last frozen column */
      .frozen-col-4::after {
        content: '';
        position: absolute;
        top: 0;
        right: -10px;
        bottom: 0;
        width: 10px;
        background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
        pointer-events: none;
      }

        /* Sticky header row — freezes on vertical scroll */
        thead tr th {
          position: sticky !important;
          top: 0;
          z-index: 11;
        }

        /* Ensure header frozen columns have darker background + highest z-index */
        thead .frozen-col {
          background-color: #6F8B83;
          position: sticky !important;
          top: 0;
          z-index: 20 !important;
        }

        /* Ensure footer frozen columns match */
        tfoot .frozen-col {
          background-color: #f8f9fa;
        }

        /* Ensure row hover doesn't break frozen column background */
        tbody tr:hover .frozen-col {
          background-color: #f5f5f5;
        }

        .date-picker-popper {
          z-index: 9999 !important;
        }

        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        .react-datepicker {
          z-index: 9999 !important;
        }
      `}</style>
      </Container>
    </ReportContainer>
  )
}

export default OtherReport