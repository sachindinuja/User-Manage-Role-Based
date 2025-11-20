import React from "react";
export function RecentProductsTable() {
  const products = [
    {
      product: "LTE Package",
      type: "Postpaid",
      status: "Active",
      pcr: true,
      orderType: "New Connection",
    },
    {
      product: "BB Package",
      type: "Prepaid",
      status: "Active",
      pcr: true,
      orderType: "Direct Sale",
    },
    {
      product: "PEO TV Package",
      type: "Postpaid",
      status: "Active",
      pcr: true,
      orderType: "Old Connection",
    },
    {
      product: "Mobile Package",
      type: "Postpaid",
      status: "Active",
      pcr: false,
      orderType: "Old Connection",
    },
    {
      product: "Gaming Package",
      type: "Prepaid",
      status: "Active",
      pcr: false,
      orderType: "Old Connection",
    },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white border-b border-gray-700">
            <th className="pb-3 font-medium">Product</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium">PCR</th>
            <th className="pb-3 font-medium">Order Type</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {products.map((product, index) => (
            <tr key={index} className="border-b border-gray-800">
              <td className="py-3 font-semibold text-white">
                {product.product}
              </td>
              <td className="py-3 font-semibold text-gray-200">
                {product.type}
              </td>
              <td className="py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.pcr
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-gray-500/10 text-red-500"
                  }`}
                >
                  {product.pcr ? "Yes" : "No"}
                </span>
              </td>
              <td className="py-3 text-white">{product.orderType}</td>
              <td className="py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
