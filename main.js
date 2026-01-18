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
const app_controller_1 = __webpack_require__(6);
const app_service_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(8);
const auth_module_1 = __webpack_require__(9);
const booking_module_1 = __webpack_require__(20);
const telegram_module_1 = __webpack_require__(25);
const users_module_1 = __webpack_require__(16);
const treatments_module_1 = __webpack_require__(29);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => ({
                    uri: process.env.MONGODB_URI_ONLINE,
                    connectTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                    family: 4,
                }),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `${process.cwd()}/.env`,
            }),
            auth_module_1.AuthModule,
            booking_module_1.BookingModule,
            telegram_module_1.TelegramModule,
            users_module_1.UsersModule,
            treatments_module_1.TreatmentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(7);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return 'Hello World!';
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(''),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(10);
const auth_controller_1 = __webpack_require__(15);
const users_module_1 = __webpack_require__(16);
const passport_1 = __webpack_require__(17);
const jwt_1 = __webpack_require__(11);
const jwt_strategy_1 = __webpack_require__(18);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'SECRET_KEY', // Use env var
                signOptions: { expiresIn: '60m' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(11);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(13);
const bcrypt = tslib_1.__importStar(__webpack_require__(14));
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.userModel.findOne({ email }).lean();
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(email, pass) {
        const passwordHash = await bcrypt.hash(pass, 10);
        const createdUser = new this.userModel({ email, passwordHash });
        return createdUser.save();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = exports.UserRole = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
};
exports.User = User;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: UserRole, default: UserRole.USER }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "role", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "telegramId", void 0);
exports.User = User = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(10);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        // In a real app, use LocalAuthGuard to validate first
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }
    async register(body) {
        return this.authService.register(body.email, body.password);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const user_schema_1 = __webpack_require__(13);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        controllers: [],
        providers: [],
        exports: [mongoose_1.MongooseModule],
    })
], UsersModule);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const passport_jwt_1 = __webpack_require__(19);
const passport_1 = __webpack_require__(17);
const common_1 = __webpack_require__(1);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET_KEY', // Use env var in production
        });
    }
    async validate(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const venue_schema_1 = __webpack_require__(21);
const appointment_schema_1 = __webpack_require__(22);
const booking_service_1 = __webpack_require__(23);
const booking_controller_1 = __webpack_require__(24);
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: venue_schema_1.Venue.name, schema: venue_schema_1.VenueSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
            ]),
        ],
        controllers: [booking_controller_1.BookingController],
        providers: [booking_service_1.BookingService],
    })
], BookingModule);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VenueSchema = exports.Venue = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
let Venue = class Venue {
};
exports.Venue = Venue;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Venue.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Venue.prototype, "address", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Venue.prototype, "images", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], Venue.prototype, "capacity", void 0);
exports.Venue = Venue = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Venue);
exports.VenueSchema = mongoose_1.SchemaFactory.createForClass(Venue);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentSchema = exports.Appointment = exports.AppointmentStatus = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(13);
const venue_schema_1 = __webpack_require__(21);
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["PENDING"] = "PENDING";
    AppointmentStatus["CONFIRMED"] = "CONFIRMED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
let Appointment = class Appointment {
};
exports.Appointment = Appointment;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof user_schema_1.User !== "undefined" && user_schema_1.User) === "function" ? _a : Object)
], Appointment.prototype, "user", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Venue', required: true }),
    tslib_1.__metadata("design:type", typeof (_b = typeof venue_schema_1.Venue !== "undefined" && venue_schema_1.Venue) === "function" ? _b : Object)
], Appointment.prototype, "venue", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Appointment.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Appointment.prototype, "endTime", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: AppointmentStatus, default: AppointmentStatus.PENDING }),
    tslib_1.__metadata("design:type", String)
], Appointment.prototype, "status", void 0);
exports.Appointment = Appointment = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Appointment);
exports.AppointmentSchema = mongoose_1.SchemaFactory.createForClass(Appointment);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const venue_schema_1 = __webpack_require__(21);
const appointment_schema_1 = __webpack_require__(22);
let BookingService = class BookingService {
    constructor(venueModel, appointmentModel) {
        this.venueModel = venueModel;
        this.appointmentModel = appointmentModel;
    }
    async createVenue(createVenueDto) {
        const createdVenue = new this.venueModel(createVenueDto);
        return createdVenue.save();
    }
    async findAllVenues(page = 1, limit = 10) {
        const MAX_LIMIT = 100;
        if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }
        const skip = (page - 1) * limit;
        return this.venueModel.find().skip(skip).limit(limit).exec();
    }
    async createAppointment(createAppointmentDto) {
        const createdAppointment = new this.appointmentModel(createAppointmentDto);
        return createdAppointment.save();
    }
    async findAllAppointments() {
        return this.appointmentModel.find().populate('user', 'email role').populate('venue', 'name address').exec();
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(venue_schema_1.Venue.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], BookingService);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const booking_service_1 = __webpack_require__(23);
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    // @UseGuards(AuthGuard('jwt')) // Uncomment to protect
    createVenue(createVenueDto) {
        return this.bookingService.createVenue(createVenueDto);
    }
    findAllVenues(page, limit) {
        return this.bookingService.findAllVenues(page, limit);
    }
    // @UseGuards(AuthGuard('jwt'))
    createAppointment(createAppointmentDto) {
        return this.bookingService.createAppointment(createAppointmentDto);
    }
    findAllAppointments() {
        return this.bookingService.findAllAppointments();
    }
};
exports.BookingController = BookingController;
tslib_1.__decorate([
    (0, common_1.Post)('venues')
    // @UseGuards(AuthGuard('jwt')) // Uncomment to protect
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "createVenue", null);
tslib_1.__decorate([
    (0, common_1.Get)('venues'),
    tslib_1.__param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "findAllVenues", null);
tslib_1.__decorate([
    (0, common_1.Post)('appointments')
    // @UseGuards(AuthGuard('jwt'))
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "createAppointment", null);
tslib_1.__decorate([
    (0, common_1.Get)('appointments'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "findAllAppointments", null);
exports.BookingController = BookingController = tslib_1.__decorate([
    (0, common_1.Controller)('booking'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof booking_service_1.BookingService !== "undefined" && booking_service_1.BookingService) === "function" ? _a : Object])
], BookingController);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const nestjs_telegraf_1 = __webpack_require__(26);
const telegram_service_1 = __webpack_require__(27);
const config_1 = __webpack_require__(5);
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                // 1. Указываем, какие сервисы нужно внедрить (инжектировать)
                inject: [config_1.ConfigService],
                // 2. Используем фабрику для создания конфигурации
                useFactory: (config) => ({
                    token: config.get('TELEGRAM_TOKEN'),
                }),
            }),
        ],
        controllers: [],
        providers: [telegram_service_1.TelegramService],
    })
], TelegramModule);


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("nestjs-telegraf");

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const telegraf_1 = __webpack_require__(28);
const nestjs_telegraf_1 = __webpack_require__(26);
let TelegramService = class TelegramService {
    constructor(bot) {
        this.bot = bot;
    }
    async start(ctx) {
        await ctx.reply('Welcome');
    }
};
exports.TelegramService = TelegramService;
tslib_1.__decorate([
    (0, nestjs_telegraf_1.Start)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof telegraf_1.Context !== "undefined" && telegraf_1.Context) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TelegramService.prototype, "start", null);
exports.TelegramService = TelegramService = tslib_1.__decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, nestjs_telegraf_1.InjectBot)()),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof telegraf_1.Telegraf !== "undefined" && telegraf_1.Telegraf) === "function" ? _a : Object])
], TelegramService);


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("telegraf");

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const treatments_controller_1 = __webpack_require__(30);
const treatments_service_1 = __webpack_require__(31);
const treatment_schema_1 = __webpack_require__(32);
let TreatmentsModule = class TreatmentsModule {
};
exports.TreatmentsModule = TreatmentsModule;
exports.TreatmentsModule = TreatmentsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: treatment_schema_1.Treatment.name, schema: treatment_schema_1.TreatmentSchema }]),
        ],
        controllers: [treatments_controller_1.TreatmentsController],
        providers: [treatments_service_1.TreatmentsService],
    })
], TreatmentsModule);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const treatments_service_1 = __webpack_require__(31);
let TreatmentsController = class TreatmentsController {
    constructor(treatmentsService) {
        this.treatmentsService = treatmentsService;
    }
    async findAll() {
        return this.treatmentsService.findAll();
    }
    getFaq() {
        return this.treatmentsService.getFaq();
    }
    async seed() {
        await this.treatmentsService.seed();
        return { message: 'Seeded successfully' };
    }
};
exports.TreatmentsController = TreatmentsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('faq'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], TreatmentsController.prototype, "getFaq", null);
tslib_1.__decorate([
    (0, common_1.Post)('seed'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TreatmentsController.prototype, "seed", null);
exports.TreatmentsController = TreatmentsController = tslib_1.__decorate([
    (0, common_1.Controller)('treatments'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof treatments_service_1.TreatmentsService !== "undefined" && treatments_service_1.TreatmentsService) === "function" ? _a : Object])
], TreatmentsController);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const treatment_schema_1 = __webpack_require__(32);
let TreatmentsService = class TreatmentsService {
    constructor(treatmentModel) {
        this.treatmentModel = treatmentModel;
    }
    async findAll() {
        return this.treatmentModel.find().exec();
    }
    async create(createTreatmentDto) {
        const createdTreatment = new this.treatmentModel(createTreatmentDto);
        return createdTreatment.save();
    }
    getFaq() {
        return [
            {
                question: 'Does diode laser hurt?',
                answer: 'Most patients describe the sensation as a light snap of a rubber band. It is generally well-tolerated.',
            },
            {
                question: 'How should I prep for my appointment?',
                answer: 'Shave the area 24 hours before. Avoid sun exposure for 2 weeks prior.',
            },
        ];
    }
    async seed() {
        const count = await this.treatmentModel.countDocuments();
        if (count === 0) {
            const treatments = [
                { name: 'Full Face Laser', category: 'Laser', price: 250, description: 'Complete face hair removal' },
                { name: 'Underarms Laser', category: 'Laser', price: 100, description: 'Underarm hair removal' },
                { name: 'Botox Forehead', category: 'Botox', price: 1200, description: 'Smooth out forehead lines' },
                { name: 'HydraFacial', category: 'Facials', price: 400, description: 'Deep cleansing and hydration' },
            ];
            await this.treatmentModel.insertMany(treatments);
        }
    }
};
exports.TreatmentsService = TreatmentsService;
exports.TreatmentsService = TreatmentsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(treatment_schema_1.Treatment.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], TreatmentsService);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentSchema = exports.Treatment = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
let Treatment = class Treatment {
};
exports.Treatment = Treatment;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Treatment.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Treatment.prototype, "category", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], Treatment.prototype, "price", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Treatment.prototype, "description", void 0);
exports.Treatment = Treatment = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Treatment);
exports.TreatmentSchema = mongoose_1.SchemaFactory.createForClass(Treatment);


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
    const port = process.env.PORT || 3000;
    app.enableCors({
        // Разрешаем запросы только с твоего фронтенда на GitHub Pages
        origin: [
            'https://beginwebdev2002.github.io/',
            'http://localhost:4200' // Твой купленный домен
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map