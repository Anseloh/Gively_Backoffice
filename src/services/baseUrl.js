// const UPLOAD_ROOT = API_ROOT;
// const AUTH_API_ROOT = API_ROOT;
const env = process.env.NODE_ENV;

const PROD = "https://api.givelycf.com";

const STAG = "https://api.givelycf.com";

const DEV = "http://localhost:6602";
// const DEV = "https://staging-api.givelycf.com";

let baseUrl = PROD;

console.log("env===============>>>>>======", env);

if (env === "development") {
  baseUrl = DEV;
} else if (env !== "production") {
  baseUrl = STAG;
}

export default {
  main: baseUrl,
  envName: env,
  dev: DEV,
  devCs: 'http://localhost:6602',
  // local: env == 'https://staging-api.givelycf.com'
  local: env == 'production'? PROD: (env !== 'staging'? STAG: DEV )
};
