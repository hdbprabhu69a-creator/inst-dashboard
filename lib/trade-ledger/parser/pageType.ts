export type ContractPageType=

    |"HEADER"
    |"ANNEXURE"
    |"CHARGES"
    |"SUMMARY"
    |"UNKNOWN";

export function detectPageType(
    text:string
):ContractPageType{

    if(
        text.includes("Annexure A")
        &&
        text.includes("Order No.")
    ){
        return "ANNEXURE";
    }

    if(
        text.includes("Contract Note")
        ||
        text.includes("Client Code")
        ||
        text.includes("Trade Date")
    ){
        return "HEADER";
    }

    if(
        text.includes("STT")
        ||
        text.includes("Stamp Duty")
        ||
        text.includes("Exchange Transaction")
        ||
        text.includes("GST")
    ){
        return "CHARGES";
    }

    if(
        text.includes("Net Amount")
        ||
        text.includes("Net obligation")
        ||
        text.includes("Pay in")
        ||
        text.includes("Pay out")
    ){
        return "SUMMARY";
    }

    return "UNKNOWN";

}
