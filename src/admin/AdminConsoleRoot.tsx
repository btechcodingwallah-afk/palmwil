import React, { useState } from 'react';
import { usePamwill } from '../state/store';
import { AdminSidebar, AdminSection } from './components/AdminSidebar';
import { AdminOverviewKPI } from './screens/AdminOverviewKPI';
import { TherapistVerificationQueue } from './screens/TherapistVerificationQueue';
import { LiveBookingsControlRoom } from './screens/LiveBookingsControlRoom';
import { ServiceCatalogManager } from './screens/ServiceCatalogManager';
import { IndianCitiesManager } from './screens/IndianCitiesManager';
import { CommissionsMembershipsView } from './screens/CommissionsMembershipsView';
import { DoctorPayoutRequestsView } from './screens/DoctorPayoutRequestsView';
import { TrainingInternshipManager } from './screens/TrainingInternshipManager';
import { ContactInquiriesManager } from './screens/ContactInquiriesManager';

export const AdminConsoleRoot: React.FC = () => {
  const { therapists, bookings, payoutRequests, trainingApplications, connectInquiries } = usePamwill();
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');

  const pendingCount = therapists.filter(t => t.status === 'Pending' || t.status === 'Under Review').length;
  const sosCount = bookings.filter(b => b.sosTriggered).length;
  const pendingPayoutsCount = payoutRequests.filter(p => p.status === 'Pending').length;
  const pendingTrainingCount = trainingApplications.filter(a => a.status === 'Pending').length;
  const pendingInquiriesCount = connectInquiries.filter(i => i.status === 'New').length;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={sec => setCurrentSection(sec)}
        pendingVerificationsCount={pendingCount}
        sosAlertCount={sosCount}
        pendingPayoutsCount={pendingPayoutsCount}
        pendingTrainingCount={pendingTrainingCount}
        pendingInquiriesCount={pendingInquiriesCount}
      />

      {/* Main Administrative Workbench */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 36px',
        backgroundColor: 'var(--bg-primary)'
      }}>
        {currentSection === 'overview' && <AdminOverviewKPI />}
        {currentSection === 'inquiries' && <ContactInquiriesManager />}
        {currentSection === 'payouts' && <DoctorPayoutRequestsView />}
        {currentSection === 'training' && <TrainingInternshipManager />}
        {currentSection === 'verification' && <TherapistVerificationQueue />}
        {currentSection === 'bookings' && <LiveBookingsControlRoom />}
        {currentSection === 'therapists' && <TherapistVerificationQueue />}
        {currentSection === 'services' && <ServiceCatalogManager />}
        {currentSection === 'cities' && <IndianCitiesManager />}
        {currentSection === 'commissions' && <CommissionsMembershipsView />}
        {currentSection === 'memberships' && <CommissionsMembershipsView />}
      </main>
    </div>
  );
};
