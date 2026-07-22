import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns"

import {
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
  SearchInput,
  SearchWrapper,
  StatusBadge,
  ButtonWrapper,
  ScrollableTableContainer,
  ResultsInfo,
  StyledDatePicker,
  Spinner,
  LoadingSpinnerContainer,
  FilterWrapper,
  ActionCell,
  EditButton,
  ViewButton,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"
import toast, { Toaster } from "react-hot-toast";
import { History, FileDown, Search, Filter } from "lucide-react"
const formatDateStr = (val) => {
  if (!val) return "";
  if (val.$date) return val.$date.split("T")[0];
  return typeof val === "string" ? val.split("T")[0] : String(val).split("T")[0];
};

const ModalOverlay = ({ children, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={onClose}>
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', minWidth: '400px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const primaryColor = "#6F8B83"
const accentColor = "#9aaea9"

const RTReport = () => {
  const [records, setRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [activeHistory, setActiveHistory] = useState([])
  const [activeHistoryName, setActiveHistoryName] = useState("")

  const handleOpenHistoryModal = (history, name) => {
    setActiveHistory(history)
    setActiveHistoryName(name)
    setShowHistoryModal(true)
  }
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [viewModalData, setViewModalData] = useState(null)

  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const url = `${Insurancebaseurl}rt_records/`
      const response = await apiRequest(url, "GET", null, {}, {
        params: {
          from_date: fromDate.toLocaleDateString("en-CA"),
          to_date: toDate.toLocaleDateString("en-CA"),
        },
      })

      if (response.success && response.data && Array.isArray(response.data.data)) {
        // No longer flattening. Ensure payment_details is parsed if it's a string
        const processedRecords = response.data.data.map((record) => {
          let payments = record.payment_details;
          if (typeof payments === 'string') {
            try {
              payments = JSON.parse(payments);
            } catch (e) {
              payments = [];
            }
          }
          if (!Array.isArray(payments)) payments = [];

          let totalPaid = 0;
          payments.forEach(p => totalPaid += Number.parseFloat(p.amount || 0));

          return {
            ...record,
            payment_details: payments,
            totalPaid: totalPaid,
          }
        })
        setRecords(processedRecords)
      } else {
        setRecords([])
      }
    } catch (error) {
      setRecords([])
      console.error("Error fetching records:", error)
      toast.error("Failed to fetch records")
    } finally {
      setLoading(false)
    }
  }, [fromDate, toDate, Insurancebaseurl])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const filteredRecords = useMemo(() => {
    let filtered = [...records]

    if (selectedCompany) {
      filtered = filtered.filter((record) => record.insurance_type === selectedCompany)
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (record) =>
          record.patient_name?.toLowerCase().includes(lowerSearch) ||
          record.patient_uhid?.toLowerCase().includes(lowerSearch) ||
          record.mobile_number?.includes(searchTerm)
      )
    }

    return filtered
  }, [records, searchTerm, selectedCompany])

  const calculateTotals = () => {
    let totalAmount = 0
    let totalExpectedAmount = 0

    filteredRecords.forEach((record) => {
      totalExpectedAmount += Number.parseFloat(record.amount_to_be_paid || 0)
      totalAmount += record.totalPaid || 0
    })

    return { totalAmount, totalExpectedAmount }
  }

  const handleEdit = (record) => {
    navigate("/RTForm", { state: record })
  }

  const handleApprove = async (record) => {
    if (window.confirm(`Are you sure you want to approve the record for ${record.patient_name}?`)) {
      try {
        const url = `${Insurancebaseurl}rtrecords/${record.rt_id || record.id}/`;
        const payload = { action: 'Approve' };
        const response = await apiRequest(url, "PUT", payload);
        if (response.success || response.status === 200 || response.status === 201) {
          toast.success("Record approved successfully");
          fetchRecords();
        } else {
          toast.error("Failed to approve record");
        }
      } catch (error) {
        console.error("Error approving record:", error);
        toast.error("An error occurred during approval");
      }
    }
  }

  const handleView = (record) => {
    setViewModalData(record)
  }

  const exportToCSV = () => {
    const headers = [
      "S.No",
      "Date",
      "Patient Name",
      "Admission Date",
      "Discharge Date",
      "Company Name",
      "Provider",
      "Expected Amount",
      "Total Paid",
      "Status",
    ]

    const { totalAmount, totalExpectedAmount } = calculateTotals()

    const dataRows = filteredRecords.map((record, index) =>
      [
        index + 1,
        record.date || "",
        record.patient_name || "",
        record.date_of_admission || "",
        record.date_of_discharge || "",
        record.insurance_type || "",
        record.specificInsuranceCompany || "",
        Number.parseFloat(record.amount_to_be_paid || 0).toFixed(2),
        record.totalPaid || 0,
        record.status || "Pending",
      ]
        .map((field) => `"${field}"`)
        .join(","),
    )

    const grandTotalRow = [
      "", "", "", "", "", "GRAND TOTAL",
      `"${totalExpectedAmount.toFixed(2)}"`,
      `"${totalAmount.toFixed(2)}"`,
      "",
    ].join(",")

    const csvContent = [headers.join(","), ...dataRows, "", grandTotalRow].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rt_records_report_${fromDate.toLocaleDateString("en-CA")}_to_${toDate.toLocaleDateString("en-CA")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handlePrintReport = () => {
    const { totalAmount, totalExpectedAmount } = calculateTotals()
    const fromDateStr = fromDate.toLocaleDateString("en-CA")
    const toDateStr = toDate.toLocaleDateString("en-CA")

    const printWindow = window.open("", "_blank")

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Radiotherapy (RT) Records Report</title>
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
          .status-pending { background-color: #f44336; }
          .status-approved { background-color: #2196f3; }
          .status-collected { background-color: #ff9800; }
          tfoot { background-color: #f8f9fa; font-weight: bold; font-size: 12px; }
          tfoot td { border-top: 2px solid ${primaryColor}; }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Radiotherapy (RT) Records Report</h1>
          <p><strong>Period:</strong> ${fromDateStr} to ${toDateStr}</p>
          <p><strong>Total Records:</strong> ${filteredRecords.length}</p>
          ${selectedCompany ? `<p><strong>Company:</strong> ${selectedCompany}</p>` : ""}
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th><th>Date</th>
              <th>Patient Name</th><th>Admission</th><th>Discharge</th><th>Company</th>
              <th>Expected Amount</th><th>Total Paid</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords
        .map(
          (record, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${formatDateStr(record.date)}</td>
                <td>${record.patient_name || ""}</td>
                <td>${formatDateStr(record.date_of_admission)}</td>
                <td>${formatDateStr(record.date_of_discharge)}</td>
                <td>${record.insurance_type || ""}</td>
                <td>₹${Number.parseFloat(record.amount_to_be_paid || 0).toFixed(2)}</td>
                <td>₹${record.totalPaid.toFixed(2)}</td>
                <td>
                  <span class="status-badge ${record.status === "Pending" ? "status-pending" : "status-approved"}">
                    ${record.status || "Pending"}
                  </span>
                </td>
              </tr>
            `,
        )
        .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6" style="text-align: right;"><strong>GRAND TOTAL:</strong></td>
              <td><strong>₹${totalExpectedAmount.toFixed(2)}</strong></td>
              <td><strong>₹${totalAmount.toFixed(2)}</strong></td>
              <td></td>
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
      case "Paid": return "#10b981";
      case "Partially Paid": return "#f59e0b";
      case "Pending": return "#ef4444";
      default: return "#6b7280";
    }
  }

  const { totalAmount, totalExpectedAmount } = calculateTotals()

  return (
    <ReportContainer>
      
      <Container>
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0, flexWrap: 'wrap', gap: '10px' }}>
          <Title style={{ margin: 0, textAlign: 'left' }}>Radiotherapy (RT) Records Report</Title>
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
            <FormControl id="companyName" as="select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
              <option value="">All Companies</option>
              <option value="General Insurance">General Insurance</option>
              <option value="ECHS">ECHS</option>
              <option value="ESI">ESI</option>
              <option value="ESIC">ESIC</option>
              <option value="Railway CTSE">Railway CTSE</option>
            </FormControl>
          </FilterWrapper>

          <FilterWrapper>
            <Label>From Date</Label>
            <StyledDatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy-MM-dd"
              maxDate={toDate}
              placeholderText="Select from date"
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
              popperClassName="date-picker-popper"
            />
          </FilterWrapper>

          <FilterWrapper>
            <Label>To Date</Label>
            <StyledDatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={fromDate}
              placeholderText="Select to date"
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
              popperClassName="date-picker-popper"
            />
          </FilterWrapper>
        </FilterContainer>

        <ResultsInfo>Showing {filteredRecords.length} record(s)</ResultsInfo>

        <ScrollableTableContainer style={{ flex: 1, minHeight: 0 }}>
          <Table className="frozen-columns-table">
            <thead>
              <tr>
                <TableHeader className="frozen-col frozen-col-0">S.No</TableHeader>
                <TableHeader className="frozen-col frozen-col-1">Date</TableHeader>
                <TableHeader className="frozen-col frozen-col-2">Patient Name</TableHeader>
                <TableHeader>Admission</TableHeader>
                <TableHeader>Discharge</TableHeader>
                <TableHeader>Company</TableHeader>
                <TableHeader>Provider</TableHeader>
                <TableHeader>Expected Amount</TableHeader>
                <TableHeader>Total Paid</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                    <LoadingSpinnerContainer>
                      <Spinner />
                      <span>Loading records...</span>
                    </LoadingSpinnerContainer>
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <TableRow key={`${record.rt_id || record.id}-${index}`}>
                    <TableCell className="frozen-col frozen-col-0" style={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell className="frozen-col frozen-col-1" style={{ whiteSpace: "nowrap" }}>
                      {formatDateStr(record.date)}
                    </TableCell>
                    <TableCell className="frozen-col frozen-col-2">{record.patient_name}</TableCell>
                    <TableCell>{formatDateStr(record.date_of_admission)}</TableCell>
                    <TableCell>{formatDateStr(record.date_of_discharge) || "N/A"}</TableCell>
                    <TableCell>{record.insurance_type}</TableCell>
                    <TableCell>{record.specificInsuranceCompany || "-"}</TableCell>
                    <TableCell>₹{Number.parseFloat(record.amount_to_be_paid || 0).toFixed(2)}</TableCell>
                    <TableCell>₹{record.totalPaid.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge color={getStatusColor(record.status)}>
                        {record.status || "Pending"}
                      </StatusBadge>
                    </TableCell>
                    <ActionCell>
                      {(role === "Insurance Admin" || role === "Insurance Super Admin" || role === "Insurance AVP") && (
                        <EditButton onClick={() => handleEdit(record)}>
                          Edit
                        </EditButton>
                      )}
                      {(role === "Insurance Admin" || role === "Insurance Super Admin" || role === "Insurance AVP") && !record.is_approved && (
                        <button 
                          onClick={() => handleApprove(record)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          Approve
                        </button>
                      )}
                      <ViewButton onClick={() => handleView(record)}>
                        View
                      </ViewButton>
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
                        <History size={12} /> History ({record.editHistory?.length || 0})
                      </button>
                    </ActionCell>
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
                  <TableCell className="frozen-col frozen-col-0"></TableCell>
                  <TableCell className="frozen-col frozen-col-1"></TableCell>
                  <TableCell className="frozen-col frozen-col-2"></TableCell>
                  <TableCell colSpan="4" style={{ textAlign: "right" }}>
                    GRAND TOTAL:
                  </TableCell>
                  <TableCell>₹{totalExpectedAmount.toFixed(2)}</TableCell>
                  <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                  <TableCell colSpan="2"></TableCell>
                </tr>
              </tfoot>
            )}
          </Table>
        </ScrollableTableContainer>

        {viewModalData && (
          <ModalOverlay onClose={() => setViewModalData(null)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Payment History</h3>
              <button onClick={() => setViewModalData(null)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>
            <p><strong>Patient:</strong> {viewModalData.patient_name}</p>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Method</TableHeader>
                  <TableHeader>Amount</TableHeader>
                </tr>
              </thead>
              <tbody>
                {viewModalData.payment_details && viewModalData.payment_details.length > 0 ? (
                  viewModalData.payment_details.map((p, i) => (
                    <tr key={i}>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{p.payment_method}</TableCell>
                      <TableCell>₹{Number.parseFloat(p.amount || 0).toFixed(2)}</TableCell>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <TableCell colSpan="3" style={{ textAlign: 'center' }}>No payments found.</TableCell>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalOverlay>
        )}

        <style>{`
          .frozen-columns-table { border-collapse: separate !important; border-spacing: 0 !important; }
          .frozen-col { position: sticky !important; z-index: 10; background-color: #ffffff; outline: 1px solid #b0c4be; }
          .frozen-col-0 { left: 0px; min-width: 50px; text-align: center; }
          .frozen-col-1 { left: 50px; min-width: 100px; }
          .frozen-col-2 { left: 150px; min-width: 150px; box-shadow: 4px 0 6px -2px rgba(0,0,0,0.15); }
          thead tr th { position: sticky !important; top: 0; z-index: 11; background-color: #6F8B83; }
          thead .frozen-col { background-color: #6F8B83 !important; color: #fff; position: sticky !important; top: 0; z-index: 20 !important; outline: 1px solid #9aaea9; }
          tfoot .frozen-col { background-color: #f8f9fa !important; }
          tbody tr:nth-child(even) .frozen-col { background-color: #f9f9f9; }
          tbody tr:nth-child(odd) .frozen-col { background-color: #ffffff; }
          tbody tr:hover .frozen-col { background-color: #e8f0ee !important; }
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

      </Container>
    </ReportContainer>
  )
}

export default RTReport
