const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [numItems, numCategories] = await Promise.all([Item.countDocuments({}).exec(), Category.countDocuments({}).exec()]);
    
    res.render("index", {title: "Inventory Home", item_count: numItems, category_count: numCategories});

});

exports.items_list = asyncHandler(async (req, res, next) => {
    const items = await Item.find({}).populate("category").exec();
    res.render("item_list", {title: "Items list", items: items});
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec();

    if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }
    res.render("item_detail", {title: "Item detail", item: item});
});

exports.create_item_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}).exec();
    res.render("item_form", {title: "Create item", categories: allCategories});
});

exports.create_item_post = [
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === "undefined") req.body.category = [];
            else req.body.category = new Array(req.body.category);
        }
        next();
    },
    body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
    body("price").notEmpty().withMessage("Price cannot be empty").isNumeric().withMessage("Price needs to be a number").toFloat(),
    body("stock").notEmpty().withMessage("Stock cannot be empty.").isNumeric().withMessage("Stock needs to be a number").toInt(),
    body("category*").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            number_in_stock: Number(req.body.stock),
            category: req.body.category
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find({}).exec();

            for (const category of allCategories) {
                if (item.category.indexOf(category._id) > -1) {
                    category.checked = "true";
                }
            }
            res.render("item_form", {title:"Create item", categories: allCategories, errors: errors.array()});
        }
        else {
            await item.save();
            res.redirect(item.url);
        }
    })
];

exports.delete_item_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec();

    if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_delete", {title: "Delete item", item: item});
});

exports.delete_item_post = asyncHandler(async (req, res, next) => {
    await Item.findByIdAndRemove(req.body.itemid).exec();
    res.redirect("/catalog/items");
});

exports.update_item_get = asyncHandler(async (req, res, next) => {
    const [item, allCategories ]= await Promise.all([Item.findById(req.params.id).populate("category").exec(), Category.find({}).exec()]);

    if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    for (const category of allCategories) {
        for (const item_g of item.category) {
            if (category._id.toString() === item_g._id.toString()) {
                category.checked = "true";
            }
        }
    }

    res.render("item_form", {title: "Update item", item: item, categories: allCategories});
});

exports.update_item_post =  [
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === "undefined") req.body.category = [];
            else req.body.category = new Array(req.body.category);
        }
        next();
    },
    body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
    body("price").notEmpty().withMessage("Price cannot be empty").isNumeric().withMessage("Price needs to be a number").toFloat(),
    body("stock").notEmpty().withMessage("Stock cannot be empty.").isNumeric().withMessage("Stock needs to be a number").toInt(),
    body("category*").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            number_in_stock: Number(req.body.stock),
            category: req.body.category,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find({}).exec();

            for (const category of allCategories) {
                if (item.category.indexOf(category._id) > -1) {
                    category.checked = "true";
                }
            }
            res.render("item_form", {title:"Update item", categories: allCategories});
        }
        else {
            const theitem = await Item.findByIdAndUpdate(req.params.id, item, {});
            res.redirect(item.url);
        }
    })
];
