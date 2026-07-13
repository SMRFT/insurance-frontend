import styled, { keyframes, css } from "styled-components"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// ── Design Tokens (mirrored from CSS vars for JS usage) ─────────────────
export const colors = {
  primary: '#4E7B6F',
  primaryLight: '#6F8B83',
  primaryDark: '#3A5C52',
  primary50: '#E8F0EE',
  accent: '#9AB3AB',
  accentLight: '#C4D4CF',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F8F7',
  bg: '#EDF2F0',
  border: '#DDE6E3',
  borderLight: '#EEF3F1',
  textPrimary: '#1A2E2B',
  textSecondary: '#4A6660',
  textMuted: '#7A9A93',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#0284C7',
}

// Legacy aliases (used internally below)
const primaryColor = colors.primary
const accentColor = colors.accent
const backgroundColor = colors.surfaceAlt
const textColor = colors.textPrimary

// ── Animations ──────────────────────────────────────────────────────────
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`

// ── Layout Containers ────────────────────────────────────────────────────

// Full-viewport report layout — no page scroll
export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--color-bg, #EDF2F0);

  @media (max-width: 768px) { padding: 14px; }
  @media (max-width: 480px) { padding: 10px; }
`

// Inner card that stretches to fill ReportContainer
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--color-surface, #fff);
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
  border: 1px solid var(--color-border, #DDE6E3);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 1024px) { padding: 20px; }
  @media (max-width: 768px)  { padding: 16px; border-radius: 10px; }
  @media (max-width: 480px)  { padding: 12px; border-radius: 8px; }
`

// Scrollable page area (for card-list pages)
export const PageScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  padding-right: 4px;
`

// ── Page Header ──────────────────────────────────────────────────────────
export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  flex-shrink: 0;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const PageHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const PageHeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`

// ── Typography ───────────────────────────────────────────────────────────
export const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  font-size: 24px;
  margin: 0 0 20px 0;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-weight: 700;
  letter-spacing: -0.3px;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    display: block;
    width: 48px;
    height: 3px;
    background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
    border-radius: 2px;
    margin: 8px auto 0;
  }

  @media (max-width: 768px) { font-size: 20px; }
  @media (max-width: 480px) { font-size: 17px; margin-bottom: 16px; }
`

export const SectionTitle = styled.h3`
  color: ${primaryColor};
  font-size: 15px;
  margin: 0 0 18px 0;
  font-weight: 600;
  border-bottom: 2px solid ${colors.primary50};
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) { font-size: 14px; margin-bottom: 14px; }
  @media (max-width: 480px) { font-size: 13px; }
`

export const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.textSecondary};
  margin-bottom: 6px;
  font-family: 'Inter', 'Poppins', sans-serif;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 480px) { font-size: 11px; }
`

// ── Form Layout ──────────────────────────────────────────────────────────
export const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg, #EDF2F0) 0%, ${colors.primary50} 100%);
  padding: 32px 20px;
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 768px) { padding: 20px 15px; }
  @media (max-width: 480px) { padding: 12px 10px; }
`

export const FormContainer = styled.div`
  background: var(--color-surface, #fff);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1px solid var(--color-border, #DDE6E3);
  animation: ${fadeInUp} 0.35s ease;

  @media (max-width: 1024px) { padding: 32px; }
  @media (max-width: 768px)  { padding: 24px; border-radius: 12px; }
  @media (max-width: 480px)  { padding: 16px; border-radius: 10px; }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  box-sizing: border-box;
`

export const FormSection = styled.div`
  background: var(--color-surface, #fff);
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border-light, #EEF3F1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 768px) { padding: 16px; margin-bottom: 14px; }
  @media (max-width: 480px) { padding: 12px; margin-bottom: 10px; }
`

export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto 20px;
  padding: 24px;
  background: var(--color-surface-alt, #F5F8F7);
  border-radius: 10px;
  border: 1px solid var(--color-border, #DDE6E3);
  box-sizing: border-box;

  @media (max-width: 768px) { padding: 16px; }
  @media (max-width: 480px) { padding: 12px; }
`

// ── Form Controls ────────────────────────────────────────────────────────
const inputBase = css`
  padding: 10px 14px;
  border: 1.5px solid var(--color-border, #DDE6E3);
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', 'Poppins', sans-serif;
  background: var(--color-surface, #fff);
  color: var(--color-text-primary, #1A2E2B);
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary50};
    background: #fff;
  }

  &::placeholder {
    color: var(--color-text-muted, #7A9A93);
    font-size: 13px;
  }

  @media (max-width: 768px) { padding: 9px 12px; font-size: 13px; }
  @media (max-width: 480px) { padding: 8px 10px; font-size: 12px; }
`

export const Input = styled.input`
  ${inputBase}
  margin-bottom: 16px;

  @media (max-width: 768px) { margin-bottom: 12px; }
  @media (max-width: 480px) { margin-bottom: 10px; }
`

export const Textarea = styled.textarea`
  ${inputBase}
  margin-bottom: 16px;
  min-height: 110px;
  resize: vertical;
  line-height: 1.6;

  @media (max-width: 768px) { margin-bottom: 12px; min-height: 90px; }
`

export const Select = styled.select`
  ${inputBase}
  margin-bottom: 16px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234A6660' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

  @media (max-width: 768px) { margin-bottom: 12px; }
  @media (max-width: 480px) { margin-bottom: 10px; }
`

// Filter bar versions (no margin-bottom, used inside FilterBar)
export const SearchInput = styled.input`
  ${inputBase}
`

export const FormControl = styled.select`
  ${inputBase}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234A6660' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
`

export const StyledDatePicker = styled(DatePicker)`
  ${inputBase}
`

// ── Radio / Checkbox ─────────────────────────────────────────────────────
export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) { gap: 12px; margin-bottom: 10px; }
`

export const RadioLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${textColor};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  input {
    accent-color: ${primaryColor};
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    cursor: pointer;
  }

  @media (max-width: 480px) { font-size: 13px; }
`

// ── Buttons ──────────────────────────────────────────────────────────────
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 18px;
  background: ${primaryColor};
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', 'Poppins', sans-serif;
  letter-spacing: 0.2px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(78,123,111,0.3);
  min-width: 90px;

  &:hover:not(:disabled) {
    background: ${colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(78,123,111,0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(78,123,111,0.3);
  }

  &:disabled {
    background: #c8d5d2;
    color: #8fa39d;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  @media (max-width: 768px) { font-size: 12px; padding: 8px 14px; }
  @media (max-width: 480px) { font-size: 12px; padding: 8px 12px; width: 100%; }
`

export const ResponsiveButton = styled(Button)`
  white-space: nowrap;
  width: auto;

  @media (max-width: 480px) { width: 100%; }
`

export const EditButton = styled(Button)`
  min-width: 36px;
  padding: 5px 10px;
  font-size: 12px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    min-width: 100%;
    padding: 6px;
  }
`

export const ViewButton = styled(Button)`
  min-width: 36px;
  padding: 5px 10px;
  font-size: 12px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    min-width: 100%;
    padding: 6px;
  }
`

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 10px;
  background: ${colors.primary50};
  color: ${primaryColor};
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${colors.primaryLight}40;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${primaryColor};
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(78,123,111,0.35);
  }

  &:active { transform: translateY(0); }
`

export const DangerButton = styled(Button)`
  background: ${colors.danger};
  box-shadow: 0 2px 8px rgba(220,38,38,0.25);

  &:hover:not(:disabled) {
    background: #b91c1c;
    box-shadow: 0 4px 14px rgba(220,38,38,0.35);
  }
`

export const SuccessButton = styled(Button)`
  background: ${colors.success};
  box-shadow: 0 2px 8px rgba(22,163,74,0.25);

  &:hover:not(:disabled) {
    background: #15803d;
    box-shadow: 0 4px 14px rgba(22,163,74,0.35);
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 480px) { flex-direction: column; margin-top: 20px; }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;

  @media (max-width: 480px) { flex-direction: column; gap: 4px; }
`

// ── Filter Bar ────────────────────────────────────────────────────────────
export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  background: var(--color-surface-alt, #F5F8F7);
  border: 1px solid var(--color-border, #DDE6E3);
  border-radius: 10px;
  padding: 14px 16px;

  @media (max-width: 768px) { gap: 10px; padding: 12px; }
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 10px;
  }
`

// Legacy alias
export const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  background: var(--color-surface-alt, #F5F8F7);
  border: 1px solid var(--color-border, #DDE6E3);
  border-radius: 10px;
  padding: 14px 16px;

  @media (max-width: 768px) { gap: 10px; padding: 12px; }
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 10px;
  }
`

export const SearchContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (max-width: 480px) { flex-direction: column; align-items: stretch; gap: 8px; }
`

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 150px;
  flex: 1;
  box-sizing: border-box;

  @media (max-width: 768px) { min-width: 100%; margin-bottom: 0; }
`

export const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 180px;
  flex: 1;
  box-sizing: border-box;

  @media (max-width: 768px) { min-width: 100%; }
`

export const ResponsiveFilterContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(160px, 1fr);
  gap: 12px;
  align-items: end;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (max-width: 768px) { grid-auto-columns: minmax(130px, 1fr); gap: 10px; }
  @media (max-width: 480px) {
    grid-auto-flow: row;
    grid-auto-columns: unset;
    grid-template-columns: 1fr;
    overflow-x: visible;
  }
`

// ── Table Components ─────────────────────────────────────────────────────
export const ResponsiveTableWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid var(--color-border, #DDE6E3);
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) { border-radius: 6px; }
`

export const ScrollableTableContainer = styled.div`
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid var(--color-border, #DDE6E3);
  border-radius: 10px;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  min-height: 0;

  @media (max-width: 480px) {
    border-radius: 6px;
  }
`

export const Table = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  margin: 0;
  background: #fff;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 13px;

  @media (max-width: 1024px) { min-width: 700px; font-size: 12px; }
  @media (max-width: 768px)  { min-width: 600px; font-size: 11px; }
  @media (max-width: 480px)  { min-width: 500px; font-size: 10px; }
`

export const TableHeader = styled.th`
  background: ${primaryColor};
  color: white;
  padding: 11px 10px;
  text-align: center;
  border: 1px solid ${colors.primaryDark}55;
  top: 0;
  z-index: 5;
  letter-spacing: 0.4px;
  white-space: nowrap;
  font-size: inherit;
  position: sticky;
  font-weight: 600;

  @media (max-width: 1024px) { padding: 9px 8px; }
  @media (max-width: 768px)  { padding: 8px 6px; }
  @media (max-width: 480px)  { padding: 6px 4px; }
`

export const TableRow = styled.tr`
  transition: background 0.15s ease;

  &:nth-child(even) { background: ${colors.surfaceAlt}; }
  &:nth-child(odd)  { background: #fff; }

  &:hover { background: ${colors.primary50} !important; }

  &:last-child td:first-child { border-bottom-left-radius: 8px; }
  &:last-child td:last-child  { border-bottom-right-radius: 8px; }
`

export const TableCell = styled.td`
  padding: 10px 10px;
  color: ${textColor};
  border: 1px solid var(--color-border, #DDE6E3);
  text-align: center;
  white-space: nowrap;
  line-height: 1.5;
  max-width: 200px;
  font-size: inherit;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1024px) { padding: 8px 7px; max-width: 160px; }
  @media (max-width: 768px)  { padding: 7px 5px; max-width: 130px; }
  @media (max-width: 480px)  { padding: 5px 4px; max-width: 100px; }
`

export const ActionCell = styled(TableCell)`
  padding: 7px 8px;
  min-width: 200px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) { min-width: 170px; }
  @media (max-width: 768px)  { min-width: 150px; }
  @media (max-width: 480px)  { min-width: 120px; }
`

// ── Status & Badges ───────────────────────────────────────────────────────
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  white-space: nowrap;
  background: ${props => props.bg || props.color || colors.primary50};
  color: ${props => props.textColor || 'white'};

  @media (max-width: 480px) { font-size: 10px; padding: 2px 8px; }
`

export const StatusSelect = styled(Select)`
  color: ${props => props.statusColor || '#333'};
  font-weight: 600;
  border: 2px solid ${props => props.statusColor || '#ccc'};
  padding: 5px 32px 5px 8px;
  border-radius: 6px;
  min-width: 130px;
  max-width: 100%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  margin-bottom: 0;
  font-size: 12px;

  @media (max-width: 768px) { min-width: 100%; }
`

// ── Info & Results ────────────────────────────────────────────────────────
export const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
  justify-content: center;
  margin: 10px 0 12px;
  color: ${colors.textSecondary};
  font-weight: 500;
  font-size: 13px;
  flex-shrink: 0;

  strong {
    color: ${primaryColor};
    font-size: 15px;
    font-weight: 700;
  }

  @media (max-width: 480px) { font-size: 12px; margin: 8px 0 10px; }
`

export const InfoText = styled.div`
  text-align: center;
  margin: 8px 0 10px;
  font-weight: 500;
  font-size: 13px;
  color: ${colors.textSecondary};
  width: 100%;
  flex-shrink: 0;

  strong { color: ${primaryColor}; }

  @media (max-width: 480px) { font-size: 12px; }
`

// ── Empty State ───────────────────────────────────────────────────────────
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: ${colors.textMuted};
  animation: ${fadeIn} 0.3s ease;

  svg {
    color: ${colors.accentLight};
    margin-bottom: 16px;
    opacity: 0.7;
  }

  @media (max-width: 480px) { padding: 40px 16px; }
`

export const EmptyStateTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textSecondary};
  margin: 0 0 8px 0;
`

export const EmptyStateText = styled.p`
  font-size: 13px;
  color: ${colors.textMuted};
  margin: 0;
  max-width: 320px;
  line-height: 1.6;
`

// ── Summary / Stat Cards ──────────────────────────────────────────────────
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;

  @media (max-width: 480px) { grid-template-columns: 1fr 1fr; gap: 8px; }
`

export const SummaryCard = styled.div`
  background: ${props => props.bg || colors.surfaceAlt};
  border: 1px solid ${props => props.borderColor || colors.border};
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .card-label {
    font-size: 11px;
    font-weight: 600;
    color: ${colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-value {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.valueColor || primaryColor};
    line-height: 1.2;
  }

  .card-sub {
    font-size: 11px;
    color: ${colors.textMuted};
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    .card-value { font-size: 17px; }
  }
`

// ── Date Group Header (for OverallApproval, grouped tables) ───────────────
export const DateGroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, ${primaryColor} 0%, ${colors.accent} 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 10px;
  gap: 12px;
  flex-wrap: wrap;
`

export const DateGroupTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const DateGroupMeta = styled.div`
  font-size: 12px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;

  span {
    background: rgba(255,255,255,0.18);
    padding: 3px 10px;
    border-radius: 999px;
    font-weight: 500;
  }
`

// ── Mobile Cards ──────────────────────────────────────────────────────────
export const MobileCard = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    background: white;
    border: 1px solid var(--color-border, #DDE6E3);
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    width: 100%;
    box-sizing: border-box;
  }
`

export const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid var(--color-border-light, #EEF3F1);
  &:last-child { border-bottom: none; }
`

export const MobileCardLabel = styled.span`
  font-weight: 600;
  color: ${colors.textMuted};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

export const MobileCardValue = styled.span`
  color: ${textColor};
  font-size: 13px;
  text-align: right;
  max-width: 60%;
`

export const DesktopTable = styled.div`
  display: block;
  width: 100%;
  @media (max-width: 768px) { display: none; }
`

export const MobileCardContainer = styled.div`
  display: none;
  width: 100%;
  @media (max-width: 768px) { display: block; }
`

// ── Blinking Indicator ────────────────────────────────────────────────────
const blink = keyframes`
  0%, 50% { opacity: 1; }
  100%     { opacity: 0; }
`

export const BlinkingLight = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  animation: ${blink} 1s infinite;
  margin: 0 auto;
  box-shadow: 0 0 6px rgba(239,68,68,0.5);

  @media (max-width: 480px) { width: 8px; height: 8px; }
`

// ── Loading Components ────────────────────────────────────────────────────
export const Spinner = styled.div`
  border: 3px solid rgba(78,123,111,0.15);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border-left-color: ${primaryColor};
  animation: ${rotate} 0.75s linear infinite;
  margin: 0 auto;
`

export const LoadingSpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  color: ${colors.textSecondary};
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  gap: 12px;
  width: 100%;
  animation: ${fadeIn} 0.3s ease;

  span { color: ${colors.textSecondary}; }
`

// ── Skeleton Loader ───────────────────────────────────────────────────────
export const Skeleton = styled.div`
  background: linear-gradient(90deg, #f0f4f2 25%, #e0eae7 50%, #f0f4f2 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
`

// ── Divider ───────────────────────────────────────────────────────────────
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-border, #DDE6E3);
  margin: 16px 0;
`