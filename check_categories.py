import pandas as pd

df = pd.read_csv("styles.csv", on_bad_lines='skip')

print(df['articleType'].unique())
