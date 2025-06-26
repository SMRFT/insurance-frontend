"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import {
  FormWrapper,
  FormContainer,
  Title,
  Form,
  FormSection,
  SectionTitle,
  Label,
  Input,
  Select,
  Button,
  ButtonWrapper,
} from "./SharedStyledComponents"

const OtherForm = ({ editData = null, onSuccess }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Get edit data from navigation state
  const editDataFromNav = location.state || editData

  const [formData, setFormData] = useState({
    date: "",
    patientName: "",
    patientUhid: "",
    mobileNumber: "",
    companyName: "",
    treatment: "",
    refund: "",
  })

  // Payment entries state - always start with one entry
  const [paymentEntries, setPaymentEntries] = useState([
    {
      id: Date.now(),
      amount: "",
      payment_method: "",
      date: "",
    },
  ])

  const [loading, setLoading] = useState(false)
  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // Debug: Log the edit data to see what we're receiving
  useEffect(() => {
    console.log("Edit data received:", editDataFromNav)
  }, [editDataFromNav])

  // Populate form data when editing
  useEffect(() => {
    if (editDataFromNav) {
      setFormData({
        date: editDataFromNav.date || "",
        patientName: editDataFromNav.patient_name || "",
        patientUhid: editDataFromNav.patient_uhid || "",
        mobileNumber: editDataFromNav.mobile_number || "",
        companyName: editDataFromNav.company_name || "",
        treatment: editDataFromNav.treatment || "",
        refund: editDataFromNav.refund ? editDataFromNav.refund.toString() : "",
      })

      // For editing, start with empty payment entries (new payments to add)
      setPaymentEntries([
        {
          id: Date.now(),
          amount: "",
          payment_method: "",
          date: "",
        },
      ])
    }
  }, [editDataFromNav])

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentEntryChange = (entryId, field, value) => {
    setPaymentEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry)))
  }

  const addPaymentEntry = () => {
    const newEntry = {
      id: Date.now(),
      amount: "",
      payment_method: "",
      date: "",
    }
    setPaymentEntries((prev) => [...prev, newEntry])
  }

  const removePaymentEntry = (entryId) => {
    if (paymentEntries.length > 1) {
      setPaymentEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.patientName || !formData.patientUhid || !formData.mobileNumber) {
      alert("Please fill all required fields")
      setLoading(false)
      return
    }

    // Mobile number validation
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number")
      setLoading(false)
      return
    }

    // Validate payment entries
    const validPaymentEntries = paymentEntries.filter((entry) => entry.amount && Number.parseFloat(entry.amount) > 0)

    if (validPaymentEntries.length === 0) {
      alert("Please enter at least one payment entry with amount")
      setLoading(false)
      return
    }

    // Date validation - prevent future dates for payment entries
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    for (const entry of validPaymentEntries) {
      if (entry.date) {
        const entryDate = new Date(entry.date)
        if (entryDate > today) {
          alert("Future dates are not allowed for payment entries")
          setLoading(false)
          return
        }
      }

      // Validate required fields for each payment entry
      if (!entry.payment_method || !entry.date) {
        alert("Please fill all required fields for payment entries (Amount, Payment Method, Date)")
        setLoading(false)
        return
      }
    }

    try {
      // Prepare payment entries for backend
      const paymentDetailsForBackend = validPaymentEntries.map((entry) => ({
        amount: Number.parseFloat(entry.amount),
        payment_method: entry.payment_method,
        date: entry.date,
      }))

      const payload = {
        date: formData.date,
        patient_name: formData.patientName,
        patient_uhid: formData.patientUhid,
        mobile_number: formData.mobileNumber,
        company_name: formData.companyName,
        treatment: formData.treatment,
        refund: formData.refund || "0",
        payment_details: paymentDetailsForBackend,
      }

      let response

      // Check if we're in edit mode - look for any ID field
      const isEditMode =
        editDataFromNav &&
        (editDataFromNav.id || editDataFromNav._id || (editDataFromNav._id && editDataFromNav._id.$oid))

      console.log("Is edit mode:", isEditMode)
      console.log("Edit data ID:", editDataFromNav?.id || editDataFromNav?._id)

      if (isEditMode) {
        // Update existing record - this will append new payment details
        let recordId = editDataFromNav.id

        // Handle different ID formats
        if (editDataFromNav._id) {
          if (typeof editDataFromNav._id === "object" && editDataFromNav._id.$oid) {
            recordId = editDataFromNav._id.$oid
          } else {
            recordId = editDataFromNav._id
          }
        }

        payload.id = recordId

        console.log("Making PUT request with payload:", payload)
        response = await axios.put(`${Insurancebaseurl}other_records/`, payload)
      } else {
        // Create new record
        console.log("Making POST request with payload:", payload)
        response = await axios.post(`${Insurancebaseurl}other_records/`, payload)
      }

      if (response.status === 200 || response.status === 201) {
        alert(isEditMode ? "Record updated successfully!" : "Record created successfully!")

        if (!isEditMode) {
          // Reset form for new entries
          setFormData({
            date: "",
            patientName: "",
            patientUhid: "",
            mobileNumber: "",
            companyName: "",
            treatment: "",
            refund: "",
          })
          setPaymentEntries([
            {
              id: Date.now(),
              amount: "",
              payment_method: "",
              date: "",
            },
          ])
        } else {
          // Navigate back to the update page after editing
          navigate("/OtherUpdate")
        }

        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      console.error("Error response:", error.response?.data)
      alert(`Error submitting form: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/OtherUpdate")
  }

  return (
    <FormWrapper>
      <FormContainer>
        <Title>{editDataFromNav ? "Edit Other Record" : "Other Form"}</Title>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Patient Information</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div>
                <Label>Date</Label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} max={getTodayDate()} />
              </div>
              <div>
                <Label>Patient Name *</Label>
                <Input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required />
              </div>
              <div>
                <Label>Patient UHID *</Label>
                <Input type="text" name="patientUhid" value={formData.patientUhid} onChange={handleChange} required />
              </div>
              <div>
                <Label>Mobile Number *</Label>
                <Input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
            </div>
          </FormSection>

          <FormSection>
            <SectionTitle>Insurance & Treatment Details</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <Label>Company Name</Label>
                <Select name="companyName" value={formData.companyName} onChange={handleChange}>
                  <option value="">Select Company</option>
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
                <Label>Treatment</Label>
                <Input type="text" name="treatment" value={formData.treatment} onChange={handleChange} />
              </div>
            </div>
          </FormSection>

          {/* Refund Section */}
          <FormSection>
            <SectionTitle>Refund Details</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
              <div>
                <Label>Refund Amount</Label>
                <Input
                  type="number"
                  name="refund"
                  value={formData.refund}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter refund amount"
                />
              </div>
            </div>
          </FormSection>

          {/* Payment Details Section */}
          <FormSection>
            <SectionTitle style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {editDataFromNav ? "Add New Payment Details" : "Payment Details"}
              <Button
                type="button"
                onClick={addPaymentEntry}
                style={{
                  backgroundColor: "#28a745",
                  padding: "6px 12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginLeft: "auto",
                }}
              >
                +
              </Button>
            </SectionTitle>

            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              {paymentEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "15px",
                    alignItems: "end",
                    marginBottom: index < paymentEntries.length - 1 ? "15px" : "0",
                    paddingBottom: index < paymentEntries.length - 1 ? "15px" : "0",
                    borderBottom: index < paymentEntries.length - 1 ? "1px solid #ddd" : "none",
                  }}
                >
                  <div>
                    <Label>Amount *</Label>
                    <Input
                      type="number"
                      value={entry.amount}
                      onChange={(e) => handlePaymentEntryChange(entry.id, "amount", e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div>
                    <Label>Payment Method *</Label>
                    <Select
                      value={entry.payment_method}
                      onChange={(e) => handlePaymentEntryChange(entry.id, "payment_method", e.target.value)}
                      required
                    >
                      <option value="">Select Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handlePaymentEntryChange(entry.id, "date", e.target.value)}
                      max={getTodayDate()}
                      required
                    />
                  </div>
                  <div>
                    {paymentEntries.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePaymentEntry(entry.id)}
                        style={{
                          backgroundColor: "#dc3545",
                          padding: "8px 12px",
                          fontSize: "14px",
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          <ButtonWrapper>
            {editDataFromNav && (
              <Button type="button" onClick={handleCancel} style={{ backgroundColor: "#6c757d", marginRight: "10px" }}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : editDataFromNav ? "Update Record" : "Submit"}
            </Button>
          </ButtonWrapper>
        </Form>
      </FormContainer>
    </FormWrapper>
  )
}

export default OtherForm
