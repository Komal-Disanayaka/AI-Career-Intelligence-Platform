"""
=============================================================================
Job Recommendation Model Training Script
=============================================================================
මෙම Script එක:
1. Job Dataset එක Load කර Preprocess කරයි
2. TF-IDF Vectorization භාවිතා කර text features extract කරයි
3. Models 3ක් (Random Forest, Gradient Boosting, Logistic Regression) compare කරයි
4. හොඳම model එක auto-select කර .pkl files ලෙස save කරයි
=============================================================================
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

import pandas as pd
import numpy as np
import os
import pickle
import warnings
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from scipy.sparse import hstack, csr_matrix

warnings.filterwarnings('ignore')

# =============================================================================
# Configuration
# =============================================================================
DATASET_PATH = os.path.join(os.path.dirname(__file__), "Job Datsset.csv")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "models")
TEST_SIZE = 0.2
RANDOM_STATE = 42

def create_output_dir():
    """Output directory එක නැත්නම් සාදයි"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"[INFO] Output directory: {OUTPUT_DIR}")

# =============================================================================
# Step 1: Data Loading
# =============================================================================
def load_data():
    """Dataset එක load කරයි"""
    print("\n" + "="*60)
    print(" STEP 1: DATA LOADING")
    print("="*60)
    
    df = pd.read_csv(DATASET_PATH)
    print(f"[INFO] Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"[INFO] Columns: {df.columns.tolist()}")
    print(f"\n[INFO] Target distribution:")
    print(f"  - Not Recommended (0): {(df['Recommended'] == 0).sum()}")
    print(f"  - Recommended (1):     {(df['Recommended'] == 1).sum()}")
    return df

# =============================================================================
# Step 2: Data Preprocessing
# =============================================================================
def preprocess_data(df):
    """Data preprocessing සිදු කරයි"""
    print("\n" + "="*60)
    print(" STEP 2: DATA PREPROCESSING")
    print("="*60)
    
    # --- 2.1: Missing values check ---
    missing = df.isnull().sum()
    if missing.sum() > 0:
        print(f"[WARNING] Missing values found:\n{missing[missing > 0]}")
        df = df.dropna()
        print(f"[INFO] Rows after dropping missing: {df.shape[0]}")
    else:
        print("[INFO] No missing values found ✓")
    
    # --- 2.2: Duplicate check ---
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        print(f"[WARNING] {duplicates} duplicate rows found - removing...")
        df = df.drop_duplicates()
        print(f"[INFO] Rows after removing duplicates: {df.shape[0]}")
    else:
        print("[INFO] No duplicate rows found ✓")
    
    # --- 2.3: Text cleaning ---
    print("[INFO] Cleaning text columns...")
    df['User_Skills'] = df['User_Skills'].str.lower().str.strip()
    df['Job_Requirements'] = df['Job_Requirements'].str.lower().str.strip()
    
    # --- 2.4: Feature & Target separation ---
    X_text_user = df['User_Skills']
    X_text_job = df['Job_Requirements']
    X_match_score = df[['Match_Score']]
    y = df['Recommended']
    
    print(f"[INFO] Preprocessing complete ✓")
    print(f"[INFO] Features: User_Skills (text), Job_Requirements (text), Match_Score (numeric)")
    print(f"[INFO] Target: Recommended (binary)")
    
    return X_text_user, X_text_job, X_match_score, y

# =============================================================================
# Step 3: Feature Engineering (TF-IDF + Scaling)
# =============================================================================
def engineer_features(X_text_user, X_text_job, X_match_score, y):
    """TF-IDF vectorization සහ feature combination"""
    print("\n" + "="*60)
    print(" STEP 3: FEATURE ENGINEERING")
    print("="*60)
    
    # --- 3.1: TF-IDF for User Skills ---
    print("[INFO] TF-IDF Vectorizing User_Skills...")
    tfidf_user = TfidfVectorizer(max_features=500, ngram_range=(1, 2))
    X_user_tfidf = tfidf_user.fit_transform(X_text_user)
    print(f"  → Shape: {X_user_tfidf.shape}")
    
    # --- 3.2: TF-IDF for Job Requirements ---
    print("[INFO] TF-IDF Vectorizing Job_Requirements...")
    tfidf_job = TfidfVectorizer(max_features=500, ngram_range=(1, 2))
    X_job_tfidf = tfidf_job.fit_transform(X_text_job)
    print(f"  → Shape: {X_job_tfidf.shape}")
    
    # --- 3.3: Scale Match_Score ---
    print("[INFO] Scaling Match_Score...")
    scaler = MinMaxScaler()
    X_match_scaled = scaler.fit_transform(X_match_score)
    X_match_sparse = csr_matrix(X_match_scaled)
    
    # --- 3.4: Combine all features ---
    print("[INFO] Combining all features (horizontal stack)...")
    X_combined = hstack([X_user_tfidf, X_job_tfidf, X_match_sparse])
    print(f"  → Final feature matrix shape: {X_combined.shape}")
    
    # --- 3.5: Train/Test Split ---
    print(f"\n[INFO] Train/Test Split ({int((1-TEST_SIZE)*100)}/{int(TEST_SIZE*100)}, stratified)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X_combined, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    print(f"  → Train: {X_train.shape[0]} samples")
    print(f"  → Test:  {X_test.shape[0]} samples")
    
    return X_train, X_test, y_train, y_test, tfidf_user, tfidf_job, scaler

# =============================================================================
# Step 4: Model Training & Comparison
# =============================================================================
def train_and_compare(X_train, X_test, y_train, y_test):
    """Models 3ක් train කර compare කරයි"""
    print("\n" + "="*60)
    print(" STEP 4: MODEL TRAINING & COMPARISON")
    print("="*60)
    
    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=200, max_depth=20, random_state=RANDOM_STATE, n_jobs=-1
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=150, max_depth=5, learning_rate=0.1, random_state=RANDOM_STATE
        ),
        "Logistic Regression": LogisticRegression(
            max_iter=1000, random_state=RANDOM_STATE, n_jobs=-1
        )
    }
    
    results = {}
    trained_models = {}
    
    for name, model in models.items():
        print(f"\n[TRAINING] {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        
        results[name] = {"Accuracy": acc, "Precision": prec, "Recall": rec, "F1-Score": f1}
        trained_models[name] = model
        
        print(f"  → Accuracy:  {acc:.4f}")
        print(f"  → Precision: {prec:.4f}")
        print(f"  → Recall:    {rec:.4f}")
        print(f"  → F1-Score:  {f1:.4f}")
    
    # --- Comparison Table ---
    print("\n" + "-"*60)
    print(" MODEL COMPARISON TABLE")
    print("-"*60)
    results_df = pd.DataFrame(results).T
    print(results_df.to_string())
    
    # --- Best Model Selection ---
    best_name = results_df['F1-Score'].idxmax()
    best_f1 = results_df.loc[best_name, 'F1-Score']
    print(f"\n{'='*60}")
    print(f" ★ BEST MODEL: {best_name} (F1-Score: {best_f1:.4f})")
    print(f"{'='*60}")
    
    return trained_models[best_name], best_name, results, y_test, trained_models[best_name].predict(X_test)

# =============================================================================
# Step 5: Save Model & Artifacts
# =============================================================================
def save_artifacts(best_model, best_name, tfidf_user, tfidf_job, scaler, results, y_test, y_pred):
    """Best model සහ preprocessing artifacts save කරයි"""
    print("\n" + "="*60)
    print(" STEP 5: SAVING ARTIFACTS")
    print("="*60)
    
    create_output_dir()
    
    # Save best model
    model_path = os.path.join(OUTPUT_DIR, "job_recommendation_model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(best_model, f)
    print(f"[SAVED] Best model → {model_path}")
    
    # Save TF-IDF vectorizers
    tfidf_user_path = os.path.join(OUTPUT_DIR, "tfidf_user_skills.pkl")
    with open(tfidf_user_path, 'wb') as f:
        pickle.dump(tfidf_user, f)
    print(f"[SAVED] TF-IDF (User Skills) → {tfidf_user_path}")
    
    tfidf_job_path = os.path.join(OUTPUT_DIR, "tfidf_job_requirements.pkl")
    with open(tfidf_job_path, 'wb') as f:
        pickle.dump(tfidf_job, f)
    print(f"[SAVED] TF-IDF (Job Requirements) → {tfidf_job_path}")
    
    # Save scaler
    scaler_path = os.path.join(OUTPUT_DIR, "scaler.pkl")
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
    print(f"[SAVED] MinMaxScaler → {scaler_path}")
    
    # Save classification report
    report_path = os.path.join(OUTPUT_DIR, "classification_report.txt")
    with open(report_path, 'w') as f:
        f.write("="*60 + "\n")
        f.write(" JOB RECOMMENDATION - MODEL TRAINING REPORT\n")
        f.write(f" Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*60 + "\n\n")
        f.write(f"Best Model: {best_name}\n\n")
        f.write("--- Model Comparison ---\n")
        results_df = pd.DataFrame(results).T
        f.write(results_df.to_string() + "\n\n")
        f.write("--- Detailed Classification Report (Best Model) ---\n")
        f.write(classification_report(y_test, y_pred, target_names=["Not Recommended", "Recommended"]))
    print(f"[SAVED] Report → {report_path}")

# =============================================================================
# Main Execution
# =============================================================================
def main():
    print("\n" + "#"*60)
    print(" JOB RECOMMENDATION MODEL TRAINING PIPELINE")
    print("#"*60)
    
    # Step 1: Load
    df = load_data()
    
    # Step 2: Preprocess
    X_text_user, X_text_job, X_match_score, y = preprocess_data(df)
    
    # Step 3: Feature Engineering
    X_train, X_test, y_train, y_test, tfidf_user, tfidf_job, scaler = engineer_features(
        X_text_user, X_text_job, X_match_score, y
    )
    
    # Step 4: Train & Compare
    best_model, best_name, results, y_test, y_pred = train_and_compare(
        X_train, X_test, y_train, y_test
    )
    
    # Step 5: Save
    save_artifacts(best_model, best_name, tfidf_user, tfidf_job, scaler, results, y_test, y_pred)
    
    print("\n" + "#"*60)
    print(" PIPELINE COMPLETE!")
    print("#"*60 + "\n")

if __name__ == "__main__":
    main()
