import Outpass from "../models/outpass.model.js";

/**
 * Scheduler to automatically update expired outpasses
 * Runs every 5 minutes to check and expire outpasses based on time limits
 * Also runs at midnight (12 AM) to expire all outpasses
 */
export const startOutpassExpirationScheduler = () => {
  // Run immediately on startup
  checkAndExpireOutpasses();

  // Run every 5 minutes to check for time-based expiration
  setInterval(() => {
    checkAndExpireOutpasses();
  }, 5 * 60 * 1000);

  // Schedule midnight task to expire all outpasses
  scheduleMidnightExpiration();

  console.log("✅ Outpass expiration scheduler started");
  console.log("   - Time-based expiration: Every 5 minutes");
  console.log("   - Midnight expiration: Every day at 12:00 AM");
};

/**
 * Schedule task to run at midnight (12:00 AM) every day
 */
const scheduleMidnightExpiration = () => {
  const scheduleNextMidnight = () => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // Next day
      0, 0, 0, 0 // 12:00:00 AM
    );

    const timeUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      // Expire all outpasses at midnight
      expireAllOutpasses();
      
      // Schedule the next midnight task
      scheduleNextMidnight();
    }, timeUntilMidnight);

    console.log(`⏰ Next midnight expiration scheduled for: ${midnight.toLocaleString()}`);
  };

  scheduleNextMidnight();
};

/**
 * Check and update expired outpasses based on time limits
 */
const checkAndExpireOutpasses = async () => {
  try {
    await Outpass.updateExpiredOutpasses();
    console.log(`[${new Date().toISOString()}] Checked for expired outpasses`);
  } catch (error) {
    console.error("Error in outpass expiration scheduler:", error);
  }
};

/**
 * Expire all pending and approved outpasses at midnight
 */
const expireAllOutpasses = async () => {
  try {
    const result = await Outpass.updateMany(
      {
        status: { $in: ["pending", "approved"] }
      },
      {
        $set: { status: "expired" }
      }
    );

    console.log(`🌙 [MIDNIGHT] Expired all outpasses: ${result.modifiedCount} outpass(es) expired at ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error("Error expiring all outpasses at midnight:", error);
  }
};
