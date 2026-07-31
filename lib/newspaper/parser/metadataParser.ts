export interface NewspaperMetadata{

    edition:string;

    date:string;

    pages:number;

    volume:string;

    issue:string;

}

export function parseMetadata(text:string):NewspaperMetadata{

    const first=text
        .split(/\r?\n/)
        .find(x=>x.trim().length>10) ?? "";

    const clean=first
        .replace(/\s+/g," ")
        .trim();

    const edition=
        clean.match(/^([A-Z]+)/)?.[1] ?? "";

    const date=
        clean.match(/(?:MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)\s*[·•]?\s*(.*?)(?=\s+[fF]\s+\d+|\s+Pages)/i)?.[1]?.trim() ?? "";

    const pages=
        Number(
            clean.match(/Pages\s+(\d+)/i)?.[1] ?? 0
        );

    const volume=
        clean.match(/Volume\s+([A-Za-z0-9]+)/i)?.[1] ?? "";

    const issue=
        clean.match(/Number\s+([A-Za-z0-9]+)/i)?.[1] ?? "";

    return{

        edition,

        date,

        pages,

        volume,

        issue

    };

}

