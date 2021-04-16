class ClassFields {
  #privateFiled = 5;
  publicField = 3;

  constructor(aaa) {
    console.log(aaa);
  }

  sum(a, b) {
    return a + b + this.#privateFiled + this.publicField;
  }
}
export default ClassFields;
