import app from "./src/app";
import { PORT } from "./src/configs/constant";
import { connectToMongoDB } from "./src/database/mongodb";

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`🚀 Futsal Buddy Server running at: http://localhost:${PORT}`);
    console.log(`📋 API Base: http://localhost:${PORT}/api/v1`);
});

// execute: npm run dev
