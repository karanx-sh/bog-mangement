const CustomError = require('./error');

const authFailed = new CustomError('Authorization Failed!',
    `Uh oh! i can't tell you anymore #BruteForcers! alert`, 401);
const dataInvalid = new CustomError('Data Invalid!',
    `Uh oh! the data you've sent is not as expected #Contact the developer!`, 417);
const userNotFound = new CustomError('User Not Found!',
    `Uh oh! i can't tell you anymore #BruteForcers! alert`, 404);
const organizationNotFound = new CustomError('Organization Not Found!',`The Organization you are looking for is not in our system`, 404);
const userExists = new CustomError('User Exists!',
    `Uh oh! the phone number entered is already registered`, 409);
const organizationExists = new CustomError('Organization Exists!',
    `Uh oh! the phone number entered is already exists`, 409);
const duplicateRequest = new CustomError('Already Done!',
    `Umm! The stuff you are trying to do is been done already!`, 409);
const serverDown = new CustomError('umm! Some Servers are down!',
    `we swear! that it's not us, we pay our server bills on time`, 404);
const badRequest = new CustomError('Bad Request!',
    `Umm! The stuff you are trying to do is unexpected!`, 400);

const categoryExists = new CustomError('Category Exists!',
    `Category Already present`, 409);
const categoryNotFound = new CustomError('Category Not Found!',
    `Category not present`, 404);

    


const productExists = new CustomError('Product Exists!',
    `Product Already present`, 409);
const productNotFound = new CustomError('Product Not Found!',
    `Product not present`, 404);

const propertyExists = new CustomError('Property Exists!',
    `Product Already present`, 409);
const propertyNotFound = new CustomError('Property Not Found!',
    `Product not present`, 404);

module.exports = { authFailed, dataInvalid, userNotFound, userExists,organizationExists ,duplicateRequest, serverDown, badRequest, organizationNotFound,
     categoryExists,categoryNotFound, productExists, productNotFound, propertyExists, propertyNotFound };