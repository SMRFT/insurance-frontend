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
const accentColor = "#9aaea9"

function EnquiryDetailPage() {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInsurance, setSelectedInsurance] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => { fetchRecords() }, [fromDate, toDate])
  useEffect(() => { filterRecords() }, [records, searchTerm, selectedInsurance])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      // This endpoint should return enquiries with their follow_ups array nested
      const response = await apiRequest(`${Insurancebaseurl}enquiry_with_followups/`, "GET", null, {}, {
        params: {
          from_date: fromDate.toLocaleDateString("en-CA"),
          to_date: toDate.toLocaleDateString("en-CA"),
        },
      })
      if (response.success) {
        setRecords(response.data)
      } else {
        setRecords([])
        toast.error("Failed to load records")
      }
    } catch {
      setRecords([])
      toast.error("Network error while loading records")
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = [...records]
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
    setFilteredRecords(filtered)
  }

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const expandAll = () => {
    setExpandedRows(new Set(filteredRecords.map((e) => e.enquiry_id)))
  }

  const collapseAll = () => {
    setExpandedRows(new Set())
  }

  const totalFollowUps = filteredRecords.reduce(
    (sum, e) => sum + (e.follow_ups?.length || 0), 0
  )

  const exportToCSV = () => {
    const rows = []
    rows.push([
      "S.No", "Date", "Patient Name", "Phone", "OP Number", "IP Number",
      "Insurance", "Insurance Provider", "Reason For Approach",
      "Follow Up #", "Follow Up Date", "Follow Up Notes",
    ].join(","))

    filteredRecords.forEach((e, i) => {
      const base = [
        i + 1, e.date || "", e.patientName || "", e.phoneNumber || "",
        e.opNumber || "", e.ipNumber || "", e.insuranceName || "",
        e.specificInsuranceCompany || "", e.reasonForApproach || "",
      ].map((f) => `"${f}"`)

      if (!e.follow_ups?.length) {
        rows.push([...base, '""', '""', '""'].join(","))
      } else {
        e.follow_ups.forEach((fu, fi) => {
          rows.push([
            ...base,
            `"${fi + 1}"`,
            `"${fu.follow_up_date || ""}"`,
            `"${fu.follow_up_notes || ""}"`,
          ].join(","))
        })
      }
    })

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(blob)
    a.download = `enquiry_details_${fromDate.toLocaleDateString("en-CA")}_to_${toDate.toLocaleDateString("en-CA")}.csv`
    a.click()
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Enquiry Detail Report</title>
      <style>
        @media print { @page { size: A4 landscape; margin: 15mm; } body { -webkit-print-color-adjust: exact; } }
        body { font-family: Arial, sans-serif; padding: 20px; margin: 0; font-size: 12px; }
        .report-header { text-align: center; margin-bottom: 24px; border-bottom: 3px solid ${primaryColor}; padding-bottom: 14px; }
        .report-header h1 { color: ${primaryColor}; margin: 0 0 8px 0; font-size: 22px; }
        .report-header p { margin: 4px 0; color: #666; font-size: 13px; }
        .enquiry-block { margin-bottom: 24px; break-inside: avoid; }
        .enquiry-title { background: ${primaryColor}; color: white; padding: 8px 14px; font-weight: bold; font-size: 13px; border-radius: 4px 4px 0 0; display: flex; justify-content: space-between; }
        .enquiry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 12px 14px; background: #f8faf9; border: 1px solid #ddd; border-top: none; }
        .enquiry-field label { font-size: 10px; color: #888; display: block; margin-bottom: 2px; }
        .enquiry-field span { font-size: 12px; color: #111; font-weight: 500; }
        .followups-section { border: 1px solid #ddd; border-top: none; }
        .followups-header { padding: 7px 14px; font-size: 11px; font-weight: bold; color: ${primaryColor}; background: #f0f7f5; border-bottom: 1px solid #ddd; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #e5e7eb; padding: 7px 10px; text-align: left; }
        th { background: #e8f0ee; color: #374151; font-weight: 600; }
        .no-followups { padding: 10px 14px; color: #9ca3af; font-size: 12px; font-style: italic; }
        .print-buttons { text-align: center; margin: 20px 0; }
        .print-button { background: ${primaryColor}; color: white; border: none; padding: 10px 24px; font-size: 14px; cursor: pointer; border-radius: 5px; margin: 0 8px; }
        @media print { .print-buttons { display: none; } }
      </style></head><body>
      <div class="report-header">
        <h1>Enquiry Detail Report</h1>
        <p><strong>Period:</strong> ${fromDate.toLocaleDateString("en-CA")} to ${toDate.toLocaleDateString("en-CA")}</p>
        <p><strong>Total Enquiries:</strong> ${filteredRecords.length} &nbsp;|&nbsp; <strong>Total Follow Ups:</strong> ${totalFollowUps}</p>
      </div>
      ${filteredRecords.map((e, i) => `
        <div class="enquiry-block">
          <div class="enquiry-title">
            <span>#${i + 1} — ${e.patientName || "—"}</span>
            <span>${e.follow_ups?.length || 0} follow up(s)</span>
          </div>
          <div class="enquiry-grid">
            <div class="enquiry-field"><label>Date</label><span>${e.date || "—"}</span></div>
            <div class="enquiry-field"><label>Phone</label><span>${e.phoneNumber || "—"}</span></div>
            <div class="enquiry-field"><label>OP Number</label><span>${e.opNumber || "—"}</span></div>
            <div class="enquiry-field"><label>IP Number</label><span>${e.ipNumber || "—"}</span></div>
            <div class="enquiry-field"><label>Insurance</label><span>${e.insuranceName || "—"}</span></div>
            <div class="enquiry-field"><label>Provider</label><span>${e.specificInsuranceCompany || "—"}</span></div>
            <div class="enquiry-field" style="grid-column: span 2"><label>Reason For Approach</label><span>${e.reasonForApproach || "—"}</span></div>
          </div>
          <div class="followups-section">
            <div class="followups-header">Follow Up History (${e.follow_ups?.length || 0})</div>
            ${e.follow_ups?.length ? `
              <table><thead><tr><th>#</th><th>Follow Up Date</th><th>Notes / Remarks</th></tr></thead>
              <tbody>${e.follow_ups.map((fu, fi) => `
                <tr><td>${fi + 1}</td><td>${fu.follow_up_date || "—"}</td><td>${fu.follow_up_notes || "—"}</td></tr>
              `).join("")}</tbody></table>
            ` : `<div class="no-followups">No follow ups recorded</div>`}
          </div>
        </div>
      `).join("")}
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
      <Container>
        <Title>Enquiry Detail — Follow Up History</Title>

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
            <Label htmlFor="insFilter">Filter by Insurance:</Label>
            <FormControl id="insFilter" value={selectedInsurance} onChange={(e) => setSelectedInsurance(e.target.value)}>
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
              onChange={(d) => setFromDate(d)}
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
              onChange={(d) => setToDate(d)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select to date"
              minDate={fromDate}
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
              popperClassName="date-picker-popper"
            />
          </FilterWrapper>

          <FilterWrapper>
            <Button onClick={expandAll}>Expand All</Button>
          </FilterWrapper>
          <FilterWrapper>
            <Button onClick={collapseAll} style={{ background: accentColor }}>Collapse All</Button>
          </FilterWrapper>
          <FilterWrapper>
            <Button onClick={exportToCSV} disabled={filteredRecords.length === 0}>Export CSV</Button>
          </FilterWrapper>
          <FilterWrapper>
            <Button onClick={handlePrint} disabled={filteredRecords.length === 0}>Print Report</Button>
          </FilterWrapper>
        </FilterContainer>

        {/* Summary bar */}
        <div style={summaryBar}>
          <span>Showing <strong>{filteredRecords.length}</strong> enquiry(s)</span>
          <span style={{ margin: "0 12px", color: "#d1d5db" }}>|</span>
          <span><strong>{totalFollowUps}</strong> total follow up(s)</span>
        </div>

        {/* Expandable rows */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading records...</div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>No records found</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredRecords.map((enquiry, index) => {
              const isExpanded = expandedRows.has(enquiry.enquiry_id)
              const followUpCount = enquiry.follow_ups?.length || 0

              return (
                <div key={enquiry.enquiry_id || index} style={cardStyles.card}>
                  {/* Enquiry row — click to toggle */}
                  <div
                    style={cardStyles.header}
                    onClick={() => toggleRow(enquiry.enquiry_id)}
                  >
                    {/* Left: index + patient */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                      <span style={cardStyles.index}>{index + 1}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={cardStyles.name}>{enquiry.patientName || "—"}</div>
                        <div style={cardStyles.meta}>
                          {enquiry.date || "—"}
                          {enquiry.opNumber && <span style={cardStyles.badge("#eff6ff","#2563eb")}>{enquiry.opNumber}</span>}
                          {enquiry.ipNumber && <span style={cardStyles.badge("#f0fdf4","#16a34a")}>{enquiry.ipNumber}</span>}
                          {enquiry.phoneNumber && <span>📞 {enquiry.phoneNumber}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Right: insurance + follow-up count + chevron */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                      {enquiry.insuranceName && (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{enquiry.insuranceName}</div>
                          {enquiry.specificInsuranceCompany && (
                            <div style={{ fontSize: "12px", color: "#6b7280" }}>{enquiry.specificInsuranceCompany}</div>
                          )}
                        </div>
                      )}
                      <span style={{
                        ...cardStyles.badge(
                          followUpCount > 0 ? "#f0fdf4" : "#f9fafb",
                          followUpCount > 0 ? "#16a34a" : "#9ca3af"
                        ),
                        minWidth: "80px", textAlign: "center",
                      }}>
                        {followUpCount} follow up{followUpCount !== 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: "18px", color: primaryColor, transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>
                        ›
                      </span>
                    </div>
                  </div>

                  {/* Reason (always visible) */}
                  {enquiry.reasonForApproach && (
                    <div style={cardStyles.reason}>
                      <span style={{ color: "#9ca3af", fontSize: "12px", marginRight: "6px" }}>Reason:</span>
                      {enquiry.reasonForApproach}
                    </div>
                  )}

                  {/* Follow Up History (expanded) */}
                  {isExpanded && (
                    <div style={cardStyles.followUpsSection}>
                      <div style={cardStyles.followUpsHeader}>
                        Follow Up History
                      </div>
                      {followUpCount === 0 ? (
                        <div style={cardStyles.noFollowUps}>No follow ups recorded yet.</div>
                      ) : (
                        <ResponsiveTableWrapper>
                          <ScrollableTableContainer>
                            <Table>
                              <thead>
                                <tr>
                                  <TableHeader style={{ width: "60px" }}>#</TableHeader>
                                  <TableHeader style={{ width: "160px" }}>Follow Up Date</TableHeader>
                                  <TableHeader>Notes / Remarks</TableHeader>
                                </tr>
                              </thead>
                              <tbody>
                                {enquiry.follow_ups.map((fu, fi) => (
                                  <TableRow key={fi}>
                                    <TableCell style={{ textAlign: "center" }}>{fi + 1}</TableCell>
                                    <TableCell style={{ whiteSpace: "nowrap" }}>{fu.follow_up_date || "—"}</TableCell>
                                    <TableCell>{fu.follow_up_notes || "—"}</TableCell>
                                  </TableRow>
                                ))}
                              </tbody>
                            </Table>
                          </ScrollableTableContainer>
                        </ResponsiveTableWrapper>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <style jsx global>{`
          .date-picker-popper, .react-datepicker-popper, .react-datepicker { z-index: 9999 !important; }
        `}</style>
      </Container>
    </ReportContainer>
  )
}

const summaryBar = {
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  background: "#f0f7f5",
  borderRadius: "8px",
  border: `1px solid #d1e8e4`,
  marginBottom: "16px",
  fontSize: "14px",
  color: "#374151",
}

const cardStyles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    cursor: "pointer",
    background: "#fff",
    gap: "12px",
    userSelect: "none",
  },
  index: {
    width: "28px", height: "28px",
    background: primaryColor, color: "#fff",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "700", flexShrink: 0,
  },
  name: {
    fontSize: "15px", fontWeight: "700", color: "#111827",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  meta: {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "12px", color: "#6b7280", marginTop: "3px", flexWrap: "wrap",
  },
  badge: (bg, color) => ({
    padding: "2px 8px", borderRadius: "12px",
    fontSize: "12px", fontWeight: "600",
    background: bg, color: color,
  }),
  reason: {
    padding: "6px 18px 10px 60px",
    fontSize: "13px", color: "#4b5563",
    borderTop: "1px solid #f3f4f6",
    background: "#fafafa",
  },
  followUpsSection: {
    borderTop: `2px solid ${primaryColor}`,
  },
  followUpsHeader: {
    padding: "8px 18px",
    fontSize: "12px", fontWeight: "700",
    color: primaryColor,
    background: "#f0f7f5",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  noFollowUps: {
    padding: "18px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "13px",
    fontStyle: "italic",
  },
}

export default EnquiryDetailPage