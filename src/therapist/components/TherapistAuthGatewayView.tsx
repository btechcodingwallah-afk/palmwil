import React, { useState } from 'react';
import { 
  ShieldCheck, DollarSign, Building, ArrowRight
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { firebaseSignInWithGoogle } from '../../services/firebase';

export const TherapistAuthGatewayView: React.FC = () => {
  const { 
    therapists,
    loginTherapist, 
    setAuthTargetRole, 
    setAuthMode, 
    setAuthModalOpen,
    setPendingGoogleUser
  } = usePamwill();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sign In with Google
  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { user: fbUser, error } = await firebaseSignInWithGoogle();
      if (fbUser) {
        setPendingGoogleUser({
          email: fbUser.email || '',
          name: fbUser.displayName || '',
          photoUrl: fbUser.photoURL || ''
        });
        const existing = therapists.find(t => 
          (fbUser.email && t.email.toLowerCase() === fbUser.email.toLowerCase()) ||
          (fbUser.phoneNumber && t.phone.includes(fbUser.phoneNumber))
        );
        if (existing) {
          loginTherapist(existing.id);
        } else {
          // If not registered yet, start onboarding
          setAuthTargetRole('therapist');
          setAuthMode('register');
          setAuthModalOpen(true);
        }
      } else if (error) {
        setErrorMsg(error?.message || 'Google Sign-In was cancelled or failed.');
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up with Google -> Starts Onboarding Process
  const handleSignUpWithGoogle = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { user: fbUser, error } = await firebaseSignInWithGoogle();
      if (fbUser) {
        setPendingGoogleUser({
          email: fbUser.email || '',
          name: fbUser.displayName || '',
          photoUrl: fbUser.photoURL || ''
        });
      }
      
      // Launch onboarding with real Google user identity
      setAuthTargetRole('therapist');
      setAuthMode('register');
      setAuthModalOpen(true);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to initialize Google Sign-Up.');
      setAuthTargetRole('therapist');
      setAuthMode('register');
      setAuthModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      overflowY: 'auto',
      position: 'relative'
    }}>
      {/* Top Brand Banner */}
      <div style={{
        padding: '32px 24px 24px 24px',
        background: 'linear-gradient(180deg, rgba(169, 129, 47, 0.12) 0%, rgba(250, 248, 245, 0) 100%)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-hairline)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-gold-light)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
          border: '1.5px solid var(--accent-gold)'
        }}>
          <ShieldCheck size={30} color="var(--accent-gold-hover)" />
        </div>
        <span className="eyebrow" style={{ letterSpacing: '0.12em', color: 'var(--accent-gold-hover)' }}>
          PAMWILL PRACTITIONER SANCTUARY
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', margin: '4px 0 6px 0', fontWeight: 600 }}>
          Practitioner Portal
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto', lineHeight: 1.45 }}>
          India's most prestigious on-demand wellness collective for verified, certified massage therapists.
        </p>

        {/* Clean 2-Option Switcher: Sign In vs Sign Up */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
          marginTop: '20px',
          maxWidth: '280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          border: '1px solid var(--border-hairline)'
        }}>
          <button
            onClick={() => setActiveTab('signin')}
            style={{
              flex: 1,
              padding: '9px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeTab === 'signin' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'signin' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'signin' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 150ms ease'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            style={{
              flex: 1,
              padding: '9px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeTab === 'signup' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'signup' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 150ms ease'
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '380px', width: '100%', margin: '0 auto' }}>

        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'var(--status-error-bg)',
            color: 'var(--status-error)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            border: '1px solid rgba(140, 58, 43, 0.2)'
          }}>
            {errorMsg}
          </div>
        )}

        {/* ================= SIGN IN VIEW ================= */}
        {activeTab === 'signin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', margin: '0 0 6px 0', fontWeight: 600 }}>
                Welcome Back, Practitioner
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                Sign in with your Google account to access your live booking requests, active routes, and daily settlements.
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleSignInWithGoogle}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 18px',
                backgroundColor: '#ffffff',
                color: '#1F1B16',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid #e0dbd3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'all 150ms ease',
                marginTop: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isLoading ? 'Connecting to Google...' : 'Sign In with Google'}</span>
            </button>

            {/* Switch to Sign Up */}
            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-hairline)' }}>
              <button
                onClick={() => setActiveTab('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-gold-hover)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                New Practitioner? Sign Up & Start Onboarding →
              </button>
            </div>
          </div>
        )}

        {/* ================= SIGN UP VIEW ================= */}
        {activeTab === 'signup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Privileges Card (Removed the 2 points requested) */}
            <div className="card-luxury" style={{ padding: '18px 18px 16px 18px' }}>
              <span className="eyebrow" style={{ fontSize: '10px' }}>PRACTITIONER PRIVILEGES</span>
              <h3 style={{ fontSize: '16px', margin: '4px 0 12px 0' }}>Why Practice with PamWill?</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <DollarSign size={15} color="var(--accent-gold)" />
                  </div>
                  <div>
                    <strong>80% Revenue Share + 100% Tips</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Earn ₹80,000 – ₹1,40,000 monthly</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Building size={15} color="var(--accent-gold)" />
                  </div>
                  <div>
                    <strong>Instant Daily Direct Payouts</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Automated settlements to your bank / UPI</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction: First Sign Up with Google, then Start Onboarding */}
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                STEP 1: GOOGLE VERIFICATION
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 12px 0' }}>
                Sign up with Google to authenticate your identity, then proceed immediately to the 5-step verification onboarding.
              </p>
            </div>

            {/* Google Sign Up Button */}
            <button
              onClick={handleSignUpWithGoogle}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 18px',
                backgroundColor: '#ffffff',
                color: '#1F1B16',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid #e0dbd3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'all 150ms ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isLoading ? 'Connecting to Google...' : 'Sign Up with Google & Start Onboarding →'}</span>
            </button>

            {/* Switch to Sign In */}
            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-hairline)' }}>
              <button
                onClick={() => setActiveTab('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Already have an account? <span style={{ color: 'var(--accent-gold-hover)', fontWeight: 600 }}>Sign In →</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
