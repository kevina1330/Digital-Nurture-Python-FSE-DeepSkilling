class Config:
    SECRET_KEY = "mysecretkey"
    SQL_ALCHEMY_DATABASE_URI = "sqlite:///courses.db"
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True