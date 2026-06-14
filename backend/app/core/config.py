from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""

    POSTGRES_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    ALLOWED_ORIGINS: str
    SECURE: bool

    

    class Config:
        env_file = ".env"
settings = Settings()