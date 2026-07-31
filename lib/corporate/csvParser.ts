import Papa,{
    ParseError
} from "papaparse";

export function parseCorporateAnnouncements(
    csv:string
):Record<string,string>[]{

    const result=
        Papa.parse<Record<string,string>>(csv,{

            header:true,

            skipEmptyLines:true,

            transformHeader:(header:string)=>
                header.trim()

        });

    if(result.errors.length){

        throw new Error(

            result.errors
                .map((e:ParseError)=>e.message)
                .join(", ")

        );

    }

    return result.data;

}

