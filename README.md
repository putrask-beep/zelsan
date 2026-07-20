# Business Intelligence Project: Student Productivity & Distraction Analysis

## Latar Belakang

Productivitas belajar mahasiswa merupakan faktor kunci keberhasilan akademik. Namun, berbagai faktor distraksi seperti penggunaan smartphone, media sosial, YouTube, dan gaming dapat menurunkan produktivitas. Proyek ini bertujuan untuk menganalisis pola produktivitas dan distraksi mahasiswa menggunakan pendekatan Business Intelligence (BI) yang komprehensif, mencakup database OLTP, Data Warehouse, ETL, OLAP Cube, Data Mining, dan Reporting.

## Tujuan Project

1. Membangun sistem Business Intelligence lengkap untuk analisis produktivitas mahasiswa
2. Mendesain database OLTP yang ter-normalisasi (3NF) dari dataset CSV
3. Merancang Data Warehouse menggunakan Star Schema
4. Mengimplementasikan proses ETL menggunakan SSIS
5. Membangun OLAP Cube menggunakan SSAS untuk analisis multidimensi
6. Melakukan Data Mining dengan K-Means Clustering untuk segmentasi mahasiswa
7. Membuat dashboard reporting menggunakan SSRS
8. Menghasilkan visualisasi data yang insights

## Deskripsi Dataset

**Nama:** `student_productivity_distraction_dataset_20000.csv`
**Jumlah Record:** 20.000 baris
**Jumlah Kolom:** 18 kolom
**Sumber:** Dataset komputer-generated (sintetis)

| No | Kolom | Tipe Data | Deskripsi |
|----|-------|-----------|-----------|
| 1 | student_id | int | ID unik mahasiswa |
| 2 | age | int | Usia mahasiswa |
| 3 | gender | string | Jenis kelamin (Male/Female/Other) |
| 4 | study_hours_per_day | float | Jam belajar per hari |
| 5 | sleep_hours | float | Jam tidur per hari |
| 6 | phone_usage_hours | float | Jam penggunaan HP per hari |
| 7 | social_media_hours | float | Jam social media per hari |
| 8 | youtube_hours | float | Jam YouTube per hari |
| 9 | gaming_hours | float | Jam gaming per hari |
| 10 | breaks_per_day | int | Jumlah istirahat per hari |
| 11 | coffee_intake_mg | float | Asupan kopi dalam mg |
| 12 | exercise_minutes | float | Durasi olahraga dalam menit |
| 13 | assignments_completed | int | Jumlah tugas selesai |
| 14 | attendance_percentage | float | Persentase kehadiran (%) |
| 15 | stress_level | int | Level stress (1-10) |
| 16 | focus_score | int | Skor fokus (0-100) |
| 17 | final_grade | float | Nilai akhir (0-100) |
| 18 | productivity_score | float | Skor produktivitas (0-100) |

### Hasil Analisis Dataset

- **Missing Value:** Tidak ada (0%)
- **Duplicate:** Tidak ada
- **Outlier:** Beberapa kolom memiliki outlier (ditangani dengan winsorization)
- **Distribusi:** Variabel numerik dengan distribusi relatively uniform

## Arsitektur Business Intelligence

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BUSINESS INTEGRATION LAYER                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │   SSRS   │  │   SSAS   │  │   SSIS   │  │  Data Mining     │   │
│  │Dashboard │  │OLAP Cube │  │   ETL    │  │  (K-Means)       │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────────────┘   │
│       │              │              │              │                 │
├───────┼──────────────┼──────────────┼──────────────┼─────────────────┤
│       │         DATA WAREHOUSE      │              │                 │
│       │     ┌──────────────────┐    │              │                 │
│       │     │  Star Schema     │    │              │                 │
│       │     │  ┌────────────┐  │    │              │                 │
│       └────▶│  │Fact Table  │  │◀───┘              │                 │
│             │  └─────┬──────┘  │                   │                 │
│             │        │         │                   │                 │
│             │  ┌─────┴──────┐  │                   │                 │
│             │  │Dim Tables  │  │◀──────────────────┘                 │
│             │  └────────────┘  │                                    │
│             └──────────────────┘                                    │
│                         │                                           │
├─────────────────────────┼───────────────────────────────────────────┤
│                   ETL PROCESS                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ CSV → Staging → Clean → Convert → Lookup → Load → DW       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                         │                                           │
├─────────────────────────┼───────────────────────────────────────────┤
│                   DATABASE LAYER                                    │
│             ┌───────────┴───────────┐                               │
│             │    OLTP Database      │                               │
│             │  ┌─────────────────┐  │                               │
│             │  │ tbl_student     │  │                               │
│             │  │ tbl_gender      │  │                               │
│             │  │ tbl_stress_lvl  │  │                               │
│             │  │ tbl_activity    │  │                               │
│             │  │ tbl_academic    │  │                               │
│             │  └─────────────────┘  │                               │
│             └───────────────────────┘                               │
│                         │                                           │
│             ┌───────────┴───────────┐                               │
│             │    Source Data        │                               │
│             │  student_productivity │                               │
│             │  _distraction_20000   │                               │
│             └───────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

## Perancangan Database

### Normalisasi 3NF

**Sebelum Normalisasi (1 tabel flat, 18 kolom):**
```
student_id, age, gender, study_hours_per_day, sleep_hours, phone_usage_hours,
social_media_hours, youtube_hours, gaming_hours, breaks_per_day,
coffee_intake_mg, exercise_minutes, assignments_completed,
attendance_percentage, stress_level, focus_score, final_grade, productivity_score
```

**Setelah Normalisasi 3NF (5 tabel):**

| Tabel | Kolom | Deskripsi |
|-------|-------|-----------|
| tbl_gender | gender_id (PK), gender_name | Referensi gender |
| tbl_stress_level | stress_id (PK), stress_name, stress_desc | Referensi level stress |
| tbl_student | student_id (PK), age, gender_id (FK) | Data master mahasiswa |
| tbl_student_daily_activity | activity_id (PK), student_id (FK), study_hours, sleep_hours, dll | Aktivitas harian |
| tbl_student_academic | academic_id (PK), student_id (FK), stress_level_id (FK), grades, dll | Performa akademik |

### Entity Relationship Diagram

```
tbl_gender (1) ────────< (N) tbl_student
                              │
tbl_stress_level (1) ──< (N) tbl_student_academic
                              │
tbl_student (1) ────────< (N) tbl_student_daily_activity
tbl_student (1) ────────< (N) tbl_student_academic
```

### Pencapaian Normalisasi

- **1NF:** Semua nilai atomik, tidak ada repeating groups
- **2NF:** Tidak ada partial dependency
- **3NF:** Tidak ada transitive dependency

## Data Warehouse

### Star Schema

```
                      ┌────────────────┐
                      │   DimGender    │
                      │ (gender_key)   │
                      └───────┬────────┘
                              │
                      ┌───────┴────────┐
                      │  DimAgeGroup   │
                      │(age_group_key) │
                      └───────┬────────┘
                              │
    ┌──────────────┐   ┌──────┴───────┐   ┌──────────────────┐
    │  DimStudent  ├───┤ FactStudent  ├───┤ DimStressLevel   │
    │(student_key) │   │ Productivity │   │ (stress_key)     │
    └──────────────┘   └──────────────┘   └──────────────────┘
```

### Fact Table: FactStudentProductivity

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| fact_key | INT (PK) | Surrogate key |
| student_key | INT (FK) | -> DimStudent |
| gender_key | INT (FK) | -> DimGender |
| stress_key | INT (FK) | -> DimStressLevel |
| age_group_key | INT (FK) | -> DimAgeGroup |
| study_hours_per_day | DECIMAL(4,2) | Jam belajar |
| sleep_hours | DECIMAL(4,2) | Jam tidur |
| phone_usage_hours | DECIMAL(4,2) | Jam HP |
| social_media_hours | DECIMAL(4,2) | Jam social media |
| youtube_hours | DECIMAL(4,2) | Jam YouTube |
| gaming_hours | DECIMAL(4,2) | Jam gaming |
| breaks_per_day | INT | Jumlah istirahat |
| coffee_intake_mg | DECIMAL(6,2) | Asupan kopi |
| exercise_minutes | DECIMAL(5,2) | Olahraga |
| assignments_completed | INT | Tugas selesai |
| attendance_percentage | DECIMAL(5,2) | Kehadiran |
| focus_score | DECIMAL(5,2) | Skor fokus |
| final_grade | DECIMAL(5,2) | Nilai akhir |
| productivity_score | DECIMAL(5,2) | Skor produktivitas |
| total_screen_time | DECIMAL (PERSISTED) | Derived: total jam layar |
| study_gaming_ratio | DECIMAL (PERSISTED) | Derived: rasio belajar/gaming |

### Dimension Tables

| Table | Key | Attributes |
|-------|-----|------------|
| DimGender | gender_key | gender_id, gender_name |
| DimStressLevel | stress_key | stress_id, stress_name, stress_desc, stress_category |
| DimAgeGroup | age_group_key | age_min, age_max, age_group_name |
| DimStudent | student_key | student_id, age, gender_key, age_group_key |

## ETL (SSIS)

### Flow ETL

```
SOURCE DATA → DATA CLEANING → DATA CONVERSION → LOOKUP → STAGING → LOAD DW
```

### Tahapan ETL

1. **Source Data:** Membaca data dari CSV flat file
2. **Data Cleaning:** Validasi null, duplikat, range values
3. **Data Conversion:** Konversi tipe data, encoding gender
4. **Lookup:** Mencari surrogate key dari dimension tables
5. **Staging Area:** Area transit sementara
6. **Load to DW:** Memuat ke Fact dan Dimension tables

### SSIS Package Structure

```
StudentProductivityETL.dtsx
├── Connection Managers (CSV, OLTP, DW)
├── Data Flow Tasks
│   ├── DFT_LoadFromCSV
│   └── DFT_LoadToDW
├── Execute SQL Tasks
│   ├── EST_TruncateStaging
│   └── EST_VerifyLoad
└── Event Handlers
```

## Analysis Services (SSAS)

### OLAP Cube: StudentProductivityCube

**Measures (Fakta):**

| Measure | Aggregation | Description |
|---------|-------------|-------------|
| Student Count | COUNT | Jumlah mahasiswa |
| Avg Study Hours | AVERAGE | Rata-rata jam belajar |
| Avg Productivity | AVERAGE | Rata-rata produktivitas |
| Avg Final Grade | AVERAGE | Rata-rata nilai akhir |
| Avg Screen Time | AVERAGE | Rata-rata total screen time |
| Avg Focus Score | AVERAGE | Rata-rata skor fokus |

**Dimensions:**

| Dimension | Hierarchy | Levels |
|-----------|-----------|--------|
| Gender | Gender Name | Male, Female, Other |
| Stress Level | Category → Name | Low/Medium/High/Critical |
| Age Group | Group Name | Remaja, Dewasa Muda, etc. |
| Student | Student ID | Individual students |

**KPIs:**

| KPI | Value | Goal | Status |
|-----|-------|------|--------|
| Productivity Score | Avg(productivity) | >= 50 | Green/Red |
| Attendance Rate | Avg(attendance) | >= 80% | Green/Red |
| Focus Score | Avg(focus_score) | >= 60 | Green/Red |
| Screen Time | Avg(screen_time) | <= 10 hrs | Green/Red |

## Data Mining

### K-Means Clustering

**Algoritma:** K-Means Clustering
**Jumlah Cluster:** 4 (berdasarkan Elbow Method dan Silhouette Score)

**Features Used (12):**
- study_hours_per_day, sleep_hours, phone_usage_hours, social_media_hours
- youtube_hours, gaming_hours, exercise_minutes, coffee_intake_mg
- assignments_completed, attendance_percentage, focus_score, productivity_score

**Scaling:** StandardScaler (zero mean, unit variance)

**Evaluation Metrics:**
- Silhouette Score
- Calinski-Harabasz Index
- Inertia (Within-Cluster Sum of Squares)

### Hasil Clustering

| Cluster | Nama | Karakteristik | Jumlah |
|---------|------|---------------|--------|
| 0 | Low Performer | Produktivitas rendah, belajar sedikit | ~25% |
| 1 | Distracted Student | Screen time tinggi, distraksi banyak | ~25% |
| 2 | Balanced Student | Aktivitas seimbang | ~25% |
| 3 | High Performer | Produktivitas tinggi, fokus baik | ~25% |

### Business Insight

1. **Early Warning System:** Identifikasi mahasiswa Cluster 0 & 1 untuk intervensi dini
2. **Personalized Support:** Program dukungan yang disesuaikan per cluster
3. **Resource Allocation:** Alokasi resources ke program yang paling dibutuhkan
4. **Digital Wellness:** Program pengelolaan screen time untuk Cluster 1
5. **Peer Mentoring:** High Performer menjadi mentor untuk Low Performer

## Reporting Services (SSRS)

### Dashboard yang Dibuat

| No | Dashboard | Deskripsi |
|----|-----------|-----------|
| 1 | Executive Dashboard | Overview KPI utama |
| 2 | Activity Dashboard | Analisis pola aktivitas |
| 3 | Popularity Analysis | Produktivitas per kategori |
| 4 | Focus Analysis | Faktor yang mempengaruhi fokus |
| 5 | Energy Analysis | Kesehatan dan energi |
| 6 | Clustering Dashboard | Visualisasi hasil clustering |
| 7 | KPI Dashboard | Key Performance Indicators |

## Struktur Folder Project

```
archive/
├── README.md                              # Dokumentasi utama
├── student_productivity_distraction_dataset_20000.csv  # Dataset asli
│
├── 01_documentation/                      # Dokumentasi
│
├── 02_database_oltp/                      # Database OLTP
│   ├── 01_create_database.sql             # Script CREATE DATABASE
│   ├── 02_create_tables.sql               # Script CREATE TABLE (3NF)
│   └── 03_data_dictionary.sql             # Data dictionary OLTP
│
├── 03_data_warehouse/                     # Data Warehouse
│   ├── 01_create_data_warehouse.sql       # Star Schema DW
│   ├── 02_data_dictionary_dw.sql          # Data dictionary DW
│   └── 03_mapping_oltp_to_dw.sql          # Mapping OLTP → DW
│
├── 04_etl_ssis/                           # Integration Services
│   ├── 01_etl_design.sql                  # ETL script & staging
│   └── 02_etl_documentation.md            # Dokumentasi ETL
│
├── 05_analysis_ssas/                      # Analysis Services
│   └── 01_olap_cube_design.sql            # OLAP Cube design & MDX
│
├── 06_data_mining/                        # Data Mining
│   └── 01_kmeans_clustering.py            # K-Means implementation
│
├── 07_reporting_ssrs/                     # Reporting Services
│   ├── 01_ssrs_report_design.sql          # Views & SP untuk SSRS
│   └── 02_ssrs_report_design.md           # Dokumentasi dashboard
│
├── 08_source_code/                        # Source Code
│   ├── python/
│   │   ├── 01_dataset_analysis.py         # Analisis dataset
│   │   ├── 02_visualization.py            # Dashboard visualizations
│   │   └── 03_preprocessing.py            # Preprocessing pipeline
│   └── sql/
│       (scripts SQL di folder masing-masing)
│
└── 09_output/                             # Output files
    ├── 01_distribusi_numerik.png
    ├── 02_boxplot_outlier.png
    ├── 03_heatmap_korelasi.png
    ├── 04_distribusi_kategorikal.png
    ├── 05_elbow_method.png
    ├── 06_cluster_visualization.png
    ├── 07_cluster_radar_chart.png
    ├── 08_clustering_results.csv
    ├── 09_cluster_summary.csv
    ├── 10_cluster_centroids.csv
    ├── 11_model_info.txt
    ├── dashboard_01_executive.png
    ├── dashboard_02_activity.png
    ├── dashboard_03_popularity.png
    ├── dashboard_04_focus.png
    ├── dashboard_05_energy.png
    ├── dashboard_06_clustering.png
    ├── dashboard_07_kpi.png
    ├── dashboard_08_correlation.png
    ├── cleaned_dataset.csv
    ├── oltp_ready_data.csv
    ├── dim_gender.csv
    ├── dim_student.csv
    └── dim_stress_level.csv
```

## Cara Menjalankan Project

### Prasyarat

- Python 3.12 dengan libraries: pandas, numpy, matplotlib, scikit-learn
- SQL Server 2022
- SQL Server Management Studio (SSMS)
- Visual Studio dengan SSIS, SSAS, SSRS extensions

### Langkah-langkah

#### 1. Analisis Dataset & Preprocessing (Python)
```bash
cd 08_source_code/python
python 01_dataset_analysis.py
python 03_preprocessing.py
```

#### 2. Buat Database OLTP (SQL Server)
```bash
# Jalankan script di SSMS:
02_database_oltp/01_create_database.sql
02_database_oltp/02_create_tables.sql
```

#### 3. Load Data ke OLTP
```bash
# Gunakan Python atau SSIS untuk load data dari CSV ke OLTP tables
python 03_preprocessing.py  # Menghasilkan oltp_ready_data.csv
```

#### 4. Buat Data Warehouse (SQL Server)
```bash
# Jalankan script di SSMS:
03_data_warehouse/01_create_data_warehouse.sql
```

#### 5. Jalankan ETL (SSIS atau SQL)
```bash
# Jalankan script SQL untuk ETL:
04_etl_ssis/01_etl_design.sql
```

#### 6. Buat OLAP Cube (SSAS)
```bash
# Jalankan script SQL untuk views:
05_analysis_ssas/01_olap_cube_design.sql
# Buat cube di SQL Server Data Tools (SSDT)
```

#### 7. Jalankan Data Mining (Python)
```bash
cd 08_source_code/python
python ../06_data_mining/01_kmeans_clustering.py
```

#### 8. Buat Visualisasi Dashboard (Python)
```bash
cd 08_source_code/python
python 02_visualization.py
```

#### 9. Deploy SSRS Reports
```bash
# Buat report di SQL Server Data Tools (SSDT)
# Deploy ke Report Server
```

## Kesimpulan

Proyek Business Intelligence ini berhasil membangun sistem analisis komprehensif untuk produktivitas dan distraksi mahasiswa, meliputi:

1. **Database OLTP** yang ter-normalisasi 3NF dengan 5 tabel
2. **Data Warehouse** dengan Star Schema (1 Fact + 4 Dimension tables)
3. **Proses ETL** yang terdokumentasi dengan Staging Area
4. **OLAP Cube** dengan Measures, Dimensions, Hierarchies, dan KPIs
5. **K-Means Clustering** yang menghasilkan 4 segmen mahasiswa
6. **Dashboard Reporting** yang komprehensif (8 dashboard)

## Pengembangan Selanjutnya

1. **Real-time ETL:** Implementasi Change Data Capture (CDC) untuk update real-time
2. **Machine Learning:** Tambahkan algoritma lain (Random Forest, Neural Network) untuk prediksi
3. **Web Dashboard:** Buat dashboard interaktif menggunakan Power BI atau web framework
4. **Mobile App:** Aplikasi mobile untuk monitoring produktivitas
5. **API Integration:** Integrasikan dengan sistem akademik kampus
6. **Text Mining:** Analisis feedback/ulasan mahasiswa
7. **Time Series:** Analisis tren produktivitas dari waktu ke waktu
8. **Advanced Analytics:** Implementasi association rules dan anomaly detection

---

**Teknologi yang Digunakan:**
- Python 3.12 (pandas, numpy, matplotlib, scikit-learn)
- SQL Server 2022 (T-SQL)
- SSIS (Integration Services)
- SSAS (Analysis Services)
- SSRS (Reporting Services)
- SSMS (SQL Server Management Studio)
