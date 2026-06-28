"use client";

import {
useState,
} from "react";

export type CrosshairState={

open:number;

high:number;

low:number;

close:number;

volume:number;

time:string;

};

export function useCrosshair(){

const[state,setState]=

useState<CrosshairState>({

open:0,

high:0,

low:0,

close:0,

volume:0,

time:"",

});

return{

crosshair:state,

setCrosshair:setState,

};

}
