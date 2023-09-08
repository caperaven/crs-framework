class SizeManager {
  get size() {
    return this._size;
  }
  constructor(updateCallback) {
    this._size = 0;
    this._updateCallback = updateCallback;
    this._collection = [];
  }
  dispose() {
    this._updateCallback = null;
    this._collection = null;
  }
  fill(size, count) {
    this._collection = [];
    for (let i = 0; i < count; i++) {
      this._collection.push({
        size,
        dataIndex: i
      });
    }
    this._size = size * count;
    this._updateCallback();
  }
  append(items) {
    this._collection.push(...items);
    this._size += calculateSize(items);
    this._updateCallback();
  }
  update(index, size, dataIndex) {
    let oldValue = this._collection[index].size;
    const sizeDifference = size - oldValue;
    this._size = this._size + sizeDifference;
    this._collection[index].size = size;
    this._collection[index].dataIndex = dataIndex;
    this._updateCallback();
  }
  insert(index, size, dataIndex) {
    this._collection.splice(index, 0, { size, dataIndex });
    this._size = this._size + size;
    this._updateCallback();
  }
  move(fromIndex, toIndex) {
    let item = this._collection[fromIndex];
    this._collection.splice(fromIndex, 1);
    this._collection.splice(toIndex, 0, item);
    this._updateCallback();
  }
  remove(index, count) {
    this._size = this._size - this._collection[index].size;
    this._collection.splice(index, count);
    this._updateCallback();
  }
  recalculate() {
    return this._size = calculateSize(this._collection);
  }
  at(index) {
    return this._collection.at(index);
  }
}
function calculateSize(collection) {
  let total = 0;
  collection.forEach((item) => {
    total = total + item.size;
  });
  return total;
}
export {
  SizeManager
};
