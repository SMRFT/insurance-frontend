import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Home,
  FileText,
  ClipboardList,
  Edit,
  Baby,
  ChevronDown,
  Shield,
  FileCheck,
  FilePlus,
  Calendar,
  Activity,
  PieChart,
  Users,
  Settings,
  Book,
  LogOut
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

const SidebarContainer = styled.div`
  position: fixed;
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #6F8B83 0%, #9AB3AB 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  
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
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 220px;
    padding: 20px 12px;
  }
  
  @media (max-width: 576px) {
    width: 120px;
    padding: 16px 8px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  animation: ${pulse} 2s infinite ease-in-out;
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
  
  @media (max-width: 576px) {
    margin-right: 0;
  }
`;

const SidebarHeader = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const RoleBadge = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  margin-top: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;
  
  @media (max-width: 576px) {
    font-size: 10px;
    padding: 4px 8px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 15px 0;
`;

const NavGroup = styled.div`
  margin-bottom: 8px;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.1}s;
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
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 576px) {
    font-size: 13px;
    padding: 10px 5px;
    justify-content: center;
    flex-direction: column;
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
    margin-left: 0;
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
    font-size: 11px;
    flex-direction: column;
    text-align: center;
    padding: 8px 4px;
    
    &:hover {
      transform: translateX(0) translateY(-2px);
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
  
  ${SidebarLink}:hover & {
    transform: scale(1.2);
  }
  
  @media (max-width: 576px) {
    margin-right: 0;
    margin-bottom: 5px;
  }
`;

const GroupIconWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  
  @media (max-width: 576px) {
    margin-right: 0;
    margin-bottom: 5px;
  }
`;

const ChevronIconWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  
  @media (max-width: 576px) {
    display: none;
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

const Badge = styled.span`
  background-color: #FF5C5C;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  font-weight: 600;
  
  @media (max-width: 576px) {
    margin-left: 0;
    margin-top: 4px;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const LogoutContainer = styled.div`
  margin-top: 20px;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.8s;
`;

const NoAccessMessage = styled.div`
  padding: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 20px 0;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 6px;
`;

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  const [openGroups, setOpenGroups] = useState({
    insurance: true,
    daycare: true,
    reports: false,
  });

  // Fetch user role from localStorage on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;
    const name = user?.name;
    setUserRole(role || "");
    setUserName(name || "");
  }, []);
  
console.log(userRole)
  const toggleGroup = (group) => {
    setOpenGroups({
      ...openGroups,
      [group]: !openGroups[group]
    });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };
  
  // Define all possible navigation groups
  const allNavigationGroups = [
    {
      id: "home",
      items: [
        { path: "/", label: "HOME", icon: <Home size={18} /> }
      ],
      roles: ["EMPLOYEE", "ADMIN", "SUPER ADMIN"] // Everyone can see home
    },
    {
      id: "insurance",
      label: "Insurance",
      icon: <Shield size={18} />,
      items: [
        { path: "/InsuranceForm", label: "Insurance Form", icon: <FilePlus size={18} /> },
        { path: "/FormUpdate", label: "Form Update", icon: <Edit size={18} /> },
        { path: "/OtherForm", label: "Other Form", icon: <Edit size={18} /> }
      ],
      roles: ["EMPLOYEE", "ADMIN", "SUPER ADMIN"] // Everyone can see home
    },
    {
      id: "daycare",
      label: "Day Care",
      icon: <Baby size={18} />,
      items: [
        { path: "/Daycare", label: "Daycare", icon: <ClipboardList size={18} /> },
      ],
      roles: ["EMPLOYEE", "ADMIN", "SUPER ADMIN"] // Everyone can see home
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText size={18} />,
      items: [
        { path: "/InsuranceReport", label: "Insurance Report", icon: <FileCheck size={18} /> },
        { path: "/OtherReport", label: "Other Report", icon: <FileCheck size={18} /> },
        { path: "/DaycareReport", label: "Daycare Report", icon: <Calendar size={18} /> },
        { path: "/RadiotherapyReport", label: "Radiotherapy Report", icon: <Activity size={18} /> },
      ],
      roles: ["EMPLOYEE", "ADMIN", "SUPER ADMIN"] // Everyone can see home
    },
    {
      id: "User Rights",
      label: "User Rights",
      icon: <FileText size={18} />,
      items: [
        { path: "/Register", label: "Register", icon: <Activity size={18} /> },

      ],
      roles: ["SUPER ADMIN"] // Everyone can see home
    },
  ];

  // Filter navigation groups based on user role
  const filteredNavigationGroups = allNavigationGroups.filter(group => 
    group.roles.includes(userRole)
  );

  return (
    <SidebarContainer>
      <LogoContainer>
        <Logo>
          <Shield size={22} />
        </Logo>
        <SidebarHeader>Insurance</SidebarHeader>
      </LogoContainer>
      {userName && (
        <RoleBadge>{userName}</RoleBadge>
      )}
      {/* {userRole && (
        <RoleBadge>{userRole}</RoleBadge>
      )} */}
      
      <Divider />
      
      {userRole ? (
        filteredNavigationGroups.map((group, index) => (
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
                        {item.badge && <Badge>{item.badge}</Badge>}
                      </SidebarLink>
                    ))}
                  </GroupItems>
                </GroupItemsContainer>
              </>
            ) : (
              // Single items without grouping (like Home)
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
        ))
      ) : (
        <NoAccessMessage>
          Please log in to access the system features
        </NoAccessMessage>
      )}
      
      <Spacer />
      
      <LogoutContainer>
        <Divider />
        <SidebarLink
          to="/"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <IconWrapper>
            <LogOut size={18} />
          </IconWrapper>
          Logout
        </SidebarLink>
      </LogoutContainer>
    </SidebarContainer>
  );
}

export default Sidebar;