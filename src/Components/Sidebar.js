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
  X
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

// Overlay for mobile
const Overlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: ${fadeIn} 0.3s ease;
  }
`;

// Mobile toggle button
const MobileToggle = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
    background: linear-gradient(135deg, #6F8B83 0%, #9AB3AB 100%);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  @media (max-width: 576px) {
    top: 15px;
    left: 15px;
    width: 45px;
    height: 45px;
  }
`;

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #6F8B83 0%, #9AB3AB 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  z-index: 1000;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
  
  @media (max-width: 1200px) {
    width: 240px;
    padding: 20px 14px;
  }
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    animation: ${props => props.isOpen ? slideIn : 'none'} 0.3s ease;
    z-index: 1000;
    width: 280px;
    box-shadow: ${props => props.isOpen ? '4px 0 20px rgba(0, 0, 0, 0.3)' : 'none'};
  }
  
  @media (max-width: 576px) {
    width: 260px;
    padding: 16px 12px;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  
  @media (max-width: 576px) {
    width: 36px;
    height: 36px;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 15px;
  position: sticky;
  top: 0;
  padding: 8px 0;
  z-index: 10;
  
  @media (max-width: 576px) {
    gap: 4px;
    margin-bottom: 10px;
    padding: 6px 0;
  }
`;

const RoleBadge = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 10px;
  }
  
  @media (max-width: 576px) {
    font-size: 10px;
    padding: 5px 8px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 15px 0;
  
  @media (max-width: 576px) {
    margin: 12px 0;
  }
`;

const NavGroup = styled.div`
  margin-bottom: 8px;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.1}s;
  
  @media (max-width: 576px) {
    margin-bottom: 6px;
  }
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px 10px;
  font-weight: 500;
  font-size: 15px;
  border-radius: 6px;
  transition: all 0.2s ease;
  user-select: none;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 8px;
  }
  
  @media (max-width: 576px) {
    font-size: 13px;
    padding: 10px 8px;
  }
`;

const GroupItemsContainer = styled.div`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const GroupItems = styled.div`
  margin-left: 12px;
  padding-top: 5px;
  padding-bottom: 5px;
  
  @media (max-width: 576px) {
    margin-left: 8px;
  }
`;

const SidebarLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 4px 0;
  padding: 10px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  font-weight: 400;
  border-radius: 6px;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 10px;
  }
  
  @media (max-width: 576px) {
    font-size: 12px;
    padding: 8px;
    
    &:hover {
      transform: translateX(3px);
    }
  }
`;

const IconWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  ${SidebarLink}:hover & {
    transform: scale(1.2);
  }
  
  @media (max-width: 768px) {
    margin-right: 10px;
    width: 18px;
    height: 18px;
  }
  
  @media (max-width: 576px) {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
`;

const GroupIconWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    margin-right: 10px;
    width: 18px;
    height: 18px;
  }
  
  @media (max-width: 576px) {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
`;

const ChevronIconWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  flex-shrink: 0;
  
  @media (max-width: 576px) {
    width: 14px;
    height: 14px;
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  left: 0;
  width: 4px;
  height: 70%;
  background-color: white;
  border-radius: 0 4px 4px 0;
  transition: all 0.3s ease;
  opacity: ${props => props.active ? '1' : '0'};
`;

const Spacer = styled.div`
  flex: 1;
  min-height: 20px;
`;

const LogoutContainer = styled.div`
  margin-top: auto;
  padding-top: 10px;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 5px;
  
  @media (max-width: 576px) {
    padding: 3px;
  }
`;

const LogoutButton = styled.button`
  color: white;
  background: #70847fff;
  border: none;
  text-decoration: none;
  margin: 4px 0;
  padding: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;
  
  &:hover {
    background-color: #617a73ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(97, 118, 112, 0.5);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 10px;
  }
  
  @media (max-width: 576px) {
    font-size: 12px;
    padding: 10px 8px;
  }
`;

const LogoutText = styled.span`
  @media (max-width: 576px) {
    display: inline;
  }
`;

function Sidebar({ userRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize all groups as closed
  const [openGroups, setOpenGroups] = useState({
    insurance: false,
    update: false,
    reports: false,
    collection: false,
    "Final Approval": false,
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");
    const name = user?.name;
    setUserName(name || "");
    setRole(userRole || storedRole || "");
  }, [userRole]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      if (isSidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (typeof Storage !== "undefined") {
      localStorage.removeItem("user_payload");
      localStorage.removeItem("selected_branch");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("employeeId");
      localStorage.removeItem("userEmail");
    }

    const redirectURL = "/secure";
    window.location.href = redirectURL;
  };

  // Define navigation groups based on role
  const getNavigationGroups = () => {
    switch(role) {
      case "Insurance Staff":
        return [
          {
            id: "insurance",
            label: "Insurance Forms",
            icon: <Shield size={18} />,
            items: [
              { path: "/", label: "Insurance Form", icon: <FilePlus size={18} /> },
              { path: "/OtherForm", label: "Other Form", icon: <FilePlus size={18} /> }
            ]
          },
          {
            id: "update",
            label: "Update Forms",
            icon: <Edit size={18} />,
            items: [
              { path: "/FormUpdate", label: "Form Update", icon: <Edit size={18} /> },
            ]
          },
          {
            id: "reports",
            label: "Reports",
            icon: <FileText size={18} />,
            items: [
              { path: "/InsuranceReport", label: "Insurance Report", icon: <FileCheck size={18} /> },
              { path: "/OtherReport", label: "Other Report", icon: <FileCheck size={18} /> },
            ]
          },
        ];

      case "Insurance Admin":
        return [
          {
            id: "update",
            label: "Update Forms",
            icon: <Edit size={18} />,
            items: [
              { path: "/FormUpdate", label: "Form Update", icon: <Edit size={18} /> },
              { path: "/OtherUpdate", label: "Other Update", icon: <Edit size={18} /> },
              { path: "/OtherGatePass", label: "Issue Gate Pass", icon: <Edit size={18} /> },
            ]
          },
          {
            id: "reports",
            label: "Reports",
            icon: <FileText size={18} />,
            items: [
              { path: "/InsuranceReport", label: "Insurance Report", icon: <FileCheck size={18} /> },
              { path: "/OtherReport", label: "Other Report", icon: <FileCheck size={18} /> },
              { path: "/RadiotherapyReport", label: "Radiotherapy Report", icon: <Activity size={18} /> },
            ]
          },
        ];

      case "Insurance Accounts":
        return [
          {
            id: "reports",
            label: "Reports",
            icon: <FileText size={18} />,
            items: [
              { path: "/InsuranceReport", label: "Insurance Report", icon: <FileCheck size={18} /> },
              { path: "/OtherReport", label: "Other Report", icon: <FileCheck size={18} /> },
            ]
          },
        ];

        case "Insurance Super Admin":
        return [
          {
            id: "update",
            label: "Update Forms",
            icon: <Edit size={18} />,
            items: [
              { path: "/FormUpdate", label: "Form Update", icon: <Edit size={18} /> },
              { path: "/OtherUpdate", label: "Other Update", icon: <Edit size={18} /> },
            ]
          },
          {
            id: "Final Approval",
            label: "Approve Forms",
            icon: <FileCheck size={18} />,
            items: [
              { path: "/OverallApproval", label: "Overall Approval", icon: <FileCheck size={18} /> },
              { path: "/RefundApproval", label: "Refund Approval", icon: <FileCheck size={18} /> },
            ]
          },
          {
            id: "reports",
            label: "Reports",
            icon: <FileText size={18} />,
            items: [
              { path: "/InsuranceReport", label: "Insurance Report", icon: <FileCheck size={18} /> },
              { path: "/OtherReport", label: "Other Report", icon: <FileCheck size={18} /> },
              { path: "/RadiotherapyReport", label: "Radiotherapy Report", icon: <Activity size={18} /> },
            ]
          },
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
        <SidebarHeader>
          <LogoContainer>
            <Logo>
              <Shield size={22} />
            </Logo>
            <Title>Insurance</Title>
          </LogoContainer>
          <CloseButton onClick={toggleSidebar} aria-label="Close sidebar">
            <X size={20} />
          </CloseButton>
        </SidebarHeader>
        
        <UserInfoContainer>
          {userName && (
            <RoleBadge>{userName}</RoleBadge>
          )}
          
          {role && (
            <RoleBadge style={{ background: 'rgba(255, 255, 255, 0.25)' }}>
              {role}
            </RoleBadge>
          )}
        </UserInfoContainer>

        <Divider />
        
        {navigationGroups.map((group, index) => (
          <NavGroup key={group.id} index={index}>
            {group.label ? (
              <>
                <GroupHeader onClick={() => toggleGroup(group.id)}>
                  <GroupIconWrapper>
                    {group.icon}
                  </GroupIconWrapper>
                  {group.label}
                  <ChevronIconWrapper isOpen={openGroups[group.id]}>
                    <ChevronDown size={16} />
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
                        <IconWrapper>
                          {item.icon}
                        </IconWrapper>
                        {item.label}
                      </SidebarLink>
                    ))}
                  </GroupItems>
                </GroupItemsContainer>
              </>
            ) : (
              group.items.map((item) => (
                <SidebarLink 
                  key={item.path} 
                  to={item.path}
                  active={isActive(item.path) ? "true" : undefined}
                >
                  <ActiveIndicator active={isActive(item.path)} />
                  <IconWrapper>
                    {item.icon}
                  </IconWrapper>
                  {item.label}
                </SidebarLink>
              ))
            )}
          </NavGroup>
        ))}
        
        <Spacer />
     
        <LogoutContainer>
          <LogoutButton onClick={handleLogout}>
            <IconWrapper>
              <LogOut size={18} />
            </IconWrapper>
            <LogoutText>Logout</LogoutText>
          </LogoutButton>
        </LogoutContainer>
      </SidebarContainer>
    </>
  );
}

export default Sidebar;