import Outpass from "../models/outpass.model.js";

/**
 * Scheduler to automatically update expired outpasses
 * Runs every 5 minutes to check and expire outpasses
 */
export const startOutpassExpirationScheduler = () => {
  // Run immediately on startup
  checkAndExpireOutpasses();

  // Then run every 5 minutes (300000 ms)
  setInterval(() => {
    checkAndExpireOutpasses();
  }, 5 * 60 * 1000);

  console.log("✅ Outpass expiration scheduler started (runs every 5 minutes)");
};

/**
 * Check and update expired outpasses
 */
const checkAndExpireOutpasses = async () => {
  try {
    await Outpass.updateExpiredOutpasses();
    console.log(`[${new Date().toISOString()}] Checked for expired outpasses`);
  } catch (error) {
    console.error("Error in outpass expiration scheduler:", error);
  }
};
