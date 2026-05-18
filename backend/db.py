"""
Supabase client singleton.
Import this module anywhere to get the shared client instance.
"""

from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

_url: str = os.getenv("SUPABASE_URL", "")
_key: str = os.getenv("SUPABASE_KEY", "")

if not _url or not _key:
    raise RuntimeError(
        "SUPABASE_URL and SUPABASE_KEY must be set in .env — "
        "see .env.example for the template."
    )

supabase: Client = create_client(_url, _key)
