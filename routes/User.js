const router = require("express").Router();

const authRequired = require("../middleware/AuthRequired");

const {
    me,
    fetchUserById,
    fetchRecommendedUsers
} = require("../controllers/User/FetchUser");

// Fetch users
router.get("/me", authRequired, me);
router.get("/recommended_users", authRequired, fetchRecommendedUsers);
router.get("/:user_id", authRequired, fetchUserById);

module.exports = router;