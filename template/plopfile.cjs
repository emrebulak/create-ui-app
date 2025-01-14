const fs = require("fs");
const path = require("path");

module.exports = function (plop) {
  // Handlebars delimiterlarını değiştirelim
  // Helper: Basit bir map, "number" => "number", "boolean" => "boolean", geri kalan => "string"

  const hbs = plop.handlebars;

  // "eq" helper'ını kaydedin
  hbs.registerHelper("eq", function (a, b) {
    return a === b;
  });

  plop.setHelper("mapYup", (type) => {
    switch (type) {
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      default:
        return "string";
    }
  });

  // Asıl generator
  plop.setGenerator("model-and-form", {
    description:
      "Create or use a TS model and generate a Formik form component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Enter model name (e.g. user):",
      },
      {
        type: "confirm",
        name: "hasModel",
        message:
          "Does the model file already exist under src/models/<Name>.ts?",
      },
      {
        // Sadece hasModel = false olduğunda fields soralım
        type: "input",
        name: "fields",
        message:
          "Enter fields (e.g. firstName:string lastName:string age:number):",
        when: (answers) => !answers.hasModel,
      },
    ],
    actions: [
      // 1) Alanları parse etme aşaması (model dosyasını okuyabilir veya user input'tan alabilir)
      function parseFields(answers) {
        const modelFilePath = path.join(
          process.cwd(),
          "src",
          "models",
          `${pascalCase(answers.name)}.ts`
        );

        if (answers.hasModel) {
          // Var olan dosyadan alanları çıkartalım
          if (!fs.existsSync(modelFilePath)) {
            throw new Error(`Model file not found: ${modelFilePath}`);
          }
          const content = fs.readFileSync(modelFilePath, "utf-8");
          answers.fields = parseTsInterface(content);
        } else {
          // Kullanıcıdan alınan fields stringini parse edelim
          const fieldsStr = answers.fields || "";
          const pairs = fieldsStr.split(" ");
          answers.fields = pairs.map((pair) => {
            const [fname, ftype] = pair.split(":");
            return { name: fname, type: ftype };
          });
        }
        return answers;
      },
      // 2) Model dosyası ekleme (sadece hasModel = false ise)
      {
        type: "add",
        path: "src/models/{{pascalCase name}}.ts",
        templateFile: "plop-templates/model.hbs",
        // Eğer model zaten varsa skip
        skip: (data) =>
          data.hasModel
            ? "Model file already exists, skipping creation."
            : undefined,
      },
      // 3) Form dosyası ekleme (her durumda)
      {
        type: "add",
        path: "src/forms/{{pascalCase name}}Form.tsx",
        templateFile: "plop-templates/form.hbs",
      },
    ],
  });
};

// Basit bir parser: interface XXX { field: type; ... }
function parseTsInterface(content) {
  // "(\w+):\s*(\w+);" patternini yakalamaya çalışıyoruz
  // Bu çok basit bir yaklaşımdır, karmaşık tiplerde yetersiz kalabilir
  const regex = /(\w+)\s*:\s*(\w+)\s*;/g;
  let match;
  const fields = [];
  while ((match = regex.exec(content)) !== null) {
    const fieldName = match[1];
    const fieldType = match[2];
    fields.push({
      name: fieldName,
      type: mapToSimpleType(fieldType),
    });
  }
  return fields;
}

// TypeScript tipinden "number" | "string" | "boolean" gibi basit tiplere dönüştürme
function mapToSimpleType(tsType) {
  // Küçük harfe çevirelim
  const t = tsType.toLowerCase();
  if (t.includes("number") || t.includes("bigint")) return "number";
  if (t.includes("boolean")) return "boolean";
  if (t.includes("date") || t.includes("time")) return "Date";
  // vs. (örneğin date -> string)
  return "string";
}

// Basit pascalCase fonksiyonu
function pascalCase(str) {
  // plop zaten "pascalCase" helperı veriyor ama bu da kullanılabilir
  return str.replace(/(^\w|_\w)/g, (s) => s.replace(/_/, "").toUpperCase());
}
