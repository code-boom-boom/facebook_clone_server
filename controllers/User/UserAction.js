const User = require("../../models/User");
const FriendRequest = require("../../models/FriendRequest");
const FilterUserData = require("../../utils/FilterUserData");
const Notification = require("../../models/Notification");
const CreateNotification = require("../../utils/CreateNotification");

exports.sendFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (req.userId === req.params.userId) {
            return res.status(400).json({ error: "You can't send friend request to yourself"});
        }

        if (user.friends.includes(req.userId)) {
            return res.status(400).json({ error: "Already friends" });
        }

        const friendRequest = await FriendRequest.findOne({
            sender: req.userId,
            receiver: req.params.userId,
        });

        if (friendRequest) {
            return res.status(400).json({ error: "Friend request already sent" });
        }

        const newFriendRequest = new FriendRequest({
            sender: req.userId,
            receiver: req.params.userId,
        });

        const save = await newFriendRequest.save();

        const friend = await FriendRequest.findById(save.id).populate("receiver");

        const chunkData = {
            id: friend.id,
            user: FilterUserData(friend.receiver)
        };

        return res.status(200).json({ message: "Friend request sent", friend: chunkData });

        // TODO: Socket IO Connection

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.acceptFriendRequest = async (req, res) => {
    try {
        const friendRequest = await FriendRequest.findById(req.params.requestId);

        if (!friendRequest) {
            return res.status(404).json({ error: "Request already accepted or not set yet" });
        }

        const sender = await User.findById(friendRequest.sender);

        if (sender.friends.includes(friendRequest.receiver)) {
            return res.status(400).json({ error: "Already in your friends lists" });
        }

        sender.friends.push(req.userId);
        await sender.save();

        const currentUser = await User.findById(req.userId);
        if (currentUser.friends.includes(friendRequest.sender)) {
            return res.status(400).json({ error: "Already friend" });
        }

        currentUser.friends.push(friendRequest.sender);
        await currentUser.save();

        const chunkData = FilterUserData(sender);

        await FriendRequest.deleteOne({ _id: req.params.requestId });
        return res.status(200).json({
            message: "Friend Request Accepted",
            user: chunkData
        });

        // TODO: Socket Script

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.declineFriendRequest = async (req, res) => {
    try {

        const friendRequest = await FriendRequest.findById(req.params.requestId).populate("sender");
        if (!friendRequest) {
            return res.status(404).json({ error: "Request doesn't exist" });
        }
        await FriendRequest.deleteOne({ _id: req.params.requestId });

        return res.status(200).json({ message: "Friend Request Declined" });

        // TODO: Socket Script

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.cancelSentFriendRequest = async (req, res) => {
    try {

        const friendRequest = await FriendRequest.findById(req.params.requestId).populate("receiver");
        if (!friendRequest) {
            return res.status(404).json({ error: "Request doesn't exist" });
        }
        await FriendRequest.deleteOne({ _id: req.params.requestId });

        return res.status(200).json({ message: "Friend request cancelled" });

        // TODO: Socket Script

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.updateProfilePic = async (req, res) => {
    const { profile_url } = req.body;
    try {
        const user = await User.findById(req.userId);

        user.profile_pic = profile_url;
        await user.save();

        const getUser = await User.findById(req.userId).populate("friends");
        const userData = FilterUserData(getUser);

        const friends = getUser.friends.map((friend) => ({
            ...FilterUserData(friend),
        }));

        userData.friends = friends;

        return res.status(200).json({ message: "Profile image updated", user: userData });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.updateCoverPic = async (req, res) => {
    const { cover_url } = req.body;
    try {

        const user = await User.findById(req.userId);

        user.cover_image = cover_url;
        await user.save();

        const getUser = await User.findById(req.userId).populate("friends");
        const userData = FilterUserData(getUser);

        const friends = getUser.friends.map((friend) => ({
            ...FilterUserData(friend),
        }));

        userData.friends = friends;

        return res.status(200).json({ message: "Cover image updated", user: userData });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (req.params.input === "name") {
            user.name = req.body.name;
        }

        if (req.params.input === "email") {
            user.name = req.body.email;
        }

        if (req.params.input === "bio") {
            user.name = req.body.bio;
        }

        if (req.params.input === "location") {
            user.name = req.body.location;
        }

        if (req.params.input === "education") {
            user.name = req.body.education;
        }

        await user.save();

        return res.status(200).json({ message: "Updated successfully!" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

exports.clearNotification = async (req, res) => {
    try {
        await Notification.deleteMany({ user: req.userId });
        return res.status(200).json({ message: "Notification Cleared Successfully!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}