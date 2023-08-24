const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({}).exec();

    res.render("category_list", {title: "Categories", categories: categories});
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, itemsInCategory] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({category: req.params.id}).exec()]);

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {title: "Category detail", category: category, items_in_category: itemsInCategory})
});

exports.create_category_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {title: "Create category"});
});

exports.create_category_post = [
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("description", "Description must not be empty.").trim().isLength({ min: 1} ).escape(),
    asyncHandler( async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category( {name: req.body.name, description: req.body.description} );

        if (!errors.isEmpty()) {
            res.render("category_form", {title: "Create category", errors: errors.array() })
        }
        else {
            await category.save();
            res.redirect(category.url);
        }
    })
];

exports.delete_category_get = asyncHandler(async (req, res, next) => {
    const [category, itemsInCategory] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({category: req.params.id}).exec()]);

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_delete", {title: "Delete category", category: category, items: itemsInCategory});
});

exports.delete_category_post = asyncHandler(async (req, res, next) => {
    
    const [category, itemsInCategory] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({category: req.params.id}).exec()]);

    if (itemsInCategory.length > 0 ) {
        res.render("category_delete", {title: "Delete category", category: category, items: itemsInCategory});
        return;
    }
    else {
        await Category.findByIdAndRemove(req.body.categoryid).exec();
        res.redirect('/catalog/categories');
    }

});

exports.update_category_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next();
    }

    res.render("category_form", {title: "Update category", category: category});
});

exports.update_category_post = [
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("description", "Description must not be empty.").trim().isLength({ min: 1} ).escape(),
    asyncHandler( async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category( {name: req.body.name, description: req.body.description, _id: req.params.id} );

        if (!errors.isEmpty()) {
            res.render("category_form", {title: "Create category", errors: errors.array() })
        }
        else {
            const thecategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(thecategory.url);
        }
    })
];
