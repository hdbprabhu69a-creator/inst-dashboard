import type {TradeSummary} from "../contractNoteTypes";
import type {PdfTextItem} from "../pdf/textItems";

export function parseSummary(
    items:PdfTextItem[]
):TradeSummary{

    const text=items.map(i=>i.text).join(" ");

    const nums=text.match(/-?\d+\.\d+|-?\d+/g) ?? [];

    return{

        isin:/INE[A-Z0-9]+/.exec(text)?.[0] ?? "",

        symbol:/INE[A-Z0-9]+\s+([A-Z]+)/.exec(text)?.[1] ?? "",

        buyQty:Number(nums[0] ?? 0),

        sellQty:Number(nums[5] ?? 0),

        averagePrice:Number(nums[1] ?? 0),

        buyValue:Number(nums[4] ?? 0),

        sellValue:Number(nums[9] ?? 0),

        netQty:Number(nums[10] ?? 0),

        netObligation:Number(nums[11] ?? 0)

    };

}
