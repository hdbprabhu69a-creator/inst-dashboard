import ExcelJS from "exceljs";

export function createHistoryWorkbook(){

    const wb = new ExcelJS.Workbook();

    wb.creator = "Institution Dashboard";
    wb.created = new Date();
    wb.modified = new Date();

    return wb;

}

export function createSummarySheet(
    wb: ExcelJS.Workbook
){

    const ws =
        wb.addWorksheet("Summary");

    ws.columns = [

        {
            header:"Symbol",
            key:"symbol",
            width:18
        },

        {
            header:"Instrument Token",
            key:"token",
            width:18
        },

        {
            header:"Candles",
            key:"candles",
            width:12
        },

        {
            header:"Latest Date",
            key:"latest",
            width:16
        },

        {
            header:"Earliest Date",
            key:"earliest",
            width:16
        }

    ];

    ws.getRow(1).font = {
        bold:true
    };

    ws.views = [
        {
            state:"frozen",
            ySplit:1
        }
    ];

    ws.autoFilter = "A1:E1";

    return ws;

}
