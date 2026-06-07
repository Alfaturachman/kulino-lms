import os
import re

emoji_pattern = re.compile(
    "["
    "\U0001f600-\U0001f64f|"  # emoticons
    "\U0001f300-\U0001f5ff|"  # symbols & pictographs
    "\U0001f680-\U0001f6ff|"  # transport & map symbols
    "\U0001f1e0-\U0001f1ff|"  # flags
    "\U00002702-\U000027b0|"  # dingbats
    "\U000024c2-\U0001f251|"
    "\U0001f900-\U0001f9ff|"  # supplemental symbols
    "\U0001fa70-\U0001faff|"  # symbols and pictographs extended
    "\U00002600-\U000026ff|"  # misc symbols
    "\U00002300-\U000023ff"   # misc technical
    "]",
    re.UNICODE
)

exclude_dirs = {"node_modules", ".next", ".git", ".gemini", "artifacts"}

results = []

for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    
    for file in files:
        if file.endswith((".md", ".ts", ".tsx", ".css")):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for i, line in enumerate(f, 1):
                        if emoji_pattern.search(line):
                            results.append((file_path, i, line.strip()))
            except Exception as e:
                pass

output_path = "artifacts/scratch/emoji_results.txt"
with open(output_path, "w", encoding="utf-8") as out:
    out.write(f"Found {len(results)} occurrences:\n")
    for r in results:
        out.write(f"{r[0]}:{r[1]}: {r[2]}\n")

print(f"Success! Results written to {output_path}")
