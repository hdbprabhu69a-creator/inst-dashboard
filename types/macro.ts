export interface MacroRow{
    id:string;
    indicator:string;
    current:string;
    previous:string;
    unit:string;
    nextRelease:string;
    frequency:string;
    source:string;
    updatedAt:string;
    status:"Updated"|"Pending"|"Due"|"Overdue";
}
