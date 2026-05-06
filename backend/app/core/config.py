from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/bogota_security"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Bogota Security System"

    class Config:
        env_file = ".env"

settings = Settings()
