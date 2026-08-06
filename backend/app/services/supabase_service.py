from supabase import create_client, Client
from app.config import settings
from typing import Optional

class SupabaseService:
    def __init__(self) -> None:
        self._client: Optional[Client] = None

    @property
    def client(self) -> Optional[Client]:
        if not self._client and settings.SUPABASE_URL and settings.SUPABASE_KEY:
            self._client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return self._client

supabase_service = SupabaseService()
