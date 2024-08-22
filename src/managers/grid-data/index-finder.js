export class IndexFinder {
    constructor(sizes) {
        this.cumulativeSizes = new Float64Array(Object.keys(sizes).length);

        let total = 0;
        for (const [index, size] of Object.entries(sizes)) {
            total += size;
            this.cumulativeSizes[parseInt(index)] = total;
        }
    }

    getIndex(location) {
        return this.cumulativeSizes.findIndex(size => location <= size);
    }
}
