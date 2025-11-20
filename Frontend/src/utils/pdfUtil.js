import jsPDF from "jspdf";
import letterHead from "../assets/images/letterHead.png";
import "jspdf-autotable";
import html2pdf from "html2pdf.js";

export const generatePDF = (columns, data, title) => {
  const doc = new jsPDF({
    orientation: "landscape", // ✅ Landscape mode
    unit: "mm",
    format: "a3",
  });

  // Add letterhead image
  doc.addImage(letterHead, "PNG", 100, 0, 185, 30);

  // Add title
  doc.setFontSize(25);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 40);

  // Add a subtitle or description
  doc.setFontSize(11);
  doc.text("Created on: " + new Date().toLocaleDateString(), 14, 50);

  // Add a horizontal line
  doc.setLineWidth(0.5);
  doc.line(14, 52, 282, 52);

  // Calculate column widths dynamically
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14; // Left and right margin
  const gap = 2; // Gap between columns in mm
  const tableWidth = pageWidth - margin * 2 - gap * (columns.length - 1);
  const columnWidth = tableWidth / columns.length;

  // Add table headers
  let startY = 60;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  columns.forEach((col, index) => {
    const x = margin + index * (columnWidth + gap);
    doc.text(col, x, startY, { maxWidth: columnWidth });
  });

  // Add table rows
  doc.setFont("helvetica", "normal");
  data.forEach((row) => {
    startY += 10; // Move to the next row
    if (startY > doc.internal.pageSize.getHeight() - 20) {
      // Add a new page if the content exceeds the page height
      doc.addPage();
      startY = 20; // Reset startY for the new page
      // Re-add table headers on the new page
      doc.setFont("helvetica", "bold");
      columns.forEach((col, index) => {
        const x = margin + index * (columnWidth + gap);
        doc.text(col, x, startY, { maxWidth: columnWidth });
      });
      startY += 10; // Move to the next row after headers
      doc.setFont("helvetica", "normal");
    }
    // Draw each cell in the row
    columns.forEach((col, colIndex) => {
      const cellData = row[col] || "0";
      const x = margin + colIndex * (columnWidth + gap);
      const lines = doc.splitTextToSize(cellData.toString(), columnWidth);
      doc.text(lines, x, startY, { maxWidth: columnWidth });
    });
  });

  // Save the PDF
  doc.save(`${title}.pdf`);
};

// generating single data report docx
export function getReportHtml(rowData) {
  // Product Eligibility
  if ("Product" in rowData || "PRODUCT" in rowData) {
    return `
      <div style="display: flex;">
        <!-- Left colored margin -->
        <div style="width: 70px; height: 90vh; background: linear-gradient(180deg, #13005A 0%, #03C988 100%); border-radius: 0px 0 0 0px; margin-right: 10px;"></div>
        <!-- Main report content -->
        <div style="flex: 1;">
          <!-- Logo Section -->
          <img 
            src=${letterHead} 
            alt="letter head"
            style="display: block; max-width: 100%; height: auto; border-radius: 8px; margin: 0px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" 
          />
    
          <!-- Title -->
          <div style="font-weight:bold; font-size:16px; text-transform:uppercase; border-bottom:2px solid #000; padding-bottom:5px; margin-bottom:15px;">
            Product Eligibility ${rowData["Product"]} Rule
          </div>

          <!-- First Row: PRODUCT, SALES DESCRIPTION, SERVICE TYPE -->
          <div style="display:flex; gap:20px; margin-bottom:12px;">
            <div style="flex:1; border:2px solid #007BFF; border-radius:6px; padding:10px;">
              <label style="font-weight:bold;">PRODUCT</label>
              <div>${rowData["Product"]}</div>
            </div>
            <div style="flex:1; border:2px solid #007BFF; border-radius:6px; padding:10px;">
              <label style="font-weight:bold;">SALES DESCRIPTION</label>
              <div>${rowData["Sales Description"]}</div>
            </div>
            <div style="flex:1; border:2px solid #007BFF; border-radius:6px; padding:10px;">
              <label style="font-weight:bold;">SERVICE TYPE</label>
              <div>${rowData["Service type"]}</div>
            </div>
          </div>

          <!-- Second Row: ORDER TYPE, ORDER SUB-TYPE, CONSIDERED FOR PCR, CONSIDERED FOR SLAB -->
          <div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:12px;">
            <div style="flex:1; min-width:200px; border:2px solid #007BFF; border-radius:6px; padding:10px;">
              <label style="font-weight:bold;">ORDER TYPE</label>
              <div>${rowData["Order type"]}</div>
            </div>
            <div style="flex:1; min-width:200px; border:2px solid #007BFF; border-radius:6px; padding:10px;">
              <label style="font-weight:bold;">ORDER SUB-TYPE</label>
              <div>${rowData["Order sub type"]}</div>
            </div>
            <div style="flex:1; min-width:300px; display:flex; gap:10px;">
              <label style="font-weight:bold;">CONSIDERED FOR PCR_</label>
              <div style="background:${
                rowData["Considered for PCR"] === "False"
                  ? "#ffe1e1"
                  : "#e3f5e3"
              }; min-width:140px; color:${
      rowData["Considered for PCR"] === "False" ? "#b71c1c" : "#358438"
    }; padding:6px; text-align:center; border-radius:4px; font-weight:bold;">${
      rowData["Considered for PCR"]
    }</div>
            </div>
            <div style="flex:1; min-width:300px; display:flex; gap:10px;">
              <label style="font-weight:bold;">CONSIDERED FOR SLAB_</label>
              <div style="background:${
                rowData["Considered for slab"] === "False"
                  ? "#ffe1e1"
                  : "#e3f5e3"
              }; min-width:140px; color:${
      rowData["Considered for slab"] === "False" ? "#b71c1c" : "#358438"
    }; padding:6px; text-align:center; border-radius:4px; font-weight:bold;">${
      rowData["Considered for slab"]
    }</div>
            </div>
          </div>

          <!-- ACTIVE Badge -->
          <div style="background:${
            rowData["Status"] === "Inactive" ? "#ffc8c8" : "#e3f5e3"
          }; color:${
      rowData["Status"] === "Inactive" ? "#b71c1c" : "#358438"
    }; font-weight:bold; font-size:20px; text-align:center; padding:8px; border-radius:4px; margin:25px 0 15px 0;">
            ${rowData["Status"]}
          </div>

          <!-- Created / Updated Info -->
          <div style="display:flex; flex-wrap:wrap; gap:20px; margin-bottom:20px;">
            <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
              <label style="font-weight:bold">Created Date</label>
              <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${
                rowData["Created Date"]
              }</label>
            </div>
            <div style="display:flex; flex-direction:column; min-width:240px; flex:1;">
              <label style="font-weight:bold">Created User</label>
              <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${
                rowData["Created User"]
              }</label>
            </div>
            <div style="display:flex; flex-direction:column; min-width:240px; flex:1;">
              <label style="font-weight:bold">Updated Date</label>
              <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${
                rowData["Updated Date"]
              }</label>
            </div>
            <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
              <label style="font-weight:bold">Updated User</label>
              <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${
                rowData["Updated User"]
              }</label>
            </div>
          </div>

          <!-- DECLARATION -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Declaration</div>
        <div style="border:1px solid #999; padding:12px; background-color:#f9f9f9;">
          <p style="margin:0;">
            I hereby declare that the information provided in this report is true, complete, and accurate to the best of my knowledge.
            I understand that any false or misleading statements may result in corrective action and that all data included has been reviewed
            and approved in accordance with institutional standards and compliance guidelines.
          </p>
        </div>

        <!-- Signature Section -->
        <div style="display:flex; justify-content:space-between; margin-top:40px; padding:0 20px;">
          <div style="text-align:center;">
            <div style="border-top:1px solid #000; width:180px; margin-top:30px;"></div>
            <div style="font-size:12px;">DATE</div>
          </div>
          <div style="text-align:center;">
            <div style="border-top:1px solid #000; width:180px; margin-top:30px;"></div>
            <div style="font-size:12px;">SIGNATURE</div>
          </div>
        </div>
    
          <!-- Footer -->
          <div style="text-align:left; padding:4px; font-size:12px; margin-top:30px; color:#666;">© LKC.BUDDHIMA</div>
        </div>
      </div>
    `;
  }
}

// main function to generate single data pdf for rules
export function generateHtml2Pdf(rowData, title) {
  const htmlString = getReportHtml(rowData, title);

  // Create a temporary DOM element
  const container = document.createElement("div");
  container.innerHTML = htmlString;
  document.body.appendChild(container);

  html2pdf()
    .from(container)
    .set({
      margin: [0, 0, 0, 0.3],
      filename: `${title}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    })
    .save()
    .then(() => {
      document.body.removeChild(container);
    });
}

// calculation reports HTML formats
export const getCalReportHtml = (rowData, title, type) => {
  if (type === "Summary Report") {
    return `
      <div style="display: flex;">
        <!-- Left colored margin -->
        <div style="width: 70px; height: 90vh; background: linear-gradient(180deg, #3F0071 0%, #332FD0 100%); border-radius: 0px 0 0 0px; margin-right: 10px;"></div>
        <!-- Main report content -->
        <div style="flex: 1;">
          <!-- Logo Section -->
          <img 
            src=${letterHead} 
            alt="letter head"
            style="display: block; max-width: 100%; height: auto; border-radius: 8px; margin: 0px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" 
          />
    
        <!-- Title -->
        <h1 style="text-align:center; font-size:20px; font-weight:bold; margin-bottom:20px; text-transform:uppercase;">${title}</h1>

        <!-- SALES DETAILS -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Sales Details</div>
        <div style="display:flex; flex-wrap:wrap; gap:15px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Employee Number</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Service Number"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Sales Channel</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Sales Channel"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Sales Month</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Sales Month"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Salary Month</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Salary Month"]}</label>
          </div>
        </div>

        <!-- OTHER -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Other</div>
        <div style="display:flex; gap:15px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column;flex:1;">
            <label style="font-weight:bold">Active Sales</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Active Sales"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; flex:1;">
            <label style="font-weight:bold">Slab Level</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Slab Level"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; flex:1;">
            <label style="font-weight:bold">Total Tx</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Total TX"]}</label>
          </div>
        </div>

        <!-- SALES COUNT BY TYPES -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Sales Count by Types</div>
        <div style="display:flex; flex-wrap:wrap; gap:15px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Total FTTH</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Total FTTH"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Total LTE</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Total LTE"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Total PEO</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Total PEO"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Total COPPER</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Total COPPER"]}</label>
          </div>
        </div>

        <!-- COMMISSION DETAILS -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Commission Details</div>
        <div style="display:flex; flex-wrap:wrap; gap:15px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Total PCR</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Total PCR"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Total Commission</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Eligible PCR"]}</label>
          </div>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:15px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">STAGE 1 PAYABLE</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Stage 1 Incentive"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">STAGE 2 PAYABLE</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Stage 2 Incentive"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">STAGE 3 PAYABLE</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Stage 3 Incentive"]}</label>
          </div>
        </div>

        <!-- DECLARATION -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Declaration</div>
        <div style="border:1px solid #999; padding:12px; background-color:#f9f9f9;">
          <p style="margin:0;">
            I hereby declare that the information provided in this report is true, complete, and accurate to the best of my knowledge.
            I understand that any false or misleading statements may result in corrective action and that all data included has been reviewed
            and approved in accordance with institutional standards and compliance guidelines.
          </p>
        </div>

        <!-- Signature Section -->
        <div style="display:flex; justify-content:space-between; margin-top:40px; padding:0 20px;">
          <div style="text-align:center;">
            <div style="border-top:1px solid #000; width:180px; margin-top:30px;"></div>
            <div style="font-size:12px;">DATE</div>
          </div>
          <div style="text-align:center;">
            <div style="border-top:1px solid #000; width:180px; margin-top:30px;"></div>
            <div style="font-size:12px;">SIGNATURE</div>
          </div>
        </div>
    
          <!-- Footer -->
          <div style="text-align:left; padding:4px; font-size:12px; margin-top:30px; color:#666;">© LKC.BUDDHIMA</div>
        </div>
      </div>
    `;
  } else if (type === "M3 Report") {
    return `<!-- Header Logos -->
      <img 
        src=${letterHead} 
        alt="letter head"
        style="display: block; max-width: 100%; height: auto; border-radius: 8px; margin: 0px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" 
      />


  <!-- Title -->
  <div style="text-align:center; background:#ffc000; color:#fff; padding:8px; font-weight:bold; text-transform:uppercase; font-size:20px; margin-bottom:20px;">
    Product Wise Summary Report - M3
  </div>

  <!-- Form Fields -->
  <div style="display:flex; flex-wrap:wrap; gap:20px; margin-bottom:20px;">
    <div style="display:flex; flex-direction:column; flex:1; min-width:180px;">
      <label>Service Number</label>
      <label style="border:1px solid #ccc; padding:6px; border-radius:4px; margin-top:8px;">MERN-0001</label>
    </div>
    <div style="display:flex; flex-direction:column; flex:1; min-width:180px;">
      <label>Sales Person Name</label>
      <label style="border:1px solid #ccc; padding:6px; border-radius:4px; margin-top:8px;">K.G.B.C.Lakmal</label>
    </div>
    <div style="display:flex; flex-direction:column; flex:1; min-width:180px;">
      <label>Eligibility Level</label>
      <label style="border:1px solid #ccc; padding:6px; border-radius:4px; margin-top:8px;">3</label>
    </div>
    <div style="display:flex; flex-direction:column; flex:1; min-width:180px;">
      <label>STG 1 Payable</label>
      <label style="border:1px solid #ccc; padding:6px; border-radius:4px; margin-top:8px;">25000.00</label>
    </div>
  </div>

  <!-- Two-column table layout using flex -->
  <div style="display: flex; flex-wrap: wrap; gap:20px;">

    <!-- Table Block -->
    <div style="flex: 1 1 calc(50% - 10px); border: 1px solid #ffc000; margin-bottom: 20px;">
      <div style="background-color: #ffc000; color:#fff; padding: 6px; font-weight: bold;">FTTH NEW</div>
      <div style="display: flex; font-weight: bold; background-color: #fff;">
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">S</div>
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">S_PCR</div>
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">DC_M3</div>
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">DC_M3_PCR</div>
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">PCR_M3</div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
      </div>
    </div>

    <!-- Repeat the block for other sections -->
    <div style="flex: 1 1 calc(50% - 10px); border: 1px solid #ffc000; margin-bottom: 20px;">
      <div style="background-color: #ffc000; color:#fff; padding: 6px; font-weight: bold;">FTTH RECONNECTION</div>
      <div style="display: flex; font-weight: bold;">
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">S</div>
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">S_PCR</div>
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">DC_M3</div>
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">DC_M3_PCR</div>
        <div style="flex: 1; padding: 6px; border: 1px solid #ffc000;">PCR_M3</div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
        <div style="flex: 1; padding: 20px; border: 1px solid #ffc000;">&nbsp;</div>
      </div>
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align:left; padding:4px; font-size:12px; margin-top:40px; color:#666;">© LKC.BUDDHIMA</div>`;
  } else if (type === "Detailed Report") {
    return `
      <div style="display: flex;">
        <!-- Left colored margin -->
        <div style="width: 70px; height: 90vh; background: linear-gradient(180deg, #A86523 0%, #F3C623 100%); border-radius: 0px 0 0 0px; margin-right: 10px;"></div>
        <!-- Main report content -->
        <div style="flex: 1;">
          <!-- Logo Section -->
          <img 
            src=${letterHead} 
            alt="letter head"
            style="display: block; max-width: 100%; height: auto; border-radius: 8px; margin: 0px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" 
          />
    
        <!-- Title -->
        <h1 style="text-align:center; font-size:20px; font-weight:bold; margin-bottom:20px; text-transform:uppercase;">${title}</h1>

        <!-- SALES DETAILS -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Sales Details</div>
        <div style="display:flex; flex-wrap:wrap; gap:15px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column; min-width:200px; flex:1;">
            <label style="font-weight:bold">Service ID</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Service ID"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Employee Number</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Service Number"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Sales Month</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Sales Month"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Sales Channel</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Sales Channel"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Account Number</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Account Number"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:220px; flex:1;">
            <label style="font-weight:bold">OSS SOID</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["OSS SOID"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Tariff ID</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Tariff ID"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Tariff Name</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Tariff Name"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Customer Type</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Customer Type"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Calculation Type</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Calculation Type"]}</label>
          </div>
        </div>

        <!-- OTHER -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Other</div>
        <div style="display:flex; gap:15px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column;flex:1;">
            <label style="font-weight:bold">Order Type</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Order Type"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; flex:1;">
            <label style="font-weight:bold">Order Sub Type</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Order Sub Type"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; flex:1;">
            <label style="font-weight:bold">INC Category</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["INC Category"]}</label>
          </div>
        </div>

        <!-- SALES COUNT BY TYPES -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Sales Details</div>
        <div style="display:flex; flex-wrap:wrap; gap:15px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">BSS Status</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["BSS Status"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">PCR Amount</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["PCR Amount"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Bearer Commission</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Bearer Commission"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Performa Eligibility</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Performa Eligibility"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Cupon Sales</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Cupon Sales"]}</label>
          </div>
          <div style="display:flex; flex-direction:column; min-width:140px; flex:1;">
            <label style="font-weight:bold">Salary Month</label>
            <label style="border:1px solid #004AAD; padding:6px; border-radius:4px; margin-top:8px;">${rowData["Salary Month"]}</label>
          </div>
        </div>

        <!-- DECLARATION -->
        <div style="font-weight:bold; color:#004AAD; margin-top:20px; margin-bottom:8px; text-transform:uppercase; font-size:14px;">Declaration</div>
        <div style="border:1px solid #999; padding:12px; background-color:#f9f9f9;">
          <p style="margin:0;">
            I hereby declare that the information provided in this report is true, complete, and accurate to the best of my knowledge.
            I understand that any false or misleading statements may result in corrective action and that all data included has been reviewed
            and approved in accordance with institutional standards and compliance guidelines.
          </p>
        </div>

        <!-- Signature Section -->
        <div style="display:flex; justify-content:space-between; margin-top:40px; padding:0 20px;">
          <div style="text-align:center;">
            <div style="border-top:1px solid #000; width:180px; margin-top:30px;"></div>
            <div style="font-size:12px;">DATE</div>
          </div>
          <div style="text-align:center;">
            <div style="border-top:1px solid #000; width:180px; margin-top:30px;"></div>
            <div style="font-size:12px;">SIGNATURE</div>
          </div>
        </div>
    
          <!-- Footer -->
          <div style="text-align:left; padding:4px; font-size:12px; margin-top:30px; color:#666;">© LKC.BUDDHIMA</div>
        </div>
      </div>
    `;
  }
};

// this reports are generated for calculation data tables
export function generateCalculationReportHtml2Pdf(rowData, title, type) {
  const htmlString = getCalReportHtml(rowData, title, type);

  // Create a temporary DOM element
  const container = document.createElement("div");
  container.innerHTML = htmlString;
  document.body.appendChild(container);

  html2pdf()
    .from(container)
    .set({
      margin: [0, 0, 0, 0.3],
      filename: `${type}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    })
    .save()
    .then(() => {
      document.body.removeChild(container);
    });
}
