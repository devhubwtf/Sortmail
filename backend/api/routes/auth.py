"""
API Routes - Auth
-----------------
OAuth endpoints for Gmail and Outlook.
"""

from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.storage.database import get_db
from models.user import User, EmailProvider
from models.connected_account import ConnectedAccount, ProviderType
from core.auth import oauth_google, jwt

router = APIRouter()


class AuthURLResponse(BaseModel):
    auth_url: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.get("/google", response_model=AuthURLResponse)
async def google_auth():
    """Initiate Google OAuth flow."""
    auth_url = oauth_google.get_google_auth_url()
    return {"auth_url": auth_url}


@router.get("/google/callback")
async def google_callback(
    code: str, 
    db: AsyncSession = Depends(get_db)
):
    """Handle Google OAuth callback."""
    # 1. Exchange code for tokens
    try:
        tokens = await oauth_google.exchange_code_for_tokens(code)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google auth failed: {str(e)}")
    
    # 2. Get user info
    try:
        user_info = await oauth_google.get_user_info(tokens.access_token)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch user info: {str(e)}")
        
    # 3. Find or create user
    # Check if user exists by email
    stmt = select(User).where(User.email == user_info.email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        # Create new user
        user = User(
            id=user_info.id, # Using Google ID as User ID for simplicity, or generate UUID
            email=user_info.email,
            name=user_info.name,
            picture_url=user_info.picture,
            provider=EmailProvider.GMAIL,
            access_token=tokens.access_token,
            # refresh_token=tokens.refresh_token, # Store in ConnectedAccount instead usually, but User model has it too
            created_at=datetime.utcnow(),
            is_active=True
        )
        db.add(user)
        await db.flush() # flush to get ID if we were auto-generating
    else:
        # Update existing user info
        user.name = user_info.name
        user.picture_url = user_info.picture
        # user.access_token = tokens.access_token # Optional: update latest token on user
    
    # 4. Update or Create ConnectedAccount for Gmail
    stmt = select(ConnectedAccount).where(
        ConnectedAccount.user_id == user.id,
        ConnectedAccount.provider == ProviderType.GMAIL
    )
    result = await db.execute(stmt)
    account = result.scalar_one_or_none()
    
    if account:
        account.access_token = tokens.access_token
        if tokens.refresh_token:
            account.refresh_token = tokens.refresh_token
        account.token_expires_at = datetime.utcnow() + timedelta(seconds=tokens.expires_in)
        account.last_sync_at = datetime.utcnow()
    else:
        account = ConnectedAccount(
            id=f"gmail_{user.id}", # Simple ID generation
            user_id=user.id,
            provider=ProviderType.GMAIL,
            access_token=tokens.access_token,
            refresh_token=tokens.refresh_token,
            token_expires_at=datetime.utcnow() + timedelta(seconds=tokens.expires_in),
            last_sync_at=datetime.utcnow(),
            created_at=datetime.utcnow()
        )
        db.add(account)
        
    await db.commit()
    
    # 5. Create Session (JWT)
    token_pair = jwt.create_token_pair(user.id, user.email)
    
    # 6. Redirect to frontend
    # For MVP: Redirect with token in query param.
    # ideally we set a cookie or show a success page.
    frontend_url = "http://localhost:3000/dashboard"
    redirect_url = f"{frontend_url}?token={token_pair.access_token}"
    
    return RedirectResponse(url=redirect_url)


@router.get("/outlook", response_model=AuthURLResponse)
async def outlook_auth():
    """Initiate Microsoft OAuth flow."""
    # TODO: Implement Microsoft OAuth URL generation
    return {"auth_url": "https://login.microsoftonline.com/..."}


@router.get("/outlook/callback")
async def outlook_callback(code: str):
    """Handle Microsoft OAuth callback."""
    # TODO: Exchange code for tokens, create user session
    return {"message": "Outlook auth callback - implement me"}


@router.get("/me")
async def get_current_user(token: str = Depends(jwt.verify_token)): # Simplified dependency
    """Get current authenticated user."""
    # This needs a proper dependency to extract user from DB based on token
    # For now just returning what verify_token returns if valid
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")
    return token


@router.post("/logout")
async def logout():
    """Logout current user."""
    return {"message": "Logged out"}
