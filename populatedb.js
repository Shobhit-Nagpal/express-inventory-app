#! usr/bin/env node

const Item = require("./models/item");
const Category = require("./models/category");
const mongoose = require("mongoose");

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

const categories = [];
const items = [];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    //call functions to allocate db
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function itemCreate(index, name, description, price, number_in_stock, category) {
   const item = new Item({name: name, description: description, price: price, number_in_stock: number_in_stock, category: category}); 
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
}

async function categoryCreate(index, name, description) {
    const category = new Category({name: name, description: description});
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function createItems() {
   console.log("Adding items");
    await Promise.all([
        itemCreate(0, "Ballpoint Pens", "Common writing instruments with a rolling ball tip that distributes ink.", 0.50, 200,[categories[0]]),
        itemCreate(1, "Printer Paper", "Standard sized white sheets commonly used in printers and copiers.", 5, 150, [categories[0]]),
        itemCreate(2, "Laptop", "Portable computer, essential for modern work and digital tasks.", 1200, 20,[categories[1]]),
        itemCreate(3, "Ergonomic keyboard", "A keyboard designed to minimize strain and provide a comfortable typing experience.", 60, 50, [categories[0], categories[1]]),
        itemCreate(4, "LED Monitor", "Digital display screens for computers, offering clear visuals and efficient energy usage.", 120, 30, [categories[1]]),
        itemCreate(5, "USB-C Charging Cable", "Modern cable for fast data transfer and changing of compatible devices.", 15, 75, [categories[1]]),
        itemCreate(6, "Whiteboard Markers", "Markers with erasable ink, used for writing on whiteboards.", 3, 100, [categories[0]]),
        itemCreate(7, "Broom and Dustpan Set", "Tools for sweeping and collecting dust and debris from floors.", 12, 40, [categories[2]]),
        itemCreate(8, "All-purpose Cleaner Spray", "Liquid cleaning agent effective on various surfaces, dispensed via a spray nozzle/", 5, 60, [categories[2]]),
        itemCreate(9, "Screwdriver Set", "Collections of tools with flat or cross-head tips for turning screws.", 20, 35, [categories[0],categories[2]]),
        itemCreate(10, "Desk Organizer Tray", "A compartmentalized tray to keep desk items like pens, clips and notes organized.", 8, 50, [categories[0]]),
        itemCreate(11, "Wireless Mouse", "A device for computer navigation, operates with a connecting wire and modern ones with wireless connectivity.", 25, 45, [categories[0], categories[1]]),
        itemCreate(12, "LED Light Bulbs", "Energy efficient light sources that provide illumination using light-emitting diodes.", 7, 80, [categories[2]]),
        itemCreate(13, "Extension Cords", "Electrical cable that extends the reach of power sources, with multiple outlets for various devices.", 100, 55,[categories[0], categories[1]]),
        itemCreate(14, "Multipurpose Wipes", "Pre-moistened tissues with disinfecting properties, used for cleaning surfaces and objects.", 4, 90, [categories[2]]),
    ]);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate(0, "Office Supplies", "This category includes everyday items and tools used in office settings. From notepads, pens, and markers to staplers, binders, and printer paper, keep track of all the essentials that make day-to-day operations smooth."),
        categoryCreate(1, "Electronics and Accessories", "Modern businesses rely heavily on electronic devices and their peripherals. This section catalogues items such as laptops, desktops, monitors, keyboards, mice, charging cables, and headphones. Monitor the health and quantity of your tech tools efficiently."),
        categoryCreate(2, "Facility Mainenance", "Proper upkeep of a workplace ensures safety and efficiency. Inventory items in this category range from cleaning supplies, such as mops, brooms, and disinfectants, to maintenance tools, like hammers, screwdrivers, and light bulbs. Keep your workspace in top condition by staying stocked up."),
    ]);
}
