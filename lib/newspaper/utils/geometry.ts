import type {BoundingBox} from "../types/parserTypes";

export function intersects(a:BoundingBox,b:BoundingBox):boolean{

return !(
a.x+a.width<b.x ||
b.x+b.width<a.x ||
a.y+a.height<b.y ||
b.y+b.height<a.y
);

}

