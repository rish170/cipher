import os
import json
import urllib.request
import urllib.error

# Parse .env manually so we don't need to pip install python-dotenv
api_key = None
try:
    with open('backend/.env', 'r') as f:
        for line in f:
            if line.startswith('GEMINI_API_KEY_DEFAULT='):
                api_key = line.strip().split('=', 1)[1]
                break
except Exception as e:
    print("Could not read backend/.env:", e)

if not api_key:
    print("API key not found in backend/.env")
    exit(1)

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("Available Models supporting generateContent:")
        for m in data.get("models", []):
            if "generateContent" in m.get("supportedGenerationMethods", []):
                # The API returns 'models/gemini-pro', we want just 'gemini-pro'
                name = m.get("name").replace("models/", "")
                print(f"- {name}")
except urllib.error.URLError as e:
    print("Error:", e.reason)
    if hasattr(e, 'read'):
        print(e.read().decode())
