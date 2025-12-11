import 'dotenv/config';
import { db } from './index';
import { appUsers } from './schema';

// Turkish first names
const firstNames = [
    'Ahmet', 'Mehmet', 'Ali', 'Mustafa', 'Hasan',
    'Hüseyin', 'İbrahim', 'Yusuf', 'Emre', 'Burak',
    'Ayşe', 'Fatma', 'Zeynep', 'Elif', 'Merve',
    'Esra', 'Selin', 'Deniz', 'Ceren', 'Gizem'
];

// Turkish last names
const lastNames = [
    'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin',
    'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan',
    'Kılıç', 'Aslan', 'Koç', 'Kurt', 'Özkan'
];

const roles = ['Admin', 'User', 'Editor'];
const statuses = ['Aktif', 'Pasif'];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(firstName: string, lastName: string, index: number): string {
    const normalized = (str: string) =>
        str.toLowerCase()
            .replace(/ı/g, 'i')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/İ/g, 'i');

    return `${normalized(firstName)}.${normalized(lastName)}${index}@example.com`;
}

async function seed() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await db.delete(appUsers);
    console.log('✓ Cleared existing app_users data');

    // Generate 20 random users
    const users = [];
    for (let i = 1; i <= 1000; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        users.push({
            name: `${firstName} ${lastName}`,
            email: generateEmail(firstName, lastName, i),
            role: getRandomElement(roles),
            status: i <= 16 ? getRandomElement(statuses) : 'Aktif', // Most users are active
        });
    }

    // Insert users
    await db.insert(appUsers).values(users);
    console.log(`✓ Inserted ${users.length} users`);

    // Display inserted users
    const insertedUsers = await db.select().from(appUsers);
    console.log('\n📋 Inserted users:');
    console.table(insertedUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status
    })));

    console.log('\n✅ Seeding complete!');
    process.exit(0);
}

seed().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
