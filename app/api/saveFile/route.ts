import fs from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

// API route handler
export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const { fileName, code } = await req.json();

        // Define the directory and file path
        const componentsDir = path.join(process.cwd(), 'components');
        const filePath = path.join(componentsDir, fileName);

        // Ensure the directory exists
        if (!fs.existsSync(componentsDir)) {
            fs.mkdirSync(componentsDir, { recursive: true });
        }

        // Write the file
        fs.writeFileSync(filePath, code);

        // Return success response
        return new Response(
            JSON.stringify({ message: `File saved at ${filePath}` }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error:', error);

        // Return error response
        return new Response(
            JSON.stringify({ message: 'Error writing file', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
