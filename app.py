import os
from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types

app = Flask(__name__)

# 🔑 Yahan apni 2 ya 3 alag alag API keys dalein
API_KEYS = [
    "AIzaSyCsSERs6si8ubtxxqSy1L9j8tVVKIZ-aeA",   # Key 1 (Primary)
    "AIzaSyC9iI2UboNEQuGCaAt98u4AFGITsh0ym8A",  # Key 2 (Backup 1)
    "AIzaSyAYirVNL3K50mPB8yGFidjUkFynZvDhrVw"    # Key 3 (Backup 2)
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # 🔄 Configuration: Restriction hata di aur max_output_tokens 1000 kar diye taaki detailed jawab aaye
    config = types.GenerateContentConfig(
        system_instruction="You are an advanced, helpful, and knowledgeable website assistant. Provide complete, comprehensive, and detailed explanations to the user's questions.",
        max_output_tokens=1000
    )

    # Har request par saari keys ko baari baari try karne ka loop
    for index, key in enumerate(API_KEYS):
        if not key or "YOUR_" in key:
            continue
            
        try:
            print(f"--> Trying API Key {index + 1}...")
            client = genai.Client(api_key=key)
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=user_message,
                config=config
            )
            
            if response.text:
                bot_reply = response.text.strip()
                print(f"✅ Success with API Key {index + 1}!")
                return jsonify({"reply": bot_reply})
                
        except Exception as e:
            print(f"❌ API Key {index + 1} Failed! Error: {str(e)}")
            continue

    return jsonify({"reply": "System temporary busy, please try again in a moment."}), 200

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)