
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'service-account.json');

try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);

    // Verify it looks like a key
    if (!json.private_key || !json.private_key.includes('BEGIN PRIVATE KEY')) {
        console.error('ERROR: Invalid service-account.json structure');
        process.exit(1);
    }

    // Minify
    const minified = JSON.stringify(json);

    // Write to file
    const outputDetails = path.join(process.cwd(), 'vercel-env-value.txt');
    fs.writeFileSync(outputDetails, minified, 'utf8');

    console.log(`\nSuccessfully wrote minified key to: ${outputDetails}`);
    console.log('Please copy content of this file to Vercel.');

} catch (e: any) {
    console.error('Error reading service-account.json:', e.message);
}
