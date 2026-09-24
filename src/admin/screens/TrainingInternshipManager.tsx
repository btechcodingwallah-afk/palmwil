import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  FileText, 
  X, 
  MessageCircle, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { TrainingApplication, ApplicationStatus, ProgramType } from '../../types';

export const TrainingInternshipManager: React.FC = () => {
  const { trainingApplications, updateTrainingApplicationStatus } = usePamwill();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const [activeApplicant, setActiveApplicant] = useState<TrainingApplication | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Compute metrics
  const totalCount = trainingApplications.length;
  const pendingCount = trainingApplications.filter(a => a.status === 'Pending').length;
  const underReviewCount = trainingApplications.filter(a => a.status === 'Under Review').length;
  const shortlistedCount = trainingApplications.filter(a => a.status === 'Shortlisted').length;
  const enrolledCount = trainingApplications.filter(a => a.status === 'Enrolled').length;

  // Filter applications
  const filteredApplications = trainingApplications.filter(app => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery) ||
      app.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const matchesProgram = selectedProgram === 'All' || app.programType === selectedProgram;
    const matchesCity = selectedCity === 'All' || app.city === selectedCity;

    return matchesSearch && matchesStatus && matchesProgram && matchesCity;
  });

  const handleOpenApplicant = (app: TrainingApplication) => {
    setActiveApplicant(app);
    setAdminNoteInput(app.adminNotes || '');
  };

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus, notes?: string) => {
    await updateTrainingApplicationStatus(appId, newStatus, notes);
    if (activeApplicant && activeApplicant.id === appId) {
      setActiveApplicant(prev => prev ? { ...prev, status: newStatus, ...(notes !== undefined ? { adminNotes: notes } : {}) } : null);
    }
  };

  const handleSaveNote = async () => {
    if (!activeApplicant) return;
    setSavingNote(true);
    await updateTrainingApplicationStatus(activeApplicant.id, activeApplicant.status, adminNoteInput);
    setSavingNote(false);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'rgba(194, 137, 41, 0.15)',
          color: '#C28929',
          border: 'rgba(194, 137, 41, 0.3)',
          icon: <Clock size={12} />
        };
      case 'Under Review':
        return {
          bg: 'rgba(56, 126, 219, 0.15)',
          color: '#387EDB',
          border: 'rgba(56, 126, 219, 0.3)',
          icon: <Eye size={12} />
        };
      case 'Shortlisted':
        return {
          bg: 'rgba(76, 107, 79, 0.2)',
          color: 'var(--status-success)',
          border: 'rgba(76, 107, 79, 0.4)',
          icon: <UserCheck size={12} />
        };
      case 'Enrolled':
        return {
          bg: 'rgba(169, 129, 47, 0.2)',
          color: 'var(--accent-gold-hover)',
          border: 'rgba(169, 129, 47, 0.4)',
          icon: <CheckCircle2 size={12} />
        };
      case 'Rejected':
        return {
          bg: 'rgba(140, 58, 43, 0.15)',
          color: '#8C3A2B',
          border: 'rgba(140, 58, 43, 0.3)',
          icon: <XCircle size={12} />
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'rgba(169, 129, 47, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)'
          }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
              Training & Internship Applications
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              PamWill Academy candidate applications, background screening, and batch enrollment.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Applicants</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalCount}
          </div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: '#C28929', textTransform: 'uppercase', fontWeight: 600 }}>Pending Review</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#C28929', marginTop: '4px' }}>
            {pendingCount}
          </div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: '#387EDB', textTransform: 'uppercase', fontWeight: 600 }}>Under Review</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#387EDB', marginTop: '4px' }}>
            {underReviewCount}
          </div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--status-success)', textTransform: 'uppercase', fontWeight: 600 }}>Shortlisted</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--status-success)', marginTop: '4px' }}>
            {shortlistedCount}
          </div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 600 }}>Enrolled Trainees</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '4px' }}>
            {enrolledCount}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-pill)',
          padding: '8px 16px',
          border: '1px solid var(--border-hairline)',
          flex: '1 1 260px',
          maxWidth: '380px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by candidate name, phone, city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              color: 'var(--text-primary)',
              width: '100%'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Program filter */}
          <select
            value={selectedProgram}
            onChange={e => setSelectedProgram(e.target.value)}
            style={selectFilterStyle}
          >
            <option value="All">All Programs</option>
            <option value="Therapist Certification Training">Therapist Certification</option>
            <option value="Spa Operations & Wellness Internship">Spa Operations Internship</option>
            <option value="Ayurvedic & Holistic Apprenticeship">Ayurvedic Apprenticeship</option>
            <option value="Clinical Physiotherapy Support Internship">Clinical Support Internship</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={selectFilterStyle}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* City filter */}
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            style={selectFilterStyle}
          >
            <option value="All">All Cities</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Candidate</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Program Track</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Experience & Format</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Contact Info</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No training applications matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map(app => {
                  const badge = getStatusBadge(app.status);
                  const appliedDate = new Date(app.appliedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr 
                      key={app.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 150ms ease'
                      }}
                    >
                      {/* Candidate */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {app.fullName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={11} color="var(--accent-gold)" /> {app.city} • Applied {appliedDate}
                        </div>
                      </td>

                      {/* Program Track */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {app.programType}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Ref: {app.id}
                        </div>
                      </td>

                      {/* Experience & Format */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          {app.experienceLevel}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {app.availability}
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                          <Phone size={12} color="var(--text-muted)" /> {app.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <Mail size={12} color="var(--text-muted)" /> {app.email}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`
                        }}>
                          {badge.icon} {app.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenApplicant(app)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-pill)',
                            border: '1px solid var(--border-hairline)',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={13} /> Review Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICANT REVIEW DRAWER / MODAL */}
      {activeApplicant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setActiveApplicant(null)}>
          
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              padding: '32px',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setActiveApplicant(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex'
              }}
            >
              <X size={18} />
            </button>

            {/* Applicant Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(169, 129, 47, 0.15)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700
              }}>
                {activeApplicant.fullName.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {activeApplicant.fullName}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {activeApplicant.city} • Ref: {activeApplicant.id}
                </div>
              </div>
            </div>

            {/* Quick Actions (Call, WhatsApp, Email) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <a
                href={`https://wa.me/${activeApplicant.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={contactBtnStyle}
              >
                <MessageCircle size={14} color="var(--status-success)" /> WhatsApp Candidate
              </a>
              <a
                href={`tel:${activeApplicant.phone}`}
                style={contactBtnStyle}
              >
                <Phone size={14} color="var(--accent-gold)" /> Call
              </a>
              <a
                href={`mailto:${activeApplicant.email}`}
                style={contactBtnStyle}
              >
                <Mail size={14} color="#387EDB" /> Email
              </a>
            </div>

            {/* Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              backgroundColor: 'var(--bg-primary)',
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Program Track</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{activeApplicant.programType}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Experience Level</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{activeApplicant.experienceLevel}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Availability</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{activeApplicant.availability}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Education / Degrees</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{activeApplicant.qualification || 'Not specified'}</div>
              </div>
            </div>

            {/* Candidate Statement */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Personal Statement & Motivation:
              </div>
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}>
                "{activeApplicant.statement}"
              </div>
            </div>

            {/* Admin Notes */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Internal Admissions Notes:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. Cleared phone screening. Scheduled practical audition on Saturday."
                  value={adminNoteInput}
                  onChange={e => setAdminNoteInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {savingNote ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Update Application Status:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => handleUpdateStatus(activeApplicant.id, 'Under Review')}
                  style={{
                    ...statusActionBtnStyle,
                    backgroundColor: activeApplicant.status === 'Under Review' ? '#387EDB' : 'var(--bg-secondary)',
                    color: activeApplicant.status === 'Under Review' ? '#FFFFFF' : 'var(--text-primary)'
                  }}
                >
                  <Eye size={13} /> Under Review
                </button>

                <button
                  onClick={() => handleUpdateStatus(activeApplicant.id, 'Shortlisted')}
                  style={{
                    ...statusActionBtnStyle,
                    backgroundColor: activeApplicant.status === 'Shortlisted' ? 'var(--status-success)' : 'var(--bg-secondary)',
                    color: activeApplicant.status === 'Shortlisted' ? '#FFFFFF' : 'var(--text-primary)'
                  }}
                >
                  <UserCheck size={13} /> Shortlist
                </button>

                <button
                  onClick={() => handleUpdateStatus(activeApplicant.id, 'Enrolled')}
                  style={{
                    ...statusActionBtnStyle,
                    backgroundColor: activeApplicant.status === 'Enrolled' ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                    color: activeApplicant.status === 'Enrolled' ? '#FFFFFF' : 'var(--text-primary)'
                  }}
                >
                  <CheckCircle2 size={13} /> Enroll Candidate
                </button>

                <button
                  onClick={() => handleUpdateStatus(activeApplicant.id, 'Rejected')}
                  style={{
                    ...statusActionBtnStyle,
                    backgroundColor: activeApplicant.status === 'Rejected' ? '#8C3A2B' : 'var(--bg-secondary)',
                    color: activeApplicant.status === 'Rejected' ? '#FFFFFF' : 'var(--text-primary)'
                  }}
                >
                  <XCircle size={13} /> Reject
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

const kpiCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-subtle)',
  padding: '16px 20px',
  boxShadow: 'var(--shadow-sm)'
};

const selectFilterStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 'var(--radius-pill)',
  border: '1px solid var(--border-hairline)',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: '12px',
  outline: 'none',
  cursor: 'pointer'
};

const contactBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: 'var(--radius-pill)',
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  fontSize: '12px',
  fontWeight: 600,
  textDecoration: 'none',
  border: '1px solid var(--border-hairline)'
};

const statusActionBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  borderRadius: 'var(--radius-pill)',
  border: '1px solid var(--border-hairline)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 150ms ease'
};
