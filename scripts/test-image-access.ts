
async function testImageUrl(url: string) {
    console.log(`Testing URL: ${url}`);
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Content-Type: ${response.headers.get('content-type')}`);

        if (!response.ok) {
            const bodyText = await (await fetch(url)).text();
            console.log(`Error Body: ${bodyText.substring(0, 200)}`);
        }
    } catch (error: any) {
        console.error(`Fetch Error: ${error.message}`);
    }
}

const targetUrl = "https://zowlqqtsqyobkpjssrzo.supabase.co/storage/v1/object/public/inventory/417a0w1hz44-1770469438139.jpg";
testImageUrl(targetUrl);
