const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) {
    return value;
  }
  return helpers.error("Invalid URL format");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value, { require_protocol: true })) {
    return value;
  }
  return helpers.error("Invalid email format");
};

module.exports.validateUserSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),

    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),

    password: Joi.string().required(),
  }),
});

module.exports.validateUserSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),

    password: Joi.string().required(),
  }),
});

module.exports.updateProfileInput = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
}),
});

module.exports.validateCreateClothingInput = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

     weather: Joi.string().required(),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

// module.exports.validateItemId = celebrate({
//   body: Joi.object().keys({
//     itemId: Joi.string().required()
//   }),


//   headers: Joi.object({
//     authorization: Joi.string()
//       .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
//       .required(),
//   }).unknown(true),

//   query: Joi.object().keys({
//     sort: Joi.string().valid("asc", "desc"),
//     page: Joi.number().integer().min(1),
//     limit: Joi.number().integer().min(1).max(100),
//   }),
// });


module.exports.validateUserId = celebrate({
  // with userId validation fails. So, I commented it out
  // params: Joi.object().keys({
  //   userId: Joi.string().hex().length(24).required(),
  // }),

  headers: Joi.object({
    authorization: Joi.string()
      .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
      .required(),
  }).unknown(true),

  query: Joi.object().keys({
    sort: Joi.string().valid("asc", "desc"),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});
