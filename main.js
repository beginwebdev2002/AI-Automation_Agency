/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
const mongoose_1 = __webpack_require__(6);
const booking_module_1 = __webpack_require__(7);
const inventory_module_1 = __webpack_require__(16);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aaa'),
            booking_module_1.BookingModule,
            inventory_module_1.InventoryModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const booking_controller_1 = __webpack_require__(8);
const booking_schema_1 = __webpack_require__(13);
const booking_repository_1 = __webpack_require__(14);
const create_booking_usecase_1 = __webpack_require__(9);
const get_bookings_usecase_1 = __webpack_require__(12);
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: booking_schema_1.BookingModel.name, schema: booking_schema_1.BookingSchema },
            ]),
        ],
        controllers: [booking_controller_1.BookingController],
        providers: [
            create_booking_usecase_1.CreateBookingUseCase,
            get_bookings_usecase_1.GetBookingsUseCase,
            {
                provide: create_booking_usecase_1.BOOKING_REPOSITORY,
                useClass: booking_repository_1.BookingRepository,
            },
        ],
        exports: [create_booking_usecase_1.CreateBookingUseCase],
    })
], BookingModule);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const create_booking_usecase_1 = __webpack_require__(9);
const get_bookings_usecase_1 = __webpack_require__(12);
let BookingController = class BookingController {
    constructor(createBookingUseCase, getBookingsUseCase) {
        this.createBookingUseCase = createBookingUseCase;
        this.getBookingsUseCase = getBookingsUseCase;
    }
    async create(body) {
        // In real app, use DTO validation here
        return this.createBookingUseCase.execute(body.clientId, body.clientName, new Date(body.date), body.items);
    }
    async findAll() {
        return this.getBookingsUseCase.execute();
    }
};
exports.BookingController = BookingController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "findAll", null);
exports.BookingController = BookingController = tslib_1.__decorate([
    (0, common_1.Controller)('bookings'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof create_booking_usecase_1.CreateBookingUseCase !== "undefined" && create_booking_usecase_1.CreateBookingUseCase) === "function" ? _a : Object, typeof (_b = typeof get_bookings_usecase_1.GetBookingsUseCase !== "undefined" && get_bookings_usecase_1.GetBookingsUseCase) === "function" ? _b : Object])
], BookingController);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBookingUseCase = exports.BOOKING_REPOSITORY = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const booking_entity_1 = __webpack_require__(10);
const booking_repository_interface_1 = __webpack_require__(11);
exports.BOOKING_REPOSITORY = 'BOOKING_REPOSITORY';
let CreateBookingUseCase = class CreateBookingUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(clientId, clientName, date, items) {
        // Business Logic: Validate date availability (could be another service)
        const booking = new booking_entity_1.Booking(crypto.randomUUID(), // In real app, ID gen might be infrastructure
        clientId, clientName, date, items);
        await this.bookingRepository.save(booking);
        // Future: Send Notification via NotificationService Port
        return booking;
    }
};
exports.CreateBookingUseCase = CreateBookingUseCase;
exports.CreateBookingUseCase = CreateBookingUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(exports.BOOKING_REPOSITORY)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof booking_repository_interface_1.IBookingRepository !== "undefined" && booking_repository_interface_1.IBookingRepository) === "function" ? _a : Object])
], CreateBookingUseCase);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Booking = void 0;
class Booking {
    constructor(id, clientId, clientName, date, items, status = 'pending', createdAt = new Date()) {
        this.id = id;
        this.clientId = clientId;
        this.clientName = clientName;
        this.date = date;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt;
    }
    get totalPrice() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
    get totalDuration() {
        return this.items.reduce((sum, item) => sum + item.durationMinutes, 0);
    }
    confirm() {
        if (this.status === 'cancelled') {
            throw new Error('Cannot confirm a cancelled booking');
        }
        this.status = 'confirmed';
    }
    complete() {
        if (this.status !== 'confirmed') {
            throw new Error('Booking must be confirmed before completion');
        }
        this.status = 'completed';
    }
    cancel() {
        if (this.status === 'completed') {
            throw new Error('Cannot cancel a completed booking');
        }
        this.status = 'cancelled';
    }
}
exports.Booking = Booking;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetBookingsUseCase = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const booking_repository_interface_1 = __webpack_require__(11);
const create_booking_usecase_1 = __webpack_require__(9);
let GetBookingsUseCase = class GetBookingsUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute() {
        return this.bookingRepository.findAll();
    }
};
exports.GetBookingsUseCase = GetBookingsUseCase;
exports.GetBookingsUseCase = GetBookingsUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(create_booking_usecase_1.BOOKING_REPOSITORY)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof booking_repository_interface_1.IBookingRepository !== "undefined" && booking_repository_interface_1.IBookingRepository) === "function" ? _a : Object])
], GetBookingsUseCase);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingSchema = exports.BookingModel = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
let BookingModel = class BookingModel {
};
exports.BookingModel = BookingModel;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], BookingModel.prototype, "_id", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], BookingModel.prototype, "clientId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], BookingModel.prototype, "clientName", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BookingModel.prototype, "date", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: true }),
    tslib_1.__metadata("design:type", Array)
], BookingModel.prototype, "items", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    }),
    tslib_1.__metadata("design:type", String)
], BookingModel.prototype, "status", void 0);
exports.BookingModel = BookingModel = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: 'bookings', timestamps: true })
], BookingModel);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(BookingModel);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingRepository = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(15);
const booking_entity_1 = __webpack_require__(10);
const booking_schema_1 = __webpack_require__(13);
let BookingRepository = class BookingRepository {
    constructor(bookingModel) {
        this.bookingModel = bookingModel;
    }
    async save(booking) {
        const exists = await this.bookingModel.exists({ _id: booking.id });
        if (exists) {
            await this.bookingModel.updateOne({ _id: booking.id }, booking);
        }
        else {
            await this.bookingModel.create({
                _id: booking.id,
                ...booking,
            });
        }
    }
    async findById(id) {
        const doc = await this.bookingModel.findById(id).exec();
        return doc ? this.toEntity(doc) : null;
    }
    async findAll() {
        const docs = await this.bookingModel.find().exec();
        return docs.map((doc) => this.toEntity(doc));
    }
    async findByDateRange(start, end) {
        const docs = await this.bookingModel
            .find({
            date: { $gte: start, $lte: end },
        })
            .exec();
        return docs.map((doc) => this.toEntity(doc));
    }
    toEntity(doc) {
        return new booking_entity_1.Booking(doc._id, doc.clientId, doc.clientName, doc.date, doc.items, doc.status, doc.createdAt);
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(booking_schema_1.BookingModel.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], BookingRepository);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const inventory_controller_1 = __webpack_require__(17);
const dress_schema_1 = __webpack_require__(21);
const inventory_repository_1 = __webpack_require__(22);
const add_dress_usecase_1 = __webpack_require__(18);
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: dress_schema_1.DressModel.name, schema: dress_schema_1.DressSchema }]),
        ],
        controllers: [inventory_controller_1.InventoryController],
        providers: [
            add_dress_usecase_1.AddDressUseCase,
            {
                provide: add_dress_usecase_1.INVENTORY_REPOSITORY,
                useClass: inventory_repository_1.InventoryRepository,
            },
        ],
        exports: [add_dress_usecase_1.AddDressUseCase],
    })
], InventoryModule);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const add_dress_usecase_1 = __webpack_require__(18);
let InventoryController = class InventoryController {
    constructor(addDressUseCase) {
        this.addDressUseCase = addDressUseCase;
    }
    async add(body) {
        return this.addDressUseCase.execute(body.name, body.category, body.size, body.price, body.imageUrl);
    }
};
exports.InventoryController = InventoryController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InventoryController.prototype, "add", null);
exports.InventoryController = InventoryController = tslib_1.__decorate([
    (0, common_1.Controller)('inventory'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof add_dress_usecase_1.AddDressUseCase !== "undefined" && add_dress_usecase_1.AddDressUseCase) === "function" ? _a : Object])
], InventoryController);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddDressUseCase = exports.INVENTORY_REPOSITORY = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const dress_entity_1 = __webpack_require__(19);
const inventory_repository_interface_1 = __webpack_require__(20);
exports.INVENTORY_REPOSITORY = 'INVENTORY_REPOSITORY';
let AddDressUseCase = class AddDressUseCase {
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }
    async execute(name, category, size, price, imageUrl) {
        const dress = new dress_entity_1.Dress(crypto.randomUUID(), name, category, size, price, 'available', imageUrl);
        await this.inventoryRepository.save(dress);
        return dress;
    }
};
exports.AddDressUseCase = AddDressUseCase;
exports.AddDressUseCase = AddDressUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(exports.INVENTORY_REPOSITORY)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof inventory_repository_interface_1.IInventoryRepository !== "undefined" && inventory_repository_interface_1.IInventoryRepository) === "function" ? _a : Object])
], AddDressUseCase);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dress = void 0;
class Dress {
    constructor(id, name, category, size, price, status = 'available', imageUrl, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.size = size;
        this.price = price;
        this.status = status;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }
    rent() {
        if (this.status !== 'available') {
            throw new Error(`Dress is not available for rent. Current status: ${this.status}`);
        }
        this.status = 'rented';
    }
    returnFromRent() {
        if (this.status !== 'rented') {
            throw new Error('Dress is not currently rented');
        }
        this.status = 'cleaning';
    }
    finishCleaning() {
        if (this.status !== 'cleaning') {
            throw new Error('Dress is not in cleaning');
        }
        this.status = 'available';
    }
    markForMaintenance() {
        this.status = 'maintenance';
    }
}
exports.Dress = Dress;


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DressSchema = exports.DressModel = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
let DressModel = class DressModel {
};
exports.DressModel = DressModel;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], DressModel.prototype, "_id", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], DressModel.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Wedding', 'Evening', 'Traditional'] }),
    tslib_1.__metadata("design:type", String)
], DressModel.prototype, "category", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], DressModel.prototype, "size", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], DressModel.prototype, "price", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['available', 'rented', 'cleaning', 'maintenance'],
    }),
    tslib_1.__metadata("design:type", String)
], DressModel.prototype, "status", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], DressModel.prototype, "imageUrl", void 0);
exports.DressModel = DressModel = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: 'dresses', timestamps: true })
], DressModel);
exports.DressSchema = mongoose_1.SchemaFactory.createForClass(DressModel);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryRepository = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(15);
const dress_entity_1 = __webpack_require__(19);
const dress_schema_1 = __webpack_require__(21);
let InventoryRepository = class InventoryRepository {
    constructor(dressModel) {
        this.dressModel = dressModel;
    }
    async save(dress) {
        const exists = await this.dressModel.exists({ _id: dress.id });
        if (exists) {
            await this.dressModel.updateOne({ _id: dress.id }, dress);
        }
        else {
            await this.dressModel.create({
                _id: dress.id,
                ...dress,
            });
        }
    }
    async findById(id) {
        const doc = await this.dressModel.findById(id).exec();
        return doc ? this.toEntity(doc) : null;
    }
    async findAll() {
        const docs = await this.dressModel.find().exec();
        return docs.map((doc) => this.toEntity(doc));
    }
    async findByCategory(category) {
        const docs = await this.dressModel.find({ category }).exec();
        return docs.map((doc) => this.toEntity(doc));
    }
    async findByStatus(status) {
        const docs = await this.dressModel.find({ status }).exec();
        return docs.map((doc) => this.toEntity(doc));
    }
    toEntity(doc) {
        return new dress_entity_1.Dress(doc._id, doc.name, doc.category, doc.size, doc.price, doc.status, doc.imageUrl, doc.createdAt);
    }
};
exports.InventoryRepository = InventoryRepository;
exports.InventoryRepository = InventoryRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(dress_schema_1.DressModel.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], InventoryRepository);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const port = process.env.PORT || 3000;
    // app.setGlobalPrefix('api');
    // app.enableCors({
    //   // Разрешаем запросы только с твоего фронтенда на GitHub Pages
    //   origin: [
    //     'https://beginwebdev2002.github.io/',
    //     /\.github\.io$/,
    //     'http://localhost:4200' // Твой купленный домен
    //   ],
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //   allowedHeaders: 'Content-Type, Accept, Authorization, x-telegram-init-data',
    //   credentials: true,
    // });
    app.enableCors({
        origin: true, // Разрешает запросы с любого источника (GitHub, Localhost)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: '*', // Принимает любые заголовки, включая Telegram Init Data
        maxAge: 3600,
    });
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map