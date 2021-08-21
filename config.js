/**
 * Config File for the project
 */
module.exports = {
    PORT: process.env.PORT || 4000,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/facebook",
    JWT_SECRET: process.env.JWT_SECRET || "itssecret",
    JWT_EXP: process.env.JWT_EXPIRE || '10h',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@gmail.com",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin@123",
}