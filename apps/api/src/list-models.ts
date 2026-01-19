
async function listModels() {
    const apiKey = "AIzaSyCcrEj-68uxskej-ZKAskLqCuOfQ38DrN0";

    try {
        console.log('Fetching models with key:', apiKey);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error('Error fetching models:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response:', text);
            return;
        }

        const data = await response.json();
        console.log('Available Models:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
