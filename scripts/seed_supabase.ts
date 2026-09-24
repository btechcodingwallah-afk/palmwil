import { createClient } from '@supabase/supabase-js';
import { MASSAGE_SERVICES } from '../src/data/services';
import { INITIAL_THERAPISTS, INITIAL_USER, INITIAL_BOOKINGS } from '../src/data/mockData';

const SUPABASE_URL = 'https://hauruoczbsxsgptojglt.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdXJ1b2N6YnN4c2dwdG9qZ2x0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODk0Njg3MywiZXhwIjoyMTA0NTIyODczfQ.KOumAq0ifEQ3aRuRSmiKAsIrGIBA_xpGij7FlKzDbCk';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function seedDatabase() {
  console.log('--- Starting PamWill Supabase Database Seeding ---');

  // 1. Check if tables exist
  const { data: testServices, error: testErr } = await supabase.from('services').select('id').limit(1);
  if (testErr && testErr.code === 'PGRST205') {
    console.log('\n⚠️ Tables not yet created in Supabase PostgreSQL schema!');
    console.log('Please copy and run the SQL from:');
    console.log('  supabase/schema.sql');
    console.log('into the Supabase SQL Editor:');
    console.log('  https://supabase.com/dashboard/project/hauruoczbsxsgptojglt/sql\n');
    return false;
  }

  console.log('✓ Tables detected in Supabase schema.');

  // 2. Seed Services (All 69 therapies)
  console.log(`Seeding ${MASSAGE_SERVICES.length} massage services...`);
  const servicesToInsert = MASSAGE_SERVICES.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    benefits: s.benefits,
    contraindications: s.contraindications,
    duration_options_min: s.durationOptionsMin,
    base_price_per_duration: s.basePricePerDuration,
    image_url: s.imageUrl,
    popular_tag: s.popularTag || null,
    add_on_compatible: s.addOnCompatible,
    requires_certification: s.requiresCertification || null
  }));

  const { error: srvErr } = await supabase.from('services').upsert(servicesToInsert, { onConflict: 'id' });
  if (srvErr) console.error('Error seeding services:', srvErr.message);
  else console.log(`✓ ${MASSAGE_SERVICES.length} services seeded successfully!`);

  // 3. Seed Therapists
  console.log(`Seeding ${INITIAL_THERAPISTS.length} therapists...`);
  const therapistsToInsert = INITIAL_THERAPISTS.map(t => ({
    id: t.id,
    full_name: t.fullName,
    photo_url: t.photoUrl,
    phone: t.phone,
    email: t.email,
    status: t.status,
    gender: t.gender,
    rating: t.rating,
    review_count: t.reviewCount,
    completed_jobs: t.completedJobs,
    experience_years: t.experienceYears,
    languages: t.languages,
    available_cities: t.availableCities,
    working_hours: t.workingHours,
    is_online: t.isOnline,
    wallet_balance: t.walletBalance,
    bank_account: t.bankAccount,
    upi_id: t.upiId,
    certifications: t.certifications,
    documents: t.documents,
    current_location: t.currentLocation || null
  }));

  const { error: therErr } = await supabase.from('therapists').upsert(therapistsToInsert, { onConflict: 'id' });
  if (therErr) console.error('Error seeding therapists:', therErr.message);
  else console.log(`✓ ${INITIAL_THERAPISTS.length} therapists seeded successfully!`);

  // 4. Seed User Profile
  console.log('Seeding initial user profile...');
  const userToInsert = {
    id: INITIAL_USER.id,
    name: INITIAL_USER.name,
    phone: INITIAL_USER.phone,
    email: INITIAL_USER.email,
    gender: INITIAL_USER.gender,
    age: INITIAL_USER.age,
    address: INITIAL_USER.address,
    city: INITIAL_USER.city,
    medical_conditions: INITIAL_USER.medicalConditions,
    preferred_therapist_gender: INITIAL_USER.preferredTherapistGender,
    emergency_contact: INITIAL_USER.emergencyContact,
    membership_tier: INITIAL_USER.membershipTier,
    membership_credits: INITIAL_USER.membershipCredits,
    saved_addresses: INITIAL_USER.savedAddresses
  };

  const { error: userErr } = await supabase.from('users').upsert([userToInsert], { onConflict: 'id' });
  if (userErr) console.error('Error seeding user:', userErr.message);
  else console.log('✓ User profile seeded successfully!');

  // 5. Seed Bookings
  console.log(`Seeding ${INITIAL_BOOKINGS.length} initial bookings...`);
  const bookingsToInsert = INITIAL_BOOKINGS.map(b => ({
    id: b.id,
    customer_id: b.customerId,
    customer_name: b.customerName,
    customer_phone: b.customerPhone,
    therapist_id: b.therapistId || null,
    therapist_name: b.therapistName || null,
    therapist_photo: b.therapistPhoto || null,
    therapist_rating: b.therapistRating || null,
    therapist_phone: b.therapistPhone || null,
    service: b.service,
    duration_min: b.durationMin,
    add_ons: b.addOns,
    therapist_gender_pref: b.therapistGenderPref,
    scheduled_date: b.scheduledDate,
    scheduled_time: b.scheduledTime,
    location_type: b.locationType,
    address: b.address,
    city: b.city,
    special_notes: b.specialNotes || null,
    base_price: b.basePrice,
    add_ons_price: b.addOnsPrice,
    coupon_discount: b.couponDiscount,
    membership_discount: b.membershipDiscount,
    total_paid: b.totalPaid,
    platform_commission: b.platformCommission,
    therapist_payout: b.therapistPayout,
    payment_method: b.paymentMethod,
    status: b.status,
    created_at: b.createdAt,
    eta_minutes: b.etaMinutes || null,
    sos_triggered: b.sosTriggered || false,
    review: b.review || null
  }));

  const { error: bookErr } = await supabase.from('bookings').upsert(bookingsToInsert, { onConflict: 'id' });
  if (bookErr) console.error('Error seeding bookings:', bookErr.message);
  else console.log(`✓ ${INITIAL_BOOKINGS.length} bookings seeded successfully!`);

  console.log('\n--- PamWill Supabase Database Seeding Completed ---');
  return true;
}

seedDatabase().catch(console.error);
