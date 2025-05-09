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
  flex-wrap: wrap;
  gap: 15px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${textColor};
  font-family: 'Roboto', sans-serif;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid ${accentColor};
  font-size: 14px;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid ${accentColor};
  font-size: 14px;
  width: 180px;
`;

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
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

const ResetButton = styled(Button)`
  background-color: #c4753d;
  margin-left: 10px;
  
  &:hover {
    background-color: #e68a49;
  }
`;

const FilterButton = styled(Button)`
  background-color: #4c6b65;
  margin-left: 10px;
  
  &:hover {
    background-color: #5d837b;
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
  const [selectedCompany, setSelectedCompany] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Date filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Helper function to format date as YYYY-MM-DD
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  // Set current date for both date inputs on component mount
  useEffect(() => {
    const today = formatDateForInput(new Date());
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/insurance/") // API endpoint for insurance data
      .then((response) => response.json())
      .then((data) => {
        setInsuranceData(data);
        // Apply date filter initially with current date
        const filtered = filterByDateRange(data, startDate, endDate);
        setFilteredData(filtered);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [startDate, endDate]);

  // Filter data by date range
  const filterByDateRange = (data, start, end) => {
    if (!start || !end) return data;
    
    const startTimestamp = new Date(start).setHours(0, 0, 0, 0);
    const endTimestamp = new Date(end).setHours(23, 59, 59, 999);
    
    return data.filter(item => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= startTimestamp && itemDate <= endTimestamp;
    });
  };

  const filterData = () => {
    // First filter by date range
    let result = filterByDateRange(insuranceData, startDate, endDate);
    
    // Then filter by company if selected
    if (selectedCompany) {
      result = result.filter((item) => item.companyName === selectedCompany);
    }
    
    // Then apply search term if it exists
    if (searchTerm && searchBy) {
      result = result.filter((item) => {
        // Handle different search fields
        const fieldValue = item[searchBy];
        if (!fieldValue) return false;
        
        return String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    setFilteredData(result);
  };

  const handleCompanyFilterChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleSearchByChange = (event) => {
    const selected = event.target.value;
    setSearchBy(selected);
    // Reset the search term when changing search field
    setSearchTerm("");
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleResetFilters = () => {
    const today = formatDateForInput(new Date());
    setStartDate(today);
    setEndDate(today);
    setSelectedCompany("");
    setSearchBy("");
    setSearchTerm("");
    
    // Reset to show data for current date only
    const filtered = filterByDateRange(insuranceData, today, today);
    setFilteredData(filtered);
  };

  const handleApplyFilters = () => {
    filterData();
  };

  const handleViewFile = (fileId) => {
    // Construct file URL using the actual file ID
    const fileUrl = `http://127.0.0.1:8000/insurance/serve_file/${fileId}`;
    window.open(fileUrl, '_blank');
  };
  
  return (
    <Container>
      <Title>Insurance Report</Title>
      {/* Date Range Filter Section */}
      <FilterContainer>
        {/* First Row: Date and Company filters */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '10px' }}>
          <FilterGroup>
            <Label htmlFor="startDate">From:</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
            
            <Label htmlFor="endDate">To:</Label>
            <Input
              id="endDate" 
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
            
            <Label htmlFor="companyName">Company:</Label>
            <Select
              id="companyName"
              value={selectedCompany}
              onChange={handleCompanyFilterChange}
            >
              <option value="">All Companies</option>
              <option value="General Insurance">General Insurance</option>
              <option value="ECHS">ECHS</option>
              <option value="ESI">ESI</option>
              <option value="Railway CTSE">Railway CTSE</option>
              <option value="TNCM">TNCM</option>
              <option value="TKT">TKT</option>
              <option value="FCA">FCA</option>
              <option value="Airport">Airport</option>
            </Select>
          </FilterGroup>
        </div>
        
        {/* Second Row: Search filters and buttons */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <FilterGroup>
            <Label htmlFor="searchBy">Search by:</Label>
            <Select
              id="searchBy"
              value={searchBy}
              onChange={handleSearchByChange}
            >
              <option value="">Select Search Field</option>
              <option value="billNumber">Bill Number</option>
              <option value="ipNumber">IP Number</option>
              <option value="opNumber">OP Number</option>
              <option value="patient_name">Patient Name</option>
              <option value="dateOfDischarge">Discharge Date</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Input
              type={searchBy === "dateOfDischarge" ? "date" : "text"}
              placeholder={`Enter ${searchBy === "billNumber" ? "Bill Number" : 
                          searchBy === "ipNumber" ? "IP Number" :
                          searchBy === "opNumber" ? "OP Number" :
                          searchBy === "patient_name" ? "Patient Name" : 
                          searchBy === "dateOfDischarge" ? "Discharge Date" : "Search term"}`}
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </FilterGroup>

          <FilterButton onClick={handleApplyFilters}>Apply Filters</FilterButton>
          <ResetButton onClick={handleResetFilters}>Reset</ResetButton>
        </div>
      </FilterContainer>

      <ScrollableTableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Patient UHID</TableHeader>
              <TableHeader>Patient Name</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>IP / OP Number</TableHeader>
              <TableHeader>Bill Number</TableHeader>
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
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.patient_uhid || "N/A"}</TableCell>
                  <TableCell>{item.patient_name || "N/A"}</TableCell>
                  <TableCell style={{whiteSpace:"nowrap"}}>{item.date || "N/A"}</TableCell>
                  <TableCell>{item.opNumber || item.ipNumber || "N/A"}</TableCell>
                  <TableCell>{item.billNumber || "N/A"}</TableCell>
                  <TableCell>{item.companyName || "N/A"}</TableCell>
                  <TableCell>{item.dateOfDischarge || "N/A"}</TableCell>
                  <TableCell style={{whiteSpace:"nowrap"}}>
                    {item.submissionStatus === "Physical" && <BlinkingLight style={{textAlign:"center"}} />}
                  </TableCell>
                  <TableCell>
                    {item.billingFile && (
                      <Button onClick={() => handleViewFile(item.billingFile)}>View</Button>
                    )}
                  </TableCell>
                  <TableCell>{item.submissionStatus || "N/A"}</TableCell>
                  <TableCell>
                    {item.queryUpload && (
                      <Button onClick={() => handleViewFile(item.queryUpload)}>View</Button>
                    )}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="20" style={{textAlign: "center"}}>No records found matching your filters</TableCell>
              </TableRow>
            )}
          </tbody>
          
        </Table>
      </ScrollableTableContainer>
    </Container>
  );
};

export default InsuranceReport;