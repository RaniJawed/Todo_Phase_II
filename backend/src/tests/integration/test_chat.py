import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_chat_endpoint_hello():
    response = client.post("/api/chat", json={"message": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert "hello" in data["message"].lower()
    assert data["role"] == "assistant"

def test_chat_endpoint_name():
    response = client.post("/api/chat", json={"message": "what is your name?"})
    assert response.status_code == 200
    data = response.json()
    assert "mohsin's assistant" in data["message"].lower()

def test_chat_endpoint_project():
    response = client.post("/api/chat", json={"message": "tell me about this project"})
    assert response.status_code == 200
    data = response.json()
    assert "mohsin raza" in data["message"].lower()

def test_chat_endpoint_default():
    response = client.post("/api/chat", json={"message": "random text 123"})
    assert response.status_code == 200
    data = response.json()
    assert "i'm here to help" in data["message"].lower()
