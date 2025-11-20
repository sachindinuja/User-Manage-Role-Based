import React from "react";
import ShinyText from "../common/ShinyText";
import {
  ShieldAlert,
  ShieldBan,
  ShieldCheck,
  ShieldCloseIcon,
} from "lucide-react";
import { Flex, Progress, Tooltip } from "antd";
import { GaugeComponent } from "react-gauge-component";

function StageCards({ stages }) {
  return (
    <div>
      {/* Stage cards */}
      {stages.map(({ stage_color, stage_name, Total_sales }) => (
        <>
          <div className="flex gap-3 mt-10 items-center">
            {/* card section start */}
            <div className="bg-white h-full rounded-2xl mb-2 w-[80%]">
              <h1
                className={`${stage_color} text-white h-15 flex justify-center items-center rounded-t-2xl uppercase`}
              >
                {stage_name}
              </h1>
              {/* middle cards */}
              <div className="grid grid-cols-4 p-4 gap-5">
                <div className="bg-white shadow-md flex items-center rounded-2xl p-4 gap-5">
                  <div className="bg-amber-400 p-2 rounded-md">
                    <ShieldAlert size={32} color="#fff" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-md font-bold text-gray-400 uppercase">
                      Total sales
                    </h1>
                    <p className="text-4xl font-bold text-amber-400">25</p>
                  </div>
                </div>
                <div className="bg-white shadow-md flex items-center rounded-2xl p-4 gap-5">
                  <div className="bg-red-500 p-2 rounded-md">
                    <ShieldBan size={32} color="#fff" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-md font-bold text-gray-400 uppercase">
                      Total TX
                    </h1>
                    <p className="text-4xl font-bold text-red-500">3</p>
                  </div>
                </div>
                <div className="bg-white shadow-md flex items-center rounded-2xl p-4 gap-5">
                  <div className="bg-gray-500 p-2 rounded-md">
                    <ShieldCloseIcon size={32} color="#fff" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-md font-bold text-gray-400 uppercase">
                      Performa Fail
                    </h1>
                    <p className="text-4xl font-bold text-gray-500">3</p>
                  </div>
                </div>
                <div className="bg-white shadow-md flex items-center rounded-2xl p-4 gap-5">
                  <div className="bg-green-500 p-2 rounded-md">
                    <ShieldCheck size={32} color="#fff" />
                  </div>
                  <div className="flex flex-col text-center">
                    <h1 className="text-md font-bold text-gray-400 uppercase">
                      Total Active sales
                    </h1>
                    <p className="text-4xl font-bold text-green-500">22</p>
                  </div>
                </div>
              </div>

              {/* table design for stages */}
              <div className="">
                <table className="w-[95%] px-5 mx-5">
                  <thead>
                    <tr>
                      <th className="py-3 bg-primary text-xs font-medium text-white uppercase rounded-md">
                        BEARER-TYPES
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase rounded-tl-md rounded-bl-md`}
                      >
                        FTTH-AB-CREATE
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        FTTH-AB-UPGRADE
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        FTTH-AB-RECON
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        LTE-AB
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        BB-FTTH
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        BB-LTE
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        PEO-COPPER
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        PEO-FTTH
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        PEO-LTE
                      </th>
                      <th
                        className={`${stage_color} px-4 text-center text-xs font-medium text-white uppercase`}
                      >
                        ADSL
                      </th>
                      <th
                        className={`${stage_color} px-4 rounded-tr-md rounded-br-md text-center text-xs font-medium text-white uppercase`}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="mt-2">
                      <td className={`py-3 text-sm font-medium text-center`}>
                        SALES
                      </td>
                      <td className={`py-3 text-sm text-center `}>3</td>
                      <td className={`py-3 text-sm text-center `}>2</td>
                      <td className={`py-3 text-sm text-center `}>15</td>
                      <td className={`py-3 text-sm text-center `}>3</td>
                      <td className={`py-3 text-sm text-center `}>3</td>
                      <td className={`py-3 text-sm text-center `}>2</td>
                      <td className={`py-3 text-sm text-center `}>15</td>
                      <td className={`py-3 text-sm text-center `}>0</td>
                      <td className={`py-3 text-sm text-center `}>NA</td>
                      <td className={`py-3 text-sm text-center `}>5</td>
                      <td className={`py-3 text-sm text-center font-bold`}>
                        25
                      </td>
                    </tr>
                    <tr className="mt-2">
                      <td className={`py-3 text-sm font-medium text-center`}>
                        TX
                      </td>
                      <td className={`py-3 text-sm text-center `}>1</td>
                      <td className={`py-3 text-sm text-center `}>1</td>
                      <td className={`py-3 text-sm text-center `}>1</td>
                      <td className={`py-3 text-sm text-center `}>1</td>
                      <td className={`py-3 text-sm text-center `}>1</td>
                      <td className={`py-3 text-sm text-center `}>1</td>
                      <td className={`py-3 text-sm text-center `}>1</td>
                      <td className={`py-3 text-sm text-center `}>0</td>
                      <td className={`py-3 text-sm text-center `}>0</td>
                      <td className={`py-3 text-sm text-center `}>0</td>
                      <td className={`py-3 text-sm text-center font-bold`}>
                        3
                      </td>
                    </tr>
                    <tr className="mt-2">
                      <td className={`py-3 text-sm font-medium text-center`}>
                        TOTAL ACTIVE SALES
                      </td>
                      <td className={`py-3 text-sm text-center `}>2</td>
                      <td className={`py-3 text-sm text-center `}>1</td>
                      <td className={`py-3 text-sm text-center `}>14</td>
                      <td className={`py-3 text-sm text-center `}>14</td>
                      <td className={`py-3 text-sm text-center `}>14</td>
                      <td className={`py-3 text-sm text-center `}>14</td>
                      <td className={`py-3 text-sm text-center `}>14</td>
                      <td className={`py-3 text-sm text-center `}>0</td>
                      <td className={`py-3 text-sm text-center `}>NA</td>
                      <td className={`py-3 text-sm text-center `}>5</td>
                      <td className={`py-3 text-sm text-center font-bold`}>
                        22
                      </td>
                    </tr>
                    <tr className="mt-2">
                      <td className={`py-3 text-sm font-medium text-center`}>
                        PCR VALUES (LKR)
                      </td>
                      <td className={`py-3 text-sm text-center `}>2000</td>
                      <td className={`py-3 text-sm text-center `}>2000</td>
                      <td className={`py-3 text-sm text-center `}>2000</td>
                      <td className={`py-3 text-sm text-center `}>2000</td>
                      <td className={`py-3 text-sm text-center `}>2000</td>
                      <td className={`py-3 text-sm text-center `}>1000</td>
                      <td className={`py-3 text-sm text-center `}>14000</td>
                      <td className={`py-3 text-sm text-center `}>0</td>
                      <td className={`py-3 text-sm text-center `}>NA</td>
                      <td className={`py-3 text-sm text-center `}>5000</td>
                      <td className={`py-3 text-sm text-center font-bold`}>
                        22000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* card footer */}
              <div className="grid grid-cols-5 rounded-b-2xl mt-10 h-25 bg-white">
                <div className="flex flex-col p-4 justify-center items-center">
                  <h1 className="text-gray-700 text-md">TOTAL PCR</h1>
                  <p className="text-3xl font-bold">22000.00</p>
                </div>
                <div className="flex flex-col p-4 justify-center items-center rounded-bl-2xl">
                  <h1 className="text-gray-500 text-md">SLAB LEVEL</h1>
                  <p className="text-3xl font-bold">3|100%</p>
                </div>
                <div className="flex flex-col p-4 justify-center items-center">
                  <h1 className="text-gray-700 text-md">ELIGIBLE PCR</h1>
                  <p className="text-3xl font-bold">12000.00</p>
                </div>
                <div
                  className={`col-span-2 flex flex-col p-4 justify-center items-center ${stage_color} rounded-br-2xl rounded-tl-2xl`}
                >
                  <h1 className="text-gray-100 text-md uppercase">
                    {stage_name} COMMISSION
                  </h1>
                  <ShinyText
                    text={"5000.50"}
                    disabled={false}
                    speed={3}
                    className="custom-class text-4xl font-bold"
                  />
                </div>
              </div>
            </div>
            {/* charts section starts here */}
            <div className=" h-auto w-[20%]">
              {/* doughnut chart for stage 1 */}
              <div className="p-5 col-span-1 rounded-lg shadow-md bg-black/50 backdrop-blur-2xl">
                <h2 className="p-2 mb-2 font-semibold text-white uppercase">
                  {stage_name} Total Sales Count By SLAB Level
                </h2>
                <GaugeComponent
                  id="gauge-component5"
                  minValue={10} // Set starting value
                  maxValue={150} // Set your custom end value
                  arc={{
                    gradient: false,
                    width: 0.25,
                    padding: 0,
                    subArcs: [
                      {
                        limit: 30,
                        color: "#F5CD19",
                        showTick: true,
                      },
                      {
                        limit: 50,
                        color: "#5BE12C",
                        showTick: true,
                      },
                      {
                        color: "#5BE12C",
                      },
                    ],
                  }}
                  value={Total_sales}
                  pointer={{
                    type: "arrow",
                    elastic: true,
                    animate: true,
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
}

export default StageCards;
