import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } from "./constant";

// Guard against re-initializing when this module is imported multiple times
// (e.g. in tests or with ts-node-dev hot reload).
if (!admin.apps.length) {
    // Two ways to configure credentials — pick whichever is set:
    //
    // Option A (simplest): download the service account JSON from Firebase
    // Console > Project Settings > Service accounts > Generate new private key,
    // save it in the backend project (e.g. backend/serviceAccountKey.json), and
    // set FIREBASE_SERVICE_ACCOUNT_PATH in .env to point at it.
    //
    // Option B: copy the three fields (project_id, client_email, private_key)
    // out of that same JSON file into FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL
    // / FIREBASE_PRIVATE_KEY in .env directly.
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (serviceAccountPath) {
        const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
        if (!fs.existsSync(resolvedPath)) {
            console.warn(
                `[firebase-admin] FIREBASE_SERVICE_ACCOUNT_PATH is set to "${serviceAccountPath}" but no file was found there.`
            );
        }
        const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
            // Don't crash the whole server if Firebase isn't configured yet — just
            // log so it's obvious why Google sign-in / Firebase password reset fail.
            console.warn(
                "[firebase-admin] Missing Firebase Admin credentials in .env — set either " +
                    "FIREBASE_SERVICE_ACCOUNT_PATH (path to the downloaded JSON key), or all three of " +
                    "FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY. " +
                    "Google sign-in and Firebase password reset will not work until one of these is set."
            );
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                clientEmail: FIREBASE_CLIENT_EMAIL,
                privateKey: FIREBASE_PRIVATE_KEY,
            }),
        });
    }
}

export const firebaseAuth = admin.auth();
export default admin;
