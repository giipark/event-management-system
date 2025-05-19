print('📦 Initiating MongoDB Replica Set..');

try {
    const config = {
        _id: 'rs0',
        members: [
            {
                _id: 0,
                host: 'localhost:27017',
            },
        ],
    };

    rs.initiate(config);
    print('✅ Replica Set initialized successfully');
} catch (e) {
    print('⚠️ Replica Set already initialized or failed:', e);
}