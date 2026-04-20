from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import traceback

app = Flask(__name__)
CORS(app)

print("🔧 JobGuard API - Production Pipeline")

# Load the single production pipeline
try:
    pipeline = joblib.load("fraud_detector_production.pkl")
    print("✅ Production pipeline loaded successfully!")
    print("   Contains: Preprocessor + Logistic Regression model")
except Exception as e:
    print(f"❌ Failed to load fraud_detector_production.pkl: {e}")
    pipeline = None

def prepare_input(data):
    """
    Prepare input data in the exact format expected by the pipeline.
    The pipeline handles all preprocessing internally.
    """
    # Create text field (title + description combined)
    title = data.get("title", "")
    description = data.get("description", "")
    text = f"{title} {description}".strip().lower()
    
    # Build input dictionary with all expected fields
    input_dict = {
        'title': title,
        'description': description,
        'text': text,  # REQUIRED: Combined text field
        'telecommuting': data.get("telecommuting", "unknown"),
        'has_company_logo': data.get("has_company_logo", "unknown"),
        'has_questions': data.get("has_questions", "unknown"),
        'employment_type': data.get("employment_type", "unknown"),
        'required_experience': data.get("required_experience", "unknown"),
        'required_education': data.get("required_education", "unknown"),
        'industry': data.get("industry", "unknown"),
        'function': data.get("function", "unknown")
    }
    
    # Convert to DataFrame (pipeline expects DataFrame input)
    df = pd.DataFrame([input_dict])
    
    return df

@app.route("/", methods=["GET"])
def health():
    status = "🚨 JobGuard LIVE ✅" if pipeline else "❌ Pipeline not loaded"
    return jsonify({
        "status": status,
        "model": "Logistic Regression (Production)",
        "version": "1.0"
    })

@app.route("/predict", methods=["POST"])
def predict():
    if not pipeline:
        return jsonify({"error": "Pipeline not loaded"}), 500
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get("title") and not data.get("description"):
            return jsonify({
                "error": "Either 'title' or 'description' is required"
            }), 400
        
        # Prepare input data
        input_df = prepare_input(data)
        
        # Make prediction using the complete pipeline
        prediction = pipeline.predict(input_df)[0]
        probabilities = pipeline.predict_proba(input_df)[0]
        fraud_probability = probabilities[1]
        
        # Determine confidence level
        if fraud_probability >= 0.8 or fraud_probability <= 0.2:
            confidence_level = "High"
        elif fraud_probability >= 0.6 or fraud_probability <= 0.4:
            confidence_level = "Medium"
        else:
            confidence_level = "Low"
        
        # Build response
        result = {
            "prediction": int(prediction),
            "is_fraud": bool(prediction),
            "fraud_probability": round(float(fraud_probability), 4),
            "confidence": confidence_level,
            "confidence_score": round(float(max(probabilities)) * 100, 1),
            "message": "🚨 FRAUD JOB OFFER" if prediction == 1 else "✅ JOB OFFER VALIDE"
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        print(traceback.format_exc())
        return jsonify({
            "error": str(e),
            "details": "Check server logs for full traceback"
        }), 500

@app.route("/model-info", methods=["GET"])
def model_info():
    """Get information about the loaded model"""
    if not pipeline:
        return jsonify({"error": "Pipeline not loaded"}), 500
    
    try:
        # Extract model info
        info = {
            "model_type": "Logistic Regression",
            "pipeline_steps": [
                "Text Preprocessing (TF-IDF)",
                "Categorical Encoding (One-Hot)",
                "Logistic Regression Classifier"
            ],
            "features": {
                "text": "title + description (TF-IDF vectorized)",
                "categorical": [
                    "telecommuting",
                    "has_company_logo",
                    "has_questions",
                    "employment_type",
                    "required_experience",
                    "required_education"
                ]
            },
            "performance": {
                "accuracy": "~95%",
                "fraud_detection_rate": "~80%"
            }
        }
        return jsonify(info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
