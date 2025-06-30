import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
});

redis.on('connect', () => {
    console.log('Conectado ao Redis');
});

redis.on('error', (err) => {
    console.error('Erro ao conectar ao Redis:', err);
});

export default redis;