class OthersMiddleware {
    print = (req, res, next) => {
        console.log('OthersMiddleware is run!');
        next();
    }

    print2 = (req, res, next) => {
        console.log('OthersMiddleware is run! geasfwesafwes');
        next();
    }
  }
  
  export default new OthersMiddleware();