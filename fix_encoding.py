import os

files = [
    "c:/Users/usama/finai/frontend/src/pages/dashboard/DashboardPage.jsx",
    "c:/Users/usama/finai/frontend/src/index.css",
    "c:/Users/usama/finai/frontend/src/components/layout/Sidebar.jsx",
    "c:/Users/usama/finai/frontend/src/components/layout/DashboardLayout.jsx"
]

for fpath in files:
    if not os.path.exists(fpath):
        print(f"Skipping {fpath}, not found.")
        continue
    
    # Try reading as UTF-16LE, then UTF-8, then latin-1
    content = None
    for enc in ['utf-16le', 'utf-8', 'latin-1']:
        try:
            with open(fpath, 'r', encoding=enc) as f:
                content = f.read()
            print(f"Read {fpath} with {enc}")
            break
        except:
            continue
    
    if content:
        # Write as UTF-8 without BOM
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Saved {fpath} as UTF-8")
    else:
        print(f"Failed to read {fpath}")
