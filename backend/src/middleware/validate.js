const { error } = require('../utils/apiResponse');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const { error: validationError, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (validationError) {
      const errors = validationError.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));
      return error(res, 'Validation failed.', 400, errors);
    }

    req[source] = value;
    next();
  };
};

module.exports = validate;
