import json
import re
import os

log_path = r"C:\Users\usama\.gemini\antigravity\brain\003b4ad0-0198-43b3-89f5-f026d2112e8c\.system_generated\logs\overview.txt"

files_to_extract = {
    "c:/Users/usama/finai/frontend/src/index.css": None,
    "c:/Users/usama/finai/frontend/src/components/layout/DashboardLayout.jsx": None,
    "c:/Users/usama/finai/frontend/src/components/layout/Sidebar.jsx": None,
    "c:/Users/usama/finai/frontend/src/pages/dashboard/DashboardPage.jsx": None
}

def clean_code(text):
    # Remove line numbers: "1: "
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        m = re.match(r'^\d+: (.*)$', line)
        if m:
            cleaned.append(m.group(1))
        else:
            cleaned.append(line)
    return '\n'.join(cleaned)

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('source') == 'TOOL' and data.get('name') == 'view_file':
                content = data.get('content', '')
                # Extract file path from content
                m = re.search(r'File Path: `file:///(.*?)`', content)
                if m:
                    path = m.group(1).lower().replace('\\', '/')
                    for target in files_to_extract:
                        if path == target.lower() and files_to_extract[target] is None:
                            # Extract the code block
                            # The log format for view_file content usually has the preamble about line numbers
                            start_marker = "The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.\n"
                            if start_marker in content:
                                start_idx = content.find(start_marker) + len(start_marker)
                                end_marker = "\nThe above content shows the entire, complete file contents"
                                end_idx = content.find(end_marker)
                                if end_idx == -1:
                                    end_marker = "\nThe above content does NOT show the entire file contents"
                                    end_idx = content.find(end_marker)
                                
                                if end_idx != -1:
                                    raw_code = content[start_idx:end_idx]
                                    files_to_extract[target] = clean_code(raw_code)
                                    print(f"Extracted initial version of {target}")
            
            # Also check replace_file_content TargetContent for the first edit
            if data.get('source') == 'MODEL' and 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc['name'] == 'replace_file_content':
                        args = tc['args']
                        target = args.get('TargetFile', '').strip('"').lower().replace('\\', '/')
                        for t in files_to_extract:
                            if target == t.lower() and files_to_extract[t] is None:
                                if 'TargetContent' in args:
                                    # TargetContent in the log is a JSON-escaped string
                                    # But since we are already in json.loads(line), tc['args']['TargetContent'] is the unescaped string!
                                    files_to_extract[t] = args['TargetContent'].strip('"')
                                    print(f"Extracted initial version of {t} from replace_file_content")
        except:
            continue

for path, content in files_to_extract.items():
    if content:
        # Fix the path if it's absolute but has double slashes or something
        real_path = path
        os.makedirs(os.path.dirname(real_path), exist_ok=True)
        with open(real_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Restored {real_path}")
    else:
        print(f"Failed to find initial version for {path}")
