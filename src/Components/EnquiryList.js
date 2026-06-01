"use client"

import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import {
  ReportContainer,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  FilterContainer,
  FilterWrapper,
  Label,
  FormControl,
  Button,
  Container,
  SearchInput,
  SearchWrapper,
  ResultsInfo,
  ScrollableTableContainer,
  ResponsiveTableWrapper,
  StyledDatePicker,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

const primaryColor = "#6F8B83"

// ─── Follow Up Modal (GET to load, PUT to update) ─────────────────────────────
function FollowUpModal({ enquiry, onClose, onSaved }) {
  const [followUpDate, setFollowUpDate] = useState("")
  const [followUpNotes, setFollowUpNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // ── Load existing follow-up data on open ──
  useEffect(() => {
    const fetchFollowUp = async () => {
      setLoading(true)
      try {
        const result = await apiRequest(
          `${Insurancebaseurl}enquiry/update/${enquiry.enquiry_id}/`,
          "GET",
          null,
          true
        )
        if (result.success && result.data) {
          setFollowUpDate(result.data.follow_up_date || "")
          setFollowUpNotes(result.data.follow_up_notes || "")
        }
      } catch (error) {
        toast.error(`Failed to load follow-up: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchFollowUp()
  }, [enquiry.enquiry_id])

  // ── Save via PUT ──
  const handleSave = async () => {
    if (!followUpDate || !followUpNotes.trim()) {
      toast.error("Please fill in both Follow Up Date and Notes")
      return
    }

    setSaving(true)
    try {
      const result = await apiRequest(
        `${Insurancebaseurl}enquiry/update/${enquiry.enquiry_id}/`,
        "PUT",
        JSON.stringify({
          follow_up_date: followUpDate,
          follow_up_notes: followUpNotes.trim(),
        }),
        true,
        { "Content-Type": "application/json" }
      )

      if (result.success) {
        toast.success("✅ Follow up saved successfully!")
        onSaved()
        onClose()
      } else {
        toast.error(`❌ Failed: ${result.error || JSON.stringify(result.errors)}`)
      }
    } catch (error) {
      toast.error(`💥 Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={modalStyles.header}>
          <div>
            <h2 style={modalStyles.title}>Follow Up</h2>
            <p style={modalStyles.subtitle}>
              {enquiry.patientName} — {enquiry.opNumber || enquiry.ipNumber || "—"}
            </p>
          </div>
          <button style={modalStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={modalStyles.body}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "20px 0" }}>
              Loading follow-up details...
            </p>
          ) : (
            <>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>
                  Follow Up Date <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  style={modalStyles.input}
                />
              </div>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>
                  Follow Up Notes / Remarks <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Enter follow up notes..."
                  rows={5}
                  style={modalStyles.textarea}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={modalStyles.footer}>
          <button style={modalStyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...modalStyles.saveBtn, opacity: saving || loading ? 0.7 : 1 }}
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Follow Up"}
          </button>
        </div>

      </div>
    </div>
  )
}

const modalStyles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "20px 24px 16px",
    borderBottom: `3px solid ${primaryColor}`,
    background: "#f8faf9",
  },
  title: { margin: 0, fontSize: "18px", fontWeight: "700", color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: "13px", color: "#6b7280" },
  closeBtn: {
    background: "none", border: "none", fontSize: "18px",
    cursor: "pointer", color: "#6b7280", padding: "0 4px",
  },
  body: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: {
    padding: "9px 12px", border: "1px solid #d1d5db",
    borderRadius: "6px", fontSize: "14px", outline: "none",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "9px 12px", border: "1px solid #d1d5db",
    borderRadius: "6px", fontSize: "14px", outline: "none",
    fontFamily: "inherit", resize: "vertical",
  },
  footer: {
    display: "flex", justifyContent: "flex-end", gap: "10px",
    padding: "16px 24px", borderTop: "1px solid #e5e7eb", background: "#f8faf9",
  },
  cancelBtn: {
    padding: "9px 20px", background: "#f3f4f6", color: "#374151",
    border: "1px solid #d1d5db", borderRadius: "6px",
    fontSize: "14px", cursor: "pointer", fontWeight: "500",
  },
  saveBtn: {
    padding: "9px 20px", background: primaryColor, color: "#fff",
    border: "none", borderRadius: "6px",
    fontSize: "14px", cursor: "pointer", fontWeight: "600",
  },
}

// ─── EnquiryList ──────────────────────────────────────────────────────────────
function EnquiryList() {
  const [enquiries, setEnquiries] = useState([])
  const [filteredEnquiries, setFilteredEnquiries] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInsurance, setSelectedInsurance] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [followUpTarget, setFollowUpTarget] = useState(null)

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => { fetchEnquiries() }, [fromDate, toDate])
  useEffect(() => { filterEnquiries() }, [enquiries, searchTerm, selectedInsurance])

  const fetchEnquiries = async () => {
    setLoading(true)
    try {
      const response = await apiRequest(`${Insurancebaseurl}enquiry_list/`, "GET", null, {}, {
        params: {
          from_date: fromDate.toLocaleDateString("en-CA"),
          to_date: toDate.toLocaleDateString("en-CA"),
        },
      })
      if (response.success) {
        setEnquiries(response.data)
      } else {
        setEnquiries([])
        toast.error("Failed to load enquiries")
      }
    } catch {
      setEnquiries([])
      toast.error("Network error while loading enquiries")
    } finally {
      setLoading(false)
    }
  }

  const filterEnquiries = () => {
    let filtered = [...enquiries]
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.patientName?.toLowerCase().includes(term) ||
          e.opNumber?.toLowerCase().includes(term) ||
          e.ipNumber?.toLowerCase().includes(term) ||
          e.phoneNumber?.includes(term)
      )
    }
    if (selectedInsurance) {
      filtered = filtered.filter(
        (e) => e.insuranceName === selectedInsurance || e.specificInsuranceCompany === selectedInsurance
      )
    }
    setFilteredEnquiries(filtered)
  }

  const exportToCSV = () => {
    const headers = ["S.No","Date","OP Number","IP Number","Patient Name","Phone Number","Insurance Name","Insurance Provider","Reason For Approach"]
    const dataRows = filteredEnquiries.map((e, i) =>
      [i+1, e.date||"", e.opNumber||"", e.ipNumber||"", e.patientName||"", e.phoneNumber||"", e.insuranceName||"", e.specificInsuranceCompany||"", e.reasonForApproach||""]
        .map((f) => `"${f}"`).join(",")
    )
    const blob = new Blob([[headers.join(","), ...dataRows].join("\n")], { type: "text/csv;charset=utf-8;" })
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(blob)
    a.download = `enquiry_list_${fromDate.toLocaleDateString("en-CA")}_to_${toDate.toLocaleDateString("en-CA")}.csv`
    a.click()
  }

  const handlePrintReport = () => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Enquiry List Report</title>
      <style>
        @media print { @page { size: A4 landscape; margin: 15mm; } body { -webkit-print-color-adjust: exact; } }
        body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
        .report-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid ${primaryColor}; padding-bottom: 15px; }
        .report-header h1 { color: ${primaryColor}; margin: 0 0 10px 0; font-size: 24px; }
        .report-header p { margin: 5px 0; color: #666; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: ${primaryColor}; color: white; }
        tbody tr:nth-child(even) { background: #f9f9f9; }
        .print-buttons { text-align: center; margin: 20px 0; }
        .print-button { background: ${primaryColor}; color: white; border: none; padding: 12px 30px; font-size: 16px; cursor: pointer; border-radius: 5px; margin: 0 10px; }
        @media print { .print-buttons { display: none; } }
      </style></head><body>
      <div class="report-header">
        <h1>Enquiry List Report</h1>
        <p><strong>Period:</strong> ${fromDate.toLocaleDateString("en-CA")} to ${toDate.toLocaleDateString("en-CA")}</p>
        <p><strong>Total Records:</strong> ${filteredEnquiries.length}</p>
        ${selectedInsurance ? `<p><strong>Insurance:</strong> ${selectedInsurance}</p>` : ""}
      </div>
      <table><thead><tr>
        <th>S.No</th><th>Date</th><th>OP Number</th><th>IP Number</th>
        <th>Patient Name</th><th>Phone Number</th><th>Insurance Name</th>
        <th>Insurance Provider</th><th>Reason For Approach</th>
      </tr></thead><tbody>
        ${filteredEnquiries.map((e, i) => `<tr>
          <td>${i+1}</td><td>${e.date||""}</td><td>${e.opNumber||""}</td><td>${e.ipNumber||""}</td>
          <td>${e.patientName||""}</td><td>${e.phoneNumber||""}</td><td>${e.insuranceName||""}</td>
          <td>${e.specificInsuranceCompany||""}</td><td>${e.reasonForApproach||""}</td>
        </tr>`).join("")}
      </tbody></table>
      <div class="print-buttons">
        <button class="print-button" onclick="window.print()">🖨️ Print</button>
        <button class="print-button" onclick="window.close()">✕ Close</button>
      </div></body></html>
    `)
    printWindow.document.close()
  }

  return (
    <ReportContainer>
      <Toaster position="top-right" />

      {/* Follow Up Modal only */}
      {followUpTarget && (
        <FollowUpModal
          enquiry={followUpTarget}
          onClose={() => setFollowUpTarget(null)}
          onSaved={fetchEnquiries}
        />
      )}

      <Container>
        <Title>Enquiry List</Title>

        <FilterContainer>
          <SearchWrapper>
            <Label>Search</Label>
            <SearchInput
              type="text"
              placeholder="Search by name, OP/IP number, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>

          <FilterWrapper>
            <Label htmlFor="insuranceFilter">Filter by Insurance:</Label>
            <FormControl id="insuranceFilter" value={selectedInsurance} onChange={(e) => setSelectedInsurance(e.target.value)}>
              <option value="">All Insurance</option>
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
            <Label>From Date:</Label>
            <StyledDatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select from date"
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
              popperClassName="date-picker-popper"
            />
          </FilterWrapper>

          <FilterWrapper>
            <Label>To Date:</Label>
            <StyledDatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select to date"
              minDate={fromDate}
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
              popperClassName="date-picker-popper"
            />
          </FilterWrapper>

          <FilterWrapper>
            <Button onClick={exportToCSV} disabled={filteredEnquiries.length === 0}>Export CSV</Button>
          </FilterWrapper>
          <FilterWrapper>
            <Button onClick={handlePrintReport} disabled={filteredEnquiries.length === 0}>Print Report</Button>
          </FilterWrapper>
        </FilterContainer>

        <ResultsInfo>Showing {filteredEnquiries.length} result(s)</ResultsInfo>

        <ResponsiveTableWrapper>
          <ScrollableTableContainer>
            <Table className="frozen-columns-table">
              <thead>
                <tr>
                  <TableHeader className="frozen-col frozen-col-0">S.No</TableHeader>
                  <TableHeader className="frozen-col frozen-col-1">Date</TableHeader>
                  <TableHeader className="frozen-col frozen-col-2">Patient Name</TableHeader>
                  <TableHeader>Phone Number</TableHeader>
                  <TableHeader>OP Number</TableHeader>
                  <TableHeader>IP Number</TableHeader>
                  <TableHeader>Insurance Name</TableHeader>
                  <TableHeader>Insurance Provider</TableHeader>
                  <TableHeader>Reason For Approach</TableHeader>
                  <TableHeader style={{ textAlign: "center" }}>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan="10" style={{ textAlign: "center", padding: "40px" }}>
                      Loading enquiries...
                    </TableCell>
                  </TableRow>
                ) : filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enquiry, index) => (
                    <TableRow key={enquiry.enquiry_id || index}>
                      <TableCell className="frozen-col frozen-col-0" style={{ textAlign: "center" }}>{index + 1}</TableCell>
                      <TableCell className="frozen-col frozen-col-1" style={{ whiteSpace: "nowrap" }}>{enquiry.date || "—"}</TableCell>
                      <TableCell className="frozen-col frozen-col-2" style={{ fontWeight: "600" }}>{enquiry.patientName || "—"}</TableCell>
                      <TableCell>{enquiry.phoneNumber || "—"}</TableCell>
                      <TableCell>{enquiry.opNumber || "—"}</TableCell>
                      <TableCell>{enquiry.ipNumber || "—"}</TableCell>
                      <TableCell>{enquiry.insuranceName || "—"}</TableCell>
                      <TableCell>{enquiry.specificInsuranceCompany || "—"}</TableCell>
                      <TableCell
                        style={{ maxWidth: "220px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        title={enquiry.reasonForApproach}
                      >
                        {enquiry.reasonForApproach || "—"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <button
                          onClick={() => setFollowUpTarget(enquiry)}
                          style={{
                            padding: "5px 14px",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            border: "1px solid #bbf7d0",
                            borderRadius: "6px",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontWeight: "500",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff" }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#16a34a" }}
                        >
                          + Follow Up
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="10" style={{ textAlign: "center", padding: "40px" }}>
                      No enquiries found matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </ScrollableTableContainer>
        </ResponsiveTableWrapper>

        <style jsx global>{`
          .frozen-columns-table { position: relative; }
          .frozen-col { position: sticky !important; background-color: white; z-index: 10; }
          .frozen-col-0 { left: 0px; min-width: 60px; text-align: center; }
          .frozen-col-1 { left: 60px; min-width: 110px; }
          .frozen-col-2 { left: 170px; min-width: 160px; border-right: 2px solid #ddd; }
          .frozen-col-2::after { content: ''; position: absolute; top: 0; right: -10px; bottom: 0; width: 10px; background: linear-gradient(to right, rgba(0,0,0,0.1), transparent); pointer-events: none; }
          thead tr th { position: sticky !important; top: 0; z-index: 11; }
          thead .frozen-col { background-color: ${primaryColor}; position: sticky !important; top: 0; z-index: 20 !important; }
          tbody tr:hover .frozen-col { background-color: #f5f5f5; }
          .date-picker-popper, .react-datepicker-popper, .react-datepicker { z-index: 9999 !important; }
        `}</style>
      </Container>
    </ReportContainer>
  )
}

export default EnquiryList