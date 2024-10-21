class Validation {
    print = (req, res, next) => {
        console.log('Validation is run!');
        next();
    }

    print2 = (req, res, next) => {
        console.log('Validation is run! geasfwesafwes');
        next();
    }
  }
  
  export default new Validation();