import React, { useEffect, useState } from "react";
import styled from "styled-components";

const primaryColor = "#6F8B83";
const backgroundColor = "#F9F9F9";
const textColor = "#333";
const accentColor = "#9aaea9";

const Container = styled.div`
  background: linear-gradient(to bottom right, ${backgroundColor}, ${primaryColor});
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1100px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
`;

const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  font-size: 28px;
  margin-bottom: 30px;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${textColor};
  font-family: 'Roboto', sans-serif;
  display: block; /* Ensure label is on a separate line from the input */
`;

const Select = styled.select`
  padding: 8px;
  margin: 0 10px;
  border-radius: 5px;
  border: 1px solid ${accentColor};
  font-size: 14px;
`;

const ScrollableTableContainer = styled.div`
  max-height: 440px;
  overflow-y: auto;
  scrollbar-width: thin;
  border: 1px solid ${accentColor};
  border-radius: 10px;
  background-color: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  background-color: #fff;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
`;

const TableHeader = styled.th`
  background-color: ${primaryColor};
  color: white;
  padding: 12px;
  text-align: center;
  border: 1px solid ${accentColor};
  position: sticky;
  top: 0;
  z-index: 1;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${backgroundColor};
  }

  &:hover {
    background-color: rgba(111, 139, 131, 0.2);
    transition: background-color 0.3s ease;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  color: ${textColor};
  border: 1px solid ${accentColor};
  text-align: center;
  word-break: break-word;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 5px 15px;
  border: none;
  background-color: ${primaryColor};
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  
  &:hover {
    background-color: ${accentColor};
  }
`;

const BlinkingLight = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  animation: blink 1s infinite;
  align-self: center;
  justify-self: center;

  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const InsuranceReport = () => {
  const [insuranceData, setInsuranceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("General Insurance");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/insurance/") // API endpoint for insurance data
      .then((response) => response.json())
      .then((data) => {
        setInsuranceData(data);
        filterData(data, "General Insurance"); // Filter data based on default "General Insurance"
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filterData = (data, company) => {
    if (company) {
      const filtered = data.filter((item) => item.companyName === company);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleCompanyFilterChange = (event) => {
    const selected = event.target.value;
    setSelectedCompany(selected);
    filterData(insuranceData, selected); // Filter the data when the company is changed
  };

  const handleViewFile = (fileId) => {
    // Construct file URL using the actual file ID
    const fileUrl = `http://127.0.0.1:8000/insurance/serve_file/${fileId}`;
    window.open(fileUrl, '_blank');
};
  
  return (
    <Container>
      <Title>Insurance Report</Title>
      <FilterContainer>
        <Label htmlFor="companyName">Filter by Company: </Label>
        <Select
          id="companyName"
          value={selectedCompany}
          onChange={handleCompanyFilterChange}
        >
          <option value="">Select Company</option>
          <option value="General Insurance">General Insurance</option>
          <option value="ECHS">ECHS</option>
          <option value="ESI">ESI</option>
          <option value="Railway">Railway</option>
          <option value="TNCM">TNCM</option>
          <option value="TKT">TKT</option>
          <option value="FCA">FCA</option>
        </Select>
      </FilterContainer>
      <ScrollableTableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Patient UHID</TableHeader>
              <TableHeader>Patient Name</TableHeader>
              <TableHeader>Bill Number</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Company Name</TableHeader>
              <TableHeader>Date of Discharge</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Billing File</TableHeader>
              <TableHeader>Submission Status</TableHeader>
              <TableHeader>Query File</TableHeader>
              <TableHeader>Approval Amount</TableHeader>
              <TableHeader>Claimed Amount</TableHeader>
              <TableHeader>Settled Amount</TableHeader>
              <TableHeader>Approval</TableHeader>
              <TableHeader>Follow-Up</TableHeader>
              <TableHeader>Reason Not Match</TableHeader>
              <TableHeader>Claim Option</TableHeader>
              <TableHeader>Claim Details</TableHeader>
              <TableHeader>Not Claim Reason</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.patient_uhid || "N/A"}</TableCell>
                <TableCell>{item.patient_name || "N/A"}</TableCell>
                <TableCell>{item.billNumber || "N/A"}</TableCell>
                <TableCell style={{whiteSpace:"nowrap"}}>{item.date || "N/A"}</TableCell>
                <TableCell>{item.companyName || "N/A"}</TableCell>
                <TableCell>{item.dateOfDischarge || "N/A"}</TableCell>
                <TableCell style={{whiteSpace:"nowrap"}}>
                  {item.submissionStatus === "Physical" && <BlinkingLight style={{textAlign:"center"}} />}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleViewFile(item.billingFile)}>View</Button>
                </TableCell>
                <TableCell>{item.submissionStatus || "N/A"}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewFile(item.queryUpload)}>View</Button>
                </TableCell>
                <TableCell>{item.approvalAmount || "N/A"}</TableCell>
                <TableCell>{item.claimedAmount || "N/A"}</TableCell>
                <TableCell>{item.settledAmount || "N/A"}</TableCell>
                <TableCell>{item.approval || "N/A"}</TableCell>
                <TableCell>{item.followUp || "N/A"}</TableCell>
                <TableCell>{item.reasonNotMatch || "N/A"}</TableCell>
                <TableCell>{item.claimOption || "N/A"}</TableCell>
                <TableCell>{item.claimDetails || "N/A"}</TableCell>
                <TableCell>{item.notClaimReason || "N/A"}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </ScrollableTableContainer>
    </Container>
  );
};

export default InsuranceReport;
