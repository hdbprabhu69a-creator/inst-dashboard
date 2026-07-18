import ExcelJS from "exceljs";

import type {ContractNote} from "../types";

export async function exportTradesToExcel(

  notes:ContractNote[],

  outputPath:string

){

  const workbook=new ExcelJS.Workbook();

  const sheet=workbook.addWorksheet("Trades");

  sheet.columns=[

    {header:"Trade Date",key:"tradeDate",width:15},
    {header:"Order No",key:"orderNo",width:20},
    {header:"Trade No",key:"tradeNo",width:15},
    {header:"Order Time",key:"orderTime",width:12},
    {header:"Trade Time",key:"tradeTime",width:12},
    {header:"Symbol",key:"symbol",width:18},
    {header:"ISIN",key:"isin",width:18},
    {header:"Exchange",key:"exchange",width:10},
    {header:"Side",key:"side",width:10},
    {header:"Quantity",key:"quantity",width:12},
    {header:"Brokerage",key:"brokerage",width:12},
    {header:"Price",key:"price",width:12},
    {header:"Gross Value",key:"grossValue",width:15},
    {header:"Value",key:"value",width:15},
    {header:"Segment",key:"segment",width:10}

  ];

  sheet.getRow(1).font={bold:true,name:"Verdana",size:12};

  for(const note of notes){

    for(const trade of note.trades){

      sheet.addRow(trade);

    }

  }

  sheet.eachRow(row=>{

    row.font={name:"Verdana",size:12};

  });

  await workbook.xlsx.writeFile(outputPath);

}
