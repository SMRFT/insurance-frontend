import React, { useState, useEffect } from "react"
import axios from "axios"
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
  ButtonWrapper
} from "./SharedStyledComponents"

const OtherForm = ({ editData = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: "",
    patientName: "",
    patientUhid: "",
    mobileNumber: "",
    companyName: "",
    treatment: "",
    amount: "",
    refund: ""
  })

  const [loading, setLoading] = useState(false)
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const response = await axios.get(`${Insurancebaseurl}get_insurance_companies/`);
        setInsuranceCompanies(response.data);
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
      }
    };

    fetchInsuranceCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.patientName || !formData.patientUhid || !formData.mobileNumber || !formData.date) {
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

    try {
      const payload = {
        date: formData.date,
        patient_name: formData.patientName,
        patient_uhid: formData.patientUhid,
        mobile_number: formData.mobileNumber,
        company_name: formData.companyName,
        treatment: formData.treatment,
        amount: parseFloat(formData.amount) || 0,
        refund: parseFloat(formData.refund) || 0
      }

      let response = await axios.post(`${Insurancebaseurl}other_records/`, payload)

      if (response.status === 200 || response.status === 201) {
        alert(editData ? "Record updated successfully!" : "Record created successfully!")
        if (!editData) {
          setFormData({
            date: "",
            patientName: "",
            patientUhid: "",
            mobileNumber: "",
            companyName: "",
            treatment: "",
            amount: "",
            refund: ""
          })
        }
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Error submitting form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormWrapper>
      <FormContainer>
        <Title>Other Form</Title>
        <Form onSubmit={handleSubmit}>
        <FormSection>
        <SectionTitle>Patient Information</SectionTitle>
        <div
            style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr", 
            gap: "20px",
            alignItems: "center" // aligns items vertically center (optional)
            }}
        >
            <div>
            <Label>Date *</Label>
            <Input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                required
            />
            </div>
            <div>
            <Label>Patient Name *</Label>
            <Input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
            />
            </div>
            <div>
            <Label>Patient UHID *</Label>
            <Input
                type="text"
                name="patientUhid"
                value={formData.patientUhid}
                onChange={handleChange}
                required
            />
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
                <Select
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                >
                  <option value="">Select Company</option>
                  {insuranceCompanies.map((company, index) => (
                    <option key={index} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Treatment</Label>
                <Input
                  type="text"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                />
              </div>
            </div>
          </FormSection>

          <FormSection>
            <SectionTitle>Financial Details</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <Label>Amount</Label>
                <Input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Refund</Label>
                <Input
                  type="text"
                  name="refund"
                  value={formData.refund}
                  onChange={handleChange}
                />
              </div>
            </div>
          </FormSection>

          <ButtonWrapper>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : (editData ? "Update" : "Submit")}
            </Button>
          </ButtonWrapper>
        </Form>
      </FormContainer>
    </FormWrapper>
  )
}

export default OtherForm
