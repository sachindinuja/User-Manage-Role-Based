from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime
from database import DatabaseManager
from calculator import IncentiveCalculator
from config import DATABASE_CONFIG

app = FastAPI(
    title="Sales Incentive API",
    description="API for Sales Performance & Incentive Calculation System",
    version="3.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = DatabaseManager()
    try:
        yield db
    finally:
        db.close()

# Request models
class CalculationRequest(BaseModel):
    sales_month: str
    calculation_type: str  # "assumed" or "real-stage1"

class EmployeeSummary(BaseModel):
    employee_number: str
    sales_chanal: str
    sales_month: str
    calculation_type: str
    slab_level: int
    total_pcr: float
    eligible_pcr: float
    total_ftth: int
    total_lte: int
    total_peo: int
    total_copper: int
    active_sales: int
    total_tx: int
    assumed_incentive: float
    stage1_incentive: float
    stage2_incentive: float
    stage3_incentive: float
    calculation_date: datetime

class DetailedResult(BaseModel):
    employee_number: str
    sales_chanal: str
    sales_month: str
    order_line_oss_order_id: str
    tariff_id: str
    tariff_name: str
    inc_category: str
    bss_status: str
    pcr_amount: float
    bearer_commission: float
    calculation_type: str
    service_id: Optional[str]
    account_num: Optional[str]
    service_name: Optional[str]
    order_type: Optional[str]
    order_sub_type: Optional[str]
    customer_type: Optional[str]
    performa_eligibility: Optional[str]
    cupon_sales: Optional[str]
    calculation_date: datetime

class IneligibleResult(BaseModel):
    employee_number: str
    sales_chanal: str
    sales_month: str
    slab_level: int
    total_pcr: float
    eligible_pcr: float
    total_ftth: int
    total_lte: int
    total_peo: int
    total_copper: int
    active_sales: int
    total_tx: int
    assumed_incentive: float
    stage1_incentive: float
    stage2_incentive: float
    stage3_incentive: float
    calculation_type: str
    calculation_date: datetime
    
@app.get('/')
def read_root():
    return {'message': 'API for Sales Performance & Incentive Calculation System'}

# Endpoints
@app.post("/calculate")
async def run_calculation(request: CalculationRequest, db: DatabaseManager = Depends(get_db)):
    calculator = IncentiveCalculator(db)
    
    try:
        if request.calculation_type == "assumed":
            calculator.run_assumed_calculation(request.sales_month)
            return {"message": f"Assumed calculation completed for {request.sales_month}"}
        
        elif request.calculation_type == "real-stage1":
            calculator.run_real_calculation_stage1(request.sales_month)
            return {"message": f"Real Stage 1 calculation completed for {request.sales_month}"}
        
        else:
            raise HTTPException(status_code=400, detail="Invalid calculation type. Use 'assumed' or 'real-stage1'")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/results/summary", response_model=List[EmployeeSummary])
async def get_employee_summary(db: DatabaseManager = Depends(get_db)):
    try:
        results = db.get_employee_summary()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/results/detailed", response_model=List[DetailedResult])
async def get_detailed_results(db: DatabaseManager = Depends(get_db)):
    try:
        results = db.get_detailed_results()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/results/ineligible", response_model=List[IneligibleResult])
async def get_ineligible_results(db: DatabaseManager = Depends(get_db)):
    try:
        results = db.get_ineligible_slab_results()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status")
async def database_status(db: DatabaseManager = Depends(get_db)):
    try:
        db.check_database_status()
        return {"status": "Database connection active"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8800, reload=True) # changes