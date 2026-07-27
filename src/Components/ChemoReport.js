import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"


import {
  ReportContainer,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  FilterContainer,
  Label,
  Input,
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
import { History, FileDown, Search, Filter, MoreVertical } from "lucide-react"
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

const ChemoReport = () => {
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

  const [activeDropdown, setActiveDropdown] = useState(null)
  const [combinedModalData, setCombinedModalData] = useState(null)
  const [activeTab, setActiveTab] = useState("edit_history")
  const [paymentModalData, setPaymentModalData] = useState(null)
  const [newPayment, setNewPayment] = useState({
    amount: "",
    payment_method: "",
    upi_details: "",
    date: new Date().toISOString().split("T")[0]
  })

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-dropdown-container')) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const url = `${Insurancebaseurl}chemo_records/`
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
    navigate("/ChemoForm", { state: record })
  }

  const handleView = (record) => {
    setViewModalData(record)
  }

  const handleCombinedViewDetails = (record) => {
    setCombinedModalData(record);
    setActiveTab("edit_history");
  }

  const handleAddPayment = async () => {
    const isAmountToBePaidYes = (
      paymentModalData.hasAmountToBePaid ||
      (paymentModalData.amount_to_be_paid && parseFloat(paymentModalData.amount_to_be_paid) > 0 ? "yes" : "no")
    ) === "yes";

    if (isAmountToBePaidYes && (!paymentModalData.amount_to_be_paid || Number.parseFloat(paymentModalData.amount_to_be_paid) <= 0)) {
      toast.error("Please enter a valid Amount to be Paid");
      return;
    }

    const hasNewPayment = isAmountToBePaidYes && newPayment.amount && Number.parseFloat(newPayment.amount) > 0;

    if (hasNewPayment) {
      if (!newPayment.date || !newPayment.payment_method) {
        toast.error("Please fill all required payment fields (Date, Amount, Payment Method)");
        return;
      }
      if (newPayment.payment_method === 'UPI' && !newPayment.upi_details) {
        toast.error("Please enter UPI details");
        return;
      }
    }

    const currentTotalPaid = paymentModalData.totalPaid || 0;
    const newAmount = hasNewPayment ? Number.parseFloat(newPayment.amount) : 0;
    const expectedAmount = isAmountToBePaidYes ? Number.parseFloat(paymentModalData.amount_to_be_paid || 0) : 0;

    if (expectedAmount > 0 && (currentTotalPaid + newAmount > expectedAmount)) {
      const exceededBy = (currentTotalPaid + newAmount) - expectedAmount;
      toast.error(`Cannot exceed expected amount (₹${expectedAmount.toFixed(2)}). Already paid: ₹${currentTotalPaid.toFixed(2)}. Exceeds by: ₹${exceededBy.toFixed(2)}.`);
      return;
    }

    let updatedPaymentDetails = paymentModalData.payment_details || [];
    if (hasNewPayment) {
      updatedPaymentDetails = [...updatedPaymentDetails, {
        amount: newAmount,
        payment_method: newPayment.payment_method,
        upi_details: newPayment.payment_method === 'UPI' ? newPayment.upi_details : "",
        date: newPayment.date
      }];
    }

    const totalPaid = updatedPaymentDetails.reduce((sum, p) => sum + Number.parseFloat(p.amount || 0), 0);

    let newStatus = paymentModalData.status;
    if (totalPaid === 0) {
      newStatus = "Pending";
    } else if (expectedAmount > 0 && totalPaid >= expectedAmount) {
      newStatus = "Paid";
    } else if (totalPaid > 0) {
      newStatus = "Partially Paid";
    }

    try {
      const payload = {
        amount_to_be_paid: isAmountToBePaidYes ? (paymentModalData.amount_to_be_paid || "") : "",
        payment_details: updatedPaymentDetails,
        status: newStatus
      };

      const url = `${Insurancebaseurl}chemorecords/${paymentModalData.chemo_id || paymentModalData.id}/`;
      const response = await apiRequest(url, "PUT", payload);

      if (response.success || response.status === 200 || response.status === 201) {
        toast.success("Payment details saved successfully");
        setPaymentModalData(null);
        setNewPayment({
          amount: "",
          payment_method: "",
          upi_details: "",
          date: new Date().toISOString().split("T")[0]
        });
        fetchRecords();
      } else {
        toast.error("Failed to save payment details");
      }
    } catch (error) {
      console.error("Error saving payment details:", error);
      toast.error("An error occurred while saving payment details");
    }
  }

  const exportToCSV = () => {
    const headers = [
      "S.No",
      "Date",
      "Patient Name",
      "UHID",
      "IP Number",
      "Admission Date",
      "Discharge Date",
      "Company Name",
      "Provider",
      "Medicine Details",
      "Expected Amount",
      "Total Paid",
      "Status",
      "Created By",
    ]

    const { totalAmount, totalExpectedAmount } = calculateTotals()

    const dataRows = filteredRecords.map((record, index) =>
      [
        index + 1,
        record.date || "",
        record.patient_name || "",
        record.patient_uhid || "",
        record.patient_ip_number || "",
        record.date_of_admission || "",
        record.date_of_discharge || "",
        record.insurance_type || "",
        record.specificInsuranceCompany || "",
        record.medicine_details || "",
        Number.parseFloat(record.amount_to_be_paid || 0).toFixed(2),
        record.totalPaid || 0,
        record.status || "Pending",
        record.created_by_name || record.created_by || "",
      ]
        .map((field) => `"${String(field).replace(/"/g, '""')}"`)
        .join(","),
    )

    const grandTotalRow = [
      "", "", "", "", "", "", "", "", "", "GRAND TOTAL",
      `"${totalExpectedAmount.toFixed(2)}"`,
      `"${totalAmount.toFixed(2)}"`,
      "", "",
    ].join(",")

    const csvContent = [headers.join(","), ...dataRows, "", grandTotalRow].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chemo_records_report_${fromDate.toLocaleDateString("en-CA")}_to_${toDate.toLocaleDateString("en-CA")}.csv`
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
        <title>Chemotherapy (Chemo) Records Report</title>
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
          <h1>Chemotherapy (Chemo) Records Report</h1>
          <p><strong>Period:</strong> ${fromDateStr} to ${toDateStr}</p>
          <p><strong>Total Records:</strong> ${filteredRecords.length}</p>
          ${selectedCompany ? `<p><strong>Company:</strong> ${selectedCompany}</p>` : ""}
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th><th>Date</th>
              <th>Patient Name</th><th>UHID</th><th>IP Number</th>
              <th>Admission</th><th>Discharge</th><th>Company</th>
              <th>Expected Amount</th><th>Total Paid</th><th>Status</th>
              <th>Created By</th>
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
                <td>${record.patient_uhid || ""}</td>
                <td>${record.patient_ip_number || ""}</td>
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
                <td>${record.created_by_name || record.created_by || "-"}</td>
              </tr>
            `,
        )
        .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="8" style="text-align: right;">GRAND TOTAL</td>
              <td>₹${totalExpectedAmount.toFixed(2)}</td>
              <td>₹${totalAmount.toFixed(2)}</td>
              <td colspan="2"></td>
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
          <Title style={{ margin: 0, textAlign: 'left' }}>Chemotherapy (Chemo) Records Report</Title>
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
              <option value="TKT">TKT</option>
              <option value="FCI">FCI</option>
              <option value="Airport">Airport</option>
              <option value="Pay Patient">Pay Patient</option>
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
                <TableHeader>UHID</TableHeader>
                <TableHeader>IP Number</TableHeader>
                <TableHeader>Admission</TableHeader>
                <TableHeader>Discharge</TableHeader>
                <TableHeader>Company</TableHeader>
                <TableHeader>Provider</TableHeader>
                <TableHeader>Expected Amount</TableHeader>
                <TableHeader>Total Paid</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Created By</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="14" style={{ textAlign: "center", padding: "20px" }}>
                    <LoadingSpinnerContainer>
                      <Spinner />
                      <span>Loading records...</span>
                    </LoadingSpinnerContainer>
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <TableRow key={`${record.chemo_id || record.id}-${index}`}>
                    <TableCell className="frozen-col frozen-col-0" style={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell className="frozen-col frozen-col-1" style={{ whiteSpace: "nowrap" }}>
                      {formatDateStr(record.date)}
                    </TableCell>
                    <TableCell className="frozen-col frozen-col-2">{record.patient_name}</TableCell>
                    <TableCell>{record.patient_uhid || "-"}</TableCell>
                    <TableCell>{record.patient_ip_number || "-"}</TableCell>
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
                    <TableCell>{record.created_by_name || record.created_by || "-"}</TableCell>
                    <ActionCell>
                      {(role === "Insurance Admin" || role === "Insurance Super Admin" || role === "Chemo Staff") ? (
                        <div style={{ position: "relative" }} className="action-dropdown-container">
                          <button onClick={() => toggleDropdown(record.chemo_id || record.id)} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "16px", padding: "4px 8px" }}>
                            <MoreVertical size={16} />
                          </button>
                          {activeDropdown === (record.chemo_id || record.id) && (
                            <div style={{ position: "absolute", right: "0", top: "100%", background: "white", border: "1px solid #ccc", borderRadius: "4px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", zIndex: 100, minWidth: "120px", textAlign: "left" }}>
                              {(role === "Insurance Admin" || role === "Insurance Super Admin") && (
                                <div
                                  style={{
                                    padding: "8px 12px",
                                    cursor: record.status === "Paid" ? "not-allowed" : "pointer",
                                    borderBottom: "1px solid #eee",
                                    fontSize: "13px",
                                    color: record.status === "Paid" ? "#9ca3af" : "inherit"
                                  }}
                                  onClick={() => {
                                    if (record.status !== "Paid") {
                                      setPaymentModalData(record);
                                      setActiveDropdown(null);
                                    }
                                  }}>
                                  Payment Details
                                </div>
                              )}
                              <div style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid #eee", fontSize: "13px" }} onClick={() => { handleEdit(record); setActiveDropdown(null); }}>
                                Edit
                              </div>
                              <div style={{ padding: "8px 12px", cursor: "pointer", fontSize: "13px" }} onClick={() => { handleCombinedViewDetails(record); setActiveDropdown(null); }}>
                                View Details
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <ViewButton onClick={() => handleCombinedViewDetails(record)}>
                          View Details
                        </ViewButton>
                      )}
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
                  <TableCell colSpan="6" style={{ textAlign: "right" }}>
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

        {paymentModalData && (
          <ModalOverlay onClose={() => setPaymentModalData(null)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Payment & Billing Details</h3>
              <button onClick={() => setPaymentModalData(null)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Patient:</strong> {paymentModalData.patient_name} ({paymentModalData.patient_uhid || 'N/A'})</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>
                <strong>Total Paid:</strong> ₹{(paymentModalData.totalPaid || 0).toFixed(2)} |
                <strong> Balance Due:</strong> ₹{Math.max(0, (parseFloat(paymentModalData.amount_to_be_paid) || 0) - (paymentModalData.totalPaid || 0)).toFixed(2)}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <Label style={{ fontWeight: 'bold' }}>Amount to be Paid</Label>
                <div style={{ display: "flex", gap: "15px", marginBottom: "10px", marginTop: "5px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="hasAmountToBePaidModal"
                      value="yes"
                      checked={(paymentModalData.hasAmountToBePaid || (paymentModalData.amount_to_be_paid && parseFloat(paymentModalData.amount_to_be_paid) > 0 ? "yes" : "no")) === "yes"}
                      onChange={() => setPaymentModalData({ ...paymentModalData, hasAmountToBePaid: "yes" })}
                    /> Yes
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="hasAmountToBePaidModal"
                      value="no"
                      checked={(paymentModalData.hasAmountToBePaid || (paymentModalData.amount_to_be_paid && parseFloat(paymentModalData.amount_to_be_paid) > 0 ? "yes" : "no")) === "no"}
                      onChange={() => setPaymentModalData({ ...paymentModalData, hasAmountToBePaid: "no", amount_to_be_paid: "" })}
                    /> No
                  </label>
                </div>
                {(paymentModalData.hasAmountToBePaid || (paymentModalData.amount_to_be_paid && parseFloat(paymentModalData.amount_to_be_paid) > 0 ? "yes" : "no")) === "yes" && (
                  <Input 
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter Amount to be Paid" 
                    value={paymentModalData.amount_to_be_paid || ""} 
                    onChange={(e) => setPaymentModalData({ ...paymentModalData, amount_to_be_paid: e.target.value })} 
                  />
                )}
              </div>

              {/* Add Payment Entry Section */}
              {(() => {
                const isYes = (paymentModalData.hasAmountToBePaid || (paymentModalData.amount_to_be_paid && parseFloat(paymentModalData.amount_to_be_paid) > 0 ? "yes" : "no")) === "yes";
                return (
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', opacity: isYes ? 1 : 0.5 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: isYes ? '#374151' : '#9ca3af' }}>
                      Add Payment Entry {!isYes && <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "normal" }}>(Disabled - Select "Yes" for Amount to be Paid)</span>}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <Label>Date</Label>
                        <Input type="date" value={newPayment.date} disabled={!isYes} onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })} />
                      </div>
                      <div>
                        <Label>Amount (₹)</Label>
                        <Input type="text" inputMode="decimal" placeholder="Enter amount" disabled={!isYes} value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} />
                      </div>
                      <div>
                        <Label>Payment Method</Label>
                        <Select value={newPayment.payment_method} disabled={!isYes} onChange={(e) => setNewPayment({ ...newPayment, payment_method: e.target.value })}>
                          <option value="">Select Method</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="UPI">UPI</option>
                        </Select>
                      </div>
                      {newPayment.payment_method === 'UPI' && (
                        <div>
                          <Label>UPI Transaction ID</Label>
                          <Input type="text" placeholder="Enter UPI details" disabled={!isYes} value={newPayment.upi_details || ''} onChange={(e) => setNewPayment({ ...newPayment, upi_details: e.target.value })} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Save Details Button */}

              <Button onClick={handleAddPayment} style={{ marginTop: '10px', background: primaryColor }}>Save Details</Button>
            </div>
          </ModalOverlay>
        )}

        {combinedModalData && (
          <ModalOverlay onClose={() => setCombinedModalData(null)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Details: {combinedModalData.patient_name}</h3>
              <button onClick={() => setCombinedModalData(null)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>

            {combinedModalData.medicine_details && (
              <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                <strong style={{ color: "#374151" }}>Medicine Details:</strong>
                <p style={{ margin: "5px 0 0 0", color: "#4b5563", fontSize: "14px", whiteSpace: "pre-wrap" }}>
                  {combinedModalData.medicine_details}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <button
                onClick={() => setActiveTab("edit_history")}
                style={{ background: activeTab === "edit_history" ? primaryColor : "transparent", color: activeTab === "edit_history" ? "white" : "#666", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                Edit History
              </button>
              <button
                onClick={() => setActiveTab("payment_history")}
                style={{ background: activeTab === "payment_history" ? primaryColor : "transparent", color: activeTab === "payment_history" ? "white" : "#666", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                Payment History
              </button>
            </div>

            {activeTab === "edit_history" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "60vh", overflowY: "auto" }}>
                {combinedModalData.editHistory && combinedModalData.editHistory.length > 0 ? (
                  combinedModalData.editHistory.map((history, index) => (
                    <div key={index} style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ fontWeight: "bold", color: "#334155" }}>
                          {new Date(history.edited_date).toLocaleString()}
                        </span>
                        <span style={{ fontSize: "14px", color: "#64748b" }}>
                          By: {history.edited_by_name || history.edited_by || "Unknown"}
                        </span>
                      </div>
                      {history.reason && (
                        <div style={{ marginBottom: "12px", padding: "8px", background: "#fff", borderRadius: "4px", fontSize: "14px", color: "#475569" }}>
                          <strong>Reason:</strong> {history.reason}
                        </div>
                      )}
                      {history.changes && history.changes.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {history.changes.map((change, i) => (
                            <div key={i} style={{ fontSize: "13px", padding: "8px", background: "#fff", borderRadius: "4px", border: "1px solid #f1f5f9" }}>
                              <strong style={{ color: "#0f172a" }}>{change.field}:</strong>{" "}
                              <span style={{ color: "#ef4444", textDecoration: "line-through" }}>{change.before || "Empty"}</span>
                              {" ➔ "}
                              <span style={{ color: "#22c55e", fontWeight: "500" }}>{change.after || "Empty"}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic" }}>
                          No specific field changes recorded
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                    No edit history available for this record.
                  </div>
                )}
              </div>
            )}

            {activeTab === "payment_history" && (
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Method</TableHeader>
                    <TableHeader>UPI Details</TableHeader>
                    <TableHeader>Amount</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {combinedModalData.payment_details && combinedModalData.payment_details.length > 0 ? (
                    combinedModalData.payment_details.map((p, i) => (
                      <tr key={i}>
                        <TableCell>{p.date}</TableCell>
                        <TableCell>{p.payment_method}</TableCell>
                        <TableCell>{p.payment_method === 'UPI' ? (p.upi_details || '-') : '-'}</TableCell>
                        <TableCell>₹{Number.parseFloat(p.amount || 0).toFixed(2)}</TableCell>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <TableCell colSpan="4" style={{ textAlign: 'center' }}>No payments found.</TableCell>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
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
      </Container>
    </ReportContainer>
  )
}

export default ChemoReport
