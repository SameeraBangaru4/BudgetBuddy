from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from models import Transaction, BudgetSummary, ShoppingList, ShoppingItem
import database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    database.create_tables()
    database.create_reminders_table()

@app.get("/")
def read_root():
    return {"message": "Personal Budget Manager API is running."}

# Shopping List Endpoints
@app.post("/shopping-lists/", response_model=int)
def create_shopping_list(title: str):
    return database.create_shopping_list(title)

@app.get("/shopping-lists/", response_model=List[ShoppingList])
def get_shopping_lists():
    lists = database.get_shopping_lists()
    return [ShoppingList(id=l['id'], title=l['title'], items=[ShoppingItem(**item) for item in l['items']]) for l in lists]

@app.post("/shopping-lists/{list_id}/items", response_model=int)
def add_item_to_list(list_id: int, name: str, quantity: int = 1):
    return database.add_item_to_list(list_id, name, quantity)

@app.patch("/shopping-items/{item_id}/checked")
def update_item_checked(item_id: int, checked: bool):
    database.update_item_checked(item_id, checked)
    return {"success": True}

@app.delete("/shopping-items/{item_id}")
def delete_item(item_id: int):
    database.delete_item(item_id)
    return {"success": True}

@app.delete("/shopping-lists/{list_id}")
def delete_shopping_list(list_id: int):
    database.delete_shopping_list(list_id)
    return {"success": True}

# Reminders Endpoints
from models import Reminder
from fastapi import Body

@app.post("/reminders/", response_model=int)
def add_reminder(reminder: Reminder = Body(...)):
    return database.add_reminder(reminder.title, reminder.date, reminder.time)

@app.get("/reminders/", response_model=List[Reminder])
def list_reminders():
    return database.get_reminders()

@app.delete("/reminders/{reminder_id}")
def delete_reminder(reminder_id: int):
    database.delete_reminder(reminder_id)
    return {"success": True}

# Budget Endpoints
@app.post("/transactions/", response_model=int)
def add_transaction(transaction: Transaction):
    return database.add_transaction(transaction)

@app.get("/transactions/", response_model=List[Transaction])
def list_transactions():
    return database.get_transactions()

@app.get("/budget/summary", response_model=BudgetSummary)
def budget_summary():
    summary = database.get_budget_summary()
    return BudgetSummary(**summary)
