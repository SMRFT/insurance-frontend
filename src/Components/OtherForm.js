import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast'
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
import apiRequest from "./ApiRequest";

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
    ipOpType: "",
    doctorName: "",
    companyName: "",
    treatment: "",
    hasRefund: false,
    refundAmount: "",
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
  const [doctorsList, setDoctorsList] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  
  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // Fetch doctors list
useEffect(() => {
  const fetchDoctors = async () => {
    setLoadingDoctors(true)
    try {
      const response = await apiRequest(
        `${Insurancebaseurl}get_doctor_list/`,
        "GET"
      )
      
      console.log("Doctors API Response:", response) // Debug log
      
      // Handle both response formats
      let doctorsData = []
      
      if (Array.isArray(response)) {
        // Direct array response
        doctorsData = response
      } else if (response && response.data && Array.isArray(response.data)) {
        // Wrapped in data object
        doctorsData = response.data
      } else if (response && Array.isArray(response.doctors)) {
        // Wrapped in doctors object
        doctorsData = response.doctors
      } else {
        console.error("Unexpected response format:", response)
        toast.error("Invalid response format from doctors API", {
          duration: 3000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        })
        setDoctorsList([])
        setLoadingDoctors(false)
        return
      }
      
      // Filter only active doctors
      const activeDoctors = doctorsData.filter(doctor => doctor.is_active === true)
      
      // Sort by doctor name
      const sortedDoctors = activeDoctors.sort((a, b) => {
        const nameA = (a.doctor_name || "").trim()
        const nameB = (b.doctor_name || "").trim()
        return nameA.localeCompare(nameB)
      })
      
      console.log("Active Doctors Count:", activeDoctors.length) // Debug log
      console.log("Sorted Doctors:", sortedDoctors) // Debug log
      
      setDoctorsList(sortedDoctors)
      
      if (sortedDoctors.length === 0) {
        toast.info("No active doctors found", {
          duration: 3000,
        })
      } else {
        console.log(`✅ Loaded ${sortedDoctors.length} doctors successfully`)
      }
    } catch (error) {
      console.error("Error fetching doctors list:", error)
      console.error("Error details:", error.response || error.message)
      toast.error("Failed to load doctors list", {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      })
      setDoctorsList([])
    } finally {
      setLoadingDoctors(false)
    }
  }

  if (Insurancebaseurl) {
    fetchDoctors()
  } else {
    console.error("Insurancebaseurl is not defined")
    toast.error("Backend URL not configured", {
      duration: 3000,
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    })
  }
}, [Insurancebaseurl])

  // Debug: Log the edit data to see what we're receiving
  useEffect(() => {
    console.log("Edit data received:", editDataFromNav)
  }, [editDataFromNav])

  // Populate form data when editing
  useEffect(() => {
    if (editDataFromNav) {
      const refundValue = editDataFromNav.refund || "0"
      // has_refund is independent - check the actual boolean field
      const hasRefundValue = editDataFromNav.has_refund === true
      
      setFormData({
        date: editDataFromNav.date || "",
        patientName: editDataFromNav.patient_name || "",
        patientUhid: editDataFromNav.patient_uhid || "",
        mobileNumber: editDataFromNav.mobile_number || "",
        ipOpType: editDataFromNav.ip_op_type || "",
        doctorName: editDataFromNav.doctor_name || "",
        companyName: editDataFromNav.company_name || "",
        treatment: editDataFromNav.treatment || "",
        hasRefund: hasRefundValue,
        refundAmount: refundValue,
      })

      // Populate existing payment details when editing
      if (editDataFromNav.payment_details && editDataFromNav.payment_details.length > 0) {
        const existingPayments = editDataFromNav.payment_details.map((payment, index) => ({
          id: Date.now() + index,
          amount: payment.amount ? payment.amount.toString() : "",
          payment_method: payment.payment_method || "",
          date: payment.date || "",
          isExisting: true,
        }))

        const newPaymentEntry = {
          id: Date.now() + editDataFromNav.payment_details.length,
          amount: "",
          payment_method: "",
          date: "",
          isExisting: false,
        }

        setPaymentEntries([...existingPayments, newPaymentEntry])
      } else {
        setPaymentEntries([
          {
            id: Date.now(),
            amount: "",
            payment_method: "",
            date: "",
            isExisting: false,
          },
        ])
      }
      
      toast.success("📝 Form data loaded for editing", {
        duration: 2000,
        icon: '✏️',
      })
    }
  }, [editDataFromNav])

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    toast.success("➕ New payment entry added!", {
      duration: 2000,
      style: {
        background: '#10b981',
        color: '#fff',
      },
    })
  }

  const removePaymentEntry = (entryId) => {
    if (paymentEntries.length > 1) {
      setPaymentEntries((prev) => prev.filter((entry) => entry.id !== entryId))
      toast.success("🗑️ Payment entry removed", {
        duration: 2000,
        style: {
          background: '#f59e0b',
          color: '#fff',
        },
      })
    } else {
      toast.error("⚠️ At least one payment entry is required", {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const loadingToast = toast.loading("Processing your request...", {
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    })

    const hasAnyData =
      Object.values(formData).some((value) => {
        if (typeof value === 'boolean') return false // Skip boolean values
        return value && value.toString().trim() !== ""
      }) ||
      paymentEntries.some((entry) => entry.amount || entry.payment_method || entry.date)

    if (!hasAnyData) {
      toast.dismiss(loadingToast)
      toast.error("📋 Please enter at least some information", {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      })
      setLoading(false)
      return
    }

    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      toast.dismiss(loadingToast)
      toast.error("📱 Please enter a valid 10-digit mobile number", {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      })
      setLoading(false)
      return
    }

    const validPaymentEntries = paymentEntries.filter(
      (entry) => !entry.isExisting && (entry.amount || entry.payment_method || entry.date),
    )

    try {
      const paymentDetailsForBackend = validPaymentEntries.map((entry) => ({
        amount: entry.amount ? Number.parseFloat(entry.amount) : 0,
        payment_method: entry.payment_method || "",
        date: entry.date || "",
      }))

      const payload = {
        date: formData.date,
        patient_name: formData.patientName,
        patient_uhid: formData.patientUhid,
        mobile_number: formData.mobileNumber,
        ip_op_type: formData.ipOpType,
        doctor_name: formData.doctorName,
        company_name: formData.companyName,
        treatment: formData.treatment,
        has_refund: formData.hasRefund,  // Always send the boolean value
        refund: formData.refundAmount || "0",  // Send refund amount regardless of checkbox
        payment_details: paymentDetailsForBackend,
      }

      let response

      const isEditMode =
        editDataFromNav &&
        (editDataFromNav.id || editDataFromNav._id || (editDataFromNav._id && editDataFromNav._id.$oid))

      if (isEditMode) {
        let recordId = editDataFromNav.id;

        if (editDataFromNav._id) {
          if (typeof editDataFromNav._id === "object" && editDataFromNav._id.$oid) {
            recordId = editDataFromNav._id.$oid;
          } else {
            recordId = editDataFromNav._id;
          }
        }

        payload.id = recordId;

        response = await apiRequest(
          `${Insurancebaseurl}other_records/`,
          "PUT",
          payload
        );
      } else {
        response = await apiRequest(
          `${Insurancebaseurl}other_records/`,
          "POST",
          payload
        );
      }

      toast.dismiss(loadingToast)

      if (response.status === 200 || response.status === 201) {
        toast.success(
          isEditMode ? "✅ Record updated successfully!" : "🎉 Record created successfully!", 
          {
            duration: 4000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          }
        )

        setTimeout(() => {
          if (!isEditMode) {
            setFormData({
              date: "",
              patientName: "",
              patientUhid: "",
              mobileNumber: "",
              ipOpType: "",
              doctorName: "",
              companyName: "",
              treatment: "",
              hasRefund: false,
              refundAmount: "",
            })
            setPaymentEntries([
              {
                id: Date.now(),
                amount: "",
                payment_method: "",
                date: "",
              },
            ])
            toast.success("📝 Form reset for new entry", {
              duration: 2000,
              style: {
                background: '#6b7280',
                color: '#fff',
              },
            })
          } else {
            navigate("/OtherUpdate")
          }

          if (onSuccess) onSuccess()
        }, 1500)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Error submitting form:", error)
      console.error("Error response:", error.response?.data)
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "An unexpected error occurred"
      
      toast.error(`💥 Error: ${errorMessage}`, {
        duration: 6000,
        style: {
          background: '#dc2626',
          color: '#fff',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    toast.success("🔄 Operation cancelled", {
      duration: 2000,
      style: {
        background: '#6b7280',
        color: '#fff',
      },
    })
    navigate("/OtherUpdate")
  }

  return (
    <FormWrapper>
      <FormContainer>
        <Title>{editDataFromNav ? "Edit Other Record" : "Other Form"}</Title>
        
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            className: '',
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontWeight: '500',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            loading: {
              theme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
            },
          }}
        />

        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Patient Information</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                alignItems: "center",
              }}
              className="responsive-grid"
            >
              <div>
                <Label>Date</Label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} max={getTodayDate()} />
              </div>

              <div>
                <Label>OP/IP Type</Label>
                <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="ipOpType"
                      value="IP"
                      checked={formData.ipOpType === "IP"}
                      onChange={handleChange}
                      style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>IP</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="ipOpType"
                      value="OP"
                      checked={formData.ipOpType === "OP"}
                      onChange={handleChange}
                      style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>OP</span>
                  </label>
                </div>
              </div>

              <div>
                <Label>OP/IP Number</Label>
                <Input 
                  type="text" 
                  name="patientUhid" 
                  value={formData.patientUhid} 
                  onChange={handleChange}
                  placeholder="Enter patient op/ip number"
                />
              </div>
              
              <div>
                <Label>Patient Name</Label>
                <Input 
                  type="text" 
                  name="patientName" 
                  value={formData.patientName} 
                  onChange={handleChange}
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <Label>Mobile Number</Label>
                <Input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>

              <div>
                <Label>Doctor Name</Label>
                <Select 
                  name="doctorName" 
                  value={formData.doctorName} 
                  onChange={handleChange}
                  disabled={loadingDoctors}
                >
                  <option value="">
                    {loadingDoctors ? "Loading doctors..." : "Select Doctor"}
                  </option>
                  {doctorsList.map((doctor, index) => (
                    <option key={index} value={doctor.doctor_name}>
                      {doctor.doctor_name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </FormSection>

          <FormSection>
            <SectionTitle>Insurance & Treatment Details</SectionTitle>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: "20px" 
            }}
            className="responsive-grid"
            >
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
                <Select name="treatment" value={formData.treatment} onChange={handleChange}>
                  <option value="">Select Treatment</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Onco Surgery">Onco Surgery</option>
                  <option value="Uro Surgery">Uro Surgery</option>
                  <option value="Cardiac Surgery">Cardiac Surgery</option>
                  <option value="Lap Surgery">Lap Surgery</option>
                  <option value="Robotic Surgery">Robotic Surgery</option>
                  <option value="Gynec Surgery">Gynec Surgery</option>
                  <option value="Gastro Entrology Surgery">Gastro Entrology Surgery</option>
                  <option value="LSCS">LSCS</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Nephrology">Nephrology</option>
                  <option value="Ortho">Ortho</option>
                  <option value="Radiation">Radiation</option>
                  <option value="Chemo">Chemo</option>
                  <option value="ICU">ICU</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Urology">Urology</option>
                  <option value="Obesity">Obesity</option>
                  <option value="HDR">HDR</option>
                  <option value="Dialysis">Dialysis</option>
                  <option value="Conservative">Conservative</option>
                  <option value="Pulmonology">Pulmonology</option>
                </Select>
              </div>
            </div>
          </FormSection>

          {/* Refund Section */}
          <FormSection>
            <SectionTitle>Refund Details</SectionTitle>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: "20px" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="hasRefund"
                    checked={formData.hasRefund}
                    onChange={handleChange}
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                  />
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>Has Refund</span>
                </label>
              </div>
              
              <div>
                <Label>Refund Amount</Label>
                <Input
                  type="number"
                  name="refundAmount"
                  value={formData.refundAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter refund amount (if any)"
                />
              </div>
            </div>
          </FormSection>

          {/* Payment Details Section */}
          <FormSection>
            <SectionTitle style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span>{editDataFromNav ? "Add New Payment Details" : "Payment Details"}</span>
              <button
                type="button"
                onClick={addPaymentEntry}
                style={{
                  backgroundColor: "#28a745",
                  borderColor: "#529e64ff",
                  color: "white",
                  padding: "6px 10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginLeft: "auto",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "none"
                }}
                title="Add new payment entry"
              >
                +
              </button>
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
                    backgroundColor: entry.isExisting ? "#e8f5e8" : "transparent",
                    padding: entry.isExisting ? "10px" : "0",
                    borderRadius: entry.isExisting ? "5px" : "0",
                  }}
                  className="payment-entry-grid"
                >
                  {entry.isExisting && (
                    <div style={{ 
                      gridColumn: "1 / -1", 
                      marginBottom: "10px", 
                      fontWeight: "bold", 
                      color: "#28a745",
                      fontSize: "14px"
                    }}>
                      Existing Payment #{index + 1} (Read-only)
                    </div>
                  )}
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={entry.amount}
                      onChange={(e) => handlePaymentEntryChange(entry.id, "amount", e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="Enter amount"
                      readOnly={entry.isExisting}
                      style={{ backgroundColor: entry.isExisting ? "#f8f9fa" : "white" }}
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select
                      value={entry.payment_method}
                      onChange={(e) => handlePaymentEntryChange(entry.id, "payment_method", e.target.value)}
                      disabled={entry.isExisting}
                      style={{ backgroundColor: entry.isExisting ? "#f8f9fa" : "white" }}
                    >
                      <option value="">Select Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Cheque">Cheque</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handlePaymentEntryChange(entry.id, "date", e.target.value)}
                      readOnly={entry.isExisting}
                      max={getTodayDate()}
                      style={{ backgroundColor: entry.isExisting ? "#f8f9fa" : "white" }}
                    />
                  </div>
                  <div>
                    {paymentEntries.length > 1 && !entry.isExisting && (
                      <Button
                        type="button"
                        onClick={() => removePaymentEntry(entry.id)}
                        style={{
                          backgroundColor: "#dc3545",
                          padding: "8px 12px",
                          fontSize: "14px",
                          minWidth: "80px",
                        }}
                        title="Remove this payment entry"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {paymentEntries.filter(entry => !entry.isExisting).length === 0 && editDataFromNav && (
                <div style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#666",
                  fontStyle: "italic"
                }}>
                  Click the + button above to add new payment entries
                </div>
              )}
            </div>
          </FormSection>

          <ButtonWrapper>
            {editDataFromNav && (
              <Button 
                type="button" 
                onClick={handleCancel} 
                style={{ 
                  backgroundColor: "#6c757d", 
                  marginRight: "10px" 
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : editDataFromNav ? "Update Record" : "Submit"}
            </Button>
          </ButtonWrapper>
        </Form>
      </FormContainer>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
          
          .payment-entry-grid {
            grid-template-columns: 1fr !important;
          }
          
          .payment-entry-grid > div:last-child {
            margin-top: 10px;
          }
        }
        
        @media (max-width: 480px) {
          .responsive-grid {
            gap: 15px !important;
          }
        }
      `}</style>
    </FormWrapper>
  )
}

export default OtherForm