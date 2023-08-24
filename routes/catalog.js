const express = require("express");
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const router = express.Router();

 /// ITEM ROUTES ///

router.get("/", item_controller.index);

router.get("/items", item_controller.items_list);

router.get("/item/create", item_controller.create_item_get);

router.post("/item/create", item_controller.create_item_post);

router.get("/item/:id/delete", item_controller.delete_item_get);

router.post("/item/:id/delete", item_controller.delete_item_post);

router.get("/item/:id/update", item_controller.update_item_get);

router.post("/item/:id/update", item_controller.update_item_post);

router.get("/item/:id", item_controller.item_detail);


/// CATEGORY ROUTES ///

router.get("/categories", category_controller.category_list);

router.get("/category/create", category_controller.create_category_get);

router.post("/category/create", category_controller.create_category_post);

router.get("/category/:id/delete", category_controller.delete_category_get);

router.post("/category/:id/delete", category_controller.delete_category_post);

router.get("/category/:id/update", category_controller.update_category_get);

router.post("/category/:id/update", category_controller.update_category_post);

router.get("/category/:id", category_controller.category_detail);

module.exports = router;
