require('dotenv').config();

const TrackingService = require('./services/trackingService');

async function main() {
  const trackingService = new TrackingService();
  await trackingService.executeTracking();
}

main().catch(console.error);
