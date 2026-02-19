"""
Dashboard Contracts
-------------------
Data structures for the dashboard aggregation layer.
"""

from typing import List, Optional
from pydantic import BaseModel

class BriefingDTO(BaseModel):
    """AI-generated briefing summary for the dashboard."""
    summary: str
    suggested_actions: List[str] = []
    tone: Optional[str] = "professional"
