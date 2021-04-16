'use strict';
class Abstract {
  // A static abstract method.
  static foo() {
    if (this === Abstract) {
      // Error Type 2. Abstract methods can not be called directly.
      throw new TypeError('Can not call static abstract method foo.');
    } else if (this.foo === Abstract.foo) {
      // Error Type 3. The child has not implemented this method.
      throw new TypeError('Please implement static abstract method foo.');
    } else {
      // Error Type 5. The child has implemented this method but also called `super.foo()`.
      throw new TypeError('Do not call static abstract method foo from child.');
    }
  }
  constructor() {
    if (this.constructor === Abstract) {
      // Error Type 1. Abstract class can not be constructed.
      throw new TypeError('Can not construct abstract class.');
    }
    //else (called from child)
    // Check if all instance methods are implemented.
    if (this.foo === Abstract.prototype.foo) {
      // Error Type 4. Child has not implemented this abstract method.
      throw new TypeError('Please implement abstract method foo.');
    }
  }
  // An abstract method.
  foo() {
    // Error Type 6. The child has implemented this method but also called `super.foo()`.
    throw new TypeError('Do not call abstract method foo from child.');
  }
}

// Error Type 1.
//let bar = new Abstract(); // Throws because abstract class can not be constructed.

// Error Type 2.
//Abstract.foo(); // Throws because static abstract methods can not be called.

class ChildA extends Abstract {}

// Error Type 3.
//ChildA.foo(); // Throws because ChildA does not implement static abstract method foo.

// Error Type 4.
//let bar = new ChildA(); // Throws because ChildA does not implement abstract method foo.

class ChildB extends Abstract {
  static foo() {
    // Calls Abstract.foo();
    super.foo();
  }
  foo() {
    // Calls Abstract.prototype.foo();
    super.foo();
  }
}

// Error Type 5.
//ChildB.foo(); // Throws because in ChildB the implementation calls the static abstract method foo.

// Error Type 6.
//(new ChildB()).foo(); // Throws because in ChildB the implementation calls the abstract method foo.

class ChildC extends Abstract {
  static foo() {
    // Implementation of abstract static method.
    console.log('ChildC.foo');
  }
  constructor() {
    super();
    // Implementation of constructor.
  }
  foo() {
    // Implementation of abstract method.
    console.log('ChildC.prototype.foo');
  }
}

// Success.
ChildC.foo();
let bar = new ChildC();
bar.foo();
