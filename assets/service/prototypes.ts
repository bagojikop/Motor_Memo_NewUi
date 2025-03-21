
declare global {
    interface Number {
        round(decimals:number): number;
    }

}



if (!Number.prototype.round)

    Number.prototype.round = function  (decimals: number): number {
        return Number(Math.round(Number(this+ "e+" + decimals)) + "e-" + decimals);
    }

    export {};