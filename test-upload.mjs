import fs from 'node:fs';
import path from 'node:path';

async function testUpload() {
    const filePath = path.join(process.cwd(), 'README.md');
    const fileContent = fs.readFileSync(filePath);
    
    // We need to simulate a login first to get a session cookie
    // But since this is a script, we can't easily do that without a fetch wrapper and cookie jar.
    // However, I can check if the server is running and if the folder is writable.
    
    const uploadDir = path.join(process.cwd(), 'uploads');
    try {
        fs.accessSync(uploadDir, fs.constants.W_OK);
        console.log('✓ Upload directory is writable');
    } catch (err) {
        console.error('✗ Upload directory is NOT writable:', err);
    }
}

testUpload();
