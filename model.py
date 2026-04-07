from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Wardrobe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    skin_tone = db.Column(db.String(50))
    dress = db.Column(db.String(50))
    glasses = db.Column(db.String(50))
    shoe = db.Column(db.String(50))
    pant = db.Column(db.String(50))
    hair_band = db.Column(db.String(50))
    style = db.Column(db.String(50))
