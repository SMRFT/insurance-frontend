import styled from "styled-components";
import React, { useState } from "react";
import { Row, Col } from 'react-bootstrap';

// Colors
const primaryColor = "#6F8B83"; // Darker shade of #9AB4AB
const backgroundColor = "#F9F9F9";
const textColor = "#333";
const accentColor = "#9aaea9";
// Styled components
const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, ${backgroundColor}, ${primaryColor});
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 20px;
`;
const FormContainer = styled.div`
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
`;
const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  font-size: 28px;
  margin-bottom: 30px;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column; /* Align items vertically */
  justify-content: center; /* Center items vertically within the container */
  align-items: center; /* Center items horizontally */
  width: 50%; /* Set the width to 50% */
  margin: 0 auto; /* Center the container horizontally */
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${textColor};
  margin-bottom: 8px; /* Add space between label and input */
  font-family: 'Roboto', sans-serif;
  display: block; /* Ensure label is on a separate line from the input */
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  margin-bottom: 20px; /* Adjust the bottom margin for consistency */
  width: 80%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 10px rgba(111, 139, 131, 0.2);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 80%;
  margin-bottom: 20px; /* Adjust the bottom margin for consistency */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 10px rgba(111, 139, 131, 0.2);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
`;
const RadioLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${textColor};
  display: flex;
  align-items: center;
  gap: 10px;
`;
// Wrapper for centering the button
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px; /* Optional: Adds space above the button */
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${primaryColor};
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: fit-content;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${accentColor};
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

function InsuranceForm() {
  const [formData, setFormData] = useState({
    patient_uhid: "",
    patient_name: "",
    billNumber: "",
    date: "",
    companyName: "",
    dateOfDischarge: "",
    billingFile: null,
    queryUpload: null,
    queryResponse: null,
    submissionStatus: "Online",
    approvalAmount: "",
    claimedAmount: "",
    settledAmount: "",
    approval: "As per norm",
    followUp: "",
    reasonNotMatch: "",
    claimOption: "Not Claim",
    claimDetails: "",
    notClaimReason: "",
    opIpSelection: "OP", // Default to OP
    opIpNumber: "", // Stores OP or IP number based on selection
    billDate: "",
    billAmount: "",
    fileSubmissionDate: "",
    queryDate: "",
    approvalDate: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Simple validation
    if (!formData.patient_uhid || !formData.patient_name || !formData.billNumber) {
      alert("Please fill out all required fields!");
      return;
    }
  
    // Prepare formData for submission
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "opIpNumber") {
        // Dynamically add either opNumber or ipNumber based on selection
        const selectionKey =
          formData.opIpSelection === "OP" ? "opNumber" : "ipNumber";
        formDataToSend.append(selectionKey, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    const response = await fetch("http://127.0.0.1:8000/insurance/", {
      method: "POST",
      body: formDataToSend,
    });
  
    if (response.ok) {
      alert("Form submitted successfully!");
      setFormData({
        patient_uhid: "",
        patient_name: "",
        billNumber: "",
        date: "",
        companyName: "",
        dateOfDischarge: "",
        billingFile: null,
        queryUpload: null,
        queryResponse: null,
        submissionStatus: "Online",
        approvalAmount: "",
        claimedAmount: "",
        settledAmount: "",
        approval: "As per norm",
        followUp: "",
        reasonNotMatch: "",
        claimOption: "Not Claim",
        claimDetails: "",
        notClaimReason: "",
        opIpSelection: "OP",
        opIpNumber: "",
        billDate: "",
        billAmount: "",
        fileSubmissionDate: "",
        queryDate: "",
        approvalDate: "",
        remarks: "",
      });
    } else {
      alert("Failed to submit form.");
    }
  };
  
  
  return (
    <FormWrapper>
      <FormContainer>
        <Title>Insurance Form</Title>
        <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
            <Col sm={4}>
              <Label>Patient UHID</Label>
              <Input type="type" name="patient_uhid" value={formData.patient_uhid} onChange={handleChange} />
            </Col>
            <Col sm={4}>
              <Label>OP or IP</Label>
              <RadioGroup>
                <RadioLabel>
                  <input
                    type="radio"
                    name="opIpSelection"
                    value="OP"
                    checked={formData.opIpSelection === "OP"}
                    onChange={handleChange}
                  />
                  OP
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    name="opIpSelection"
                    value="IP"
                    checked={formData.opIpSelection === "IP"}
                    onChange={handleChange}
                  />
                  IP
                </RadioLabel>
              </RadioGroup>
            </Col>
            <Col sm={4}>
              {formData.opIpSelection && (
                <>
                  <Label>
                    {formData.opIpSelection === "OP"
                      ? "Enter OP Number"
                      : "Enter IP Number"}
                  </Label>
                  <Input
                    type="text"
                    name="opIpNumber"
                    value={formData.opIpNumber}
                    onChange={handleChange}
                    placeholder={`Enter ${formData.opIpSelection} Number`}
                  />
                </>
              )}
            </Col>
   
            <Col sm={4}>
              <Label>Patient Name</Label>
              <Input type="type" name="patient_name" value={formData.patient_name} onChange={handleChange} />
            </Col>
            <Col sm={4}>
              <Label>Bill Number</Label>
              <Input
                type="type"
                name="billNumber"
                value={formData.billNumber}
                onChange={handleChange}
              />
            </Col>
            <Col sm={4}>
    <Label>Bill Date</Label>
    <Input
      type="date"
      name="billDate"
      value={formData.billDate}
      onChange={handleChange}
    />
  </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4}>
              <Label>Date</Label>
              <Input type="date" name="date" value={formData.date} onChange={handleChange} />
            </Col>
            <Col sm={4}>
              <Label>Company Name</Label>
              <Select name="companyName" value={formData.companyName} onChange={handleChange}>
                <option value="">Select Company</option>
                <option value="General Insurance">General Insurance</option>
                <option value="ECHS">ECHS</option>
                <option value="ESI">ESI</option>
                <option value="ESIC">ESIC</option>
                <option value="Railway">Railway</option>
                <option value="CTSE">CTSE</option>
                <option value="TNCMCHIS">TNCMCHIS</option>
                <option value="TKT">TKT</option>
                <option value="FCI">FCI</option>
              </Select>
            </Col>
            <Col sm={4}>
              <Label>Date of Discharge</Label>
              <Input
                type="date"
                name="dateOfDischarge"
                value={formData.dateOfDischarge}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>

  <Col sm={3}>
    <Label>Bill Amount</Label>
    <Input
      type="text"
      name="billAmount"
      value={formData.billAmount}
      onChange={handleChange}
    />
  </Col>
  <Col sm={3}>
    <Label>File Submission Date</Label>
    <Input
      type="date"
      name="fileSubmissionDate"
      value={formData.fileSubmissionDate}
      onChange={handleChange}
    />
  </Col>
  <Col sm={3}>
          <Label>Submission Status</Label>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="submissionStatus"
                value="Online"
                checked={formData.submissionStatus === "Online"}
                onChange={handleChange}
              />
              Online
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="submissionStatus"
                value="Physical"
                checked={formData.submissionStatus === "Physical"}
                onChange={handleChange}
              />
              Physical
            </RadioLabel>
          </RadioGroup>
          </Col>
  <Col sm={3}>
          <Label>Billing Done</Label>
          <Input type="file" name="billingFile" onChange={handleChange} />
          </Col>
</Row>
<Row>

 
  <Col sm={4}>
    <Label>Approval Date</Label>
    <Input
      type="date"
      name="approvalDate"
      value={formData.approvalDate}
      onChange={handleChange}
    />
  </Col>

 
</Row>
<Row>

</Row>

        <Row className="mb-3">

          <Col sm={4}>
    <Label>Query Date/Return File Date</Label>
    <Input
      type="date"
      name="queryDate"
      value={formData.queryDate}
      onChange={handleChange}
    />
  </Col>
          <Col sm={3}>
          <Label>query upload</Label>
          <Input type="file" name="queryUpload" onChange={handleChange} />
          </Col>
          <Col sm={3}>
          <Label>query Response</Label>
          <Input type="file" name="queryResponse" onChange={handleChange} />
          </Col>
          </Row>

          <Row>
          <Col sm={4}>
            <Label>Approval Amount</Label>
              <Input
                type="text"
                name="approvalAmount"
                value={formData.approvalAmount}
                onChange={handleChange}
             />
          </Col>
          <Col sm={4}>
            <Label>Claimed Amount</Label>
              <Input
                type="text"
                name="claimedAmount"
                value={formData.claimedAmount}
                onChange={handleChange}
              />
          </Col>
          <Col sm={4}>
            <Label>Settled Amount</Label>
              <Input
                type="text"
                name="settledAmount"
                value={formData.settledAmount}
                onChange={handleChange}
              />
          </Col>
          <Col sm={12}>
    <Label>Remarks</Label>
    <Input
      type="textarea"
      name="remarks"
      value={formData.remarks}
      onChange={handleChange}
    />
  </Col>
          </Row>

          <CenteredContainer>
            <Label>Approval</Label>
            <Select
              name="approval"
              value={formData.approval}
              onChange={handleChange}
            >
              <option value="As per norm">As per norm</option>
              <option value="Not per norms">Not per norms</option>
            </Select>
          </CenteredContainer>

          {/* Conditional fields for "Not per norms" */}
          {formData.approval === "Not per norms" && (
            <>
            <Row>
            <Col sm={6}>
              <Label>Follow Up</Label>
              <Input type="text" name="followUp" value={formData.followUp} onChange={handleChange} />
            </Col>
            <Col sm={6}>
              <Label>Reason for Not Match</Label>
              <Input
                type="text"
                name="reasonNotMatch"
                value={formData.reasonNotMatch}
                onChange={handleChange}
              />
              </Col>
              </Row>
              
              <Row>
              <Col sm={6}>
              <Label>Claim Option</Label>
              <RadioGroup>
                <RadioLabel>
                  <input
                    type="radio"
                    name="claimOption"
                    value="Claim"
                    checked={formData.claimOption === "Claim"}
                    onChange={handleChange}
                  />
                  Claim
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    name="claimOption"
                    value="Not Claim"
                    checked={formData.claimOption === "Not Claim"}
                    onChange={handleChange}
                  />
                  Not Claim
                </RadioLabel>
              </RadioGroup>
              </Col>
              <Col sm={6}>
              {/* Input fields for both Claim and Not Claim */}
              {formData.claimOption === "Claim" && (
                <>
                  <Label>Claim Details</Label>
                  <Input
                    type="text"
                    name="claimDetails"
                    value={formData.claimDetails}
                    onChange={handleChange}
                  />
                </>
              )}
              {formData.claimOption === "Not Claim" && (
                <>
                  <Label>Reason for Not Claim</Label>
                  <Input
                    type="text"
                    name="notClaimReason"
                    value={formData.notClaimReason}
                    onChange={handleChange}
                  />
                </>
              )}
              </Col>
              </Row>
            </>
          )}
            <ButtonWrapper>
              <Button type="submit">Submit</Button>
            </ButtonWrapper>
        </Form>
      </FormContainer>
    </FormWrapper>
  );
}
export default InsuranceForm;