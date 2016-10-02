export function getPixelNumber(column: number, row: number): number {
    return column * 12 + (column % 2 ? row : 11 - row);
}

export function getPixelNumberFromString(ledAddress: string): number {
    const regex = /^([a-e])([1-9]|1[0-2])$/i;

    if (!regex.test(ledAddress)) {
        throw new Error("Incorrect ledAddress. Allowed values: A1-E12");
    }

    const parsed = regex.exec(ledAddress.toUpperCase());
    const column = parsed[1].charCodeAt(0) - 65;
    const row = parseInt(parsed[2], 10) - 1;

    return getPixelNumber(column, row);
}