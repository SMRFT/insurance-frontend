import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Shield,
  FileCheck,
  FilePlus,
  Edit,
  Activity,
  ChevronDown,
  LogOut,
  FileText,
  Menu,
  X,
  List,
  ClipboardList,
  BarChart2,
  CheckSquare,
  FileEdit,
  PlusSquare,
  FileBarChart,
  Stethoscope,
  RefreshCw,
  BadgeCheck,
  Receipt,
  Banknote,
  MessageSquare,
  FileSearch
} from "lucide-react";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: ${fadeIn} 0.3s ease;
  }
`;

const MobileToggle = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: 20px; left: 20px;
    z-index: 1001;
    background: linear-gradient(135deg, #6F8B83 0%, #9AB3AB 100%);
    color: white;
    border: none;
    width: 50px; height: 50px;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    &:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
    &:active { transform: scale(0.95); }
  }
  @media (max-width: 576px) { top: 15px; left: 15px; width: 45px; height: 45px; }
`;

const SidebarContainer = styled.div`
  position: fixed;
  left: 0; top: 0;
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #6F8B83 0%, #9AB3AB 100%);
  color: white;
  display: flex;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  box-shadow: 4px 0 15px rgba(0,0,0,0.1);
  overflow: hidden;
  z-index: 1000;
  @media (max-width: 1200px) { width: 240px; }
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    animation: ${props => props.isOpen ? slideIn : 'none'} 0.3s ease;
    width: 280px;
    box-shadow: ${props => props.isOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none'};
  }
  @media (max-width: 576px) { width: 260px; }
`;

const SidebarTop = styled.div`
  padding: 24px 16px 0 16px;
  flex-shrink: 0;
  @media (max-width: 1200px) { padding: 20px 14px 0 14px; }
  @media (max-width: 576px) { padding: 16px 12px 0 12px; }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) transparent;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); border-radius: 10px; }
  @media (max-width: 1200px) { padding: 0 14px; }
  @media (max-width: 576px) { padding: 0 12px; }
`;

const SidebarBottom = styled.div`
  padding: 10px 16px 16px 16px;
  flex-shrink: 0;
  @media (max-width: 1200px) { padding: 10px 14px 14px 14px; }
  @media (max-width: 576px) { padding: 8px 12px 12px 12px; }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  @media (max-width: 768px) { margin-bottom: 16px; }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s infinite ease-in-out;
  flex: 1;
`;

const Logo = styled.div`
  background-color: white;
  color: #6F8B83;
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  flex-shrink: 0;
  @media (max-width: 576px) { width: 36px; height: 36px; }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
  white-space: nowrap;
  @media (max-width: 768px) { font-size: 18px; }
`;

const CloseButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    background: rgba(255,255,255,0.15);
    border: none;
    color: white;
    width: 32px; height: 32px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    &:hover { background: rgba(255,255,255,0.25); }
    &:active { transform: scale(0.95); }
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 15px;
  @media (max-width: 576px) { gap: 4px; margin-bottom: 10px; }
`;

const RoleBadge = styled.div`
  background: rgba(255,255,255,0.15);
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.2);
  letter-spacing: 0.5px;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 768px) { font-size: 11px; padding: 6px 10px; }
  @media (max-width: 576px) { font-size: 10px; padding: 5px 8px; }
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(255,255,255,0.2);
  margin: 0 0 15px 0;
  @media (max-width: 576px) { margin: 0 0 12px 0; }
`;

const NavGroup = styled.div`
  margin-bottom: 4px;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.1}s;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  border-radius: 6px;
  color: rgba(255,255,255,0.7);
  transition: all 0.2s ease;
  user-select: none;
  &:hover { color: rgba(255,255,255,0.95); background-color: rgba(255,255,255,0.06); }
  @media (max-width: 768px) { font-size: 10px; padding: 9px 10px; }
  @media (max-width: 576px) { font-size: 10px; padding: 8px; }
`;

const GroupLabel = styled.span`
  flex: 1;
`;

const ChevronIconWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  flex-shrink: 0;
  opacity: 0.7;
`;

const GroupItemsContainer = styled.div`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const GroupItems = styled.div`
  padding: 2px 0 6px 0;
`;

const SidebarLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 2px 0;
  padding: 9px 12px 9px 10px;
  font-size: 13.5px;
  display: flex;
  align-items: center;
  font-weight: 400;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? 'rgba(255,255,255,0.18)' : 'transparent'};
  position: relative;
  gap: 10px;
  &:hover {
    background-color: rgba(255,255,255,0.13);
    transform: translateX(4px);
  }
  &:active { transform: scale(0.98); }
  @media (max-width: 768px) { font-size: 13px; padding: 8px 10px; }
  @media (max-width: 576px) { font-size: 12px; padding: 8px; gap: 8px; &:hover { transform: translateX(2px); } }
`;

const IconPill = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: ${props => props.bg || 'rgba(255,255,255,0.18)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  ${SidebarLink}:hover & { transform: scale(1.12); }
  @media (max-width: 768px) { width: 26px; height: 26px; }
  @media (max-width: 576px) { width: 24px; height: 24px; border-radius: 6px; }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  left: 0;
  width: 3px;
  height: 60%;
  background-color: white;
  border-radius: 0 4px 4px 0;
  transition: all 0.3s ease;
  opacity: ${props => props.active ? '1' : '0'};
`;

const LogoutContainer = styled.div`
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 5px;
  @media (max-width: 576px) { padding: 3px; }
`;

const LogoutButton = styled.button`
  color: white;
  background: #70847fff;
  border: none;
  margin: 4px 0;
  padding: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;
  &:hover { background-color: #617a73ff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(97,118,112,0.5); }
  &:active { transform: scale(0.98); }
  @media (max-width: 768px) { font-size: 13px; padding: 10px; }
  @media (max-width: 576px) { font-size: 12px; padding: 10px 8px; }
`;

// Icon background colours per item type
const ICON_COLORS = {
  // Forms
  insuranceForm:  'rgba(100,180,255,0.35)',
  otherForm:      'rgba(130,200,140,0.35)',
  // Updates
  formUpdate:     'rgba(255,180,80,0.35)',
  otherUpdate:    'rgba(255,140,100,0.35)',
  gatePass:       'rgba(180,140,255,0.35)',
  // Reports
  insuranceReport:'rgba(80,200,200,0.35)',
  otherReport:    'rgba(100,210,160,0.35)',
  radiotherapy:   'rgba(255,120,160,0.35)',
  // Approvals
  overall:        'rgba(100,220,120,0.35)',
  refund:         'rgba(255,200,80,0.35)',
  // Enquiry
  enquiryForm:    'rgba(255,160,220,0.35)',
  enquiryList:    'rgba(160,180,255,0.35)',
  enquiryDetail:  'rgba(255,220,120,0.35)',
};

function Sidebar({ userRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState({
    insurance: false,
    update: false,
    reports: false,
    collection: false,
    "Final Approval": false,
    enquiry: false,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");
    const name = user?.name;
    setUserName(name || "");
    setRole(userRole || storedRole || "");
  }, [userRole]);

  useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      document.body.style.overflow = isSidebarOpen ? 'hidden' : 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const toggleGroup = (group) => {
    setOpenGroups(prev => {
      const isOpen = prev[group];
      const allClosed = Object.keys(prev).reduce((acc, k) => ({ ...acc, [k]: false }), {});
      return { ...allClosed, [group]: !isOpen };
    });
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    ["user_payload","selected_branch","access_token","user","role","name","employeeId","userEmail"]
      .forEach(k => localStorage.removeItem(k));
    window.location.href = "/secure";
  };

  const getNavigationGroups = () => {
    switch (role) {
      case "Insurance Staff":
        return [
          {
            id: "insurance", label: "Insurance Forms",
            items: [
              { path: "/",          label: "Insurance Form", icon: <FilePlus size={15} />,    color: ICON_COLORS.insuranceForm },
              { path: "/OtherForm", label: "Other Form",     icon: <PlusSquare size={15} />,  color: ICON_COLORS.otherForm },
            ]
          },
          {
            id: "update", label: "Update Forms",
            items: [
              { path: "/FormUpdate", label: "Form Update", icon: <FileEdit size={15} />, color: ICON_COLORS.formUpdate },
            ]
          },
          {
            id: "reports", label: "Reports",
            items: [
              { path: "/InsuranceReport", label: "Insurance Report", icon: <FileBarChart size={15} />, color: ICON_COLORS.insuranceReport },
              { path: "/OtherReport",     label: "Other Report",     icon: <BarChart2 size={15} />,    color: ICON_COLORS.otherReport },
            ]
          },
          {
            id: "enquiry", label: "Enquiry",
            items: [
              { path: "/EnquiryForm", label: "Enquiry Form", icon: <MessageSquare size={15} />, color: ICON_COLORS.enquiryForm },
            ]
          },
        ];

      case "Insurance Admin":
        return [
          {
            id: "update", label: "Update Forms",
            items: [
              { path: "/FormUpdate",   label: "Form Update",    icon: <FileEdit size={15} />,     color: ICON_COLORS.formUpdate },
              { path: "/OtherUpdate",  label: "Other Update",   icon: <RefreshCw size={15} />,    color: ICON_COLORS.otherUpdate },
              { path: "/OtherGatePass",label: "Issue Gate Pass",icon: <ClipboardList size={15} />,color: ICON_COLORS.gatePass },
            ]
          },
          {
            id: "reports", label: "Reports",
            items: [
              { path: "/InsuranceReport",   label: "Insurance Report",   icon: <FileBarChart size={15} />, color: ICON_COLORS.insuranceReport },
              { path: "/OtherReport",       label: "Other Report",       icon: <BarChart2 size={15} />,    color: ICON_COLORS.otherReport },
              { path: "/RadiotherapyReport",label: "Radiotherapy Report",icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
              { path: "/RTReport",          label: "RT Report",          icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
              { path: "/ChemoReport",       label: "Chemo Report",       icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
            ]
          },
          {
            id: "enquiry", label: "Enquiry",
            items: [
              { path: "/EnquiryForm", label: "Enquiry Form", icon: <MessageSquare size={15} />, color: ICON_COLORS.enquiryForm },
              { path: "/EnquiryDetailPage", label: "Enquiry Detail", icon: <FileSearch size={15} />, color: ICON_COLORS.enquiryDetail },
            ]
          },
        ];

      case "Insurance Accounts":
        return [
          {
            id: "reports", label: "Reports",
            items: [
              { path: "/InsuranceReport", label: "Insurance Report", icon: <FileBarChart size={15} />, color: ICON_COLORS.insuranceReport },
              { path: "/OtherReport",     label: "Other Report",     icon: <BarChart2 size={15} />,    color: ICON_COLORS.otherReport },
              { path: "/RTReport",        label: "RT Report",        icon: <Stethoscope size={15} />,  color: ICON_COLORS.radiotherapy },
              { path: "/ChemoReport",     label: "Chemo Report",     icon: <Stethoscope size={15} />,  color: ICON_COLORS.radiotherapy },
            ]
          },
        ];

      case "Insurance Super Admin":
        return [
          {
            id: "update", label: "Update Forms",
            items: [
              { path: "/FormUpdate",  label: "Form Update",  icon: <FileEdit size={15} />,  color: ICON_COLORS.formUpdate },
              { path: "/OtherUpdate", label: "Other Update", icon: <RefreshCw size={15} />, color: ICON_COLORS.otherUpdate },
            ]
          },
          {
            id: "Final Approval", label: "Approve Forms",
            items: [
              { path: "/OverallApproval", label: "Overall Approval", icon: <BadgeCheck size={15} />, color: ICON_COLORS.overall },
              { path: "/RefundApproval",  label: "Refund Approval",  icon: <Banknote size={15} />,   color: ICON_COLORS.refund },
            ]
          },
          {
            id: "reports", label: "Reports",
            items: [
              { path: "/InsuranceReport",   label: "Insurance Report",   icon: <FileBarChart size={15} />, color: ICON_COLORS.insuranceReport },
              { path: "/OtherReport",       label: "Other Report",       icon: <BarChart2 size={15} />,    color: ICON_COLORS.otherReport },
              { path: "/RadiotherapyReport",label: "Radiotherapy Report",icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
              { path: "/RTReport",          label: "RT Report",          icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
              { path: "/ChemoReport",       label: "Chemo Report",       icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
            ]
          },
          {
            id: "enquiry", label: "Enquiry",
            items: [
              { path: "/EnquiryDetailPage", label: "Enquiry Detail", icon: <FileSearch size={15} />,    color: ICON_COLORS.enquiryDetail },
            ]
          },
        ];

      case "Insurance Marketting":
        return [
          {
            id: "enquiry", label: "Enquiry",
            items: [
              { path: "/EnquiryList",       label: "Enquiry List",   icon: <List size={15} />,          color: ICON_COLORS.enquiryList },
              { path: "/EnquiryDetailPage", label: "Enquiry Detail", icon: <FileSearch size={15} />,    color: ICON_COLORS.enquiryDetail },
            ]
          },
        ];

      case "RT Staff":
        return [
          {
            id: "insurance", label: "Insurance Forms",
            items: [
              { path: "/RTForm", label: "RT Form", icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
            ]
          },
          {
            id: "reports", label: "Reports",
            items: [
              { path: "/RTReport", label: "RT Report", icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
            ]
          }
        ];

      case "Chemo Staff":
        return [
          {
            id: "insurance", label: "Insurance Forms",
            items: [
              { path: "/ChemoForm", label: "Chemo Form", icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
            ]
          },
          {
            id: "reports", label: "Reports",
            items: [
              { path: "/ChemoReport", label: "Chemo Report", icon: <Stethoscope size={15} />, color: ICON_COLORS.radiotherapy },
            ]
          }
        ];

      case "Insurance Testing":
        return [
          {
            id: "insurance",
            label: "Insurance Forms",
            items: [
              {
                path: "/InsuranceForm",
                label: "Insurance Form",
                icon: <FilePlus size={15} />,
                color: ICON_COLORS.insuranceForm
              },
              {
                path: "/OtherForm",
                label: "Other Form",
                icon: <PlusSquare size={15} />,
                color: ICON_COLORS.otherForm
              },
              {
                path: "/RTForm",
                label: "RT Form",
                icon: <Stethoscope size={15} />,
                color: ICON_COLORS.radiotherapy
              },
              {
                path: "/ChemoForm",
                label: "Chemo Form",
                icon: <Stethoscope size={15} />,
                color: ICON_COLORS.radiotherapy
              }
            ]
          },

          {
            id: "update",
            label: "Update Forms",
            items: [
              {
                path: "/FormUpdate",
                label: "Form Update",
                icon: <FileEdit size={15} />,
                color: ICON_COLORS.formUpdate
              },
              {
                path: "/OtherUpdate",
                label: "Other Update",
                icon: <RefreshCw size={15} />,
                color: ICON_COLORS.otherUpdate
              },
              {
                path: "/OtherGatePass",
                label: "Issue Gate Pass",
                icon: <ClipboardList size={15} />,
                color: ICON_COLORS.gatePass
              },
            ]
          },

          {
            id: "Final Approval",
            label: "Approve Forms",
            items: [
              {
                path: "/OverallApproval",
                label: "Overall Approval",
                icon: <BadgeCheck size={15} />,
                color: ICON_COLORS.overall
              },
              {
                path: "/RefundApproval",
                label: "Refund Approval",
                icon: <Banknote size={15} />,
                color: ICON_COLORS.refund
              },
            ]
          },

          {
            id: "reports",
            label: "Reports",
            items: [
              {
                path: "/InsuranceReport",
                label: "Insurance Report",
                icon: <FileBarChart size={15} />,
                color: ICON_COLORS.insuranceReport
              },
              {
                path: "/OtherReport",
                label: "Other Report",
                icon: <BarChart2 size={15} />,
                color: ICON_COLORS.otherReport
              },
              {
                path: "/RadiotherapyReport",
                label: "Radiotherapy Report",
                icon: <Stethoscope size={15} />,
                color: ICON_COLORS.radiotherapy
              },
              {
                path: "/RTReport",
                label: "RT Report",
                icon: <Stethoscope size={15} />,
                color: ICON_COLORS.radiotherapy
              },
              {
                path: "/ChemoReport",
                label: "Chemo Report",
                icon: <Stethoscope size={15} />,
                color: ICON_COLORS.radiotherapy
              },
            ]
          },

          {
            id: "enquiry",
            label: "Enquiry",
            items: [
              {
                path: "/EnquiryForm",
                label: "Enquiry Form",
                icon: <MessageSquare size={15} />,
                color: ICON_COLORS.enquiryForm
              },
              {
                path: "/EnquiryList",
                label: "Enquiry List",
                icon: <List size={15} />,
                color: ICON_COLORS.enquiryList
              },
              {
                path: "/EnquiryDetailPage",
                label: "Enquiry Detail",
                icon: <FileSearch size={15} />,
                color: ICON_COLORS.enquiryDetail
              },
            ]
          }
        ];

      default:
        return [];
    }
  };

  const navigationGroups = getNavigationGroups();

  return (
    <>
      <MobileToggle onClick={toggleSidebar} aria-label="Toggle sidebar">
        <Menu size={24} />
      </MobileToggle>

      <Overlay isOpen={isSidebarOpen} onClick={toggleSidebar} />

      <SidebarContainer isOpen={isSidebarOpen}>

        <SidebarTop>
          <SidebarHeader>
            <LogoContainer>
              <Logo><Shield size={22} /></Logo>
              <Title>Insurance</Title>
            </LogoContainer>
            <CloseButton onClick={toggleSidebar} aria-label="Close sidebar">
              <X size={20} />
            </CloseButton>
          </SidebarHeader>

          <UserInfoContainer>
            {userName && <RoleBadge>{userName}</RoleBadge>}
            {role && <RoleBadge style={{ background: 'rgba(255,255,255,0.25)' }}>{role}</RoleBadge>}
          </UserInfoContainer>

          <Divider />
        </SidebarTop>

        <ScrollableContent>
          {navigationGroups.map((group, index) => (
            <NavGroup key={group.id} index={index}>
              <GroupHeader onClick={() => toggleGroup(group.id)}>
                <GroupLabel>{group.label}</GroupLabel>
                <ChevronIconWrapper isOpen={openGroups[group.id]}>
                  <ChevronDown size={14} />
                </ChevronIconWrapper>
              </GroupHeader>

              <GroupItemsContainer isOpen={openGroups[group.id]}>
                <GroupItems>
                  {group.items.map((item) => (
                    <SidebarLink
                      key={item.path}
                      to={item.path}
                      active={isActive(item.path) ? "true" : undefined}
                    >
                      <ActiveIndicator active={isActive(item.path)} />
                      <IconPill bg={item.color}>
                        {item.icon}
                      </IconPill>
                      {item.label}
                    </SidebarLink>
                  ))}
                </GroupItems>
              </GroupItemsContainer>
            </NavGroup>
          ))}
        </ScrollableContent>

        <SidebarBottom>
          <LogoutContainer>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </LogoutButton>
          </LogoutContainer>
        </SidebarBottom>

      </SidebarContainer>
    </>
  );
}

export default Sidebar;