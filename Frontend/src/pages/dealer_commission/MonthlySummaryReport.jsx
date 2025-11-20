import React from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/dealer_commission/DataTable";
import DCard from "../../components/common/DCard";
import { columns, data } from "../../data/dealer_commission/CommissionData";

function DealerCommissionSummary() {
  return (
    <div className="block">
      {/* Header */}
      <PageHeader title="Dealer Commission Summary" />

      {/* Analytics */}
      <main>
        <div className="grid grid-cols-3 gap-4">
          <DCard>
            <h1>Total Dealers</h1>
            <p>{data.length}</p>
          </DCard>
          <DCard>
            <h1>Total Dec I (LKR)</h1>
            <p>{data.reduce((sum, item) => sum + item["Dec I (LKR)"], 0).toFixed(2)}</p>
          </DCard>
          <DCard>
            <h1>Total Oct II (LKR)</h1>
            <p>{data.reduce((sum, item) => sum + item["Oct II (LKR)"], 0).toFixed(2)}</p>
          </DCard>
        </div>
      </main>

      {/* Data Table */}
      <div className="m-4">
        <DataTable columns={columns} data={data} title="Dealer Commission Details" />
      </div>
    </div>
  );
}

export default DealerCommissionSummary;