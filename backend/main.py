from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from database.session import engine, Base
from api.routes import router

# Créer les tables dans la base de données
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(router)


@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API Salaire Mada", "version": "1.0.0"}
