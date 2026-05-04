import re
import sys

log_path = r"C:\Users\usama\.gemini\antigravity\brain\003b4ad0-0198-43b3-89f5-f026d2112e8c\.system_generated\logs\overview.txt"

files_to_restore = [
    "c:/Users/usama/finai/frontend/src/index.css",
    "c:/Users/usama/finai/frontend/src/components/layout/DashboardLayout.jsx",
    "c:/Users/usama/finai/frontend/src/components/layout/Sidebar.jsx",
    "c:/Users/usama/finai/frontend/src/components/layout/DashboardTopBar.jsx",
    "c:/Users/usama/finai/frontend/src/pages/dashboard/DashboardPage.jsx"
]

with open(log_path, "r", encoding="utf-8") as f:
    log_content = f.read()

for target in files_to_restore:
    # Look for the block
    marker = f"File Path: `file:///{target}`"
    idx = log_content.find(marker)
    if idx == -1:
        print(f"Not found: {target}")
        continue
    
    print(f"Found: {target}")
    # Extract from this point onwards
    sub = log_content[idx:]
    
    # Try line-numbered format first
    start_marker = "The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.\\n"
    start_idx = sub.find(start_marker)
    
    if start_idx != -1:
        start_idx += len(start_marker)
        end_marker1 = "\\nThe above content does NOT show the entire file contents"
        end_marker2 = "\\nThe above content shows the entire, complete file contents"
        
        end_idx1 = sub.find(end_marker1, start_idx)
        end_idx2 = sub.find(end_marker2, start_idx)
        
        end_idx = -1
        if end_idx1 != -1 and end_idx2 != -1:
            end_idx = min(end_idx1, end_idx2)
        elif end_idx1 != -1:
            end_idx = end_idx1
        elif end_idx2 != -1:
            end_idx = end_idx2
            
        if end_idx != -1:
            raw_code = sub[start_idx:end_idx]
            
            # Since it's inside a JSON string, we need to unescape newlines
            # Wait, if log_content is the raw text of overview.txt, the newlines might be actual newlines if it's parsed, or \\n if it's raw JSON.
            # Let's decode unicode escapes and newlines.
            try:
                # To handle literal \n and \" from the JSON representation
                decoded_code = raw_code.encode().decode('unicode_escape')
            except Exception as e:
                decoded_code = raw_code.replace('\\n', '\n').replace('\\"', '"')
                
            # Remove line numbers: "1: "
            lines = decoded_code.split('\n')
            cleaned_lines = []
            for line in lines:
                m = re.match(r'^\d+: (.*)$', line)
                if m:
                    cleaned_lines.append(m.group(1))
                else:
                    # If it doesn't match the line number format, just keep it (maybe an empty line)
                    cleaned_lines.append(line)
            
            with open(target, "w", encoding="utf-8") as out:
                out.write('\n'.join(cleaned_lines))
            print(f"Successfully restored {target}")
        else:
            print(f"Could not find end marker for {target}")
    else:
        print(f"Could not find start marker for {target}")

