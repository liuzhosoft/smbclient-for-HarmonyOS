export namespace Utils {

  export function flagValueBy(set: Set<number> | number | undefined): number | undefined {
    if (set == undefined) {
      return undefined;
    }
    if (typeof set === 'number') {
      return set;
    }
    let result = 0;
    for (let v of set) {
      result |= v;
    }
    return result;
  }
  
}