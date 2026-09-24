import { createClient } from '@supabase/supabase-js';
import { MassageService, Therapist, Booking, UserProfile, PayoutRequest, TrainingApplication, ConnectInquiry } from '../types';

export const SUPABASE_URL = 'https://hauruoczbsxsgptojglt.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdXJ1b2N6YnN4c2dwdG9qZ2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NDY4NzMsImV4cCI6MjEwNDUyMjg3M30.nAU5XU2nBshbNBRsfjiKTud4naOGhUCEpp8Q39eN2EA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// ================= SERVICES API =================
export async function dbFetchServices(): Promise<MassageService[] | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error || !data) return null;

    return data.map((row: any): MassageService => ({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      benefits: row.benefits || [],
      contraindications: row.contraindications || [],
      durationOptionsMin: row.duration_options_min || [60, 90],
      basePricePerDuration: row.base_price_per_duration || {},
      imageUrl: row.image_url,
      popularTag: row.popular_tag,
      addOnCompatible: row.add_on_compatible ?? true,
      requiresCertification: row.requires_certification
    }));
  } catch (err) {
    console.warn('Supabase dbFetchServices error:', err);
    return null;
  }
}

export async function dbUpsertService(service: MassageService): Promise<boolean> {
  try {
    const row = {
      id: service.id,
      name: service.name,
      category: service.category,
      description: service.description,
      benefits: service.benefits,
      contraindications: service.contraindications,
      duration_options_min: service.durationOptionsMin,
      base_price_per_duration: service.basePricePerDuration,
      image_url: service.imageUrl,
      popular_tag: service.popularTag || null,
      add_on_compatible: service.addOnCompatible,
      requires_certification: service.requiresCertification || null
    };

    const { error } = await supabase.from('services').upsert([row], { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('Supabase dbUpsertService error:', err);
    return false;
  }
}

export async function dbDeleteService(serviceId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('services').delete().eq('id', serviceId);
    return !error;
  } catch (err) {
    return false;
  }
}

// ================= THERAPISTS API =================
export async function dbFetchTherapists(): Promise<Therapist[] | null> {
  try {
    const { data, error } = await supabase
      .from('therapists')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error || !data) return null;

    return data.map((row: any): Therapist => ({
      id: row.id,
      fullName: row.full_name,
      photoUrl: row.photo_url,
      phone: row.phone,
      email: row.email,
      status: row.status,
      gender: row.gender,
      rating: Number(row.rating) || 0,
      reviewCount: row.review_count || 0,
      completedJobs: row.completed_jobs || 0,
      experienceYears: row.experience_years || 0,
      languages: row.languages || [],
      availableCities: row.available_cities || [],
      workingHours: row.working_hours,
      isOnline: row.is_online ?? false,
      walletBalance: Number(row.wallet_balance) || 0,
      bankAccount: row.bank_account,
      upiId: row.upi_id,
      certifications: row.certifications || [],
      documents: row.documents || [],
      currentLocation: row.current_location
    }));
  } catch (err) {
    console.warn('Supabase dbFetchTherapists error:', err);
    return null;
  }
}

export async function dbUpdateTherapist(therapistId: string, updates: Partial<Therapist>): Promise<boolean> {
  try {
    const row: any = {};
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.isOnline !== undefined) row.is_online = updates.isOnline;
    if (updates.walletBalance !== undefined) row.wallet_balance = updates.walletBalance;
    if (updates.completedJobs !== undefined) row.completed_jobs = updates.completedJobs;
    if (updates.documents !== undefined) row.documents = updates.documents;

    const { error } = await supabase.from('therapists').update(row).eq('id', therapistId);
    return !error;
  } catch (err) {
    return false;
  }
}

// ================= BOOKINGS API =================
export async function dbFetchBookings(): Promise<Booking[] | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error || !data) return null;

    return data.map((row: any): Booking => {
      // Resolve liveLocation from:
      // 1. row.live_location (if column exists)
      // 2. row.service?.liveLocation (persisted in JSONB service field)
      // 3. Extracted from row.address string (e.g. "Live Satellite Pin • 31.2518° N, 75.6997° E")
      let liveLoc = row.live_location;
      if (!liveLoc && row.service?.liveLocation) {
        liveLoc = row.service.liveLocation;
      }
      if (!liveLoc && typeof row.address === 'string') {
        const match = row.address.match(/(\d+(?:\.\d+)?)\s*°?\s*N[,\s]+(\d+(?:\.\d+)?)\s*°?\s*E/i);
        if (match) {
          liveLoc = {
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
            accuracy: 6,
            sharedAt: row.created_at || new Date().toISOString(),
            placeName: row.address
          };
        }
      }

      return {
        id: row.id,
        customerId: row.customer_id,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        therapistId: row.therapist_id,
        therapistName: row.therapist_name,
        therapistPhoto: row.therapist_photo,
        therapistRating: Number(row.therapist_rating) || undefined,
        therapistPhone: row.therapist_phone,
        service: row.service,
        durationMin: row.duration_min,
        addOns: row.add_ons || [],
        therapistGenderPref: row.therapist_gender_pref,
        scheduledDate: row.scheduled_date,
        scheduledTime: row.scheduled_time,
        locationType: row.location_type,
        address: row.address,
        city: row.city,
        specialNotes: row.special_notes,
        basePrice: Number(row.base_price),
        addOnsPrice: Number(row.add_ons_price) || 0,
        couponDiscount: Number(row.coupon_discount) || 0,
        membershipDiscount: Number(row.membership_discount) || 0,
        totalPaid: Number(row.total_paid),
        platformCommission: Number(row.platform_commission),
        therapistPayout: Number(row.therapist_payout),
        paymentMethod: row.payment_method,
        status: row.status,
        createdAt: row.created_at,
        etaMinutes: row.eta_minutes,
        sosTriggered: row.sos_triggered ?? false,
        review: row.review || row.service?.review,
        startOtp: row.start_otp || row.service?.startOtp,
        endOtp: row.end_otp || row.service?.endOtp,
        sessionStartedAt: row.session_started_at || row.service?.sessionStartedAt,
        sessionCompletedAt: row.session_completed_at || row.service?.sessionCompletedAt,
        liveLocation: liveLoc
      };
    });
  } catch (err) {
    console.warn('Supabase dbFetchBookings error:', err);
    return null;
  }
}

export async function dbInsertBooking(booking: Booking): Promise<boolean> {
  try {
    // Preserve liveLocation and OTP metadata inside the service JSONB object so it is resilient across schemas
    const serviceWithMetadata = {
      ...booking.service,
      ...(booking.liveLocation ? { liveLocation: booking.liveLocation } : {}),
      ...(booking.startOtp ? { startOtp: booking.startOtp } : {}),
      ...(booking.endOtp ? { endOtp: booking.endOtp } : {}),
      ...(booking.sessionStartedAt ? { sessionStartedAt: booking.sessionStartedAt } : {}),
      ...(booking.sessionCompletedAt ? { sessionCompletedAt: booking.sessionCompletedAt } : {}),
      ...(booking.review ? { review: booking.review } : {})
    };

    const row: any = {
      id: booking.id,
      customer_id: booking.customerId,
      customer_name: booking.customerName,
      customer_phone: booking.customerPhone,
      therapist_id: booking.therapistId || null,
      therapist_name: booking.therapistName || null,
      therapist_photo: booking.therapistPhoto || null,
      therapist_rating: booking.therapistRating || null,
      therapist_phone: booking.therapistPhone || null,
      service: serviceWithMetadata,
      duration_min: booking.durationMin,
      add_ons: booking.addOns,
      therapist_gender_pref: booking.therapistGenderPref,
      scheduled_date: booking.scheduledDate,
      scheduled_time: booking.scheduledTime,
      location_type: booking.locationType,
      address: booking.address,
      city: booking.city,
      special_notes: booking.specialNotes || null,
      base_price: booking.basePrice,
      add_ons_price: booking.addOnsPrice,
      coupon_discount: booking.couponDiscount,
      membership_discount: booking.membershipDiscount,
      total_paid: booking.totalPaid,
      platform_commission: booking.platformCommission,
      therapist_payout: booking.therapistPayout,
      payment_method: booking.paymentMethod,
      status: booking.status,
      created_at: booking.createdAt,
      eta_minutes: booking.etaMinutes || null,
      sos_triggered: booking.sosTriggered || false,
      review: booking.review || null
    };

    const { error } = await supabase.from('bookings').insert([row]);
    return !error;
  } catch (err) {
    console.warn('Supabase dbInsertBooking error:', err);
    return false;
  }
}

export async function dbUpdateBooking(bookingId: string, updates: Partial<Booking>): Promise<boolean> {
  try {
    const row: any = {};
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.etaMinutes !== undefined) row.eta_minutes = updates.etaMinutes;
    if (updates.sosTriggered !== undefined) row.sos_triggered = updates.sosTriggered;
    if (updates.therapistId !== undefined) row.therapist_id = updates.therapistId;
    if (updates.therapistName !== undefined) row.therapist_name = updates.therapistName;
    if (updates.therapistPhoto !== undefined) row.therapist_photo = updates.therapistPhoto;
    if (updates.therapistRating !== undefined) row.therapist_rating = updates.therapistRating;
    if (updates.therapistPhone !== undefined) row.therapist_phone = updates.therapistPhone;
    if (updates.review !== undefined) row.review = updates.review;

    if (updates.service !== undefined || updates.liveLocation !== undefined || updates.startOtp !== undefined || updates.endOtp !== undefined || updates.sessionStartedAt !== undefined || updates.sessionCompletedAt !== undefined) {
      const baseService = updates.service || {};
      row.service = {
        ...baseService,
        ...(updates.liveLocation ? { liveLocation: updates.liveLocation } : {}),
        ...(updates.startOtp ? { startOtp: updates.startOtp } : {}),
        ...(updates.endOtp ? { endOtp: updates.endOtp } : {}),
        ...(updates.sessionStartedAt ? { sessionStartedAt: updates.sessionStartedAt } : {}),
        ...(updates.sessionCompletedAt ? { sessionCompletedAt: updates.sessionCompletedAt } : {}),
        ...(updates.review ? { review: updates.review } : {})
      };
    }

    const { error } = await supabase.from('bookings').update(row).eq('id', bookingId);
    return !error;
  } catch (err) {
    return false;
  }
}

// ================= REALTIME LISTENER =================
export function subscribeToRealtimeUpdates(callback: (table: string, event: string, payload: any) => void) {
  const channel = supabase
    .channel('pamwill-realtime-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
      callback('bookings', payload.eventType, payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'therapists' }, payload => {
      callback('therapists', payload.eventType, payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, payload => {
      callback('services', payload.eventType, payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, payload => {
      callback('users', payload.eventType, payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ================= AUTHENTICATION API =================
export async function authSignInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function authSignInWithPhone(phone: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms'
      }
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function authVerifyPhoneOtp(phone: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function authSignInWithEmail(email: string, password?: string) {
  try {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } else {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      return { data, error };
    }
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function authSignUpWithEmail(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function authSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return !error;
  } catch (err) {
    return false;
  }
}

export async function authGetSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (err) {
    return null;
  }
}

// ================= NEW THERAPIST REGISTRATION =================
export async function dbInsertTherapist(therapist: Therapist): Promise<boolean> {
  try {
    const row = {
      id: therapist.id,
      full_name: therapist.fullName,
      photo_url: therapist.photoUrl,
      phone: therapist.phone,
      email: therapist.email,
      status: therapist.status,
      gender: therapist.gender,
      rating: therapist.rating,
      review_count: therapist.reviewCount,
      completed_jobs: therapist.completedJobs,
      experience_years: therapist.experienceYears,
      languages: therapist.languages,
      available_cities: therapist.availableCities,
      working_hours: therapist.workingHours,
      is_online: therapist.isOnline,
      wallet_balance: therapist.walletBalance,
      bank_account: therapist.bankAccount,
      upi_id: therapist.upiId,
      certifications: therapist.certifications,
      documents: therapist.documents,
      current_location: therapist.currentLocation || null
    };

    const { error } = await supabase.from('therapists').insert([row]);
    return !error;
  } catch (err) {
    console.warn('dbInsertTherapist error:', err);
    return false;
  }
}

// ================= USER PROFILE API =================
export async function dbSaveUserProfile(user: UserProfile): Promise<boolean> {
  try {
    const row = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      age: user.age,
      address: user.address,
      city: user.city,
      medical_conditions: user.medicalConditions,
      preferred_therapist_gender: user.preferredTherapistGender,
      emergency_contact: user.emergencyContact,
      membership_tier: user.membershipTier || null,
      membership_credits: user.membershipCredits || 0,
      saved_addresses: user.savedAddresses
    };

    const { error } = await supabase.from('users').upsert([row], { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('dbSaveUserProfile error:', err);
    return false;
  }
}

// ================= PAYOUT REQUESTS API =================
export async function dbFetchPayoutRequests(): Promise<PayoutRequest[] | null> {
  try {
    const { data, error } = await supabase
      .from('payout_requests')
      .select('*')
      .order('requested_at', { ascending: false });

    if (!error && data) {
      return data.map((row: any): PayoutRequest => ({
        id: row.id,
        therapistId: row.therapist_id,
        therapistName: row.therapist_name,
        therapistPhoto: row.therapist_photo || undefined,
        therapistPhone: row.therapist_phone || undefined,
        upiId: row.upi_id,
        amount: Number(row.amount),
        status: row.status,
        requestedAt: row.requested_at,
        paidAt: row.paid_at || undefined,
        transactionRef: row.transaction_ref || undefined,
        notes: row.notes || undefined
      }));
    }

    // Fallback: fetch from system_payouts in users table
    const { data: userData } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_payouts')
      .maybeSingle();

    if (userData && Array.isArray(userData.saved_addresses)) {
      return userData.saved_addresses as PayoutRequest[];
    }
    return [];
  } catch (err) {
    return null;
  }
}

export async function dbInsertPayoutRequest(payout: PayoutRequest): Promise<boolean> {
  try {
    const row = {
      id: payout.id,
      therapist_id: payout.therapistId,
      therapist_name: payout.therapistName,
      therapist_photo: payout.therapistPhoto || null,
      therapist_phone: payout.therapistPhone || null,
      upi_id: payout.upiId,
      amount: payout.amount,
      status: payout.status,
      requested_at: payout.requestedAt,
      paid_at: payout.paidAt || null,
      transaction_ref: payout.transactionRef || null,
      notes: payout.notes || null
    };

    const { error } = await supabase.from('payout_requests').insert([row]);
    if (!error) return true;

    // Fallback: append to system_payouts in users table
    const { data: existing } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_payouts')
      .maybeSingle();

    const currentList: PayoutRequest[] = (existing && Array.isArray(existing.saved_addresses))
      ? existing.saved_addresses
      : [];

    const updatedList = [payout, ...currentList.filter(p => p.id !== payout.id)];

    const { error: upsertErr } = await supabase
      .from('users')
      .upsert([{
        id: 'system_payouts',
        name: 'System Payouts Registry',
        saved_addresses: updatedList
      }]);

    return !upsertErr;
  } catch (err) {
    return false;
  }
}

export async function dbUpdatePayoutRequest(payoutId: string, updates: Partial<PayoutRequest>): Promise<boolean> {
  try {
    const row: any = {};
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.paidAt !== undefined) row.paid_at = updates.paidAt;
    if (updates.transactionRef !== undefined) row.transaction_ref = updates.transactionRef;
    if (updates.notes !== undefined) row.notes = updates.notes;

    const { error } = await supabase.from('payout_requests').update(row).eq('id', payoutId);
    if (!error) return true;

    // Fallback: update in system_payouts in users table
    const { data: existing } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_payouts')
      .maybeSingle();

    if (existing && Array.isArray(existing.saved_addresses)) {
      const currentList: PayoutRequest[] = existing.saved_addresses;
      const updatedList = currentList.map(p => {
        if (p.id === payoutId) {
          return { ...p, ...updates };
        }
        return p;
      });

      const { error: upsertErr } = await supabase
        .from('users')
        .upsert([{
          id: 'system_payouts',
          name: 'System Payouts Registry',
          saved_addresses: updatedList
        }]);

      return !upsertErr;
    }
    return false;
  } catch (err) {
    return false;
  }
}

// ================= TRAINING & INTERNSHIP APPLICATIONS API =================
export async function dbFetchTrainingApplications(): Promise<TrainingApplication[] | null> {
  try {
    const { data, error } = await supabase
      .from('training_applications')
      .select('*')
      .order('applied_at', { ascending: false });

    if (!error && data) {
      return data.map((r: any): TrainingApplication => ({
        id: r.id,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        city: r.city,
        programType: r.program_type,
        experienceLevel: r.experience_level,
        availability: r.availability,
        qualification: r.qualification || '',
        statement: r.statement || '',
        status: r.status || 'Pending',
        appliedAt: r.applied_at,
        adminNotes: r.admin_notes
      }));
    }

    // Resilient Fallback: read from system_training_applications in users table
    const { data: fallbackRow } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_training_applications')
      .maybeSingle();

    if (fallbackRow && Array.isArray(fallbackRow.saved_addresses)) {
      return fallbackRow.saved_addresses as TrainingApplication[];
    }

    return null;
  } catch (err) {
    console.warn('Supabase dbFetchTrainingApplications error:', err);
    return null;
  }
}

export async function dbInsertTrainingApplication(app: TrainingApplication): Promise<boolean> {
  try {
    const row = {
      id: app.id,
      full_name: app.fullName,
      email: app.email,
      phone: app.phone,
      city: app.city,
      program_type: app.programType,
      experience_level: app.experienceLevel,
      availability: app.availability,
      qualification: app.qualification,
      statement: app.statement,
      status: app.status,
      applied_at: app.appliedAt,
      admin_notes: app.adminNotes
    };

    const { error } = await supabase.from('training_applications').insert([row]);
    if (!error) return true;

    // Resilient fallback: store in users.saved_addresses
    const { data: existing } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_training_applications')
      .maybeSingle();

    const currentList: TrainingApplication[] = (existing && Array.isArray(existing.saved_addresses)) 
      ? existing.saved_addresses 
      : [];

    const updated = [app, ...currentList.filter(a => a.id !== app.id)];

    const { error: upsertErr } = await supabase
      .from('users')
      .upsert([{
        id: 'system_training_applications',
        name: 'System Training Applications Registry',
        saved_addresses: updated
      }]);

    return !upsertErr;
  } catch (err) {
    console.warn('Supabase dbInsertTrainingApplication error:', err);
    return false;
  }
}

export async function dbUpdateTrainingApplicationStatus(
  appId: string, 
  status: string, 
  notes?: string
): Promise<boolean> {
  try {
    const updates: any = { status };
    if (notes !== undefined) updates.admin_notes = notes;

    const { error } = await supabase
      .from('training_applications')
      .update(updates)
      .eq('id', appId);

    if (!error) return true;

    // Fallback in users table
    const { data: existing } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_training_applications')
      .maybeSingle();

    if (existing && Array.isArray(existing.saved_addresses)) {
      const currentList: TrainingApplication[] = existing.saved_addresses;
      const updatedList = currentList.map(a => {
        if (a.id === appId) {
          return {
            ...a,
            status: status as any,
            ...(notes !== undefined ? { adminNotes: notes } : {})
          };
        }
        return a;
      });

      const { error: upsertErr } = await supabase
        .from('users')
        .upsert([{
          id: 'system_training_applications',
          name: 'System Training Applications Registry',
          saved_addresses: updatedList
        }]);

      return !upsertErr;
    }
    return false;
  } catch (err) {
    return false;
  }
}

// ================= CONNECT WITH US / INQUIRIES API =================
export async function dbFetchConnectInquiries(): Promise<ConnectInquiry[] | null> {
  try {
    const { data, error } = await supabase
      .from('connect_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((r: any): ConnectInquiry => ({
        id: r.id,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        city: r.city,
        inquiryType: r.inquiry_type,
        organization: r.organization || '',
        message: r.message,
        preferredContactMethod: r.preferred_contact_method || 'WhatsApp',
        status: r.status || 'New',
        createdAt: r.created_at,
        adminNotes: r.admin_notes
      }));
    }

    // Resilient fallback: read from system_connect_inquiries in users table
    const { data: fallbackRow } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_connect_inquiries')
      .maybeSingle();

    if (fallbackRow && Array.isArray(fallbackRow.saved_addresses)) {
      return fallbackRow.saved_addresses as ConnectInquiry[];
    }

    return null;
  } catch (err) {
    console.warn('Supabase dbFetchConnectInquiries error:', err);
    return null;
  }
}

export async function dbInsertConnectInquiry(inquiry: ConnectInquiry): Promise<boolean> {
  try {
    const row = {
      id: inquiry.id,
      full_name: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone,
      city: inquiry.city,
      inquiry_type: inquiry.inquiryType,
      organization: inquiry.organization,
      message: inquiry.message,
      preferred_contact_method: inquiry.preferredContactMethod,
      status: inquiry.status,
      created_at: inquiry.createdAt,
      admin_notes: inquiry.adminNotes
    };

    const { error } = await supabase.from('connect_inquiries').insert([row]);
    if (!error) return true;

    // Resilient fallback in users table
    const { data: existing } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_connect_inquiries')
      .maybeSingle();

    const currentList: ConnectInquiry[] = (existing && Array.isArray(existing.saved_addresses))
      ? existing.saved_addresses
      : [];

    const updated = [inquiry, ...currentList.filter(i => i.id !== inquiry.id)];

    const { error: upsertErr } = await supabase
      .from('users')
      .upsert([{
        id: 'system_connect_inquiries',
        name: 'System Connect Inquiries Registry',
        saved_addresses: updated
      }]);

    return !upsertErr;
  } catch (err) {
    console.warn('Supabase dbInsertConnectInquiry error:', err);
    return false;
  }
}

export async function dbUpdateConnectInquiryStatus(
  inquiryId: string,
  status: string,
  notes?: string
): Promise<boolean> {
  try {
    const updates: any = { status };
    if (notes !== undefined) updates.admin_notes = notes;

    const { error } = await supabase
      .from('connect_inquiries')
      .update(updates)
      .eq('id', inquiryId);

    if (!error) return true;

    // Fallback in users table
    const { data: existing } = await supabase
      .from('users')
      .select('saved_addresses')
      .eq('id', 'system_connect_inquiries')
      .maybeSingle();

    if (existing && Array.isArray(existing.saved_addresses)) {
      const currentList: ConnectInquiry[] = existing.saved_addresses;
      const updatedList = currentList.map(item => {
        if (item.id === inquiryId) {
          return {
            ...item,
            status: status as any,
            ...(notes !== undefined ? { adminNotes: notes } : {})
          };
        }
        return item;
      });

      const { error: upsertErr } = await supabase
        .from('users')
        .upsert([{
          id: 'system_connect_inquiries',
          name: 'System Connect Inquiries Registry',
          saved_addresses: updatedList
        }]);

      return !upsertErr;
    }
    return false;
  } catch (err) {
    return false;
  }
}


