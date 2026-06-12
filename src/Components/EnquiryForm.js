"use client"

import { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
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
  CenteredContainer,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

function EnquiryForm() {
  const location = useLocation()
  const formDataFromUpdate = location.state || {}
  const [insuranceCompanies, setInsuranceCompanies] = useState([])
  const [treatments, setTreatments] = useState([])
  const [formData, setFormData] = useState({
    date: "",
    ipNumber: "",
    opNumber: "",
    patientName: "",
    phoneNumber: "",
    insuranceName: "",
    specificInsuranceCompany: "",
    treatment: "",
    reasonForApproach: "",
  })

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // Fetch insurance companies for General Insurance dropdown
  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const result = await apiRequest(`${Insurancebaseurl}get_insurance_companies/`)
        if (result.success) {
          setInsuranceCompanies(result.data)
          toast.success("Insurance companies loaded successfully!")
        } else {
          console.error("Error fetching insurance companies:", result.error)
          toast.error("Failed to load insurance companies")
        }
      } catch (error) {
        console.error("Network error:", error)
        toast.error("Network error while loading insurance companies")
      }
    }
    fetchInsuranceCompanies()
  }, [])

  // Fetch treatment list
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const result = await apiRequest(`${Insurancebaseurl}get_treatment_list/`)
        if (result.success) {
          setTreatments(result.data)
        } else {
          console.error("Error fetching treatments:", result.error)
          toast.error("Failed to load treatment list")
        }
      } catch (error) {
        console.error("Network error:", error)
        toast.error("Network error while loading treatments")
      }
    }
    fetchTreatments()
  }, [])

  // Pre-fill form when editing
  useEffect(() => {
    if (Object.keys(formDataFromUpdate).length > 0) {
      const newFormData = { ...formData }
      Object.keys(formDataFromUpdate).forEach((key) => {
        if (key in newFormData) {
          newFormData[key] = formDataFromUpdate[key]
        }
      })
      setFormData(newFormData)
      toast.success("Form loaded for editing")
    }
  }, [formDataFromUpdate])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Reset specific insurance when main insurance name changes
    if (name === "insuranceName" && value !== "General Insurance") {
      setFormData({
        ...formData,
        insuranceName: value,
        specificInsuranceCompany: "",
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isUpdate = Object.keys(formDataFromUpdate).length > 0

    // Validation
    if (!formData.patientName || !formData.phoneNumber) {
      toast.error("Please fill out all required fields!")
      return
    }

    const loadingToast = toast.loading(isUpdate ? "Updating enquiry..." : "Submitting enquiry...")

    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key])
        }
      })

      let apiResult

      if (isUpdate) {
        const updateIdentifier =
          formDataFromUpdate.opNumber ||
          formDataFromUpdate.ipNumber ||
          formDataFromUpdate.patientName

        if (updateIdentifier) {
          const updateEndpoint = `${Insurancebaseurl}enquiry/update/${encodeURIComponent(updateIdentifier)}/`
          apiResult = await apiRequest(updateEndpoint, "PUT", formDataToSend, true, {})
        } else {
          toast.dismiss(loadingToast)
          toast.error("❌ No valid identifier found for update")
          return
        }
      } else {
        apiResult = await apiRequest(`${Insurancebaseurl}enquiry/`, "POST", formDataToSend, true, {})
      }

      toast.dismiss(loadingToast)

      if (apiResult.success) {
        toast.success(
          isUpdate ? "✅ Enquiry updated successfully!" : "🎉 Enquiry submitted successfully!",
          {
            duration: 4000,
            style: { background: "#10b981", color: "#ffffff" },
            iconTheme: { primary: "#ffffff", secondary: "#10b981" },
          }
        )

        if (!isUpdate) {
          setFormData({
            date: "",
            ipNumber: "",
            opNumber: "",
            patientName: "",
            phoneNumber: "",
            insuranceName: "",
            specificInsuranceCompany: "",
            treatment: "",
            reasonForApproach: "",
          })
          toast.success("📝 Form reset for new entry")
        }
      } else {
        toast.error(`❌ Failed: ${apiResult.error}`, {
          duration: 6000,
          style: { background: "#ef4444", color: "#ffffff" },
        })
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Exception:", error)
      toast.error(`💥 Error: ${error.message}`, {
        duration: 6000,
        style: { background: "#dc2626", color: "#ffffff" },
      })
    }
  }

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  const isUpdate = Object.keys(formDataFromUpdate).length > 0

  return (
    <FormWrapper>
      <FormContainer>
        <Title>{isUpdate ? "Update Enquiry Form" : "Enquiry Form"}</Title>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: { background: "#363636", color: "#fff" },
            success: { duration: 3000 },
            error: { duration: 5000 },
          }}
        />

        <Form onSubmit={handleSubmit}>

          {/* Enquiry Details Section */}
          <FormSection>
            <SectionTitle>Enquiry Details</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                alignItems: "start",
              }}
              className="responsive-row"
            >
              {/* Date */}
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>Date</Label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={getTodayDate()}
                />
              </Col>

              {/* IP Number */}
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>IP Number</Label>
                <Input
                  type="text"
                  name="ipNumber"
                  value={formData.ipNumber}
                  onChange={handleChange}
                  placeholder="Enter IP Number"
                />
              </Col>

              {/* OP Number */}
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>OP Number</Label>
                <Input
                  type="text"
                  name="opNumber"
                  value={formData.opNumber}
                  onChange={handleChange}
                  placeholder="Enter OP Number"
                />
              </Col>
            </Row>
          </FormSection>

          {/* Patient Information Section */}
          <FormSection>
            <SectionTitle>Patient Information</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
                alignItems: "start",
              }}
              className="responsive-row"
            >
              {/* Patient Name */}
              <Col xs={12} sm={6} md={6} lg={6}>
                <Label>
                  Patient Name <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter Patient Name"
                />
              </Col>

              {/* Phone Number */}
              <Col xs={12} sm={6} md={6} lg={6}>
                <Label>
                  Phone Number <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  maxLength={15}
                />
              </Col>
            </Row>
          </FormSection>

          {/* Insurance Details Section */}
          <FormSection>
            <SectionTitle>Insurance Details</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
                alignItems: "start",
              }}
              className="responsive-row"
            >
              {/* Insurance Name */}
              <Col xs={12} sm={12} md={6} lg={6}>
                <Label>Insurance Name</Label>
                <Select
                  name="insuranceName"
                  value={formData.insuranceName}
                  onChange={handleChange}
                >
                  <option value="">Select Insurance</option>
                  <option value="General Insurance">General Insurance</option>
                  <option value="ECHS">ECHS</option>
                  <option value="ESI">ESI</option>
                  <option value="ESIC">ESIC</option>
                  <option value="Railway CTSE">Railway CTSE</option>
                  <option value="TKT">TKT</option>
                  <option value="FCI">FCI</option>
                  <option value="Airport">Airport</option>
                </Select>
              </Col>

              {/* Specific Insurance Provider — only for General Insurance */}
              {formData.insuranceName === "General Insurance" && (
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Label>Select Insurance Provider</Label>
                  <Select
                    name="specificInsuranceCompany"
                    value={formData.specificInsuranceCompany}
                    onChange={handleChange}
                  >
                    <option value="">Select Insurance Provider</option>
                    {insuranceCompanies.map((company, index) => (
                      <option key={index} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
                </Col>
              )}
            </Row>
          </FormSection>

          {/* Reason For Approach Section */}
          <FormSection>
            <SectionTitle>Reason For Approach</SectionTitle>
                        {/* Treatment row */}
            <Row style={{ marginTop: "20px" }}>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Label>Treatment</Label>
                <Select
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                >
                  <option value="">Select Treatment</option>
                  {treatments.map((t, index) => (
                    <option key={index} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Label>Reason For Approach</Label>
                <textarea
                  name="reasonForApproach"
                  value={formData.reasonForApproach}
                  onChange={handleChange}
                  placeholder="Enter reason for approach..."
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "10px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </Col>
            </Row>
          </FormSection>

          <ButtonWrapper>
            <Button type="submit">
              {isUpdate ? "Update" : "Submit"}
            </Button>
          </ButtonWrapper>
        </Form>
      </FormContainer>

      <style>{`
        @media (max-width: 991px) {
          .responsive-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 767px) {
          .responsive-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </FormWrapper>
  )
}

export default EnquiryForm