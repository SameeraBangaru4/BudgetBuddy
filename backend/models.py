from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class Transaction(BaseModel):
    id: Optional[int] = None
    date: date
    amount: float
    category: str
    description: Optional[str] = None
    type: str  # 'income' or 'expense'

class BudgetSummary(BaseModel):
    total_income: float
    total_expense: float
    balance: float

class ShoppingItem(BaseModel):
    id: Optional[int] = None
    name: str
    quantity: int = 1
    checked: bool = False

class ShoppingList(BaseModel):
    id: Optional[int] = None
    title: str
    items: List[ShoppingItem] = []

class Reminder(BaseModel):
    id: Optional[int] = None
    title: str
    date: str
    time: str
