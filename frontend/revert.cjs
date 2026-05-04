const fs = require('fs');
const readline = require('readline');

async function processLog() {
    const logPath = 'C:/Users/usama/.gemini/antigravity/brain/003b4ad0-0198-43b3-89f5-f026d2112e8c/.system_generated/logs/overview.txt';
    const fileStream = fs.createReadStream(logPath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const targetFiles = [
        "c:/Users/usama/finai/frontend/src/index.css",
        "c:/Users/usama/finai/frontend/src/components/layout/DashboardLayout.jsx",
        "c:/Users/usama/finai/frontend/src/components/layout/Sidebar.jsx",
        "c:/Users/usama/finai/frontend/src/components/layout/DashboardTopBar.jsx",
        "c:/Users/usama/finai/frontend/src/pages/dashboard/DashboardPage.jsx"
    ];

    const recovered = new Set();

    for await (const line of rl) {
        if (!line.trim()) continue;
        try {
            const data = JSON.parse(line);
            if (data.source === 'TOOL' && data.name === 'view_file' && data.content) {
                for (const target of targetFiles) {
                    if (!recovered.has(target) && data.content.includes(`File Path: \`file:///${target}\``)) {
                        console.log(`Found content for ${target}`);
                        const match = data.content.match(/The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>\. Please note that any changes targeting the original code should remove the line number, colon, and leading space\.\n([\s\S]+?)\n(?:The above content does NOT show the entire file contents|The above content shows the entire, complete file contents of the requested file)/);
                        if (match) {
                            let text = match[1];
                            // Remove line numbers: "1: "
                            text = text.replace(/^\d+: /gm, '');
                            fs.writeFileSync(target, text);
                            recovered.add(target);
                            console.log(`Successfully restored ${target}`);
                        } else {
                            console.log(`Regex did not match for ${target}`);
                        }
                    }
                }
            }
        } catch (e) {
            // Ignore non-json or parsing errors
        }
    }
    console.log("Done");
}

processLog();
