import csv
from collections import Counter

articles_by_gender_occasion = {}

try:
    with open('../styles.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        # id_val, gender_val, cat, sub, art, col, sea, year, usa, name
        for row in reader:
            if len(row) < 10: continue
            id_val, gender_val, cat, sub, art, col, sea, year, usa, name = row[:10]
            
            # usa is usage (occasion)
            key = (gender_val, usa)
            if key not in articles_by_gender_occasion:
                articles_by_gender_occasion[key] = Counter()
            articles_by_gender_occasion[key][art] += 1

    for key, counts in articles_by_gender_occasion.items():
        print(f"--- {key} ---")
        for art, count in counts.most_common(10):
            print(f"  {art}: {count}")

except Exception as e:
    print("Error:", e)
