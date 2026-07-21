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

const primaryColor = "#6F8B83"
const accentColor = "#9aaea9"

// ─── Add Doctor Modal ────────────────────────────────────────────────────────
const AddDoctorModal = ({ onClose, onSuccess, baseUrl }) => {
  const [doctorName, setDoctorName] = useState("")
  const [department, setDepartment] = useState("")
  const [loading, setLoading] = useState(false)

  const getTodayFormatted = () => {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const yyyy = today.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!doctorName.trim()) {
      toast.error("Doctor name is required", { duration: 3000 })
      return
    }

    setLoading(true)
    try {
      const payload = {
        doctor_name: doctorName.trim(),
        department: department.trim(),
        created_by: "system",
        created_date: getTodayFormatted(),
        last_modified_by: "system",
        last_modified_date: getTodayFormatted(),
        is_active: true,
      }

      const response = await apiRequest(`${baseUrl}add_doctor/`, "POST", payload)

      if (response.success || response.status === 200 || response.status === 201) {
        toast.success("✅ Doctor added successfully!", {
          duration: 3000,
          style: { background: "#10b981", color: "#fff" },
        })
        onSuccess(payload.doctor_name)
        onClose()
      } else {
        toast.error(response.error || "Failed to add doctor", { duration: 4000 })
      }
    } catch (error) {
      console.error("Error adding doctor:", error)
      toast.error(`Error: ${error.response?.data?.error || error.message}`, {
        duration: 4000,
        style: { background: "#dc2626", color: "#fff" },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>
            Add New Doctor
          </h3>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={modalFieldStyle}>
            <label style={modalLabelStyle}>Doctor Name <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="e.g. DR.JOHN DOE, MS (ORTHO)"
              style={modalInputStyle}
              required
            />
          </div>

          <div style={modalFieldStyle}>
            <label style={modalLabelStyle}>Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Orthopedics"
              style={modalInputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{ ...modalCancelBtnStyle }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ ...modalSubmitBtnStyle, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Adding..." : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Add Treatment Modal ─────────────────────────────────────────────────────
const AddTreatmentModal = ({ onClose, onSuccess, baseUrl }) => {
  const [treatmentName, setTreatmentName] = useState("")
  const [loading, setLoading] = useState(false)

  const getTodayFormatted = () => {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const yyyy = today.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!treatmentName.trim()) {
      toast.error("Treatment name is required", { duration: 3000 })
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: treatmentName.trim(),
        created_by: "system",
        created_date: getTodayFormatted(),
        last_modified_by: "system",
        last_modified_date: getTodayFormatted(),
        is_active: true,
      }

      const response = await apiRequest(`${baseUrl}add_treatment/`, "POST", payload)

      if (response.success || response.status === 200 || response.status === 201) {
        toast.success("✅ Treatment added successfully!", {
          duration: 3000,
          style: { background: "#10b981", color: "#fff" },
        })
        onSuccess(payload.name)
        onClose()
      } else {
        toast.error(response.error || "Failed to add treatment", { duration: 4000 })
      }
    } catch (error) {
      console.error("Error adding treatment:", error)
      toast.error(`Error: ${error.response?.data?.error || error.message}`, {
        duration: 4000,
        style: { background: "#dc2626", color: "#fff" },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>
            Add New Treatment
          </h3>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={modalFieldStyle}>
            <label style={modalLabelStyle}>Treatment Name <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="text"
              value={treatmentName}
              onChange={(e) => setTreatmentName(e.target.value)}
              placeholder="e.g. Cardiology"
              style={modalInputStyle}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{ ...modalCancelBtnStyle }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ ...modalSubmitBtnStyle, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Adding..." : "Add Treatment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Shared Modal Styles ──────────────────────────────────────────────────────
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  backdropFilter: "blur(4px)",
}

const modalStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "480px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  overflow: "hidden",
  animation: "modalSlideIn 0.2s ease-out",
}

const modalHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 24px",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
}

const closeButtonStyle = {
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#6b7280",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  transition: "background 0.15s",
}

const modalFieldStyle = {
  marginBottom: "16px",
}

const modalLabelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "6px",
}

const modalInputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#1f2937",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
}

const modalSubmitBtnStyle = {
  backgroundColor: primaryColor,
  color: "#fff",
  border: "none",
  padding: "10px 24px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background 0.15s",
}

const modalCancelBtnStyle = {
  backgroundColor: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  padding: "10px 24px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background 0.15s",
}

// ─── Plus Button Style ────────────────────────────────────────────────────────
const plusButtonStyle = {
  backgroundColor: primaryColor,
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  minWidth: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
  lineHeight: 1,
  flexShrink: 0,
  transition: "background 0.15s, transform 0.1s",
  boxShadow: "0 2px 6px rgba(111,139,131,0.3)",
}

// ─── Main Form Component ──────────────────────────────────────────────────────
const OtherForm = ({ editData = null, onSuccess }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const editDataFromNav = location.state || editData

  const [formData, setFormData] = useState({
    date: "",
    patientName: "",
    patientUhid: "",
    mobileNumber: "",
    ipOpType: "",
    doctorName: "",
    companyName: "",
    specificInsuranceCompany: "",
    treatment: "",
    hasRefund: false,
    refundAmount: "",
  })

  const [paymentEntries, setPaymentEntries] = useState([
    { id: Date.now(), amount: "", payment_method: "", upi_details: "", date: "" },
  ])

  const [loading, setLoading] = useState(false)
  const [doctorsList, setDoctorsList] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [treatmentsList, setTreatmentsList] = useState([])
  const [loadingTreatments, setLoadingTreatments] = useState(false)

  // Modal states
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [showTreatmentModal, setShowTreatmentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [tempReason, setTempReason] = useState("")

  const getChangedFields = (original, currentPayload) => {
    const changes = [];
    
    // Compare basic fields
    const fieldMapping = {
      date: { label: "Date", origKey: "date" },
      patient_name: { label: "Patient Name", origKey: "patient_name" },
      patient_uhid: { label: "Patient UHID", origKey: "patient_uhid" },
      mobile_number: { label: "Mobile Number", origKey: "mobile_number" },
      ip_op_type: { label: "IP/OP Type", origKey: "ip_op_type" },
      doctor_name: { label: "Doctor Name", origKey: "doctor_name" },
      company_name: { label: "Company Name", origKey: "company_name" },
      specificInsuranceCompany: { label: "Insurance Provider", origKey: "specificInsuranceCompany" },
      treatment: { label: "Treatment Details", origKey: "treatment" },
      has_refund: { label: "Has Refund", origKey: "has_refund" },
      refund: { label: "Refund Amount", origKey: "refund" },
    };

    Object.keys(fieldMapping).forEach(key => {
      const mapping = fieldMapping[key];
      const origVal = original[mapping.origKey] !== undefined && original[mapping.origKey] !== null ? original[mapping.origKey].toString().trim() : "";
      const currVal = currentPayload[key] !== undefined && currentPayload[key] !== null ? currentPayload[key].toString().trim() : "";
      
      if (origVal !== currVal) {
        changes.push({
          field: mapping.label,
          before: origVal || "Empty",
          after: currVal || "Empty"
        });
      }
    });

    // Compare payment details
    const origPayments = original.payment_details || [];
    const currPayments = currentPayload.payment_details || [];
    
    const normalizePayment = (p) => ({
      amount: Number(p.amount) || 0,
      payment_method: (p.payment_method || "").toString().trim(),
      upi_details: (p.payment_method || "").toString().trim() === "UPI" ? (p.upi_details || "").toString().trim() : "",
      date: (p.date || "").toString().trim()
    });

    const origNormalized = origPayments.map(normalizePayment);
    const currNormalized = currPayments.map(normalizePayment);

    if (JSON.stringify(origNormalized) !== JSON.stringify(currNormalized)) {
      changes.push({
        field: "Payment Details",
        before: origPayments.length ? `${origPayments.length} payment(s)` : "Empty",
        after: currPayments.length ? `${currPayments.length} payment(s)` : "Empty"
      });
    }

    return changes;
  };

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // ── Fetch Doctors ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true)
      try {
        const response = await apiRequest(`${Insurancebaseurl}get_doctor_list/`, "GET")

        let doctorsData = []
        if (Array.isArray(response)) {
          doctorsData = response
        } else if (response?.data && Array.isArray(response.data)) {
          doctorsData = response.data
        } else if (response?.doctors && Array.isArray(response.doctors)) {
          doctorsData = response.doctors
        } else {
          console.error("Unexpected doctors response format:", response)
          setDoctorsList([])
          setLoadingDoctors(false)
          return
        }

        const activeDoctors = doctorsData.filter((d) => d.is_active === true)
        const sortedDoctors = activeDoctors.sort((a, b) =>
          (a.doctor_name || "").trim().localeCompare((b.doctor_name || "").trim())
        )
        setDoctorsList(sortedDoctors)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        toast.error("Failed to load doctors list", {
          duration: 3000,
          style: { background: "#ef4444", color: "#fff" },
        })
        setDoctorsList([])
      } finally {
        setLoadingDoctors(false)
      }
    }

    if (Insurancebaseurl) fetchDoctors()
  }, [Insurancebaseurl])

  // ── Fetch Insurance Companies ──────────────────────────────────────────────────
  const [insuranceCompanies, setInsuranceCompanies] = useState([])
  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const result = await apiRequest(`${Insurancebaseurl}get_insurance_companies/`)
        if (result.success) {
          setInsuranceCompanies(result.data)
        }
      } catch (error) {
        console.error("Error fetching insurance companies:", error)
      }
    }
    if (Insurancebaseurl) fetchInsuranceCompanies()
  }, [Insurancebaseurl])

  // ── Fetch Treatments ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTreatments = async () => {
      setLoadingTreatments(true)
      try {
        const response = await apiRequest(`${Insurancebaseurl}get_treatment_list/`, "GET")

        let treatmentsData = []
        if (Array.isArray(response)) {
          treatmentsData = response
        } else if (response?.data && Array.isArray(response.data)) {
          treatmentsData = response.data
        } else if (response?.treatments && Array.isArray(response.treatments)) {
          treatmentsData = response.treatments
        } else {
          console.error("Unexpected treatments response format:", response)
          setTreatmentsList([])
          setLoadingTreatments(false)
          return
        }

        // Sort alphabetically by name
        const sortedTreatments = treatmentsData.sort((a, b) =>
          (a.name || "").trim().localeCompare((b.name || "").trim())
        )
        setTreatmentsList(sortedTreatments)
      } catch (error) {
        console.error("Error fetching treatments:", error)
        toast.error("Failed to load treatments list", {
          duration: 3000,
          style: { background: "#ef4444", color: "#fff" },
        })
        setTreatmentsList([])
      } finally {
        setLoadingTreatments(false)
      }
    }

    if (Insurancebaseurl) fetchTreatments()
  }, [Insurancebaseurl])

  useEffect(() => {
    console.log("Edit data received:", editDataFromNav)
  }, [editDataFromNav])

  // ── Populate Edit Data ───────────────────────────────────────────────────────
  useEffect(() => {
    if (editDataFromNav) {
      const refundValue = editDataFromNav.refund || "0"
      const hasRefundValue = editDataFromNav.has_refund === true

      setFormData({
        date: editDataFromNav.date || "",
        patientName: editDataFromNav.patient_name || "",
        patientUhid: editDataFromNav.patient_uhid || "",
        mobileNumber: editDataFromNav.mobile_number || "",
        ipOpType: editDataFromNav.ip_op_type || "",
        doctorName: editDataFromNav.doctor_name || "",
        companyName: editDataFromNav.company_name || "",
        specificInsuranceCompany: editDataFromNav.specificInsuranceCompany || "",
        treatment: editDataFromNav.treatment || "",
        hasRefund: hasRefundValue,
        refundAmount: refundValue,
      })

      if (editDataFromNav.payment_details?.length > 0) {
        const existingPayments = editDataFromNav.payment_details.map((payment, index) => ({
          id: Date.now() + index,
          amount: payment.amount ? payment.amount.toString() : "",
          payment_method: payment.payment_method || "",
          upi_details: payment.upi_details || "",
          date: payment.date || "",
          isExisting: true,
        }))
        const newPaymentEntry = {
          id: Date.now() + editDataFromNav.payment_details.length,
          amount: "",
          payment_method: "",
          upi_details: "",
          date: "",
          isExisting: false,
        }
        setPaymentEntries([...existingPayments, newPaymentEntry])
      } else {
        setPaymentEntries([{ id: Date.now(), amount: "", payment_method: "", upi_details: "", date: "", isExisting: false }])
      }
    }
  }, [editDataFromNav])

  const getTodayDate = () => new Date().toISOString().split("T")[0]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handlePaymentEntryChange = (entryId, field, value) => {
    setPaymentEntries((prev) =>
      prev.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry))
    )
  }

  const addPaymentEntry = () => {
    setPaymentEntries((prev) => [
      ...prev,
      { id: Date.now(), amount: "", payment_method: "", upi_details: "", date: "" },
    ])
    toast.success("➕ New payment entry added!", {
      duration: 2000,
      style: { background: "#10b981", color: "#fff" },
    })
  }

  const removePaymentEntry = (entryId) => {
    if (paymentEntries.length > 1) {
      setPaymentEntries((prev) => prev.filter((entry) => entry.id !== entryId))
      toast.success("🗑️ Payment entry removed", {
        duration: 2000,
        style: { background: "#f59e0b", color: "#fff" },
      })
    } else {
      toast.error("⚠️ At least one payment entry is required", {
        duration: 3000,
        style: { background: "#ef4444", color: "#fff" },
      })
    }
  }

  // ── Callbacks from modals ────────────────────────────────────────────────────
  const handleDoctorAdded = (newDoctorName) => {
    // Add to list and auto-select
    setDoctorsList((prev) => {
      const newEntry = { doctor_name: newDoctorName, is_active: true }
      return [...prev, newEntry].sort((a, b) =>
        (a.doctor_name || "").localeCompare(b.doctor_name || "")
      )
    })
    setFormData((prev) => ({ ...prev, doctorName: newDoctorName }))
  }

  const handleTreatmentAdded = (newTreatmentName) => {
    // Add to list and auto-select
    setTreatmentsList((prev) => {
      const newEntry = { name: newTreatmentName }
      return [...prev, newEntry].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      )
    })
    setFormData((prev) => ({ ...prev, treatment: newTreatmentName }))
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const executeSubmit = async (historyData = []) => {
    setLoading(true)

    const loadingToast = toast.loading("Processing your request...", {
      style: { background: "#3b82f6", color: "#fff" },
    })

    const hasAnyData =
      Object.values(formData).some((value) => {
        if (typeof value === "boolean") return false
        return value && value.toString().trim() !== ""
      }) ||
      paymentEntries.some((entry) => entry.amount || entry.payment_method || entry.upi_details || entry.date)

    if (!hasAnyData) {
      toast.dismiss(loadingToast)
      toast.error("📋 Please enter at least some information", {
        duration: 4000,
        style: { background: "#ef4444", color: "#fff" },
      })
      setLoading(false)
      return
    }

    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      toast.dismiss(loadingToast)
      toast.error("📱 Please enter a valid 10-digit mobile number", {
        duration: 4000,
        style: { background: "#ef4444", color: "#fff" },
      })
      setLoading(false)
      return
    }

    try {
      const paymentDetailsForBackend = paymentEntries
        .filter((entry) => entry.amount || entry.payment_method || entry.upi_details || entry.date)
        .map((entry) => ({
          amount: entry.amount ? Number.parseFloat(entry.amount) : 0,
          payment_method: entry.payment_method || "",
          upi_details: entry.payment_method === "UPI" ? entry.upi_details : "",
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
        specificInsuranceCompany: formData.specificInsuranceCompany,
        treatment: formData.treatment,
        has_refund: formData.hasRefund,
        refund: formData.refundAmount || "0",
        payment_details: paymentDetailsForBackend,
      }

      let response

      const isEditMode =
        editDataFromNav &&
        (editDataFromNav.id || editDataFromNav._id || (editDataFromNav._id && editDataFromNav._id.$oid))

      if (isEditMode) {
        let recordId = editDataFromNav.id
        if (editDataFromNav._id) {
          if (typeof editDataFromNav._id === "object" && editDataFromNav._id.$oid) {
            recordId = editDataFromNav._id.$oid
          } else {
            recordId = editDataFromNav._id
          }
        }
        payload.id = recordId
        payload.editHistory = historyData
        response = await apiRequest(`${Insurancebaseurl}other_records/`, "PUT", payload)
      } else {
        response = await apiRequest(`${Insurancebaseurl}other_records/`, "POST", payload)
      }

      toast.dismiss(loadingToast)

      if (response.status === 200 || response.status === 201) {
        toast.success(
          isEditMode ? "✅ Record updated successfully!" : "🎉 Record created successfully!"
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
              specificInsuranceCompany: "",
              treatment: "",
              hasRefund: false,
              refundAmount: "",
            })
            setPaymentEntries([{ id: Date.now(), amount: "", payment_method: "", upi_details: "", date: "", isExisting: false }])
            toast.success("📝 Form reset for new entry", {
              duration: 2000,
              style: { background: "#6b7280", color: "#fff" },
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
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred"
      toast.error(`💥 Error: ${errorMessage}`, {
        duration: 6000,
        style: { background: "#dc2626", color: "#fff" },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.patientUhid) { toast.error("OP/IP Number is required"); return; }
    if (!formData.patientName) { toast.error("Patient Name is required"); return; }
    if (!formData.companyName) { toast.error("Insurance Company is required"); return; }
    if (!formData.treatment) { toast.error("Treatment Details are required"); return; }
    
    const validPayments = paymentEntries.filter((entry) => entry.amount || entry.payment_method || entry.upi_details || entry.date);
    if (validPayments.length === 0) {
      toast.error("At least one Payment Detail is required");
      return;
    }


    const isEditMode =
      editDataFromNav &&
      (editDataFromNav.id || editDataFromNav._id || (editDataFromNav._id && editDataFromNav._id.$oid))

    if (isEditMode) {
      // Calculate current payload to compare with original
      const paymentDetailsForBackend = paymentEntries
        .filter((entry) => entry.amount || entry.payment_method || entry.upi_details || entry.date)
        .map((entry) => ({
          amount: entry.amount ? Number.parseFloat(entry.amount) : 0,
          payment_method: entry.payment_method || "",
          upi_details: entry.payment_method === "UPI" ? entry.upi_details : "",
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
        specificInsuranceCompany: formData.specificInsuranceCompany,
        treatment: formData.treatment,
        has_refund: formData.hasRefund,
        refund: formData.refundAmount || "0",
        payment_details: paymentDetailsForBackend,
      }

      const changes = getChangedFields(editDataFromNav, payload)
      if (changes.length > 0) {
        setShowEditModal(true)
        return
      }
    }
    await executeSubmit(editDataFromNav ? (editDataFromNav.editHistory || []) : [])
  }

  const handleModalConfirm = async (reason) => {
    setShowEditModal(false)
    const paymentDetailsForBackend = paymentEntries
      .filter((entry) => entry.amount || entry.payment_method || entry.upi_details || entry.date)
      .map((entry) => ({
        amount: entry.amount ? Number.parseFloat(entry.amount) : 0,
        payment_method: entry.payment_method || "",
        upi_details: entry.payment_method === "UPI" ? entry.upi_details : "",
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
      specificInsuranceCompany: formData.specificInsuranceCompany,
      treatment: formData.treatment,
      has_refund: formData.hasRefund,
      refund: formData.refundAmount || "0",
      payment_details: paymentDetailsForBackend,
    }

    const changes = getChangedFields(editDataFromNav, payload)
    const newHistoryItem = {
      edited_by: localStorage.getItem("employeeId") || localStorage.getItem("name") || "system",
      edited_date: new Date().toISOString(),
      edited_reason: reason,
      changes: changes
    }
    const updatedHistory = [...((editDataFromNav && editDataFromNav.editHistory) || []), newHistoryItem]
    await executeSubmit(updatedHistory)
  }

  const handleCancel = () => {
    toast.success("🔄 Operation cancelled", {
      duration: 2000,
      style: { background: "#6b7280", color: "#fff" },
    })
    navigate("/OtherUpdate")
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <FormWrapper>
      <FormContainer>
        <Title>{editDataFromNav ? "Edit Other Record" : "Other Form"}</Title>

        

        {/* Modals */}
        {showDoctorModal && (
          <AddDoctorModal
            onClose={() => setShowDoctorModal(false)}
            onSuccess={handleDoctorAdded}
            baseUrl={Insurancebaseurl}
          />
        )}
        {showTreatmentModal && (
          <AddTreatmentModal
            onClose={() => setShowTreatmentModal(false)}
            onSuccess={handleTreatmentAdded}
            baseUrl={Insurancebaseurl}
          />
        )}

        <Form onSubmit={handleSubmit}>
          {/* ── Patient Information ── */}
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
                <Label>OP/IP Number <span style={{ color: "red" }}>*</span></Label>
                <Input
                  type="text"
                  name="patientUhid"
                  value={formData.patientUhid}
                  onChange={handleChange}
                  placeholder="Enter patient op/ip number"
                  required
                />
              </div>

              <div>
                <Label>Patient Name <span style={{ color: "red" }}>*</span></Label>
                <Input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  required
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

              {/* Doctor Name with + button */}
              <div>
                <Label>Doctor Name</Label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Select
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    disabled={loadingDoctors}
                    style={{ flex: 1 }}
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
                  <button
                    type="button"
                    onClick={() => setShowDoctorModal(true)}
                    style={plusButtonStyle}
                    title="Add new doctor"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── Insurance & Treatment Details ── */}
          <FormSection>
            <SectionTitle>Insurance & Treatment Details</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
              className="responsive-grid"
            >
              <div>
                <Label>Company Name <span style={{ color: "red" }}>*</span></Label>
                <Select name="companyName" value={formData.companyName} onChange={handleChange} required>
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

              {formData.companyName === "General Insurance" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Label>
                    Insurance Provider <span style={{ color: "#ef4444" }}>*</span>
                  </Label>
                  <Select
                    name="specificInsuranceCompany"
                    value={formData.specificInsuranceCompany}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Insurance Provider</option>
                    {insuranceCompanies.map((company, index) => (
                      <option key={index} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Treatment with + button */}
              <div>
                <Label>Treatment <span style={{ color: "red" }}>*</span></Label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Select
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    disabled={loadingTreatments}
                    style={{ flex: 1 }}
                    required
                  >
                    <option value="">
                      {loadingTreatments ? "Loading treatments..." : "Select Treatment"}
                    </option>
                    {treatmentsList.map((t, index) => (
                      <option key={index} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={() => setShowTreatmentModal(true)}
                    style={plusButtonStyle}
                    title="Add new treatment"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── Refund Section ── */}
          <FormSection>
            <SectionTitle>Refund Details</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
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

          {/* ── Payment Details Section ── */}
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
                  border: "none",
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
                    <div
                      style={{
                        gridColumn: "1 / -1",
                        marginBottom: "10px",
                        fontWeight: "bold",
                        color: "#28a745",
                        fontSize: "14px",
                      }}
                    >
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
                      required={!!entry.amount}
                    >
                      <option value="">Select Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Cheque">Cheque</option>
                    </Select>
                  </div>
                  {entry.payment_method === "UPI" && (
                    <div>
                      <Label>UPI Details</Label>
                      <Input
                        type="text"
                        value={entry.upi_details || ""}
                        onChange={(e) => handlePaymentEntryChange(entry.id, "upi_details", e.target.value)}
                        placeholder="Enter UPI Transaction ID"
                        readOnly={entry.isExisting}
                        required
                        style={{ backgroundColor: entry.isExisting ? "#f8f9fa" : "white" }}
                      />
                    </div>
                  )}
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handlePaymentEntryChange(entry.id, "date", e.target.value)}
                      readOnly={entry.isExisting}
                      required={!!entry.amount}
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

              {paymentEntries.filter((entry) => !entry.isExisting).length === 0 && editDataFromNav && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
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
                style={{ backgroundColor: "#6c757d", marginRight: "10px" }}
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

      {showEditModal && (
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
            maxWidth: "500px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <h4 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "bold" }}>Reason for Modification</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>Please provide a brief reason for editing this record to keep the audit history updated.</p>
            <textarea
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                resize: "vertical"
              }}
              placeholder="e.g. Corrected gross amount typo, updated claim status"
              value={tempReason}
              onChange={(e) => setTempReason(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
              <button
                type="button"
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
                onClick={() => {
                  setShowEditModal(false)
                  setTempReason("")
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#4f46e5",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
                onClick={() => {
                  if (!tempReason.trim()) {
                    toast.error("Please enter an edit reason!")
                    return
                  }
                  handleModalConfirm(tempReason)
                  setTempReason("")
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
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