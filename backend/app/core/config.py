from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""

    POSTGRES_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    ALLOWED_ORIGINS: str
    SECURE: bool

    ADMIN_NAME: str
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    ADMIN_ROLE: str

    

    class Config:
        env_file = ".env"
settings = Settings()