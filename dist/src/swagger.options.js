"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("@nestjs/swagger");
const packages = require("../package.json");
function SwaggerBuilder(app, config) {
    if (!config.STAGE)
        config.STAGE = 'LOCAL';
    else
        config.STAGE = config.STAGE.toUpperCase();
    const setSchemes = config.STAGE === 'LOCAL' ? ['http'] : ['https', 'http'];
    const option = new swagger_1.DocumentBuilder()
        .setTitle(packages.name)
        .setDescription(packages.description)
        .addBearerAuth()
        .setVersion(`v${packages.version}-${config.STAGE.toLowerCase()}`)
        .setSchemes(...setSchemes)
        .build();
    const result = swagger_1.SwaggerModule.createDocument(app, option);
    return result;
}
exports.SwaggerBuilder = SwaggerBuilder;
//# sourceMappingURL=swagger.options.js.map