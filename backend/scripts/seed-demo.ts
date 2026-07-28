/**
 * Seeds the database with realistic demo data across every role and feature —
 * meant for your project demo/defense so the app doesn't look empty.
 *
 * Usage:
 *   npx tsx scripts/seed-demo.ts
 *
 * Safe to re-run: it checks for existing demo accounts by email and skips
 * recreating anything that's already there, so running it twice won't
 * duplicate data. It does NOT touch any real user data — every demo account
 * uses an @demo.futsalbuddy.com email so they're easy to find and delete.
 *
 * All demo accounts use the password: Demo@12345
 */
import bcryptjs from "bcryptjs";
import { connectToMongoDB } from "../src/database/mongodb";
import { UserModel, IUser } from "../src/models/user.model";
import { PlayerProfileModel } from "../src/models/player.model";
import { FutsalModel } from "../src/models/futsal.model";
import { TeamModel } from "../src/models/team.model";
import { MatchModel } from "../src/models/match.model";
import { BookingModel } from "../src/models/booking.model";
import { ReviewModel } from "../src/models/review.model";
import { NotificationModel } from "../src/models/notification.model";

const DEMO_PASSWORD = "Demo@12345";

async function upsertUser(fields: Partial<IUser> & { email: string }): Promise<IUser> {
    const existing = await UserModel.findOne({ email: fields.email });
    if (existing) return existing;
    const hashedPassword = await bcryptjs.hash(DEMO_PASSWORD, 10);
    return UserModel.create({ ...fields, password: hashedPassword, isActive: true, isVerified: true });
}

async function main() {
    await connectToMongoDB();
    console.log("🌱 Seeding demo data...\n");

    // ─── Admin ──────────────────────────────────────────────────────────────
    const admin = await upsertUser({
        firstName: "Admin",
        lastName: "Demo",
        email: "admin@demo.futsalbuddy.com",
        username: "demo_admin",
        role: "admin",
    });
    console.log(`✅ Admin: ${admin.email}`);

    // ─── Organizers + their futsal venues ──────────────────────────────────
    const organizerDefs = [
        { firstName: "Rajesh", lastName: "Shrestha", district: "Kathmandu", futsalName: "Champs Futsal Arena" },
        { firstName: "Sita", lastName: "Gurung", district: "Lalitpur", futsalName: "Patan Futsal Ground" },
        { firstName: "Bikash", lastName: "Tamang", district: "Bhaktapur", futsalName: "Durbar Futsal Court" },
    ];

    const organizers: IUser[] = [];
    const futsals: any[] = [];

    for (let i = 0; i < organizerDefs.length; i++) {
        const def = organizerDefs[i];
        const org = await upsertUser({
            firstName: def.firstName,
            lastName: def.lastName,
            email: `organizer${i + 1}@demo.futsalbuddy.com`,
            username: `demo_organizer${i + 1}`,
            role: "organizer",
        });
        organizers.push(org);

        let futsal = await FutsalModel.findOne({ name: def.futsalName });
        if (!futsal) {
            futsal = await FutsalModel.create({
                organizerId: org._id.toString(),
                name: def.futsalName,
                description: `A well-maintained 5-a-side futsal court in ${def.district}, open daily.`,
                district: def.district,
                municipality: def.district,
                nearbyLandmark: "Near main chowk",
                latitude: 27.7 + i * 0.01,
                longitude: 85.3 + i * 0.01,
                contactNumber: `98${(10000000 + i).toString().slice(0, 8)}`,
                pricePerHour: 1200 + i * 200,
                openingTime: "06:00",
                closingTime: "22:00",
                facilities: ["Floodlights", "Changing Room", "Parking", "Drinking Water"],
                isVerified: i !== 2, // leave the 3rd one unverified so admin has something to verify in the demo
                isActive: true,
            });
        }
        futsals.push(futsal);
        console.log(`✅ Organizer: ${org.email} — venue "${futsal.name}" (${futsal.isVerified ? "verified" : "pending verification"})`);
    }

    // ─── Players + their player profiles ───────────────────────────────────
    const playerDefs = [
        { firstName: "Anish", lastName: "K.C.", position: "forward", skillLevel: "advanced", city: "Kathmandu" },
        { firstName: "Priya", lastName: "Maharjan", position: "midfielder", skillLevel: "intermediate", city: "Kathmandu" },
        { firstName: "Suman", lastName: "Rai", position: "defender", skillLevel: "intermediate", city: "Lalitpur" },
        { firstName: "Nisha", lastName: "Thapa", position: "goalkeeper", skillLevel: "advanced", city: "Lalitpur" },
        { firstName: "Kiran", lastName: "Basnet", position: "forward", skillLevel: "beginner", city: "Bhaktapur" },
        { firstName: "Manisha", lastName: "Adhikari", position: "midfielder", skillLevel: "professional", city: "Kathmandu" },
        { firstName: "Dipesh", lastName: "Lama", position: "defender", skillLevel: "beginner", city: "Kathmandu" },
        { firstName: "Sabina", lastName: "Karki", position: "any", skillLevel: "intermediate", city: "Bhaktapur" },
    ];

    const players: IUser[] = [];
    for (let i = 0; i < playerDefs.length; i++) {
        const def = playerDefs[i];
        const player = await upsertUser({
            firstName: def.firstName,
            lastName: def.lastName,
            email: `player${i + 1}@demo.futsalbuddy.com`,
            username: `demo_player${i + 1}`,
            role: "player",
        });
        players.push(player);

        const existingProfile = await PlayerProfileModel.findOne({ userId: player._id.toString() });
        if (!existingProfile) {
            await PlayerProfileModel.create({
                userId: player._id.toString(),
                position: def.position,
                skillLevel: def.skillLevel,
                preferredFoot: i % 2 === 0 ? "right" : "left",
                age: 20 + (i % 10),
                city: def.city,
                bio: `${def.skillLevel} ${def.position} looking for regular matches in ${def.city}.`,
                availability: ["Saturday", "Sunday"],
                stats: {
                    matchesPlayed: 5 + i * 3,
                    wins: 2 + i,
                    losses: 1 + i,
                    goals: i * 2,
                    assists: i,
                },
                lookingFor: "both",
                isAvailable: true,
            });
        }
    }
    console.log(`✅ ${players.length} players with player profiles created`);

    // ─── Teams ──────────────────────────────────────────────────────────────
    let teamA = await TeamModel.findOne({ name: "Kathmandu Strikers" });
    if (!teamA) {
        teamA = await TeamModel.create({
            name: "Kathmandu Strikers",
            organizerId: organizers[0]._id.toString(),
            city: "Kathmandu",
            description: "Competitive team looking for weekend challenges.",
            skillLevel: "advanced",
            maxMembers: 10,
            isOpen: true,
            members: [players[0]._id.toString(), players[1]._id.toString(), players[5]._id.toString()],
        });
    }
    let teamB = await TeamModel.findOne({ name: "Patan United" });
    if (!teamB) {
        teamB = await TeamModel.create({
            name: "Patan United",
            organizerId: organizers[1]._id.toString(),
            city: "Lalitpur",
            description: "Friendly mixed-skill team, always up for a match.",
            skillLevel: "mixed",
            maxMembers: 10,
            isOpen: true,
            members: [players[2]._id.toString(), players[3]._id.toString()],
        });
    }
    console.log(`✅ Teams: "${teamA.name}", "${teamB.name}"`);

    // ─── Matches (one of each status, for a realistic-looking list) ───────
    const today = new Date();
    const dateStr = (daysFromNow: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() + daysFromNow);
        return d.toISOString().slice(0, 10);
    };

    const matchDefs = [
        { title: "Weekend Friendly 5v5", status: "open", daysFromNow: 3, players: players.slice(0, 2) },
        { title: "Saturday Night League", status: "full", daysFromNow: 5, players: players.slice(0, 6) },
        { title: "Sunday Morning Kickabout", status: "completed", daysFromNow: -4, players: players.slice(2, 8) },
    ];

    for (const def of matchDefs) {
        const existing = await MatchModel.findOne({ title: def.title });
        if (existing) continue;
        await MatchModel.create({
            title: def.title,
            organizerId: organizers[0]._id.toString(),
            venue: futsals[0].name,
            city: futsals[0].district,
            matchDate: dateStr(def.daysFromNow),
            matchTime: "18:00",
            maxPlayers: 10,
            skillLevel: "any",
            matchType: "friendly",
            description: "Demo match for project presentation.",
            status: def.status,
            entryFee: 200,
            players: def.players.map((p) => p._id.toString()),
        });
    }
    console.log(`✅ ${matchDefs.length} matches created (open / full / completed)`);

    // ─── Bookings (one of each status) ─────────────────────────────────────
    const bookingDefs = [
        { status: "pending", daysFromNow: 2, startTime: "17:00", endTime: "18:00" },
        { status: "approved", daysFromNow: 4, startTime: "19:00", endTime: "20:00" },
        { status: "completed", daysFromNow: -7, startTime: "18:00", endTime: "19:00" },
    ];
    for (const def of bookingDefs) {
        const date = dateStr(def.daysFromNow);
        const existing = await BookingModel.findOne({
            futsalId: futsals[0]._id.toString(),
            date,
            startTime: def.startTime,
        });
        if (existing) continue;
        await BookingModel.create({
            futsalId: futsals[0]._id.toString(),
            playerId: players[0]._id.toString(),
            date,
            startTime: def.startTime,
            endTime: def.endTime,
            status: def.status,
            price: futsals[0].pricePerHour,
        });
    }
    console.log(`✅ ${bookingDefs.length} bookings created (pending / approved / completed)`);

    // ─── A review for the completed booking ────────────────────────────────
    const completedBooking = await BookingModel.findOne({ futsalId: futsals[0]._id.toString(), status: "completed" });
    if (completedBooking) {
        const existingReview = await ReviewModel.findOne({ bookingId: completedBooking._id.toString() });
        if (!existingReview) {
            await ReviewModel.create({
                futsalId: futsals[0]._id.toString(),
                playerId: players[0]._id.toString(),
                bookingId: completedBooking._id.toString(),
                rating: 5,
                comment: "Great court, good lighting, friendly staff. Will book again!",
            });
            await FutsalModel.updateOne(
                { _id: futsals[0]._id },
                { $set: { rating: 5, reviewCount: 1 } }
            );
        }
    }
    console.log(`✅ 1 review created`);

    // ─── A few notifications so the bell icon isn't empty on first login ──
    const notifSeed = [
        { userId: players[0]._id.toString(), type: "booking_approved", message: "Your booking was approved" },
        { userId: organizers[0]._id.toString(), type: "new_review", message: `${futsals[0].name} received a new 5★ review` },
        { userId: admin._id.toString(), type: "new_organizer_registration", message: "A new organizer registered" },
    ];
    for (const n of notifSeed) {
        const exists = await NotificationModel.findOne({ userId: n.userId, message: n.message });
        if (!exists) await NotificationModel.create(n);
    }
    console.log(`✅ Sample notifications created\n`);

    console.log("🎉 Demo data seeding complete!\n");
    console.log("Login with any of these (all use password: " + DEMO_PASSWORD + "):");
    console.log(`  Admin:      ${admin.email}`);
    organizers.forEach((o) => console.log(`  Organizer:  ${o.email}`));
    players.forEach((p) => console.log(`  Player:     ${p.email}`));

    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Failed to seed demo data:", err);
    process.exit(1);
});
