/**
 * Creates (or promotes) an admin account.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Reads ADMIN_EMAIL / ADMIN_USERNAME / ADMIN_PASSWORD from .env if present,
 * otherwise falls back to the defaults below. Safe to re-run — if the email
 * already exists, it just promotes that account to role "admin" instead of
 * creating a duplicate.
 */
import bcryptjs from "bcryptjs";
import { connectToMongoDB } from "../src/database/mongodb";
import { UserModel } from "../src/models/user.model";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@futsalbuddy.com";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

async function main() {
    await connectToMongoDB();

    const existing = await UserModel.findOne({ email: ADMIN_EMAIL });

    if (existing) {
        existing.role = "admin";
        existing.isActive = true;
        existing.isVerified = true;
        await existing.save();
        console.log(`✅ Promoted existing user "${ADMIN_EMAIL}" to admin.`);
    } else {
        const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);
        await UserModel.create({
            firstName: "Admin",
            lastName: "User",
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            isVerified: true,
        });
        console.log(`✅ Created new admin account.`);
        console.log(`   Email:    ${ADMIN_EMAIL}`);
        console.log(`   Username: ${ADMIN_USERNAME}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log(`   ⚠️  Change this password after your first login.`);
    }

    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Failed to seed admin:", err);
    process.exit(1);
});
