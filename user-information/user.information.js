// {
//   "first_name": "Thongvan",
//   "last_name": "Xiong",
//   "gender": "male",
//   "role": "admin",
//   "password": "123",
//   "email": "thongvan@email.com",
//   "phone": "02098222944",
//   "profile": "data"
// }
// {
//   "first_name": "Choua",
//   "last_name": "Xiong",
//   "gender": "male",
//   "role": "staff",
//   "password": "8888",
//   "email": "choua@email.com",
//   "phone": "02055220011",
//   "profile": "data"
// }

// Why should have authentication and authorizeRole for each routs
// 👤 USER ROUTES

// POST /user/register → ❌ No auth

// Users are creating a new account, so they’re not logged in yet. Auth is not possible.

// POST /user/login → ❌ No auth

// Users need to log in to get credentials. Auth doesn’t exist yet.

// PUT /user/refreshToken → ✅ Auth

// Requires the user to be logged in because they are refreshing their existing token.

// POST /user/forgotPassword → ❌ No auth

// Users may have forgotten their password, so they cannot be authenticated yet.

// GET /user/getAll → ✅ Auth + Admin

// Fetching all users is sensitive, so only admins should access it.

// GET /user/getOne/:user_id → ✅ Auth (user himself or admin)

// Regular users can view their own profile only. Admins can view anyone.

// PUT /user/update/:user_id → ✅ Auth + Admin

// Updating user info is sensitive. Only admins are allowed to change anyone.

// DELETE /user/delete/:user_id → ✅ Auth + Admin

// Deleting accounts is highly sensitive, restricted to admins.

// 👥 TENANT ROUTES

// POST /tenant/insert → ✅ Auth (maybe tenant or admin)

// Only logged-in users (admins or a tenant) can create tenant records.

// GET /tenant/getAll → ✅ Auth + Admin

// Listing all tenants is sensitive; only admin can see it.

// GET /tenant/getOne/:tenant_id → ✅ Auth (tenant himself or admin)

// Tenants can only see their own info, admin can see all.

// PUT /tenant/update/:tenant_id → ✅ Auth + Admin

// Updating tenant data is sensitive; only admin can do it.

// DELETE /tenant/delete/:tenant_id → ✅ Auth + Admin

// Deleting tenant records is sensitive; only admin.

// 🏢 ROOMTYPE ROUTES

// POST /roomtype/insert → ✅ Auth + Admin

// Only admin can add room types to control the system.

// GET /roomtype/getAll → ❌ Public (optional: Auth)

// Usually safe for all users to see types of rooms available.

// GET /roomtype/getOne/:roomtype_id → ❌ Public

// Viewing details of a room type is not sensitive.

// PUT /roomtype/update/:roomtype_id → ✅ Auth + Admin

// Only admin can update room types.

// DELETE /roomtype/delete/:roomtype_id → ✅ Auth + Admin

// Only admin can delete room types.

// 🏠 ROOM ROUTES

// POST /room/insert → ✅ Auth + Admin

// Adding rooms is admin-only for security.

// GET /room/getAll → ❌ Public (optional: Auth)

// Usually safe for all users to see room availability.

// GET /room/getOne/:room_id → ❌ Public

// Viewing a single room is safe for public.

// PUT /room/update/:room_id → ✅ Auth + Admin

// Admin can update room details.

// DELETE /room/delete/:room_id → ✅ Auth + Admin

// Admin-only, highly sensitive.

// 📄 RENTAL CONTRACT ROUTES

// POST /rentalcontract/insert → ✅ Auth (tenant + admin)

// Only logged-in users (tenant themselves or admin) can create contracts.

// GET /rentalcontract/getAll → ✅ Auth + Admin

// Admin-only: viewing all contracts is sensitive.

// GET /rentalcontract/getOne/:rentalcontract_id → ✅ Auth (tenant himself or admin)

// Tenant can only view their own contract; admin can view all.

// PUT /rentalcontract/update/:rentalcontract_id → ✅ Auth + Admin

// Only admin can update contracts.

// DELETE /rentalcontract/delete/:rentalcontract_id → ✅ Auth + Admin

// Only admin can delete contracts.
// 📅 BOOKING ROUTES

// POST /booking/insert → ✅ Auth (tenant or user)

// Only logged-in tenants (or users) can create a booking.

// Reason: Creating a booking is tied to a specific user account, so anonymous users cannot do it.

// GET /booking/getAll → ✅ Auth + Admin

// Only admin can see all bookings.

// Reason: A list of all bookings is sensitive data, includes other tenants’ information.

// GET /booking/getOne/:booking_id → ✅ Auth (tenant himself or admin)

// Tenants can view their own booking only, admin can view anyone.

// Reason: Protects privacy of other tenants’ bookings.

// PUT /booking/update/:booking_id → ✅ Auth + Admin

// Only admin can update booking details.

// Reason: Changing bookings could affect multiple tenants, so regular users cannot modify bookings globally.

// DELETE /booking/delete/:booking_id → ✅ Auth + Admin

// Only admin can delete bookings.

// Reason: Deleting bookings impacts system integrity; must be restricted to admin.

// 🏨 STAY ROUTES

// POST /stay/insert → ✅ Auth (tenant or admin)

// Tenants can add a stay record themselves, admin can add stays too.

// Reason: Stay info is personal and tied to tenant account.

// GET /stay/getAll → ✅ Auth + Admin

// Only admin can see all stays.

// Reason: List of all stays contains sensitive information.

// GET /stay/getOne/:stay_id → ✅ Auth (tenant himself or admin)

// Tenants can see their own stay records, admin can see all.

// Reason: Protects personal information of other tenants.

// PUT /stay/update/:stay_id → ✅ Auth + Admin

// Only admin can update stay info.

// Reason: Stay details are sensitive and must be consistent system-wide.

// DELETE /stay/delete/:stay_id → ✅ Auth + Admin

// Only admin can delete stay records.

// Reason: Deleting stay info affects historical records; restricted to admin.

// 💳 PAYMENT ROUTES

// POST /payment/insert → ✅ Auth (tenant/user)

// Only logged-in tenants or users can create a payment record.

// Reason: Payment is linked to an account, anonymous users cannot pay.

// GET /payment/getAll → ✅ Auth + Admin

// Admin can see all payments.

// Reason: Financial data is highly sensitive.

// GET /payment/getOne/:payment_id → ✅ Auth (tenant himself or admin)

// Tenants can see their own payment records; admin can see all.

// Reason: Protects privacy and financial info of other tenants.

// PUT /payment/update/:payment_id → ✅ Auth + Admin

// Only admin can update payments.

// Reason: Prevents tampering with financial records.

// DELETE /payment/delete/:payment_id → ✅ Auth + Admin

// Only admin can delete payments.

// Reason: Financial integrity must be preserved; only admin can remove records.

// 🔔 NOTIFICATION ROUTES

// POST /notification/insert → ✅ Auth (system/admin, sometimes user)

// Admin or system can create notifications.

// Sometimes users can create notifications (like messages or alerts).

// Reason: Notifications affect users, so only authenticated parties can create them.

// GET /notification/getAll → ✅ Auth + Admin

// Admin can see all notifications.

// Reason: Full list is sensitive system info.

// GET /notification/getOne/:notification_id → ✅ Auth (user himself or admin)

// Users can only see their own notifications. Admin can see all.

// Reason: Protects privacy of notifications.

// PUT /notification/update/:notification_id → ✅ Auth + Admin

// Only admin can update notifications.

// Reason: Editing notifications affects system messages for everyone.

// DELETE /notification/delete/:notification_id → ✅ Auth + Admin

// Only admin can delete notifications.

// Reason: Removing notifications affects all users; admin-only.

// ✅ Summary / Rules

// POST routes:

// Users/tenants can create personal data.

// Admin can create system-wide data.

// GET routes:

// Users can only view their own records.

// Admin can view all records.

// PUT / DELETE routes:

// Usually admin only, because changes affect multiple users or system integrity.