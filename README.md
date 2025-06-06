# 🗺️ Kapitour

Sistema de roteiros turísticos com **FastAPI** no backend e **React** no frontend.

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js (LTS)](https://nodejs.org/)

---

## 🔧 Instalação

1. **Baixe ou clone este repositório** e acesse a pasta do projeto:

```bash
git clone https://github.com/seu-usuario/maricatour.git
cd maricatour
Crie e ative o ambiente virtual (venv):
python -m venv venv

# Ativando no Windows:
venv\Scripts\activate

# Ou no Linux/macOS:
source venv/bin/activate


Instale as dependências do backend:
pip install fastapi uvicorn osmnx flask scikit-learn pydantic typing folium networkx 


Instale as dependências do frontend:
npm install

---
## ▶️ Execução

2. **Comandos para inicio do projeto**:

```bash
🧠 Backend (FastAPI)
Na raiz do projeto, execute:
uvicorn main:app --reload --port 5000


A API será executada em: http://127.0.0.1:5000

🌐 Frontend (React)
Dentro da pasta frontend, execute:
npm start


O site será aberto em: http://localhost:3000
