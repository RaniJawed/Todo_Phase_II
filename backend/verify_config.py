import sys
import os

# Ensure src is in path
sys.path.append(os.path.abspath("."))

try:
    from src.config import settings
    print(f"DEBUG setting is: {settings.DEBUG}")
    from src.database import engine
    print("Database engine imported successfully")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
