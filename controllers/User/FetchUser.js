const User = require("../../models/User");
const Notification = require("../../models/Notification");

const FilterUserData = require("../../utils/FilterUserData");

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("friends");

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        const userData = FilterUserData(user);

        userData.friends = user.friends.map((friend) => {
            return {
                ...FilterUserData(friend)
            };
        });

        const notifications = await Notification.find({ user: req.userId }).sort({
            createdAt: -1
        });

        let notifData = notifications.map((notif) => {
            return {
                id: notif.id,
                body: notif.body,
                createdAt: notif.createdAt
            };
        });

        return res.status(200).json({ user: userData, notifications: notifData });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.fetchUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).populate("friends");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userData = FilterUserData(user);

        return res.status(200).json({ user: userData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.fetchRecommendedUsers = async (req, res) => {
    try {
        const users = await User.find().where("_id").ne(req.userId).populate("friends");

        const usersData = users.map((user) => FilterUserData(user));

        return res.status(200).json({ users: usersData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}