import { useState, useEffect, useCallback, useMemo } from "react"
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
  Spinner,
  LoadingSpinnerContainer,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"
import { History, FileDown, Search, Filter } from "lucide-react"
const primaryColor = "#6F8B83"
const accentColor = "#9aaea9"

const OtherReport = () => {
  const [records, setRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [activeHistory, setActiveHistory] = useState([])
  const [activeHistoryName, setActiveHistoryName] = useState("")

  const userPayloadStr = localStorage.getItem("user_payload");
  const userPayload = userPayloadStr ? JSON.parse(userPayloadStr) : {};
  const allowedActions = userPayload["allowed-actions"] || [];
  const isAccounts = allowedActions.includes("SIN-R-ACC") || allowedActions.includes("SIN-R-TST");

  const handleOpenHistoryModal = (history, name) => {
    setActiveHistory(history)
    setActiveHistoryName(name)
    setShowHistoryModal(true)
  }
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [doctorList, setDoctorList] = useState([])
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // Fetch doctor list on mount
  useEffect(() => {
    const fetchDoctorList = async () => {
      try {
        const url = `${Insurancebaseurl}get_doctor_list/`
        const response = await apiRequest(url, "GET")
        if (response.success) {
          setDoctorList(response.data || [])
        } else {
          console.error("Error fetching doctor list:", response.error || response.data)
        }
      } catch (error) {
        console.error("Error fetching doctor list:", error)
      }
    }
    fetchDoctorList()
  }, [Insurancebaseurl])

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const url = `${Insurancebaseurl}other_records/report/`
      const response = await apiRequest(url, "GET", null, {}, {
        params: {
          from_date: fromDate.toLocaleDateString("en-CA"),
          to_date: toDate.toLocaleDateString("en-CA"),
        },
      })

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
  }, [fromDate, toDate, Insurancebaseurl])

  // Fetch records when date filters change
  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleFromDateChange = (date) => setFromDate(date)
  const handleToDateChange = (date) => setToDate(date)

  const filteredRecords = useMemo(() => {
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

    if (selectedDoctor) {
      filtered = filtered.filter((record) => record.doctor_name === selectedDoctor)
    }

    return filtered
  }, [records, searchTerm, selectedCompany, selectedPaymentMethod, selectedDoctor])

  const handleCompanyFilterChange = (event) => setSelectedCompany(event.target.value)
  const handlePaymentMethodFilterChange = (event) => setSelectedPaymentMethod(event.target.value)
  const handleDoctorFilterChange = (event) => setSelectedDoctor(event.target.value)

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRecordForRefund, setSelectedRecordForRefund] = useState(null);

  const handleInitiateRefund = async () => {
    if (!selectedRecordForRefund) return;
    try {
      const url = `${Insurancebaseurl}other_records/`;
      const payload = {
        id: selectedRecordForRefund.id || (selectedRecordForRefund._id && selectedRecordForRefund._id.$oid) || selectedRecordForRefund._id,
        is_refund_initiated: true
      };
      
      const response = await apiRequest(url, "PUT", payload);
      
      if (response.success || response.status === 200 || response.status === 201 || (response.data && response.data.message)) {
        setShowRefundModal(false);
        fetchRecords(); // Refresh the data
      } else {
        console.error("Failed to update refund status:", response.error);
        alert("Failed to initiate refund. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating refund:", error);
      alert("Error initiating refund. Please try again.");
    }
  };

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
      "Company",
      "Provider",
      "Treatment",
      "Amount",
      "Payment Method",
      "Has Refund",
      "Refund Amount",
      "Status",
      "Approved By",
      "Final Approved By",
      "Refund Approved By",
      "Created By",
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
        record.specificInsuranceCompany || "",
        record.treatment || "",
        Number.parseFloat(record.amount || 0).toFixed(2),
        record.payment_method || "",
        record.has_refund ? "Yes" : "No",
        Number.parseFloat(record.refund || 0).toFixed(2),
        record.status || "",
        record.approved_by_name || "",
        record.final_approved_by_name || "",
        record.refund_approved_by_name || "",
        record.created_by_name || "",
      ]
        .map((field) => `"${field}"`)
        .join(","),
    )

    const grandTotalRow = [
      "", "", "", "", "", "", "", "GRAND TOTAL", "",
      `"${totalAmount.toFixed(2)}"`,
      "", "",
      `"${totalRefund.toFixed(2)}"`,
      "", "", "", "", "",
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

    const printWindow = window.open("", "_blank")

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Insurance Records Report</title>
        <style>
          @media print {
            @page { size: A4 landscape; margin: 15mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
          .report-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid ${primaryColor}; padding-bottom: 15px; }
          .report-header h1 { color: ${primaryColor}; margin: 0 0 10px 0; font-size: 24px; }
          .report-header p { margin: 5px 0; color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: ${primaryColor}; color: white; font-weight: bold; position: sticky; top: 0; }
          tbody tr:nth-child(even) { background-color: #f9f9f9; }
          tbody tr:hover { background-color: #f5f5f5; }
          .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; display: inline-block; color: white; }
          .refund-yes { background-color: #4caf50; }
          .refund-no { background-color: #f44336; }
          .status-pending { background-color: #f44336; }
          .status-approved { background-color: #2196f3; }
          .status-collected { background-color: #ff9800; }
          .status-final-approved { background-color: #f9ee5dfa; color: #333; }
          .status-gate-pass { background-color: #4caf50; }
          tfoot { background-color: #f8f9fa; font-weight: bold; font-size: 12px; }
          tfoot td { border-top: 2px solid ${primaryColor}; }
          .print-buttons { text-align: center; margin: 20px 0; }
          .print-button { background-color: ${primaryColor}; color: white; border: none; padding: 12px 30px; font-size: 16px; cursor: pointer; border-radius: 5px; margin: 0 10px; }
          .print-button:hover { background-color: ${accentColor}; }
          @media print { .print-buttons { display: none; } }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Insurance Records Report</h1>
          <p><strong>Period:</strong> ${fromDateStr} to ${toDateStr}</p>
          <p><strong>Total Records:</strong> ${filteredRecords.length}</p>
          ${selectedCompany ? `<p><strong>Company:</strong> ${selectedCompany}</p>` : ""}
          ${selectedPaymentMethod ? `<p><strong>Payment Method:</strong> ${selectedPaymentMethod}</p>` : ""}
          ${selectedDoctor ? `<p><strong>Doctor:</strong> ${selectedDoctor}</p>` : ""}
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th><th>Date</th><th>IP/OP Type</th><th>IP/OP Number</th>
              <th>Patient Name</th><th>Mobile</th><th>Doctor Name</th><th>Company</th>
              <th>Treatment</th><th>Amount</th><th>Payment Method</th><th>Refund</th>
              <th>Status</th><th>Approved By</th><th>Final Approved By</th><th>Refund Approved By</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords
              .map(
                (record, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${record.date || ""}</td>
                <td>${record.ip_op_type || ""}</td>
                <td>${record.patient_uhid || ""}</td>
                <td>${record.patient_name || ""}</td>
                <td>${record.mobile_number || ""}</td>
                <td>${record.doctor_name || ""}</td>
                <td>${record.company_name || ""}</td>
                <td>${record.treatment || ""}</td>
                <td>₹${Number.parseFloat(record.amount || 0).toFixed(2)}</td>
                <td>${record.payment_method || ""}</td>
                <td>₹${Number.parseFloat(record.refund || 0).toFixed(2)}</td>
                <td>
                  <span class="status-badge ${
                    record.status === "Pending"
                      ? "status-pending"
                      : record.status === "Approved"
                        ? "status-approved"
                        : record.status === "Collected"
                          ? "status-collected"
                          : record.status === "Final Approved"
                            ? "status-final-approved"
                            : record.status === "Gate Pass Issued"
                              ? "status-gate-pass"
                              : ""
                  }">
                    ${record.status || "Pending"}
                  </span>
                </td>
                <td>${record.approved_by_name || "-"}</td>
                <td>${record.final_approved_by_name || "-"}</td>
                <td>${record.refund_approved_by_name || "-"}</td>
              </tr>
            `,
              )
              .join("")}
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
      case "Pending":       return "#f44336"
      case "Approved":      return "#2196f3"
      case "Collected":     return "#ff9800"
      case "Final Approved":return "#f9ee5dfa"
      case "Gate Pass Issued": return "#4caf50"
      default:              return "#666"
    }
  }

  const { totalAmount, totalRefund } = calculateTotals()

  return (
    <ReportContainer>
      <Container>
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0, flexWrap: 'wrap', gap: '10px' }}>
          <Title style={{ margin: 0, textAlign: 'left' }}>Other Records Report - All Status</Title>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={exportToCSV} disabled={filteredRecords.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap' }}>
              <FileDown size={15} />
              Export CSV
            </Button>
            <Button onClick={handlePrintReport} disabled={filteredRecords.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap' }}>
              <FileDown size={15} />
              Print Report
            </Button>
          </div>
        </div>

        {/* ── Filters ── */}
        <FilterContainer>
          <SearchWrapper>
            <Label>
              <Search size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Search
            </Label>
            <SearchInput
              type="text"
              placeholder="Search by name, UHID, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>

          <FilterWrapper>
            <Label htmlFor="companyName">
              <Filter size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Company
            </Label>
            <FormControl id="companyName" value={selectedCompany} onChange={handleCompanyFilterChange}>
              <option value="">All Companies</option>
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
            <Label htmlFor="paymentMethod">
              <Filter size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Payment
            </Label>
            <FormControl id="paymentMethod" value={selectedPaymentMethod} onChange={handlePaymentMethodFilterChange}>
              <option value="">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </FormControl>
          </FilterWrapper>

          {/* ── Doctor filter ── */}
          <FilterWrapper>
            <Label htmlFor="doctorFilter">
              <Filter size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Doctor
            </Label>
            <FormControl id="doctorFilter" value={selectedDoctor} onChange={handleDoctorFilterChange}>
              <option value="">All Doctors</option>
              {doctorList.map((doctor, index) => (
                <option
                  key={doctor.id ?? doctor.doctor_name ?? index}
                  value={doctor.doctor_name ?? doctor}
                >
                  {doctor.doctor_name ?? doctor}
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
                modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
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
                modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
              }}
              popperClassName="date-picker-popper"
            />
          </FilterWrapper>
        </FilterContainer>

        <ResultsInfo>Showing {filteredRecords.length} result(s)</ResultsInfo>

        <ScrollableTableContainer style={{ flex: 1, minHeight: 0 }}>
          <Table className="frozen-columns-table">
            <thead>
              <tr>
                <TableHeader className="frozen-col frozen-col-0">S.No</TableHeader>
                <TableHeader className="frozen-col frozen-col-1">Date</TableHeader>
                <TableHeader className="frozen-col frozen-col-2">IP/OP Type</TableHeader>
                <TableHeader className="frozen-col frozen-col-3">IP/OP Number</TableHeader>
                <TableHeader className="frozen-col frozen-col-4">Patient Name</TableHeader>
                <TableHeader>Mobile</TableHeader>
                <TableHeader style={{ minWidth: "150px" }}>Doctor Name</TableHeader>
                <TableHeader>Company</TableHeader>
                <TableHeader>Provider</TableHeader>
                <TableHeader>Treatment</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Payment Method</TableHeader>
                <TableHeader>Has Refund</TableHeader>
                <TableHeader>Refund</TableHeader>
                <TableHeader>Refund Initiated</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Approved By</TableHeader>
                <TableHeader>Final Approved By</TableHeader>
                <TableHeader>Refund Approved By</TableHeader>
                <TableHeader>Refund Initiated By</TableHeader>
                <TableHeader>Created By</TableHeader>
                <TableHeader style={{ textAlign: "center" }}>Edit History</TableHeader>
                {isAccounts && <TableHeader style={{ textAlign: "center" }}>Action</TableHeader>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="23" style={{ textAlign: "center", padding: "20px" }}>
                    <LoadingSpinnerContainer>
                      <Spinner />
                      <span>Loading records...</span>
                    </LoadingSpinnerContainer>
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <TableRow key={`${record.id}-${record.date}-${record.amount}-${index}`}>
                    <TableCell className="frozen-col frozen-col-0" style={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell className="frozen-col frozen-col-1" style={{ whiteSpace: "nowrap" }}>
                      {record.date}
                    </TableCell>
                    <TableCell className="frozen-col frozen-col-2">{record.ip_op_type}</TableCell>
                    <TableCell className="frozen-col frozen-col-3">{record.patient_uhid}</TableCell>
                    <TableCell className="frozen-col frozen-col-4">{record.patient_name}</TableCell>
                    <TableCell>{record.mobile_number}</TableCell>
                    <TableCell style={{ wordWrap: "break-word", whiteSpace: "normal", maxWidth: "200px", minWidth: "150px" }}>
                      {record.doctor_name}
                    </TableCell>
                    <TableCell>{record.company_name}</TableCell>
                    <TableCell>{record.specificInsuranceCompany || "-"}</TableCell>
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
                      <StatusBadge color={record.is_refund_initiated ? "#4caf50" : "#f44336"}>
                        {record.is_refund_initiated ? "Yes" : "No"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge color={getStatusColor(record.status)}>
                        {record.status || "Pending"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{record.approved_by_name || "-"}</TableCell>
                    <TableCell>{record.final_approved_by_name || "-"}</TableCell>
                    <TableCell>{record.refund_approved_by_name || "-"}</TableCell>
                    <TableCell>{record.refund_initiated_by_name || "-"}</TableCell>
                    <TableCell>{record.created_by_name || "-"}</TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenHistoryModal(record.editHistory || [], record.patient_name || "N/A")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          background: "#eef2f6",
                          color: "#334155",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        <History size={12} /> View ({record.editHistory?.length || 0})
                      </button>
                    </TableCell>
                    {isAccounts && (
                      <TableCell style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecordForRefund(record);
                            setShowRefundModal(true);
                          }}
                          disabled={!record.is_refund_approved || record.is_refund_initiated}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            background: (!record.is_refund_approved || record.is_refund_initiated) ? "#ccc" : "#4caf50",
                            color: "white",
                            border: "none",
                            cursor: (!record.is_refund_approved || record.is_refund_initiated) ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap"
                          }}
                        >
                          Refund Initiated
                        </button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="23" style={{ textAlign: "center", padding: "20px" }}>
                    No records found matching the current filters
                  </TableCell>
                </TableRow>
              )}
            </tbody>
            {filteredRecords.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                  <TableCell className="frozen-col frozen-col-0"></TableCell>
                  <TableCell className="frozen-col frozen-col-1"></TableCell>
                  <TableCell className="frozen-col frozen-col-2"></TableCell>
                  <TableCell className="frozen-col frozen-col-3"></TableCell>
                  <TableCell className="frozen-col frozen-col-4"></TableCell>
                  <TableCell colSpan="4" style={{ textAlign: "right" }}>
                    GRAND TOTAL:
                  </TableCell>
                  <TableCell colSpan="3"></TableCell>
                  <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                  <TableCell colSpan="2"></TableCell>
                  <TableCell>₹{totalRefund.toFixed(2)}</TableCell>
                  <TableCell colSpan={isAccounts ? 9 : 8}></TableCell>
                </tr>
              </tfoot>
            )}
          </Table>
        </ScrollableTableContainer>

        <style>{`
          .frozen-columns-table { border-collapse: separate !important; border-spacing: 0 !important; }
          .frozen-col { position: sticky !important; z-index: 10; background-color: #ffffff; outline: 1px solid #b0c4be; }
          .frozen-col-0 { left: 0px; min-width: 60px; text-align: center; }
          .frozen-col-1 { left: 60px; min-width: 110px; }
          .frozen-col-2 { left: 170px; min-width: 150px; }
          .frozen-col-3 { left: 320px; min-width: 120px; }
          .frozen-col-4 { left: 440px; min-width: 130px; box-shadow: 4px 0 6px -2px rgba(0,0,0,0.15); }
          thead tr th { position: sticky !important; top: 0; z-index: 11; background-color: #6F8B83; }
          thead .frozen-col { background-color: #6F8B83 !important; color: #fff; position: sticky !important; top: 0; z-index: 20 !important; outline: 1px solid #9aaea9; }
          tfoot .frozen-col { background-color: #f8f9fa !important; }
          tbody tr:nth-child(even) .frozen-col { background-color: #f9f9f9; }
          tbody tr:nth-child(odd) .frozen-col { background-color: #ffffff; }
          tbody tr:hover .frozen-col { background-color: #e8f0ee !important; }
          .date-picker-popper { z-index: 9999 !important; }
          .react-datepicker-popper { z-index: 9999 !important; }
          .react-datepicker { z-index: 9999 !important; }
        `}</style>
      {showHistoryModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999
        }}>
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "650px",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "bold" }}>
                Edit History - {activeHistoryName}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#64748b",
                  fontWeight: "bold"
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {activeHistory && activeHistory.length > 0 ? (
                [...activeHistory].reverse().map((entry, idx) => (
                  <div key={idx} style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "#f8fafc"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "8px", fontWeight: "500" }}>
                      <span>👤 {entry.edited_by_name || entry.edited_by || "System"}</span>
                      <span>📅 {entry.edited_date ? new Date(entry.edited_date).toLocaleString() : "N/A"}</span>
                    </div>
                    <div style={{
                      fontSize: "14px",
                      color: "#1e293b",
                      marginBottom: "12px",
                      fontStyle: "italic",
                      background: "#f1f5f9",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      borderLeft: "3px solid #6f8b83"
                    }}>
                      <strong>Reason: </strong> {entry.edited_reason || "No reason provided"}
                    </div>
                    {entry.changes && entry.changes.length > 0 ? (
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginTop: "8px" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#e2e8f0" }}>
                            <th style={{ border: "1px solid #cbd5e1", padding: "6px 8px", textAlign: "left" }}>Field</th>
                            <th style={{ border: "1px solid #cbd5e1", padding: "6px 8px", textAlign: "left" }}>Before</th>
                            <th style={{ border: "1px solid #cbd5e1", padding: "6px 8px", textAlign: "left" }}>After</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry.changes.map((change, cIdx) => (
                            <tr key={cIdx} style={{ backgroundColor: "white" }}>
                              <td style={{ border: "1px solid #e2e8f0", padding: "6px 8px", fontWeight: "600", color: "#475569" }}>{change.field}</td>
                              <td style={{ border: "1px solid #e2e8f0", padding: "6px 8px", color: "#b91c1c", backgroundColor: "#fef2f2" }}>{change.before || "Empty"}</td>
                              <td style={{ border: "1px solid #e2e8f0", padding: "6px 8px", color: "#15803d", backgroundColor: "#f0fdf4" }}>{change.after || "Empty"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ fontSize: "12px", color: "#64748b" }}>No specific field modifications tracked.</div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontStyle: "italic" }}>
                  No edit history available for this record.
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                onClick={() => setShowHistoryModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "white",
                  color: "#475569",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefundModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999
        }}>
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "bold" }}>
              Confirm Refund
            </h3>
            <p style={{ color: "#475569", margin: 0 }}>
              Is Amount refunded for {selectedRecordForRefund?.patient_name}?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setSelectedRecordForRefund(null);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "white",
                  color: "#475569",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInitiateRefund}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#4caf50",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      </Container>
    </ReportContainer>
  )
}

export default OtherReport