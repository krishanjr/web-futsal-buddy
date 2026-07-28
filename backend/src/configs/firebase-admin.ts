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

    let initialized = false;

    if (serviceAccountPath) {
        const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
        if (!fs.existsSync(resolvedPath)) {
            console.warn(
                `[firebase-admin] FIREBASE_SERVICE_ACCOUNT_PATH is set to "${serviceAccountPath}" but no file was found there.`
            );
        } else {
            try {
                const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                initialized = true;
            } catch (err) {
                console.warn('[firebase-admin] Failed to load service account JSON:', err.message || err);
            }
        }
    }

    // If no service account file, try env vars. Only initialize if all three exist.
    if (!initialized) {
        if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: FIREBASE_PROJECT_ID,
                        clientEmail: FIREBASE_CLIENT_EMAIL,
                        privateKey: FIREBASE_PRIVATE_KEY,
                    }),
                });
                initialized = true;
            } catch (err) {
                console.warn('[firebase-admin] Failed to initialize from env vars:', err.message || err);
            }
        } else {
            console.warn(
                "[firebase-admin] Missing Firebase Admin credentials in .env — set either " +
                    "FIREBASE_SERVICE_ACCOUNT_PATH (path to the downloaded JSON key), or all three of " +
                    "FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY. " +
                    "Google sign-in and Firebase password reset will not work until one of these is set."
            );
        }
    }
}

export const firebaseAuth = admin.apps.length ? admin.auth() : null;
export default admin;
