import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // schema: "https://api-client-dev.greep.io/graphql",
  schema: "http://127.0.0.1:8000/graphql",
  documents: ["src/**/*.vue"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
      },
      plugins: [],
    },
  },
};

export default config;
