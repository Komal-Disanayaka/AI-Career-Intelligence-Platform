"""
=============================================================================
Skill Gap Analysis Model Training Script
=============================================================================
මෙම Script එක:
1. Job Posts Dataset එක Load කර Preprocess කරයි
2. Skills TF-IDF Vectorization කරයි
3. Models 3ක් (Random Forest, SVM, Multinomial Naive Bayes) compare කරයි
4. හොඳම model එක auto-select කර .pkl files ලෙස save කරයි

මෙම model එක user skills ලබාදුන් විට job category predict කරයි.
ඉන්පසු target category එකේ required skills සමඟ compare කර skill gap identify කරයි.
=============================================================================
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

import pandas as pd
import numpy as np
import os
import pickle
import ast
import warnings
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

warnings.filterwarnings('ignore')

# =============================================================================
# Configuration
# =============================================================================
DATASET_PATH = os.path.join(os.path.dirname(__file__), "all_job_post.csv")
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
    print(f"\n[INFO] Category distribution:")
    for cat, count in df['category'].value_counts().items():
        print(f"  - {cat}: {count}")
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
        df = df.dropna(subset=['job_skill_set', 'category'])
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
    
    # --- 2.3: Parse skill_set from string list to actual text ---
    print("[INFO] Parsing job_skill_set column...")
    
    def parse_skills(skill_str):
        """String list එක parse කර comma-separated text එකක් බවට convert කරයි"""
        try:
            # Try to parse as Python list literal
            skills_list = ast.literal_eval(skill_str)
            if isinstance(skills_list, list):
                return ', '.join([s.strip().lower() for s in skills_list])
        except (ValueError, SyntaxError):
            pass
        # Fallback: treat as comma-separated string
        return skill_str.lower().strip()
    
    df['skills_text'] = df['job_skill_set'].apply(parse_skills)
    print(f"  → Sample parsed skills: {df['skills_text'].iloc[0][:100]}...")
    
    # --- 2.4: Clean category column ---
    print("[INFO] Cleaning category column...")
    df['category'] = df['category'].str.strip().str.upper()
    
    # --- 2.5: Label encode target ---
    print("[INFO] Label encoding categories...")
    le_category = LabelEncoder()
    df['category_encoded'] = le_category.fit_transform(df['category'])
    print(f"  → Classes: {le_category.classes_.tolist()}")
    
    X_text = df['skills_text']
    y = df['category_encoded']
    
    print(f"\n[INFO] Preprocessing complete ✓")
    
    return X_text, y, le_category, df

# =============================================================================
# Step 3: Feature Engineering (TF-IDF)
# =============================================================================
def engineer_features(X_text, y):
    """TF-IDF vectorization"""
    print("\n" + "="*60)
    print(" STEP 3: FEATURE ENGINEERING (TF-IDF)")
    print("="*60)
    
    # --- 3.1: TF-IDF Vectorization ---
    print("[INFO] TF-IDF Vectorizing skills...")
    tfidf = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), sublinear_tf=True)
    X_tfidf = tfidf.fit_transform(X_text)
    print(f"  → Feature matrix shape: {X_tfidf.shape}")
    print(f"  → Top features: {tfidf.get_feature_names_out()[:10].tolist()}")
    
    # --- 3.2: Train/Test Split ---
    print(f"\n[INFO] Train/Test Split ({int((1-TEST_SIZE)*100)}/{int(TEST_SIZE*100)}, stratified)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X_tfidf, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    print(f"  → Train: {X_train.shape[0]} samples")
    print(f"  → Test:  {X_test.shape[0]} samples")
    
    return X_train, X_test, y_train, y_test, tfidf

# =============================================================================
# Step 4: Model Training & Comparison
# =============================================================================
def train_and_compare(X_train, X_test, y_train, y_test, le_category):
    """Models 3ක් train කර compare කරයි"""
    print("\n" + "="*60)
    print(" STEP 4: MODEL TRAINING & COMPARISON")
    print("="*60)
    
    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=200, max_depth=20, random_state=RANDOM_STATE, n_jobs=-1
        ),
        "SVM (Linear)": LinearSVC(
            max_iter=2000, random_state=RANDOM_STATE
        ),
        "Multinomial NB": MultinomialNB(
            alpha=0.1
        )
    }
    
    results = {}
    trained_models = {}
    
    for name, model in models.items():
        print(f"\n[TRAINING] {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='weighted')
        rec = recall_score(y_test, y_pred, average='weighted')
        f1 = f1_score(y_test, y_pred, average='weighted')
        
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
    
    best_model = trained_models[best_name]
    y_pred_best = best_model.predict(X_test)
    
    return best_model, best_name, results, y_test, y_pred_best

# =============================================================================
# Step 5: Build Category-Skill Mapping
# =============================================================================
def build_skill_mapping(df, le_category):
    """එක එක category එකට top skills mapping එකක් build කරයි.
    මෙය skill gap analysis සඳහා backend එකට අවශ්‍යයි."""
    print("\n" + "="*60)
    print(" STEP 5: BUILDING CATEGORY-SKILL MAPPING")
    print("="*60)
    
    category_skills = {}
    
    for category in df['category'].unique():
        cat_df = df[df['category'] == category]
        # Collect all skills for this category
        all_skills = []
        for skills_text in cat_df['skills_text']:
            skills = [s.strip() for s in skills_text.split(',')]
            all_skills.extend(skills)
        
        # Count and rank skills
        skill_counts = pd.Series(all_skills).value_counts()
        top_skills = skill_counts.head(30).index.tolist()
        category_skills[category] = top_skills
        print(f"  [{category}] Top 5 skills: {top_skills[:5]}")
    
    return category_skills

# =============================================================================
# Step 6: Save Model & Artifacts
# =============================================================================
def save_artifacts(best_model, best_name, tfidf, le_category, category_skills, results, y_test, y_pred):
    """Best model සහ preprocessing artifacts save කරයි"""
    print("\n" + "="*60)
    print(" STEP 6: SAVING ARTIFACTS")
    print("="*60)
    
    create_output_dir()
    
    # Save best model
    model_path = os.path.join(OUTPUT_DIR, "skill_gap_model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(best_model, f)
    print(f"[SAVED] Best model → {model_path}")
    
    # Save TF-IDF vectorizer
    tfidf_path = os.path.join(OUTPUT_DIR, "tfidf_skills.pkl")
    with open(tfidf_path, 'wb') as f:
        pickle.dump(tfidf, f)
    print(f"[SAVED] TF-IDF Vectorizer → {tfidf_path}")
    
    # Save label encoder
    le_path = os.path.join(OUTPUT_DIR, "label_encoder.pkl")
    with open(le_path, 'wb') as f:
        pickle.dump(le_category, f)
    print(f"[SAVED] Label Encoder → {le_path}")
    
    # Save category-skill mapping
    mapping_path = os.path.join(OUTPUT_DIR, "category_skills_mapping.pkl")
    with open(mapping_path, 'wb') as f:
        pickle.dump(category_skills, f)
    print(f"[SAVED] Category-Skill Mapping → {mapping_path}")
    
    # Save classification report
    report_path = os.path.join(OUTPUT_DIR, "classification_report.txt")
    target_names = le_category.classes_.tolist()
    with open(report_path, 'w') as f:
        f.write("="*60 + "\n")
        f.write(" SKILL GAP ANALYSIS - MODEL TRAINING REPORT\n")
        f.write(f" Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*60 + "\n\n")
        f.write(f"Best Model: {best_name}\n\n")
        f.write("--- Model Comparison ---\n")
        results_df = pd.DataFrame(results).T
        f.write(results_df.to_string() + "\n\n")
        f.write("--- Detailed Classification Report (Best Model) ---\n")
        f.write(classification_report(y_test, y_pred, target_names=target_names))
        f.write("\n\n--- Category-Skill Mapping (Top 10 per category) ---\n")
        for cat, skills in category_skills.items():
            f.write(f"\n[{cat}]:\n  {', '.join(skills[:10])}\n")
    print(f"[SAVED] Report → {report_path}")

# =============================================================================
# Main Execution
# =============================================================================
def main():
    print("\n" + "#"*60)
    print(" SKILL GAP ANALYSIS MODEL TRAINING PIPELINE")
    print("#"*60)
    
    # Step 1: Load
    df = load_data()
    
    # Step 2: Preprocess
    X_text, y, le_category, df_processed = preprocess_data(df)
    
    # Step 3: Feature Engineering
    X_train, X_test, y_train, y_test, tfidf = engineer_features(X_text, y)
    
    # Step 4: Train & Compare
    best_model, best_name, results, y_test, y_pred = train_and_compare(
        X_train, X_test, y_train, y_test, le_category
    )
    
    # Step 5: Build Skill Mapping
    category_skills = build_skill_mapping(df_processed, le_category)
    
    # Step 6: Save
    save_artifacts(best_model, best_name, tfidf, le_category, category_skills, results, y_test, y_pred)
    
    print("\n" + "#"*60)
    print(" PIPELINE COMPLETE!")
    print("#"*60 + "\n")

if __name__ == "__main__":
    main()
