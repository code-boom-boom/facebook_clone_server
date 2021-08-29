const router = require("express").Router();

const authRequired = require("../middleware/AuthRequired");

// Fetch methods
const {
    me,
    fetchUserById,
    fetchRecommendedUsers,
    fetchSentFriendRequest,
    fetchIncomingFriendRequest,
    searchUsers
} = require("../controllers/User/FetchUser");

// Chat methods
const {
    sendMessageToFriend,
    getFriendMessages
} = require("../controllers/User/Chat");

// User Actions
const {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelSentFriendRequest,
    updateProfilePic,
    updateCoverPic,
    updateProfile,
    clearNotification
} = require("../controllers/User/UserAction");

// Fetch users
router.get("/me", authRequired, me);
router.get("/recommended_users", authRequired, fetchRecommendedUsers);
router.get("/friend_request/sent", authRequired, fetchSentFriendRequest);
router.get("/friend_request/received", authRequired, fetchIncomingFriendRequest);
router.get("/search", searchUsers);

// User Actions
router.post("/friend_request/:userId/send", authRequired, sendFriendRequest);
router.post("/friend_request/:requestId/accept", authRequired, acceptFriendRequest);
router.post("/friend_request/:requestId/decline", authRequired, declineFriendRequest);
router.post("friend_request/:requestId/cancel", authRequired, cancelSentFriendRequest);

router.get("/:user_id", authRequired, fetchUserById);

// chat routes
router.post("/chat/:friendId/send", authRequired, sendMessageToFriend);
router.get("/chat/:friendId/get_messages", authRequired, getFriendMessages);

// profile actions
router.put("/profile_pic/update", authRequired, updateProfilePic);
router.put("/cover_pic/update", authRequired, updateCoverPic);
router.put("/update_profile/:input", authRequired, updateProfile);
router.delete("/notifications/clear", authRequired, clearNotification);

module.exports = router;