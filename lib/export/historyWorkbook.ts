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

export function createStockSheet(
    wb: ExcelJS.Workbook,
    symbol:string
){

    const ws=
        wb.addWorksheet(
            symbol.substring(0,31)
        );

    ws.columns=[

        {
            header:"Date",
            key:"date",
            width:15
        },

        {
            header:"Open",
            key:"open",
            width:12
        },

        {
            header:"High",
            key:"high",
            width:12
        },

        {
            header:"Low",
            key:"low",
            width:12
        },

        {
            header:"Close",
            key:"close",
            width:12
        },

        {
            header:"Volume",
            key:"volume",
            width:18
        },

        {
            header:"Instrument Token",
            key:"token",
            width:18
        }

    ];

    ws.getRow(1).font={
        bold:true
    };

    ws.views=[
        {
            state:"frozen",
            ySplit:1
        }
    ];

    ws.autoFilter="A1:G1";

    ws.getColumn("date").numFmt="dd-mm-yyyy";

    return ws;

}

