const fs = require('fs');
const readline = require('readline');

async function run() {
    const rl = readline.createInterface({ input: fs.createReadStream('C:/Users/usama/.gemini/antigravity/brain/003b4ad0-0198-43b3-89f5-f026d2112e8c/.system_generated/logs/overview.txt') });
    let isTarget = false;
    let content = '';
    for await (const line of rl) {
        if (line.includes('File Path: `file:///c:/Users/usama/finai/frontend/src/components/layout/DashboardTopBar.jsx`')) {
            isTarget = true;
        }
        if (isTarget) {
            content += line + '\n';
            if (line.includes('The above content shows the entire, complete file contents')) {
                break;
            }
        }
    }
    const match = content.match(/<original_line>\. Please note that any changes targeting the original code should remove the line number, colon, and leading space\.\n([\s\S]+?)The above content shows the entire/);
    if (match) {
        let text = match[1].replace(/^\d+: /gm, '');
        fs.writeFileSync('c:/Users/usama/finai/frontend/src/components/layout/DashboardTopBar.jsx', text);
        console.log('Restored DashboardTopBar.jsx');
    } else {
        console.log('Match failed');
    }
}
run();
