import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormWrapper,
  ReportContainer,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  SearchContainer,
  FilterContainer,
  Label,
  Input,
  Select,
  Button,
  ButtonWrapper
} from "./SharedStyledComponents";

const OtherReport = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL;

  useEffect(() => {
    fetchRecords();
  }, [fromDate, toDate]);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, companyFilter]);

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

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Insurancebaseurl}other_records/`, {
        params: { from_date: fromDate, to_date: toDate }
      });
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
      alert("Error fetching records");
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = records;
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patient_uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.mobile_number.includes(searchTerm)
      );
    }
    if (companyFilter) {
      filtered = filtered.filter(record => record.company_name === companyFilter);
    }
    setFilteredRecords(filtered);
  };

  const exportToCSV = () => {
    const headers = ["DAte", "Patient Name", "Patient UHID", "Mobile Number", "Company Name", "Treatment", "Amount", "Refund"];
    const csvContent = [
      headers.join(","),
      ...filteredRecords.map(record => [
        record.date,
        record.patient_name,
        record.patient_uhid,
        record.mobile_number,
        record.company_name,
        record.treatment,
        record.amount,
        record.refund
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "insurance_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <FormWrapper>
      <ReportContainer>
        <Title>Other Records Report</Title>
        <FilterContainer             style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", 
            gap: "20px",
            alignItems: "center" // aligns items vertically center (optional)
            }}>
          <div>
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search by name, UHID, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label>Company</Label>
            <Select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="">All Companies</option>
              {insuranceCompanies.map((company, index) => (
                <option key={index} value={company.name}>
                  {company.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <Label>To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div style={{marginTop:"10px"}}>
            <Button  onClick={exportToCSV}>Export CSV</Button>
          </div>
        </FilterContainer>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Patient Name</TableHeader>
                <TableHeader>UHID</TableHeader>
                <TableHeader>Mobile</TableHeader>
                <TableHeader>Company</TableHeader>
                <TableHeader>Treatment</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Refund</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell style={{ whiteSpace: "nowrap" }}>{record.date}</TableCell>
                  <TableCell>{record.patient_name}</TableCell>
                  <TableCell>{record.patient_uhid}</TableCell>
                  <TableCell>{record.mobile_number}</TableCell>
                  <TableCell>{record.company_name}</TableCell>
                  <TableCell>{record.treatment}</TableCell>
                  <TableCell>₹{record.amount}</TableCell>
                  <TableCell>₹{record.refund}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}

        {filteredRecords.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            No records found
          </div>
        )}
      </ReportContainer>
    </FormWrapper>
  );
};

export default OtherReport;
