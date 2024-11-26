const Joi = require('joi');

const customMessages = {
    'string.base': '{#label} should be a string',
    'string.empty': '{#label} cannot be empty',
    'string.email': 'Please enter a valid email address',
    'number.base': '{#label} should be a number',
    'number.min': '{#label} should be at least {#limit}',
    'any.required': '{#label} is required',
    'string.min': '{#label} should have at least {#limit} characters',
    'array.base': '{#label} should be an array',
    'array.min': '{#label} should have at least {#limit} items'
};

const schemas = {

    member: Joi.object({
        mobile: Joi.number()
            .min(1000000000)
            .max(9999999999)
            .required()
            .messages({
                'number.min': 'Mobile number should be 10 digits',
                'number.max': 'Mobile number should be 10 digits'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages(customMessages),
        occupation: Joi.string()
            .required()
            .trim()
            .messages(customMessages),
        createpassword: Joi.string()
            .min(6)
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,30}$'))
            .messages({
                'string.pattern.base': 'Password must contain at least 6 characters with letters, numbers or special characters'
            })
    }),

    request: Joi.object({
        mobile: Joi.number()
            .min(1000000000)
            .max(9999999999)
            .required()
            .messages({
                'number.min': 'Mobile number should be 10 digits',
                'number.max': 'Mobile number should be 10 digits'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages(customMessages),
        amt: Joi.number()
            .min(1000)
            .required()
            .messages({
                'number.min': 'Amount should be at least 1000'
            }),
        type: Joi.string()
            .required()
            .messages(customMessages),
        msg: Joi.string()
            .allow('')
            .optional()
            .messages(customMessages),
        code: Joi.string()
            .required()
            .messages(customMessages)
    }),

    service: Joi.object({
        type: Joi.string()
            .required()
            .messages(customMessages),
        code: Joi.string()
            .required()
            .messages(customMessages),
        description: Joi.string()
            .required()
            .messages(customMessages),
        imgUrl: Joi.string()
            .required()
            .uri()
            .messages({
                'string.uri': 'Image URL must be a valid URL'
            }),
        detail: Joi.array()
            .items(Joi.string())
            .min(1)
            .required()
            .messages({
                'array.min': 'At least one detail is required'
            })
    }),

    calculation: Joi.object({
        amt: Joi.number()
            .min(1000)
            .required()
            .messages({
                'number.min': 'Amount should be at least 1000'
            }),
        tenure: Joi.number()
            .min(1)
            .max(360)
            .required()
            .messages({
                'number.min': 'Tenure should be at least 1 month',
                'number.max': 'Tenure should not exceed 360 months'
            }),
        type: Joi.string()
            .required()
            .messages(customMessages)
    }),

    updatePassword: Joi.object({
        mobile: Joi.number()
            .min(1000000000)
            .max(9999999999)
            .required()
            .messages({
                'number.min': 'Mobile number should be 10 digits',
                'number.max': 'Mobile number should be 10 digits'
            }),
        password: Joi.string()
            .min(6)
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,30}$'))
            .messages({
                'string.pattern.base': 'Password must contain at least 6 characters with letters, numbers or special characters'
            })
    }),
    updateRequest: Joi.object({
        mobile: Joi.number()
            .min(1000000000)
            .max(9999999999)
            .required(),
        service: Joi.string()
            .required(),
        type: Joi.string()
            .required(),
        remarks: Joi.string()
            .allow('')
            .optional()
    }),

};

const validateRequest = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return res.status(500).json({
                success: false,
                message: 'Invalid schema specified'
            });
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errorMessages
            });
        }

        req.body = value;
        next();
    };
};

module.exports = validateRequest;