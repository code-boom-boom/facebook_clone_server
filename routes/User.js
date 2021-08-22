const router = require("express").Router();

const authRequired = require("../middleware/AuthRequired");

const {
    me,
    fetchUserById,
    fetchRecommendedUsers,
    fetchSentFriendRequest
} = require("../controllers/User/FetchUser");

// Fetch users
router.get("/me", authRequired, me);
router.get("/recommended_users", authRequired, fetchRecommendedUsers);
router.get("/friend_request/sent", authRequired, fetchSentFriendRequest);
router.get("/:user_id", authRequired, fetchUserById);

module.exports = router;