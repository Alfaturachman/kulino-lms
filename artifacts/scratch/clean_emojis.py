import os

files_to_clean = [
    "README.md",
    "Product Development Life Cycle/01_BRD.md",
    "Product Development Life Cycle/02_PRD.md",
    "Product Development Life Cycle/06_Progress.md"
]

emoji_map = {
    "🛠️": "",
    "🚀": "",
    "📋": "",
    "✅": "✓",
    "🎬": "",
    "📄": "",
    "📦": "",
    "💬": "",
    "👨‍🎓": "",
    "🏷️": "",
    "☎️": "",
    "🎓": "",
    "👨‍🏫": "",
    "🔑": "",
    "🎨": "",
    "🏫": "",
    "🗂️": "",
    "👥": "",
    "✨": "",
    "🏛️": "",
    "⚙️": "",
    "🌐": ""
}

for rel_path in files_to_clean:
    if not os.path.exists(rel_path):
        print(f"File not found: {rel_path}")
        continue
        
    print(f"Cleaning {rel_path}...")
    with open(rel_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    original = content
    for emoji, replacement in emoji_map.items():
        content = content.replace(emoji, replacement)
        
    # Clean up any leftover double spaces from emoji removal, particularly in headers
    lines = []
    for line in content.splitlines():
        # Clean double spaces in headers
        if line.startswith("#"):
            line = " ".join(line.split())
        lines.append(line)
    content = "\n".join(lines) + ("\n" if content.endswith("\n") else "")
    
    if content != original:
        with open(rel_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Successfully cleaned emojis from {rel_path}")
    else:
        print(f"No changes in {rel_path}")
