const express = require("express");
const { getAllOrders, myOrders, updateOrder, deleteOrder } = require("../controller/orderController");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controller/userController");
const router= express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser)

router.route("/logout").get(logout)

router.route("/password/forgot").post(forgotPassword)

router.route("/password/reset/:token").put(resetPassword)

router.route("/me").get(isAuthenticatedUser,getUserDetails)

router.route("/password/update").put(isAuthenticatedUser,updatePassword)

router.route("/me/update").put(isAuthenticatedUser, updateProfile)

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser)

router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser).put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)

router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)

router.route("/order/:id").get(isAuthenticatedUser, getSingleUser)

router.route("/orders/me").get(isAuthenticatedUser, myOrders)

router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
.delete(isAuthenticatedUser, authorizeRoles("admin"),deleteOrder)

module.exports = router;