import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFileAlt, faClipboard } from "@fortawesome/free-solid-svg-icons";

const SidebarContainer = styled.div`
  position: fixed;
  width: 220px;
  height: 100vh;
  background-color: #9AB3AB;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: 'Roboto', sans-serif; /* Updated font style */
  transition: width 0.3s;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 180px;
    padding: 15px;
  }

  @media (max-width: 576px) {
    width: 100px;
    padding: 10px;
  }
`;

const SidebarLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 10px 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 576px) {
    font-size: 14px;
    flex-direction: column; /* Stack icon and text vertically */
    text-align: center;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  margin-right: 10px;

  @media (max-width: 576px) {
    margin-right: 0;
    margin-bottom: 5px; /* Space between icon and text when stacked */
  }
`;

const SidebarHeader = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 576px) {
    font-size: 16px;
  }
`;

function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarHeader>Insurance</SidebarHeader>
      <SidebarLink to="/">
        <Icon icon={faHome} />
        Home
      </SidebarLink>
      <SidebarLink to="/InsuranceForm">
        <Icon icon={faFileAlt} />
        Insurance Form
      </SidebarLink>
      <SidebarLink to="/InsuranceReport">
        <Icon icon={faClipboard} />
        Insurance Report
      </SidebarLink>
    </SidebarContainer>
  );
}

export default Sidebar;
