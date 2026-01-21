import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Define Schema locally to avoid import complexities in standalone script
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, default: 'USER' },
    telegramId: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function runBenchmark() {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);

    // Setup data
    await User.create({
        email: 'test@example.com',
        passwordHash: 'hash',
        role: 'USER'
    });

    const iterations = 5000;

    // Warmup
    for (let i = 0; i < 100; i++) {
        await User.findOne({ email: 'test@example.com' });
        await User.findOne({ email: 'test@example.com' }).lean();
    }

    // Benchmark Baseline
    console.log('Running Baseline (findOne + toObject)...');
    const startBaseline = process.hrtime.bigint();
    for (let i = 0; i < iterations; i++) {
        const doc = await User.findOne({ email: 'test@example.com' });
        if (doc) doc.toObject();
    }
    const endBaseline = process.hrtime.bigint();
    const baselineTime = Number(endBaseline - startBaseline) / 1e6; // ms

    // Benchmark Optimized
    console.log('Running Optimized (findOne + lean)...');
    const startOptimized = process.hrtime.bigint();
    for (let i = 0; i < iterations; i++) {
        await User.findOne({ email: 'test@example.com' }).lean();
    }
    const endOptimized = process.hrtime.bigint();
    const optimizedTime = Number(endOptimized - startOptimized) / 1e6; // ms

    console.log(`\nResults over ${iterations} iterations:`);
    console.log(`Baseline: ${baselineTime.toFixed(2)} ms`);
    console.log(`Optimized: ${optimizedTime.toFixed(2)} ms`);
    console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}%`);

    await mongoose.disconnect();
    await mongod.stop();
}

runBenchmark().catch(err => console.error(err));
