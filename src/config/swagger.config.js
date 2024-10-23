export default {
    swaggerDefinition: {
        openapi: '3.0.0',
        version: '0.1.0',
        info: {
            title: 'AITEE API Documentation',
            version: '1.0.0',
            description:
                'This is the API documentation for the AITEE project. It provides all the necessary endpoints and information required to interact with the AITEE backend services.',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/',
            },
        ],
    },
    apis: ['src/middlewares/**/*.js', 'src/controllers/**/*.js', 'src/models/entities/*.js'],
};
