"""
=============================================================================
Salary Prediction Model Training Script
=============================================================================
මෙම Script එක:
1. Salary Dataset එක Load කර Preprocess කරයි
2. Categorical features encode කර, numeric features scale කරයි
3. Models 4ක් (Random Forest, Gradient Boosting, XGBoost, Linear Regression) compare කරයි
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
from sklearn.preprocessing import LabelEncoder, StandardScaler, OrdinalEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

warnings.filterwarnings('ignore')

# =============================================================================
# Configuration
# =============================================================================
DATASET_PATH = os.path.join(os.path.dirname(__file__), "Salary Data.csv")
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
    print(f"\n[INFO] Salary statistics:")
    print(f"  - Min:    ${df['Salary'].min():,.0f}")
    print(f"  - Max:    ${df['Salary'].max():,.0f}")
    print(f"  - Mean:   ${df['Salary'].mean():,.0f}")
    print(f"  - Median: ${df['Salary'].median():,.0f}")
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
    
    # --- 2.3: Outlier removal using IQR on Salary ---
    print("[INFO] Removing Salary outliers (IQR method)...")
    Q1 = df['Salary'].quantile(0.25)
    Q3 = df['Salary'].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    before = df.shape[0]
    df = df[(df['Salary'] >= lower) & (df['Salary'] <= upper)]
    removed = before - df.shape[0]
    print(f"  → IQR Range: [{lower:,.0f}, {upper:,.0f}]")
    print(f"  → Removed {removed} outlier rows")
    print(f"  → Rows remaining: {df.shape[0]}")
    
    # --- 2.4: Gender Encoding ---
    print("[INFO] Encoding Gender (Male=1, Female=0)...")
    le_gender = LabelEncoder()
    df['Gender'] = le_gender.fit_transform(df['Gender'])
    
    # --- 2.5: Education Level Ordinal Encoding ---
    print("[INFO] Ordinal encoding Education Level...")
    education_order = [["High School", "Bachelor's", "Master's", "PhD"]]
    oe_education = OrdinalEncoder(categories=education_order, handle_unknown='use_encoded_value', unknown_value=-1)
    df['Education Level'] = oe_education.fit_transform(df[['Education Level']])
    
    # --- 2.6: Job Title Label Encoding ---
    print("[INFO] Label encoding Job Title...")
    le_job = LabelEncoder()
    df['Job Title'] = le_job.fit_transform(df['Job Title'])
    print(f"  → Unique job titles: {len(le_job.classes_)}")
    
    # --- 2.7: Feature & Target separation ---
    feature_cols = ['Age', 'Gender', 'Education Level', 'Job Title', 'Years of Experience']
    X = df[feature_cols]
    y = df['Salary']
    
    # --- 2.8: Standard Scaling on numeric columns ---
    print("[INFO] Standard scaling numeric features (Age, Years of Experience)...")
    scaler = StandardScaler()
    numeric_cols = ['Age', 'Years of Experience']
    X = X.copy()
    X[numeric_cols] = scaler.fit_transform(X[numeric_cols])
    
    print(f"\n[INFO] Preprocessing complete ✓")
    print(f"[INFO] Feature matrix shape: {X.shape}")
    
    # Store encoders
    encoders = {
        'le_gender': le_gender,
        'oe_education': oe_education,
        'le_job': le_job
    }
    
    return X, y, encoders, scaler

# =============================================================================
# Step 3: Train/Test Split
# =============================================================================
def split_data(X, y):
    """Train/Test split"""
    print("\n" + "="*60)
    print(" STEP 3: TRAIN/TEST SPLIT")
    print("="*60)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    print(f"[INFO] Train: {X_train.shape[0]} samples")
    print(f"[INFO] Test:  {X_test.shape[0]} samples")
    
    return X_train, X_test, y_train, y_test

# =============================================================================
# Step 4: Model Training & Comparison
# =============================================================================
def train_and_compare(X_train, X_test, y_train, y_test):
    """Models 4ක් train කර compare කරයි"""
    print("\n" + "="*60)
    print(" STEP 4: MODEL TRAINING & COMPARISON")
    print("="*60)
    
    models = {
        "Random Forest": RandomForestRegressor(
            n_estimators=200, max_depth=15, random_state=RANDOM_STATE, n_jobs=-1
        ),
        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=200, max_depth=5, learning_rate=0.1, random_state=RANDOM_STATE
        ),
        "XGBoost": XGBRegressor(
            n_estimators=200, max_depth=5, learning_rate=0.1, random_state=RANDOM_STATE,
            verbosity=0, n_jobs=-1
        ),
        "Linear Regression": LinearRegression()
    }
    
    results = {}
    trained_models = {}
    
    for name, model in models.items():
        print(f"\n[TRAINING] {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        results[name] = {"R²": r2, "MAE": mae, "RMSE": rmse}
        trained_models[name] = model
        
        print(f"  → R² Score: {r2:.4f}")
        print(f"  → MAE:      ${mae:,.2f}")
        print(f"  → RMSE:     ${rmse:,.2f}")
    
    # --- Comparison Table ---
    print("\n" + "-"*60)
    print(" MODEL COMPARISON TABLE")
    print("-"*60)
    results_df = pd.DataFrame(results).T
    print(results_df.to_string())
    
    # --- Best Model Selection (highest R²) ---
    best_name = results_df['R²'].idxmax()
    best_r2 = results_df.loc[best_name, 'R²']
    print(f"\n{'='*60}")
    print(f" ★ BEST MODEL: {best_name} (R²: {best_r2:.4f})")
    print(f"{'='*60}")
    
    best_model = trained_models[best_name]
    y_pred_best = best_model.predict(X_test)
    
    return best_model, best_name, results, y_test, y_pred_best

# =============================================================================
# Step 5: Save Model & Artifacts
# =============================================================================
def save_artifacts(best_model, best_name, encoders, scaler, results, y_test, y_pred):
    """Best model සහ preprocessing artifacts save කරයි"""
    print("\n" + "="*60)
    print(" STEP 5: SAVING ARTIFACTS")
    print("="*60)
    
    create_output_dir()
    
    # Save best model
    model_path = os.path.join(OUTPUT_DIR, "salary_prediction_model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(best_model, f)
    print(f"[SAVED] Best model → {model_path}")
    
    # Save encoders
    encoders_path = os.path.join(OUTPUT_DIR, "label_encoders.pkl")
    with open(encoders_path, 'wb') as f:
        pickle.dump(encoders, f)
    print(f"[SAVED] Label Encoders → {encoders_path}")
    
    # Save scaler
    scaler_path = os.path.join(OUTPUT_DIR, "scaler.pkl")
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
    print(f"[SAVED] StandardScaler → {scaler_path}")
    
    # Save regression report
    report_path = os.path.join(OUTPUT_DIR, "regression_report.txt")
    with open(report_path, 'w') as f:
        f.write("="*60 + "\n")
        f.write(" SALARY PREDICTION - MODEL TRAINING REPORT\n")
        f.write(f" Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*60 + "\n\n")
        f.write(f"Best Model: {best_name}\n\n")
        f.write("--- Model Comparison ---\n")
        results_df = pd.DataFrame(results).T
        f.write(results_df.to_string() + "\n\n")
        f.write("--- Prediction Sample (Best Model) ---\n")
        comparison = pd.DataFrame({'Actual': y_test.values[:10], 'Predicted': y_pred[:10]})
        comparison['Difference'] = comparison['Actual'] - comparison['Predicted']
        f.write(comparison.to_string() + "\n")
    print(f"[SAVED] Report → {report_path}")

# =============================================================================
# Main Execution
# =============================================================================
def main():
    print("\n" + "#"*60)
    print(" SALARY PREDICTION MODEL TRAINING PIPELINE")
    print("#"*60)
    
    # Step 1: Load
    df = load_data()
    
    # Step 2: Preprocess
    X, y, encoders, scaler = preprocess_data(df)
    
    # Step 3: Split
    X_train, X_test, y_train, y_test = split_data(X, y)
    
    # Step 4: Train & Compare
    best_model, best_name, results, y_test, y_pred = train_and_compare(
        X_train, X_test, y_train, y_test
    )
    
    # Step 5: Save
    save_artifacts(best_model, best_name, encoders, scaler, results, y_test, y_pred)
    
    print("\n" + "#"*60)
    print(" PIPELINE COMPLETE!")
    print("#"*60 + "\n")

if __name__ == "__main__":
    main()
